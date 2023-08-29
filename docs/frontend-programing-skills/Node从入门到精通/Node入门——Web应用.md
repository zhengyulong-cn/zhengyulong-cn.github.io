# Node入门——Web应用

## HTTP服务器

1.基本操作

创建Web Server，回调传入request和response

```js
const http = require('http');
const server = http.createServer((req, res) => {
  const { url, method, headers } = req;
  res.setHeader('content-type', 'text/html');
  res.write(`请求 URL: ${url}\n`);
  res.write(`请求方法: ${method}\n`);
  res.write(`请求 headers：${JSON.stringify(headers, null, '  ')}`);
  res.end('\n');
});
server.listen(9527, () => {
  console.log('Web Server started at port 9527');
});
```

2.读取文件

```js
const http = require('http');
const path = require('path');
const fs = require('fs/promises');

const ROOT_DIRECTORY = './src';
const server = http.createServer((req, res) => {
  const { url } = req;
  const filePath = path.join(ROOT_DIRECTORY, url);
  console.log(filePath);
  fs.readFile(filePath).then(
    chunk => {
      res.writeHead(200, {
        // 这里设置只能返回js文本文件，想要动态的修改，可以引入mime模块
        'content-type': 'application/x-javascript;charset=utf-8',
      })
      res.end(chunk);
    },
    err => {
      console.log(err);
      res.writeHead(404, {
        'content-type': 'text/html',
      })
      res.end('文件不存在');
    }
  )
});

server.listen(9527, () => {
  console.log('Web Server started at port 9527');
})
```

3.读取电影文件

理论上读取电影文件可以使用和上面一样的代码，但实际执行会发现电影文件在完全读取到内存后才返回给浏览器，这样返回内容耗时极长，而且电影文件过大的话程序也没有办法处理，**HTTP 协议是支持分段传输的**，既然 res 是可写流，可以简单**使用 stream 来做到边读取内容边返回给浏览器**，而不是一次读取完成后返回。

```js
const http = require('http');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');

// 静态资源根目录
const ROOT_DIRECTORY = '/Users/undefined/node-demo/public';

const server = http.createServer((req, res) => {
  const { url } = req;

  const filePath = path.join(ROOT_DIRECTORY, url);

  fs.access(filePath, fs.constants.R_OK, err => {
    if (err) {
      res.writeHead(404, {
        'content-type': 'text/html',
      });
      res.end('文件不存在！');

    } else {
      res.writeHead(200, {
        'content-type': mime.contentType(path.extname(url)),
      });
      fs.createReadStream(filePath).pipe(res);
    }
  });
});

server.listen(9527, () => {
  console.log('Web Server started at port 9527');
});
```

## 使用中间件的思路写一个静态服务器



