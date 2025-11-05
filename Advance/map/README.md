# map简介

## 说明
JavaScript 的 map() 是数组（Array）中最常用、最强大的方法之一，和 filter()、reduce() 并称为 “函数式编程三剑客”。

“对数组中的每个元素进行‘加工’，生成一个全新的数组。”

一对一映射：原数组有 5 个元素，新数组也一定有 5 个元素。

## 用法
```
const numbers = [1, 2, 3, 4];
const doubled = numbers.map(x => x*2);
```

```
const products = [
  { name: '手机', price: 3000 },
  { name: '电脑', price: 8000 }
];

const cheapProducts = products.map(p => ({...p,isExpensive:p.price>5000}))

```


```
// 错误：没有 return
[1,2,3].map(x => { x * 2 }); // [undefined, undefined, undefined]

// 正确：
[1,2,3].map(x => x * 2);      // [2,4,6]
// 或
[1,2,3].map(x => { return x * 2; }); // [2,4,6]
```