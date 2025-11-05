# || 默认值

## 说明
|| 来提供默认值，这是 JavaScript 中非常常见且实用的技巧

从左到右计算，返回第一个 “truthy” 值；如果全都 falsy，就返回最后一个值。

在 JS 中，以下值被认为是 falsy（“假”的）：

false
0
-0
0n（BigInt 零）
""（空字符串）
null
undefined
NaN
其余所有值都是 truthy（“真”的），比如：
"hello"、"0"、" "（非空字符串）
1、-1、[]、{}、function(){} 等

## 场景
变量默认值
```
function greet(name) {
    name = name || '游客' ;
    console.log('Hello,' + name)
}

greet();        // Hello, 游客
greet("");      // Hello, 游客
greet("Alice"); // Hello, Alice
```


Tip:
零或者字符串可能都是我们需要用到的值，so，更合理是永空值运算符

# 空值合并运算符 ??
const display = count ?? 10; // 只有当 count 是 null 或 undefined 时才用 10
console.log(display); // 0 ✅ 正确！