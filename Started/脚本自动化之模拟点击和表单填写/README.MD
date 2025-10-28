# 知识点总结:

## DOM元素定位
document.querySelector(selector)：按 CSS 选择器定位元素。
document.getElementById(id)、getElementsByClassName、getElementsByName：其他定位方式。

## 模拟点击
element.click()：最直接的方式。 
在某些场景中，可能需要派发 click 事件或使用 dispatchEvent(value等框架)

## 表单填写
对输入框/选择框：
<input type="text">
input.value = "..."。

<select ...>
input.value =2
对 select 下拉：select.value = "optionValue" 或 select.selectedIndex = …。


对复选框／单选框：
<input type="radio">
<input type="checkbox">
checkbox.checked = true。


**warn**
在使用现代前端框架（如 Vue、React）开发的网站中，直接设置 value 可能不会同步框架上层数据，应触发 input/keydown/change 等事件
栗子：
const radio = document.getElementById('radio-button-2');
radio.checked = true;
radio.dispatchEvent(new Event('change',{bubbles:true}));


## 自动化流程
判断条件（如是否登录）：通过检查某元素是否存在/null。 
learn.scriptcat.org

执行操作：填写、勾选、点击。


# Test练习
由于众多网站都需要验证码登录了，如果只是单纯练习自动提交表单，可以用以下地址：
https://formy-project.herokuapp.com/form


# Q & A
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