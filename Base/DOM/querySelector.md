# querySelector用法

## 定义
querySelector 是 DOM（文档对象模型） 提供的一个方法，用于根据 CSS 选择器语法查找页面中的元素

## 常见用法
选择器	含义	示例
[attr]	存在该属性	div[name] → 所有带 name 属性的 div
[attr="value"]	属性值完全等于	div[name="666"]
[attr^="val"]	属性值以...开头	div[name^="66"] → 匹配 666, 66abc
[attr$="val"]	属性值以...结尾	div[name$="66"] → 匹配 166, x66
[attr*="val"]	属性值包含...	div[name*="66"] → 匹配 a66b, 666
[attr~="val"]	属性值是空格分隔的词之一	<div class="btn primary"> → [class~="btn"]


Tips:
## html属性名不区分大小写，属性值区分大小写