# ?. 运算符说明

## 栗子

a?.textContent：如果 a 为 null/undefined，直接返回 undefined，不报错
textContent?.replace(...)：同理，防止 textContent 为 null。