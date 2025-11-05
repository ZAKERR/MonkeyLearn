# '...'展开运算符

## 背景说明
ES6引入的展开运算符，把数组“打散”成一个个独立元素


eg
```
const arr = [2, 3, 4];

// 不用 ...：整个数组作为一个元素 push 进去
docs.push(arr);
// 结果: docs = [doc1, [2, 3, 4]] ← 嵌套了！

// 用 ...：把数组元素一个个 push
docs.push(...arr);
// 结果: docs = [doc1, 2, 3, 4] ← 扁平！


通常如果遇到
const childDocs = allDocsSameOrigin(d); // 得到子树的所有 document（数组）
for (const doc of childDocs) {
  docs.push(doc); // 一个个加进去
}

可以考虑直接
docs.push(...allDocsSameOrigin(d))
```
