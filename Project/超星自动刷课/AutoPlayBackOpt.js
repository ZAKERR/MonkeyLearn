// ==UserScript==
// @name         Chaoxing 课程目录自动播 & 跳过已完成
// @namespace    cx-autoplay-skip-done
// @version      1.2.0
// @description  在章节目录页自动定位未完成小节，自动播放；已完成直接跳过，播放完自动进入下一个未完成小节
// @match        *://*.chaoxing.com/*
// @match        *://*.chaoxing.com/mooc-ans/*
// @match        *://mooc1.chaoxing.com/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  'use strict';

  // ---------- 样式与小面板 ----------
  GM_addStyle(`
    #cxAutoPanel{position:fixed;right:16px;top:90px;z-index:999999;
      background:#101823;color:#fff;border-radius:12px;padding:12px 14px;box-shadow:0 6px 24px rgba(0,0,0,.25);font:14px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial}
    #cxAutoPanel h1{font-size:14px;margin:0 0 8px;font-weight:600}
    #cxAutoPanel .row{display:flex;gap:8px;align-items:center;margin-top:6px}
    #cxAutoPanel button{cursor:pointer;border:0;border-radius:8px;padding:6px 10px}
    #cxAutoPanel .pri{background:#4c8bf5;color:#fff}
    #cxAutoPanel .sec{background:#223049;color:#cfe0ff}
    #cxAutoPanel .muted{color:#9bb0c9;font-size:12px;margin-top:6px}
  `);

  const panel = document.createElement('div');
  panel.id = 'cxAutoPanel';
  panel.innerHTML = `
    <h1>Chaoxing 自动学习</h1>
    <div class="row">
      <button id="cxStart" class="pri">开始</button>
      <button id="cxStop" class="sec">暂停</button>
    </div>
    <div id="cxInfo" class="muted">状态：待机</div>
  `;
  document.documentElement.appendChild(panel);

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const info = $('#cxInfo');
  const btnStart = $('#cxStart');
  const btnStop = $('#cxStop');

  let running = false;
  let queue = [];
  let cursor = 0;
  let currentVideo = null;
  let keepAliveTimer = null;
  let endGuardTimer = null;

  function setInfo(t) { info.textContent = '状态：' + t; }

  // ---------- 判断/收集 “未完成” 小节 ----------
  // 经验标记：
  // 1) <input class="jobUnfinishCount" value="1"> 存在 => 未完成
  // 2) <span class="jobCount ...">（橙色小圆点，里面是数字）=> 未完成
  // 无这两类一般视为已完成
  function isUnfinished(h4) {
    if (!h4) return false;
    if (h4.querySelector('input.jobUnfinishCount[value="1"]')) return true;
    if (h4.querySelector('span.jobCount')) return true;
    return false;
  }

  function collectQueue() {
    const h4s = $$('.ncells h4[id^="cur"]');
    const items = h4s
      .filter(isUnfinished)
      .map(h4 => {
        const a = h4.querySelector('a[href^="javascript:getTeacherAjax"]');
        // 解析 href 中的 getTeacherAjax('courseId','clazzId','chapterId')
        const m = a ? a.getAttribute('href').match(/getTeacherAjax\('(\d+)','(\d+)','(\d+)'\)/) : null;
        return m ? {
          h4,
          courseId: m[1],
          clazzId: m[2],
          chapterId: m[3],
          title: a?.textContent?.replace(/\s+/g,' ').trim() || '未命名'
        } : null;
      })
      .filter(Boolean);

    // 当前页面通常从上往下播更自然
    return items;
  }

  // ---------- 播放器寻找（含同域 iframe） ----------
  function allDocsSameOrigin(rootDoc = document) {
    const docs = [rootDoc];
    const iframes = $$('iframe', rootDoc);
    for (const ifr of iframes) {
      try {
        const d = ifr.contentDocument;
        if (d) docs.push(...allDocsSameOrigin(d));
      } catch (e) { /* 跨域，忽略 */ }
    }
    return docs;
  }

  function findPlayableVideo() {
    const docs = allDocsSameOrigin();
    let candidates = [];
    for (const d of docs) {
      const vs = $$('video', d);
      for (const v of vs) {
        const area = (v.offsetWidth || 0) * (v.offsetHeight || 0);
        candidates.push({ v, area, d });
      }
    }
    // 取尺寸最大那个，更可能是主播放器
    candidates.sort((a, b) => b.area - a.area);
    return candidates.length ? candidates[0].v : null;
  }

  function ensurePlaying(video) {
    // 持续确保在播放（网站可能间歇性暂停）
    clearInterval(keepAliveTimer);
    keepAliveTimer = setInterval(() => {
      if (!running || !video) return;
      if (video.paused) {
        video.play().catch(() => {});
      }
    }, 5000);
  }

  function attachVideoListeners(video, onEnded) {
    if (!video) return;
    currentVideo = video;

    try { video.playbackRate = 1.0; } catch (e) {}
    video.muted = false; // 如需静音可改为 true
    video.autoplay = true;

    // 有些场景需要调用 play() 才开始
    video.play().catch(() => {});

    // 保险：如果接近结尾也触发下一项
    clearInterval(endGuardTimer);
    endGuardTimer = setInterval(() => {
      if (!running || !video || isNaN(video.duration) || video.duration <= 5) return;
      if (video.currentTime >= video.duration - 1.0) {
        clearInterval(endGuardTimer);
        onEnded();
      }
    }, 2000);

    // 正常结束
    const ended = () => {
      video.removeEventListener('ended', ended);
      clearInterval(endGuardTimer);
      onEnded();
    };
    video.addEventListener('ended', ended);

    ensurePlaying(video);
  }

  // ---------- 打开小节 ----------
  function openItem(item) {
    setInfo(`进入小节：${item.title}`);
    // 优先直接调用全局函数（更稳）
    const gw = unsafeWindow || window;
    if (typeof gw.getTeacherAjax === 'function') {
      try {
        gw.getTeacherAjax(item.courseId, item.clazzId, item.chapterId);
        return;
      } catch (e) { /* 失败则退回到点击 a */ }
    }
    // 回退：直接点链接（会触发 getTeacherAjax）
    const a = item.h4.querySelector('a[href^="javascript:getTeacherAjax"]');
    if (a) a.click();
  }

  // ---------- 播放当前索引 ----------
  function playAt(idx) {
    if (!running) return;
    if (idx >= queue.length) {
      setInfo('已完成全部未完成小节 ✅');
      running = false;
      clearInterval(keepAliveTimer);
      clearInterval(endGuardTimer);
      return;
    }
    cursor = idx;
    const item = queue[cursor];
    openItem(item);

    // 等待视频元素出现
    let retry = 0;
    const maxRetry = 60; // 最多等 ~60*500ms = 30s
    const waitTimer = setInterval(() => {
      if (!running) { clearInterval(waitTimer); return; }
      const v = findPlayableVideo();
      retry++;

      if (v) {
        clearInterval(waitTimer);
        setInfo(`播放中：${item.title}`);
        attachVideoListeners(v, () => {
          // 播完后刷新“未完成”列表，跳到下一个仍未完成的小节
          queue = collectQueue();
          // 找到当前 chapterId 在新列表中的位置
          const nextIdx = queue.findIndex(q => q.chapterId === item.chapterId) + 1 || 0;
          playAt(nextIdx);
        });
      } else if (retry >= maxRetry) {
        clearInterval(waitTimer);
        // 找不到视频，直接跳下一个（可能是纯文档/讨论类）
        setInfo(`未检测到视频，跳过：${item.title}`);
        playAt(idx + 1);
      }
    }, 500);
  }

  // ---------- 控制 ----------
  function start() {
    running = true;
    queue = collectQueue();
    if (!queue.length) {
      setInfo('没有检测到未完成小节 🎉');
      running = false;
      return;
    }
    setInfo(`共 ${queue.length} 个未完成小节，开始……`);
    playAt(0);
  }

  function stop() {
    running = false;
    clearInterval(keepAliveTimer);
    clearInterval(endGuardTimer);
    try { currentVideo && currentVideo.pause && currentVideo.pause(); } catch(e){}
    setInfo('已暂停');
  }

  btnStart.addEventListener('click', start);
  btnStop.addEventListener('click', stop);

  // 页面初始加载后，延时尝试一次自动开始（你也可以手动点“开始”）
  setTimeout(() => {
    // 自动启动：如不想自动，注释掉这一行
    // start();
  }, 1200);
})();
