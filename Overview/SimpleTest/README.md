# 问答
## 如何通过JS创建元素，或者说创建input元素

---
## 如何将创建JS的元素插入到特定位置

---

## Element和Node的区别

---

## document.querySelector('div[style="margin-top"]')    去匹配这个有什么问题吗  <div style="margin-top: 5px;">
此写法是精准匹配，"margin-top:"是style的子串，可以写成'style*="margin-top"'

---

## 按钮数值如何提取，一般是通过类型转换实现
let lValue = parseFloat(document.getElementById("leftInput").value)

---
##  如何给这个button元素添加点击事件呢?
addEventListener方法即可
栗子：
addEventListener('click', () => {
  // 你的计算逻辑
});
8、JS的const概念是什么?
const 限制的是“变量绑定（变量名 → 值）不能重新赋值”，本身内容是可以被修改的
const obj = { a: 1 };
obj.a = 2;        // ✅ OK，对象内部属性可改
obj = { a: 3 };   // ❌ 不行，不能给 obj 重新赋新对象

## 什么是IIFEImmediately Invoked Function Expression ?

形式如：
```
(function () {
  // todo
})();
```
作用：
1. 创建“独立作用域”，防止污染到全局变量
2. 控制“启动时机”，保证执行后自动结束，不留全局函数

## trim()方法是什么意思?
去除字符串开头和结尾的空白字符（包括空格、制表符 \t、换行符 \n、回车符 \r 等），并返回一个新字符串。


## JS箭头函数，
inp => xxx  等价于 function(inp) { return xxx;}

e => { ... } 等价于 function(inp) { ...}
!!!带{}不会的箭头函数不会自动返回，如需返回手动加return


# 反思：

* 没有先观察网页本身留了main的div标签入口，完全没有在创建div的必要
* 用 textContent 代替 innerText，显示纯文本更快更稳（不用触发布局/样式计算）。
* 可以增加输入回车触发，
[lInput, rInput].forEach(inp => inp.addEventListener('keydown', e=>{
  if (e.key === 'Enter') btn.click();
}));
4、append一次可以排多个节点,appendChild只能加一个节点