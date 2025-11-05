# reduce简介

## 说明
reduce() 就是它们的“终极搭档”——它负责 “聚合”, 聚合成一个特定的值

## 语法
const result = arr.reduce(callback(accumulator, currentValue, index, array), initialValue);


callback	必需。聚合函数，定义如何“累积”
accumulator	累积器（上一次回调的返回值）
currentValue	当前元素
index	（可选）当前索引
array	（可选）原数组
initialValue	（可选）初始值，非常重要！

Tips:不写初始值，accumulator为数组第一个元素

## 应用场景
求和
```
const numbers = [1,2,3,4]
const sum = numbers.reduce((acc,curr) => acc + curr,0);
```

求最大值
```
const nums = [5,2,6]
const max = nums.reduce((acc,curr) => curr > acc ? curr :acc)
```

数组转对象
```
const user = [
    { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
]

const userMap = user.reduce((acc,user)=> {
    acc[user.id] = user.name;
    return acc;
})
```

出现统计次数
```
const fruits = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
const count = fruits.reduce((acc,fruit) => {
    acc[fruit] = (acc[fruit] || 0) + 1;
    return acc;
},{})
```

扁平化二维数组
```
const matrix = [[1,2],[3,4],[5]]

const flat = matrix.reduce((acc,row) => acc.concat(row),[]);
或者
const flat = matrix.reduce((acc,row) => acc.push(...row),[]);

console.log(flat);
```

Tips:
尽可能保证有初始值...否则遇到空数组对象就直接报错了

```
[].reduce((a, b) => a + b, 0); // 返回 0，安全！
[].reduce((a, b) => a + b); // ❌ 报错：Reduce of empty array with no initial value
```