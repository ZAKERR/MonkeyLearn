// 伪代码/骨架：可读性导向，省掉 UI 与细枝末节
async function run() {
  while (true) {
    const queue = collectQueue();                  // 重新收集未完成
    if (queue.length === 0) return info('全部完成');

    const item = queue[0];                         // 取队首（或用指针更精细）
    openItem(item);                                // 调页面函数进入小节

    const video = await waitForVideo(30000);       // 等待播放器出现（轮询或 MutationObserver）
    if (!video) { info('没找到视频，跳过'); continue; }

    await playToEnd(video);                        // 保活 + 结束事件 + 结尾兜底
    // 回到 while 顶部重新收集，确保“未完成”列表是最新的
  }
}

function waitForVideo(timeoutMs) {
  return new Promise(resolve => {
    const start = Date.now();
    const timer = setInterval(() => {
      const v = findPlayableVideo();
      if (v) { clearInterval(timer); resolve(v); }
      else if (Date.now() - start > timeoutMs) { clearInterval(timer); resolve(null); }
    }, 500);
  });
}

function playToEnd(video) {
  return new Promise(resolve => {
    // 基本设置
    try { video.playbackRate = 1.0; } catch {}
    video.muted = false; video.autoplay = true;
    video.play().catch(()=>{});

    // keep-alive
    const keep = setInterval(() => { if (video.paused) video.play().catch(()=>{}); }, 5000);

    // 结尾兜底
    const guard = setInterval(() => {
      if (!isFinite(video.duration) || video.duration < 5) return;
      if (video.currentTime >= video.duration - 1) { cleanup(); resolve(); }
    }, 2000);

    const onEnded = () => { cleanup(); resolve(); };
    video.addEventListener('ended', onEnded);

    function cleanup() {
      clearInterval(keep); clearInterval(guard);
      video.removeEventListener('ended', onEnded);
    }
  });
}
