# => 箭头函数简介

## 介绍
一种创建函数的语法，like

### 形式一
(arg1, arg2, ..., argN) => expression;
arg1 => expression
arg1 => ({expression}）

等价于

let func = function(arg1, arg2, ..., argN) {
  return expression;
};


### 形式二
(a, b) => {  // 花括号表示开始一个多行函数
  let result = a + b;
  return result; // 如果我们使用了花括号，那么我们需要一个显式的 “return”
};

Tips: 带括号需要手动返回值，部分callback函数需要返回值，如果使用了带{}记得手动补充return