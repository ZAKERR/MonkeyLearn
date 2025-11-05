# filter简介

## 说明
用于筛选数组中符合条件的元素。callback为true，保留元素.“留下我想要的，扔掉我不想要的。”

## 语法
const newArray = arr.filter(callback(element, index, array), thisArg);
参数	说明
callback	必需。一个“判断函数”，决定元素是否保留
element	当前遍历的数组元素
index	（可选）当前元素的索引
array	（可选）原数组本身
thisArg	（可选）指定 callback 中的 this 值


## usage
```
const tasks = [
  { name: '学习 JS', done: false },
  { name: '写代码', done: true },
  { name: '看视频', done: false }
];

cosnt undone = tasks.filter(task => !task.done)

```

```
const messy = [0, '', null, undefined, 'hello', 42];
const clean = messy.filter(Boolean);
```
