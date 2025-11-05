# 项目背景说明
某位老友因刷课课时不足，于是想让我帮其手工刷课，因为是蛮好的朋友，本着这种事情可能会不断来找我，于是乎，我开始研究起了这个刷课平台-> 超星mooc

# 研究细节

## 播放器禁止倍速播放
这个很有意思，主动对其video元素修改playbackRate进行修改，会出现视频播放暂停，而且在播放过程中似乎也是有时间记录的，比如会记录用户看了多长时间等等，然后推送到服务端


# 知识点:

## video 视频保活，即一直保持播放 keep-live
```
const keep = setInterval(()=> {if (video.paused) video.play().catch(()=>{})},5000)
```
Tips:
.catch的好处在于即便异常，也不会弹出报错


## video 视频结尾怎么判定
采用轮询 + 播放结束事件的形式

### 轮询视频是否结束
```
const endGuard = setInterval(
    ()=> {
        if (!isFinite(video.duration) || video.duration < 5>) return // 不存在进度条
        if (video.currentTime >= video.duration -1) {
            // todo cleanup
            resolve()
        }

    },2000
)
```

### 播放事件结束
```
const onEnded = ()=>{ // todo cleanup resolve()}
video.addEventListener('ended',onEnded)
```

### 这些定时器和监听，可以封装成一个函数用于清理
```
function cleanup() {
    clearInterval(keep);
    clearInterval(gurad);
    video.removeEventListener('ended',onEnded)
}
```

## 定时器写法
### setInterval() 固定间隔，需要手动清理
```
const timer = setInterval( 
    ()=>{
        if (found) {
            clearInterval(timer)
            resolve(...)
        }
    }
)
```

### setTimeout()递归,动态设置每一次的定时间隔
```
const check = () => {
    if (found) {
        resolve(...);
    } else if (Data.now()-start < timeout>) {
        setTimeout(check,500)
    }
}
```

## 通过最大面积获取正确播放器

```
const $$ = (sel,root = document) = > Array.from(root.querySelectorAll(sel,root))
function allDocsSameOrigin(rootDoc = document)
{
    const docs = [rootDoc];
    const iframes = $$('iframe',rootDoc)
    for (const ifra of iframes) {
        try {
           const iDoc = ifr.contentDocument;
           if (iDoc) {
                docs.push(...allDocsSameOrigin(iDoc))
           }
        } catch (e) {
            // 跨域则忽略
        }
    }

    return docs;
}

function findPlayableVideo() {
    const docs = allDocsSameOrigin(); // 所有能访问的文档
    let candidates = [];
    for (const d of docs) {
        cosnt vs = $$('video',d);
        for (const v of vs) {
            const area = (v.offsetWidth || 0) * (v.offsetHeight || 0) ; //可见面积
            candidates.push({v,area})
        }
    }
    // 降序排序
    candidates.sort((a,b) => b.area -a.area);
    return candidates.length ? candidates[0].v,null;
}

```

## 如何调用网页内的js函数
通过获取unsafeWindow 或者直接获取window进行


开启权限
// @grant        unsafeWindow
const gw = unsafeWindow || window;
if (typeof gw.getTeacherAjax == 'function') {
    try {
        gw.getTeacherAjax();
        return
    } catch(e)
}

const a = item.h4.querySelector('a[href^="javascript:getTeacherAjax"]')
a.?click();
