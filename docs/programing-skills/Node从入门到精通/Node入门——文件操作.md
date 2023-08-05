# Node入门——文件操作

## API风格

### 传统回调风格

```js
const fs = require('fs');
fs.stat('.', (err, stats) => {
  if(err) {
  	// 处理错误。
  } else {
  	 // 使用 stats
  }
});
```

### Promise风格

```js
const fs = require('fs').promises;
fs.stat('.').then(stats => {
  // 使用 stats
}).catch(error => {
  // 处理错误
});
```

::: danger
`require('fs/promises')`在v14后可用。
:::

### promisify

