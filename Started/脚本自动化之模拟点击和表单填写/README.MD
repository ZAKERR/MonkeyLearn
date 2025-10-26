# 在实现自动化模拟点击自动登录出现的问题

##  Q & A
Q:如何检测验证码滑块是否成功?
A:验证码滑块验证成功会触发元素变动，使用MutationObserver()对象监听特定元素即可【由于验证码滑块是动态生成的，所以监听整个document,比较浪费性能... 】，此处验证码成功后会修改id为“dx_captcha_basic_bar-success_1”的style属性，简单理解通过css实现的滑块效果

栗子：
const checkBoxObs = new MutationObserver(()=> {
            const sliderPass = document.querySelector('#dx_captcha_basic_bar-success_1[style="display: block;"]');
            if (sliderPass)  {
                checkBoxObs.disconnect();
                doLogin();
            }
        })

checkBoxObs.observe(document,{childList:true,subtree:true})


Q:正式测试后又发现除了滑动验证码，还又出现了新的识图验证码，即需要两次验证，可能是频繁登录的原因？
明天再试试