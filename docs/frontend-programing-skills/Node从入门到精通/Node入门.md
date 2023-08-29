# 一、Node基础

## Node.js是什么

定义：Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.

从定义我们可以看到几个重要特征：

1. Node.js不是一门语言，而是一个运行时
2. 语言是JavaScript，不包含BOM、DOM API，添加了Stream、网络等API
3. Node.js依赖V8引擎运行JavaScript

由于JavaScript是单线程的，Node.js依赖事件循环机制实现异步，来节约CPU资源，但**该事件循环机制和在浏览器是不同的**。

## 相关工具

npm 是 Node.js 的包管理工具，通过npm可以使用第三方开源模块。类似还有yarn、pmpm等等。

### npm

1.配置npm

```bash
# 查看当前源
npm config get registry
# 切换淘宝源
npm config set registry https://registry.npm.taobao.org
```

2.安装package

```bash
# 全局安装
npm install <package_name> -g
# 在项目中安装指定版本的包
npm install <package_name>@x.y.z
```

全局安装的目录位置：

- Mac：`/Users/felix/.nvm/versions/node/nvm各个版本/bin/`
- Windows：`C:\Users\你的用户名\AppData\Roaming\npm\node_modules`

本地安装就是找到对应的工程文件夹，不携带`-g`

3.查看相关信息

```bash
# 查看项目安装的包
npm list
# 查看某个包的信息（不一定在项目中引用过的）
npm info <package_name>
# 查看某个包的所有版本号（不一定在项目中引用过的）
npm view <package_name> versions
```

4.清理缓存

```bash
npm cache clean --force
```

### npx

1.npx解决的主要问题，就是调用项目内部安装的模块。

比如有模块jest，一般来说，想要调用就只能在项目脚本和 package.json 的scripts字段里面，但我们想现在通过命令行调用，则必须执行`node-modules/.bin/jest--version`。npx解决就是这个问题，现在可以直接通过`npx jest --version`调用了。

npx执行原理就是在运行时到`node_modules/.bin/*`路径和环境变量`$PATH`里检测命令是否存在。

2.避免全局安装模块

执行下面代码时，npx会将`create-react-app`下载到一个临时目录，使用后再删除

```bash
npx create-react-app my-react-app
```

3.参数

- `--no-install`：强制npx使用本地模块，如果本地不存在就报错。
- `--ignore-existing`：忽略本地的同名模块，强制安装使用远程模块

### package.json

npm 通过 Node.js 模块根目录的 `package.json` 文件获取模块元数据和依赖关系：

```json
  
{
  "name": "react",
  "description": "React is a JavaScript library for building user interfaces.",
  "keywords": [
    "react"
  ],
  "version": "16.13.1",
  "homepage": "https://reactjs.org/",
  "bugs": "https://github.com/facebook/react/issues",
  "license": "MIT",
  "files": [
    "LICENSE",
    "README.md",
    "build-info.json",
    "index.js",
    "cjs/",
    "umd/",
    "jsx-runtime.js",
    "jsx-dev-runtime.js"
  ],
  "main": "index.js",
  "repository": {
    "type": "git",
    "url": "https://github.com/facebook/react.git",
    "directory": "packages/react"
  },
  "engines": {
    "node": ">=0.10.0"
  },
  "dependencies": {
    "loose-envify": "^1.1.0",
    "object-assign": "^4.1.1"
  },
  "browserify": {
    "transform": [
      "loose-envify"
    ]
  }
}
```

1.name：模块唯一标识

安装和使用模块：

```bash
npm install react
```

```js
const react = require('react');
```

可以通过scope组织具有相关性的模块，`@`开头的包就是一个scoped package：

```bash
# 以下的scope都是babel
@babel/preset-env
@babel/preset-react
@babel/plugin-transform-typescript
```

2.version

遵从语义化版本规范，使用`x.y.z`形式，对应`主版本.次版本.修订版本`，递增规则如下：

- 主版本：当你做了不兼容的 API 修改
- 次版本：当你做了向下兼容的功能性新增
- 修订版本：当你做了向下兼容的问题修正

除了正式版本，为了保证稳定性，会提供先行版本，这种特殊版本除非开发者精确声明使用，否则 npm install 不会自动安装对应版本内容：

- alpha: 内部版本
- beta: 公测版本
- rc: Release candidate，正式版本的候选版本

3.dependencies & devDependencies

dependencies：生产环境中的包，生产和开发环境都能用

devDependencies：开发环境中的包，只有开发环境能用

模块依赖版本号有几种不同写法，来保证安装对应版本：

- `x.y.z`：使用精确版本号
- `*` ：任意版本，第一次安装会使用模块最新版本
- `^x.y.z`：x 位锁死，y、z 位使用最新版本
  - `3.x` 和 `^3.0.0` 含义相同，x 位使用指定版本，y、z 位使用最新
- `~x.y.z`：x、y 位锁死，z 位使用最新版本

```bash
# 安装对应模块到生产环境
npm install <package_name> --save
# 安装对应模块到开发环境，并指明版本号为^x.y.z
npm install <package_name>@x --save-dev
```

4.peerDependencies

有时候模块需要与宿主模块共享依赖，也就是有可能会用到某个模块，但自己不安装，希望宿主环境安装的时候使用 peerDependencies 声明。

5.repository

指定模块源码信息

```bash
"repository": {
  "type": "git",
  "url": "https://github.com/facebook/react.git",
  "directory": "packages/react"
},
```

6.main

标识模块入口文件，比如react的`main: "index.js"`

```js
// 下面两句写法含义相同
const react = require('react');
const react = require('react/index.js');
```

7.script

通过`npm run <script_name>`来运行脚本

# 二、基础API

## path

**Path模块在Windows和POSIX（Linux、Mac OS）上处理是有差异的。**

1. `path.basename(path [, ext])`：返回路径的最终指向位置（文件和文件夹都可以）
   1. path：给定路径
   2. ext：可选文件扩展名，如果匹配到了就只返回文件名。

```js
path.basename('/foo/bar/baz/asdf/quux.txt');	// quux.txt
path.basename('/foo/bar/baz/asdf/quux.txt','.txt');		// quux
path.basename('/foo/bar/baz/asdf/quux.txt','.html');	// quux.txt
```

2. `path.dirname(path)`：path目录名
3. `path.extname(path)`：path扩展名，如果没有扩展名则返回空字符串

```js
const myPath = '/foo/bar/baz/asdf/vue.config.js';
console.log(path.dirname(myPath));		// /foo/bar/baz/asdf
console.log(path.extname(myPath));		// .js
```

4. `path.delimiter`：操作系统界定符号
   1. windows为`;`
   2. POSIX为`:`

5. `path.sep`：路径分割符
   1. windows为`\`
   2. POSIX为`/`
6. `path.parse(path)`：文件路径字符串--->对象
7. `path.format(parseObject)`：对象--->文件路径字符串

```js
const parseObject = {
  root: '/',
  dir: '/foo/bar/baz/asdf',
  base: 'vue.config.js',
  ext: '.js',
  name: 'vue.config'
}
```

8. `path.normalize(path)`：规范化给定的path字符串
9. `path.join([...paths])`：连接path片段

```js
path.join('/foo', 'bar', 'baz/asdf', 'quux', '..');		// \foo\bar\baz\asdf
```

10. `path.relative(from, to)`：返回 from 到 to 的相对路径

```js
path.relative('/data/test/aaa', '/data/impl/bbb');		// ..\..\impl\bbb
```

11. `path.resolve([...paths])`：每个后续的path会被追加到前面，直到构建绝对路径。

```js
// 从右到左构建了绝对路径
// F:\static_files\gif\image.gif
path.resolve('wwwroot', '/static_files/png/', '../gif/image.gif');
// 由于从右到左一直没有构建绝对路径，因此最终会加上执行该文件的目录
// F:\Project\node-study\wwwroot\static_files\gif\image.gif
path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif');
```

## events

发布订阅模式，维护了一个事件数组。

1. `emitter.on(eventName, listener)`：订阅，加入到事件数组尾部。
   1. `emitter.once(eventName, listener)`：订阅一次
2. `emitter.emit(eventName[, ...args])`：发布
3. `emitter.off(eventName, listener)`：取消订阅
   1. `emitter.removeListener(eventName, listener)`：取消订阅
4. `emitter.prependListener(eventName, listener)`：把 listener 添加到事件数组头部。

```js
const EventEmitter = require('events');
const ee = new EventEmitter();

const listener1 = (...args) => {
  console.log('a', ...args);
};
const listener2 = () => console.log('b');
const listener3 = (x, ...y) => console.log('c', x, y);
ee.on('foo', listener1);
ee.on('foo', listener2);
ee.on('foo', listener3);

ee.off('foo', listener2);
ee.emit('foo', 1, 2, 3, 4, 5, 6);
/**************
a 1 2 3 4 5 6
c 1 [ 2, 3, 4, 5, 6 ]
***************/
```

## process

1. 系统信息
   1. `process.title`：进程名称，默认为node
   2. `process.pid`：当前进程的pid
      1. pid是进程的唯一标识
   3. `process.ppid`：当前进程的父进程pid
   4. `process.platform`：进程运行的操作系统
   5. `process.version`：Node.js版本
   6. `process.env`：当前Shell的所有环境变量
      1. Windows 不支持`NODE_ENV=production`的设置方式，这时候可以借助cross-env
2. 执行信息
   1. `process.execPath`：执行当前脚本的 Node 二进制文件的绝对路径。
   2. `process.argv`：返回数组，前两项固定。
      1. 第一个元素：`process.execPath`。
      2. 第二个元素：正在执行的 JavaScript 文件的路径。
      3. 其他元素：任何其他命令行参数。
   3. `process.execArgv`：返回数组，数组元素是传入的一组**特定于 Node.js 的命令行选项**。

> 同为命令行参数，有的是Node.js命令行选项，但有的不是

```js
const process = require('process');
console.log(process.execPath);
console.log(process.argv);
console.log(process.execArgv);
// 在命令行中执行node --harmony test.js --nick chyingp 
/**************
F:\Software\node\node.exe
[
  'F:\\Software\\node\\node.exe',
  'F:\\Project\\node-study\\test.js',
  '--nick',
  'chyingp'
]
[ '--harmony' ]
***************/
```

3. 资源查看
   1. `process.uptime()`：当前进程运行多长时间，单位是秒。
   2. `process.memoryUsage()`：进程占用的内存，单位为字节。
   3. `process.cpuUsage([previousValue])`：CPU使用时间耗时，单位为毫秒。
      1. user表示用户程序代码运行占用的时间。
      2. system表示系统占用时间。

```js
const process = require('process');
const startUsage = process.cpuUsage();
// { user: 38579, system: 6986 }

// spin the CPU for 500 milliseconds
const now = Date.now();
while (Date.now() - now < 500);

console.log(process.cpuUsage(startUsage));
// { user: 514883, system: 11226 }
```

4. 方法
   1. `process.exit([code])`：强制终止进程。
      1. 绝大多数情况没有必要显示调用，如果事件循环中，没有其他待处理的工作，则 Node.js 进程将自行退出。 
      2. 即使仍有未完全完成的异步操作挂起，比如IO，也会强制终止进程。为了解决终止前IO未完全写入等操作，建议使用`process.exitCode`设置退出码，然后不给事件循环中安排工作。
   2. `process.kill(pid[, signal])`：将signal发送到由pid标识的进程。
   3. `process.nextTick(fn)`：异步微任务，将fn添加到下一个时间点的队列执行。
   4. `process.cwd()`：返回当前工作路径。
   5. `process.chdir(directory)`：切换当前工作路径。

```js
const process = require('process');
console.log(process.cwd());
try {
  process.chdir('F:\\Software');
  console.log(process.cwd());
} catch (err) {
  console.log('没有当前目录!');
}
/**************
F:\Project\node-study
F:\Software
***************/
```

5. 事件
   1. `exit`：和`process.exit()`作用相同
   2. `beforeExit`：当事件循环清空且没有其他工作要安排时，会触发该事件。
   3. `uncaughtException`：当前进程抛出一个没有被捕捉的错误时会触发该事件。

```js
process.on('uncaughtException', function (err) {
  console.error(err.stack);
});
```

6. 标准输入输出

`process.stdin`、`process.stdout`、`process.stderr`分别代表进程的标准输入、标准输出、标准错误输出。

```js
const process = require('process');
process.stdin.setEncoding('utf8');
process.stdin.on('readable', () => {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    process.stdout.write(`data: ${chunk}`);
  }
});
```

## url

### URL对象

> 有些教程会提到`urlObject`对象，这是旧的API，应该尽量不要使用。

用来做URL解析，关于各部分，官网给出如下图：

```bash
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                              href                                              │
├──────────┬──┬─────────────────────┬────────────────────────┬───────────────────────────┬───────┤
│ protocol │  │        auth         │          host          │           path            │ hash  │
│          │  │─────────────────────┼─────────────────┬──────┼──────────┬────────────────┤       │
│          │  │ username │ password │    hostname     │ port │ pathname │     search     │       │
│          │  │          │          │                 │      │          ├─┬──────────────┤       │
│    origin   │          │          │           origin       │          │ │    query     │       │
"  https:   //    user   :   pass   @ sub.example.com : 8080   /p/a/t/h  ?  query=string   #hash "
```

1. 构造URL对象，`new URL(input[, base])`
   1. input：url字符串
      1. 如果是绝对路径，如`https://example.org`，则不需要base
      2. 如果是相对路径，如`/foo`，则需要base
   2. base：基础地址

```js
new URL('https://example.org');
new URL('/foo', 'https://example.org/'); // https://example.org/foo
```

2. 属性

对于`https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash`，URL对象为：

```js
URL {
  href: 'https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash',
  origin: 'https://sub.example.com:8080',
  protocol: 'https:',
  username: 'user',
  password: 'pass',
  host: 'sub.example.com:8080',
  hostname: 'sub.example.com',
  port: '8080',
  pathname: '/p/a/t/h',
  search: '?query=string',
  searchParams: URLSearchParams { 'query' => 'string' },
  hash: '#hash'
}
```

### URLSearchParams

> `querystring`模块是旧的API，在新项目中尽量使用新的`URLSearchParams`对象来解析

1. 从URL中获取URLSearchParams对象，有两种方法

```js
const params1 = url.searchParams;
const params2 = new URLSearchParams(url.searchParams);
```

2. 方法，方法为字面意思
   1. get(name)
   2. getAll(name)
   3. set(name, value)
   4. append(name, value)
   5. delete(name)
   6. has(name)
   7. entries()
   8. keys()
   9. values()
   10. toString()：转为参数字符串形式
   11. forEach(fn[, thisArg])

```js
const { URL } = require('url');
const url = new URL('https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash');

const params = new URLSearchParams(url.searchParams);
params.forEach((value, name, searchParams) => {
  console.log(name, value);
})
```

## zlib

工作原理：

1. 浏览器发送请求时通过请求头的`accept-encoding`标识支持的压缩格式
2. 服务端返回`content-encoding`指明使用的格式
3. 浏览器得到响应报文后，依据`content-encoding`进行解压

> zlib几个方法创建的对象都是 Transform流。

| **accept-encoding** | **zlib**                      |
| ------------------- | ----------------------------- |
| gzip                | `zlib.createGzip()`           |
| deflate             | `zlib.createDeflate()`        |
| br                  | `zlib.createBrotliCompress()` |

# 三、文件

## API风格

> Node.js中文件相关操作API会有如下四种风格：
>
> - 回调风格：最旧式的风格，会产生回调地狱
> - Promise风格：总是返回一个Promise对象，然后通过Promise范式处理相关操作
> - promisify风格：通过util.promisify函数将文件处理函数变成Promise风格
> - 同步风格：在函数名后会有添加了Sync的API，通过async/await处理，显得精炼

1.传统回调风格

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

2.Promise API

返回 Promise 对象而不使用回调

> require('fs/promises') v14 后可用

```js
const fs = require('fs').promises;
// const fs = require('fs/promises');

fs.stat('.').then(stats => {
  // 使用 stats
}).catch(error => {
  // 处理错误
});
```

3.promisify

```js
const util = require('util');
const fs = require('fs');

const stat = util.promisify(fs.stat);
stat('.').then(stats => {
  // 使用 stats
}).catch(error => {
  // 处理错误
});
```

4.同步方法

命名规则是方法名称后面添加 `Sync`

```js
const fs = require('fs');
try {
	const stats = fs.statSync('.');
  // 使用 stats
} catch(error) {
	// 处理错误
}
```

## 文件读取

> 有些API在过程中会产生FileHandle对象，是**数字文件描述符的对象封装**。
>
> 该对象一般通过open方法创建，最终必须要通过close方法销毁。

### readFile()

异步读取文件的**全部**内容

options：

- encoding：编码
- flag：文件系统flags的支持，默认为`'r'`
- signal：AbortSignal类型，运行中断相关操作

> 文件标志位：
>
> - r：读取，文件不存在就异常
> - r+：读写，文件不存在就异常
> - rs+：同步读写，文件不存在就异常
> - w：写入文件不存在就异常
> - w+：读写，文件不存在就异常
>
> r+和w+都是读写，它们有区别吗？
>
> 当然有的，r+标识**先读取，然后从尾部开始写入**；但w+则是**以覆盖形式的写入**。因此**要修改文件而不是替换时候应该将 flag选项设置为r+ 而不是默认的 w。**

1. 回调方式

```js
fs.readFile('./long.txt', { encoding: 'utf8', flag: 'r' }, (err, data) => {
  if (err) throw err;
  console.log(data);
})
```

2. Promise API：`fsPromises.readFile(path[, options])`

```js
const fs = require('fs/promises');
fs.readFile('./long.txt', {
  encoding: 'utf8',
  flag: 'r',
}).then(data => {
  console.log(data);
}, err => {
  console.log(err);
})
```

3. 同步方法

```js
async function test() {
  const buffer = await fs.readFileSync('./long.txt', {
    encoding: "utf8",
    flag: 'r',
  })
  console.log(buffer);
}
test();
```

### 精确读取

类似C语言，有三个函数实现精细化操作：

- open()
- read()
  - options
    - buffer：Buffer类型，将填充读取的文件数据的缓冲区
    - offset：整数类型，缓冲区中开始填充的位置
    - position：整数类型，从文件开始读取数据的位置
    - length：整数类型，从文件开始读取的字节数
  - 返回值
    - bytesRead：读取的字节数
    - buffer：对传入的buffer参数的引用
- close()

他们在不同API风格下差异是较大的。

1. 回调风格

```js
function test() {
  // fd是由FileHandle对象管理的数字文件描述符，number类型
  fs.open('./long.txt', (err, fd) => {
    if (err) throw err;
    const readOptions = {
      position: 10,
      length: 36,
    }
    fs.read(fd, readOptions, (err, bytesRead, buffer) => {
      if (err) throw err;
      console.log(bytesRead, buffer);
      fs.close(fd, err => {
        if (err) throw err;
      })
    })
  })
}
test();
```

2. Primise API

```js
const fs = require('fs/promises');
async function test() {
  // 1.打开long.txt文件，返回用Promise包装的FileHandler对象
  const fileHandle = await fs.open('./long.txt');
  // 2.读取选项
  const readOptions = {
    position: 10,
    length: 36,
  }
  const { bytesRead, buffer } = await fileHandle.read(readOptions);
  console.log(bytesRead, buffer);
  // 3.关闭文件
  fileHandle.close()
}
test();
```

3. promisify

```js
const fs = require('fs');
const { promisify } = require('util');

const open = promisify(fs.open);
const read = promisify(fs.read);
const close = promisify(fs.close);

async function test() {
  // const fd = await promisify(fs.open)('./long.txt');
  const fd = await open('./long.txt');
  const readOptions = {
    position: 10,
    length: 36,
  }
  const { bytesRead, buffer } = await read(fd, readOptions);
  console.log(bytesRead, buffer);
  await close(fd)
}
test();
```

4. 同步方法

```js
const fs = require('fs');

async function test() {
  // fd是由FileHandle对象管理的数字文件描述符，number类型
  const fd = fs.openSync('./long.txt');
  const readOptions = {
    position: 10,
    length: 36,
  }
  // 注意: 这里要先分配缓存区
  const buffer = Buffer.alloc(40);
  const bytesRead = fs.readSync(fd, buffer, readOptions);
  console.log(bytesRead, buffer);
  fs.closeSync(fd);
}
test();
```

### fs.createReadStream()

`fs.createReadStream(path[, options])`：

- path

- options

- - fd：如果指定了 fd，则 ReadStream 会忽略 path 参数，使用指定的文件描述符（不会再次触发 open 事件）
  - autoClose：默认值: true，文件读取完成或者出现异常时是否自动关闭文件描述符
  - start：开始读取位置
  - end：结束读取位置
  - highWaterMark：默认值为64*1024，普通可读流一般是16k

```js
const fs = require('fs');
const rs = fs.createReadStream('./src/test.txt');
rs.on('open', fd => {
  console.log(`文件描述符 ${fd} 已分配`);
});
rs.on('ready', () => {
  console.log('文件已准备好');
});
rs.on('data', chunk => {
  console.log('读取文件数据:', chunk.toString());
});
rs.on('end', () => {
  console.log('文件读取完成');
});
rs.on('close', () => {
  console.log('文件已关闭');
});
rs.on('error', (err) => {
  console.log('文件读取发生发生异常:', err.stack);
});
```

## 文件写入

### writeFile()

1. 使用Promise API形式：`fsPromises.writeFile(file, data[, options])`

```js
const fs = require('fs/promises');
const data = Buffer.from('Hello, Node.js');
fs.writeFile('./test.txt', data).then(
  res => {
    // res是undefined
    console.log(typeof res);
  },
  err => {
    console.log(err);
  }
)
```

2. 同步方法

```js
const fs = require('fs');
async function writeData(data) {
  await fs.writeFileSync('./test.txt', data);
}
const data = Buffer.from('Hello, Node.js!');
writeData(data)
```

### appendFile()

将数据追加到尾部，`fs.appendFile(path, data[, options])`，和`writeFile()`使用类似

```js
const fs = require('fs');
async function appendData(data) {
  await fs.appendFileSync('./test.txt', data);
}
const data = Buffer.from('Hello, Node.js!');
appendData(data)
```

### 精确写入

前面已经介绍了open、read、close方法，这里要介绍的write方法和read类似

但需要注意的是，read和write不能同时操作，它们都是异步的。

- `fs.writeSync(fd, buffer[, offset[, length[, position]]])`
- `fs.writeSync(fd, string[, position[, encoding]])`

**注意之前option可以写成对象，这里是不行的。**

```js
const fs = require('fs');
const handleFile = async (filePath, writeStr) => {
  const fd = await fs.openSync(filePath, 'w+');
  await fs.writeSync(fd, writeStr);
  await fs.closeSync(fd);
}
const str = '纸上得来终觉浅，绝知此事要躬行\n';
const filePath = './test.txt';
handleFile(filePath, str)
```

### fs.createWriteStream()

`fs.createWriteStream(path[, options])`：

- path
- options
  - fd：默认值null，如果指定了 fd，则会忽略 path 参数，使用指定的文件描述符（不会再次触发 open 事件）
  - mode：默认值0o666
  - autoClose：默认值为true，当 'error' 或 'finish' 事件时，文件描述符会被自动地关闭
  - start：开始写入文件的位置，不设置默认覆盖

```js
const fs = require('fs');
// 使用管道方式
fs.createReadStream('./src/test.txt')
  .pipe(fs.createWriteStream('./copy.txt'));
```

## 文件夹操作

### fs.Dir类

**可迭代**标识目录流的类，由`opendir()`创建

1. `dir.path`：此目录的只读路径
2. `dir.read()`
   1. 不传参数：返回Promise，包装的Dirent对象
   2. 传入回调函数`(err,dirent)=>{}`：读取完成后通过`fs.Dirent`或null调用回调函数
3. `dir.close()`：异步关闭目录的底层资源句柄
   1. `dir.close((err)=>{})`：关闭过程中可能导致错误，可以用回调形式

### fs.Dirent类

是遍历 fs.Dir 获得的目录项，可以是目录中的文件或子目录

> 目录条目是文件名和文件类型对的组合。

1. `dirent.name`：文件名
2. `dirent.isDirectory()`：是否是目录
3. `dirent.isFile()`：是否是文件
4. `dirent.isSymbolicLink()`：是否是对象描述符号链接

### 操作

1.`fs.opendir(path[, options], callback)`：打开一个目录，返回 fs.Dir 对象

```js
const fs = require('fs/promises');
async function print(path) {
  try {
    // dir是目录对象
    const dir = await fs.opendir(path);
    // 异步迭代器for await
    for await (const dirent of dir) {
      console.log(dirent);
    }
  } catch (err) {
    console.error(err);
  }
}
print('./src');
```

通过dir.read()迭代dir：

```js
const fs = require('fs/promises');
async function print(path) {
  try {
    const dir = await fs.opendir(path);
    let dirent = await dir.read();
    while (dirent) {
      console.log(dirent);
      dirent = await dir.read();
    }
  } catch (err) {
    console.error(err);
  }
}
print('./src');
```

2.`fs.readdir(path[, options], callback)`：读取目录内容，files是目录中的**文件名**的数组。

options：

- encoding：默认值utf8，如果encoding设置为buffer，则返回的文件名是Buffer对象
- withFileTypes：默认值false，设置为true后回调函数files数组将包含fs.Dirent对象

```js
const fs = require('fs/promises');
async function print(path) {
  const files = await fs.readdir(path, {
    encoding: 'utf8',
    withFileTypes: true,
  });
  console.log(files);
}
print('./src');
/*****************
[
  Dirent { name: 'long.txt', [Symbol(type)]: 1 },
  Dirent { name: 'test.txt', [Symbol(type)]: 1 }
]
*****************/
```

3.`fs.mkdir(path[, options], callback)`：创建目录

options：

- recursive：**默认值 false**，设置为 true 时候表示递归创建
- mode：默认值 0o777，Windows 不支持

```js
const fs = require('fs/promises');
/**
 * 创建目录：./src/assets/image
 * recursive为true表示递归创建，即使路径中有段没有也会创建
 */
fs.mkdir('./src/assets/image', { recursive: true },).catch(err => {
  console.log(err);
})
```

4.`fs.rm(path[, options], callback)`：删除文件夹

> 应避免使用`fs.rmdir()`，转而使用`fs.rm()`

options：

- force：默认值false，设置为true时候如果**path不存在异常忽略**。
- recursive：**默认值 false**，设置为 true 时候表示递归删除
- maxRetries：遇到`EBUSY`、`EMFILE`、`ENFILE`、`ENOTEMPTY` 或 `EPERM` 错误，Node.js会以retryDelay的时间间隔重试该操作。maxRetries标识重试次数。
- retryDelay：重试的时间间隔

```js
const fs = require('fs/promises');
const rmOptions = {
  force: true,
  recursive: true,
}
fs.rm('./src/assets', rmOptions).catch(err => {
  console.log(err);
})
```

## 监视

### fs.FSWatcher类

用于监视文件变化，调用`fs.watch()`后返回一个`fs.FSWatcher`实例。每当指定监视的文件被修改时，实例会触发事件调用回调函数。

### fs.watch()

> `fs.watch()`和`fs.watchFile()`都是监视文件的API，但`fs.watchFile()`使用轮训方式检测文件变化，如果不设置 `interval` 或者设置较高的值会发现文件变化的监视有延迟，而`fs.watch()`监听操作系统提供的事件，而且可以监视目录变化，使用`fs.watch()`比`fs.watchFile()`更高效，**平常应尽可能使用`fs.watch()`代替`fs.watchFile()`**。

- 回调形式API：`fs.watch(filename[, options][, listener])`
- Promise API：`fsPromises.watch(filename[, options])`
  - filename：**文件或文件夹路径**
  - options
    - ecoding
    - recursive：**默认值 false**，设置为 true 时候表示递归监视，即监视所有子目录，**仅在Windows和Mac OS上支持**。
    - persistent：**默认值 true**，指示如果文件已正被监视，进程是否应继续运行。
    - signal
  - 返回值：**AsyncIterator类型**，不是Promise
    - eventType：变更类型
      - rename：文件出现或被删除
      - change：文件发生修改
    - filename：变更文件名称

```js
const fs = require('fs/promises');
(async () => {
  const watcher = fs.watch('./', { recursive: true });
  for await (const event of watcher) {
    console.log(event);
  }
})()
```

### 社区选择

fs.watchFile() 性能问题，fs.watch() 平台不一致等两个方法都有不尽如人意的地方

Node.js `fs.watch`:

- MacOS 有时候不提供 `filename`
- 在部分场景不触发修改事件（MacOS Sublime）
- 经常一次修改两次触发事件
- 大部分文件变化 eventType 都是 `rename`.
- 未提供简单的监视文件树方式

Node.js `fs.watchFile`:

- 事件处理问题和 fs.watch 一样烂
- 没有嵌套监听
- CPU 消耗大

日常在监视文件变化可以选择社区的优秀方案：

1. [node-watch](https://www.npmjs.com/package/node-watch)
2. [chokidar](https://www.npmjs.com/package/chokidar)

## 其他常用API

### 判断路径是否存在

由于`fs.exists()`的废弃，在今后推荐使用下面的方式：

```js
fs.open('./src/longd.txt', 'r').then(
  fd => {
    console.log(fd);
  }, err => {
    if(err.code ==='ENOENT'){
      console.log('文件不存在');
    }
  }
);
```

处理用错误捕捉，还可以用`fs.access()`相关模式进行判断

### fs.access()

`fs.access(path[, mode], callback)` ：测试用户对 path 指定的文件或目录的权限。

mode可选值：

| 常量                | 描述                                                         |
| :------------------ | :----------------------------------------------------------- |
| `fs.constants.F_OK` | 方法默认值，表明文件对调用进程可见，可用于判断文件是否存在   |
| `fs.constants.R_OK` | 表明调用进程可以读取文件                                     |
| `fs.constants.W_OK` | 表明调用进程可以写入文件                                     |
| `fs.constants.X_OK` | 表明调用进程可以执行文件，在 Windows 上无效（表现等同 `fs.constants.F_OK` |

> 注意：`fs.constants.*`是在fs下的，用`const fs = require('fs/promises');`是访问不到的，只能用`const fs = require('fs');`

```js
const fs = require('fs');
fs.access('./src/long.txt', fs.constants.F_OK, (err) => {
  console.log(err ? '不存在' : '存在');
})
```

### fs.copyFile()

`fs.copyFile(src, dest[, mode], callback)` ：将 src 拷贝到 dest， **默认情况下，如果 dest 已经存在则会覆盖。**

mode可选值：

| 常量                                  | 描述                                                         |
| :------------------------------------ | :----------------------------------------------------------- |
| `fs.constants.COPYFILE_EXCL`          | 如果目标路径存在则失败。                                     |
| `fs.constants.COPYFILE_FICLONE`       | 复制操作将尝试创建写时复制引用链接。 如果底层平台不支持写时复制，则使用回退复制机制。 |
| `fs.constants.COPYFILE_FICLONE_FORCE` | 复制操作将尝试创建写时复制引用链接。 如果底层平台不支持写时复制，则操作将失败并显示错误。 |

```js
const fs = require('fs');
// 通过使用 COPYFILE_EXCL，如果目标文件存在，则操作将失败。
fs.promises.copyFile('./src/long.txt', './my-copy.txt', fs.constants.COPYFILE_EXCL).then(
  () => console.log('源文件已拷贝到目标文件'),
  () => console.log('该文件无法拷贝')
)
```

### fs.rename()

`fs.rename(oldPath, newPath, callback)` ：

- 如果oldPath和newPath都是同一路径下，只有文件名不同，那么就是重命名
- 如果oldPath和newPath不是同一路径下，那就是剪贴后重命名

```js
const fs = require('fs');
fs.promises.rename('./src/long.txt', './my-copy.txt').then(
  () => console.log('重命名成功'),
  () => console.log('重命名失败')
)
```

### fs.unlink()

`fs.unlink(path, callback)` ：删除常规文件或软链接，不能用于目录

```js
const fs = require('fs');
fs.promises.unlink('./my-copy.txt').then(
  () => console.log('删除成功'),
  () => console.log('删除失败')
)
```

### fs.chmod()

`fs.chmod(path, mode, callback)`：mode 使用八进制表示 `0o765` (0o 表示数字是八进制)，和 linux 文件权限规则一致，后三位数字分别代表

1. 文件 owner 权限
2. 所在 group 权限
3. 其它 group 权限

```js
fs.chmod('my_file.txt', 0o775, (err) => {
  if (err) throw err;
  console.log('文件 my_file.txt 的权限已被更改');
});
```

# 四、流

## 数据结构化对象

主要分为三类：

1. 类型化数组（TypedArray）：在标准中即数组对象Array，在ES2017后引入了`Int8Array`、`Unit8Array`、`Float32Array`、`BigInt64Array`等对象
2. `ArrayBuffer`和`SharedArrayBuffer`
3. `DataView`

### TypedArray

该对象描述一个底层的二进制数据缓冲区的一个类数组视图。

- `Int8Array`：二进制补码8位有符号整数的数组，因此范围是`0b10000000~0b01111111`（十进制`-128~127`）
- `Uint8Array`：二进制补码8位无符号整数的数组，因此范围是`0b00000000~0b11111111`（十进制`0~255`）
- `Float32Array`：32位浮点数型数组
- `BigInt64Array`：64位有符号整数组成的数组，初始化值为`0n`

```js
const arr1 = new Int8Array(8);
arr1[0] = 0b01111111;   // +最大
arr1[1] = 0b00000001;   // +最小
arr1[2] = 0b11111111;   // -最大
arr1[3] = 0b10000000;   // -最小
console.log(arr1);
console.log(arr1.length);	// 数组长度
console.log(arr1.BYTES_PER_ELEMENT);	// 数组元素占几个字节

const arr2 = new Uint8Array(8);
arr2[0] = 0b00000000;   // 最小
arr2[1] = 0b11111111;   // 最大
console.log(arr2);
console.log(arr2.length);
console.log(arr2.BYTES_PER_ELEMENT);

const arr3 = new Int16Array(8);
arr3[0] = 0b0111111111111111;
arr3[1] = 0b0000000000000001;
arr3[2] = 0b1111111111111111;
arr3[3] = 0b1000000000000000;
console.log(arr3);
console.log(arr3.length);
console.log(arr3.BYTES_PER_ELEMENT);

/*************************
Int8Array(8) [
  127, 1, -1, -128,
    0, 0,  0,    0
]
8
1
Uint8Array(8) [
  0, 255, 0, 0,
  0,   0, 0, 0
]
8
1
Int16Array(8) [
   32767, 1, -1,
  -32768, 0,  0,
       0, 0
]
8
2
*************************/
```

创建TypedArray数组的四种方式：

```js
// 1.创建长度为8的Int32数组
const arr1 = new Int32Array(8);
// 2.通过数组创建
const arr2 = new Int32Array([21, 22]);
// 3.通过其他TypedArray创建
const arr3 = new Int32Array(arr2);
// 4.通过ArrayBuffer创建，三个参数分别为buffer,byteOffset,length
const arr4 = new Int32Array(new ArrayBuffer(16), 0, 4);
```

至于一些具体的方法，这里不是重点，很多和Array类似。

### ArrayBuffer

`ArrayBuffer`对象用来表示通用的、固定长度的原始二进制数据缓冲区。

你不能直接操作 `ArrayBuffer` 的内容，而是**要通过TypedArray或DataView对象来操作**，它们会将缓冲区中的数据表示为特定的格式，并通过这些格式来读写缓冲区的内容。

```js
// create an ArrayBuffer with a size in bytes
const buffer = new ArrayBuffer(8);
console.log(buffer.byteLength);		// 8
```

### DataView

`DataView`视图是一个可以从二进制`ArrayBuffer`对象中读写多种数值类型的底层接口。

```js
const buffer = new ArrayBuffer(8);
// 创建视图
const view1 = new DataView(buffer);
const view2 = new DataView(buffer, 4, 2);
// 将byteOffset为4后的2字节设置为0x1010，即1111000011110000
view1.setInt16(4, 0x1010);
// 获取view2视图byteOffset为0后的2字节的值
console.log(view2.getInt16(0));
// 获取视图对应的ArrayBuffer
console.log(view2.buffer);
/****************
4112
ArrayBuffer {
  [Uint8Contents]: <00 00 00 00 10 10 00 00>,
  byteLength: 8
}
*****************/
```

## Buffer

### 实例化Buffer

1. `Buffer.from()`
   1. 传入字符串
   2. 传入buffer，创建副本
   3. 传入数字数组
   4. 传入ArrayBuffer，**共享内存**
   5. 传入支持valueOf或Symbol.toPrimitive的对象
      1. `valueOf`：`Buffer.from(object.valueOf(), offsetOrEncoding, length)`
      2. `Symbol.toPrimitive`：`Buffer.from(object[Symbol.toPrimitive]('string'), offsetOrEncoding)`

```js
// 1.通过字符串创建buffer
const buf1 = Buffer.from('Hello', 'utf-8');
console.log(buf1);  // <Buffer 48 65 6c 6c 6f>
// 2.通过buffer创建副本buffer
const buf2 = Buffer.from(buf1);
console.log(buf2, buf1 === buf2);   // <Buffer 48 65 6c 6c 6f> false
// 3.通过数字数组创建buffer
const buf3 = Buffer.from([0x56, 0xff, 0xc3]);
console.log(buf3);  // <Buffer 56 ff c3>
// 4.与ArrayBuffer共享内存
const ab = new Int8Array([10, 16]);
const buf4 = Buffer.from(ab.buffer);
console.log(buf4);
// 由于是共享内存，修改后Buffer也会跟着自动修改
ab[1] = 11;
console.log(buf4);
// 5.支持valueOf或Symbol.toPrimitive的对象，初始化Buffer
class Foo {
  [Symbol.toPrimitive]() {
    return 'this is a test';
  }
}
const buf5 = Buffer.from(new Foo())
console.log(buf5);
/****************
<Buffer 48 65 6c 6c 6f>
<Buffer 48 65 6c 6c 6f> false
<Buffer 56 ff c3>
<Buffer 0a 10>
<Buffer 0a 0b>
<Buffer 74 68 69 73 20 69 73 20 61 20 74 65 73 74>
*****************/
```

2. `Buffer.alloc()`

```js
/**
 * size: buffer大小
 * fill: 要填充的初始值
 * encoding: 如果fill是字符串，则这是它的字符编码，默认utf8
 */
const buf = Buffer.alloc(8,'ab','utf8')
console.log(buf);	// <Buffer 61 62 61 62 61 62 61 62>
```

### Buffer和string转换

```js
// 字符串--->Buffer
const buf1 = Buffer.from('test', 'utf8')
console.log(buf1);
// Buffer--->字符串
const str1 = buf1.toString();
const str2 = buf1.toString('hex');
console.log(str1, str2);
```

### Buffer拼接

`Buffer.concat(list[, totalLength])`：可以把多个 Buffer 实例拼接为一个 Buffer 实例

```js
const buf1 = Buffer.from('a');
const buf2 = Buffer.from('b');
const buf3 = Buffer.from('c');
console.log(Buffer.concat([buf1, buf2, buf3]));
```

### StringDecoder

在Node.js中汉字字符是由三个字节表示的，如果处理中文字符时候使用的3的倍数的字节数，就会造成字符拼接乱码问题。

```js
const buf = Buffer.from('中文字符串！');
for (let i = 0; i < buf.length; i += 5) {
  const b = Buffer.allocUnsafe(5);
  buf.copy(b, 0, i);
  console.log(b.toString());
}
```

![](images/StringDecoder.png)

使用 string_decoder 模块可以解决这个问题：

StringDecoder在得到编码后，知道宽字节在utf-8下占3个字节，所以在处理末尾不全的字节时，会保留到第二次write()。

```js
const { StringDecoder } = require('string_decoder');
const buf = Buffer.from('中文字符串！');
const decoder = new StringDecoder('utf8');
for (let i = 0; i < buf.length; i += 5) {
  const b = Buffer.allocUnsafe(5);
  buf.copy(b, 0, i);
  console.log(decoder.write(b));
}
```

## Stream基本概念

**流是对输入输出设备的抽象，是一组有序的、有起点和终点的字节数据传输手段。**

在Node.js中安装流动方向可以分为三种：

- 设备流向程序：readable
- 程序流向设备：writable
- 双向流动：duplex、transform

pipe()连接：流的加工器，如下面例子所示，流的方向：

- `rs ---> lowercase`：lowercase 在下游，所以 lower 需要是个 writable 流
- `lowercase ---> ws`：相对而言，lowercase 又在上游，所以 lower 需要是个 readable 流

因此`lowercase`必须是双向的流。

```js
const fs = require('fs');
const rs = fs.createReadStream('./test.txt');
const ws = fs.createWriteStream('./src/test.txt');
rs.pipe(lowercase).pipe(ws);
```

## 可读流

可读流是**生产数据**用来供程序消费的流。常见的数据生产方式有读取磁盘文件、读取网络请求内容等。

### 自定义可读流

自定义可读流需要两步：

1. 继承Stream模块的Readable类
2. **覆盖重写**`_read()`方法，调用this.push将生产的数据放入待读取队列中

注意事项：

- `_read()`方法有一个参数size，在暂停模式下指定应读取多少数据返回
- this.push的内容只能是字符串或Buffer，不能是数字
- this.push的第二个参数encoding指定字符串编码类型
- this.push(null)用于标识数据读取完毕

```js
const { Readable } = require('stream');
class RandomNumberStream extends Readable {
  constructor(max) {
    super();
    this.max = max;
  }
  _read() {
    setTimeout(() => {
      if (this.max) {
        const randomNumber = parseInt(Math.random() * 1000);
        this.push(`${randomNumber}\n`);
        this.max = this.max - 1;
      } else {
        // 向缓存区push一个null用于暂停操作
        this.push(null);
      }
    }, 100)
  }
}

const rns = new RandomNumberStream(5);
// 使用pipe()是流动模式
rns.pipe(process.stdout)
```

### 两种读取模式

在上面代码中用了setTimeout而不是setInterval，为啥？这就要引出两种读取模式呢，使用了pipe()设置为了流动模式，因而通过setTimeout也能实现重复定时效果。

两种模式：

1. 流动模式：数据由底层系统读出，并**尽可能快**地提供给应用程序
2. 暂停模式：必须显示地**调用 read() 方法**来读取若干数据块【挤牙膏式读数据】

两种模式式可以互相转换的：

1. 暂停模式--->流动模式
   1. 通过添加 data 事件监听器来启动数据监听
   2. 调用 resume() 方法启动数据流
   3. 调用 pipe() 方法将数据转接到另一个可写流
2. 流动模式--->暂停模式
   1. 在流没有 pipe() 时，调用 pause() 方法可以将流暂停
   2. pipe() 时移除所有 data 事件的监听，再调用 unpipe() 方法

#### 流动模式

上述例子通过pipe()就是流动模式，当然也可以通过data事件方式

当可读流生产出可供消费的数据后就会触发 data 事件，data 事件监听器绑定后，数据会被尽可能地传递。

```js
const rns = new RandomNumberStream(5);
rns.on('data', chunk => {
  console.log(chunk);
})
rns.on('end', () => {
  console.log('done');
})
rns.on('error', (err) => {
  console.error(err);
})
```

#### 暂停模式

NodeJS 提供了一个 `readable` 的事件，事件在可读流准备好数据的时候触发，也就是先监听这个事件，收到通知有数据了再去读取就好了：

```js
/**
 * 当read()函数返回值为null时候表示读取完成
 * 设置size为2，表示每次读取2个字节
 */
rns.on('readable', () => {
  let chunk;
  while ((chunk = rns.read(2)) !== null) {
    console.log(chunk);
  }
})
```

## 可写流

可写流是对数据流向设备的抽象，用来**消费上游流过来的数据**，通过可写流程序可以把数据写入设备，常见的是本地磁盘文件或者 TCP、HTTP 等网络响应。

### 可写流的使用

之前提到通过监听可读流的data事件就能使可读流进入到流动模式中，我们在回调事件里调用了可写流的 write() 方法，这样数据就被写入了可写流抽象的设备中，也就是copy.txt文件。

wirte()有三个参数：

- chunk：表示要写入的数据
- encoding：字符编码
- callback：数据被写入之后的回调函数

```js
const fs = require('fs');
const rs = fs.createReadStream('./src/test.txt');
const ws = fs.createWriteStream('./copy.txt');

rs.setEncoding('utf-8');
rs.on('data', chunk => {
  ws.write(chunk);
});
```

### 自定义可写流

自定义可读流和可读流类似，也是两步：

1. 继承stream模块的Writable类
2. 实现`_write()`方法

```js
const { Writable } = require('stream');
class OutputStream extends Writable {
  _write(chunk, encoding, callback) {
    process.stdout.write(chunk.toString().toUpperCase());
    process.nextTick(callback);
  }
}
```

实例化可写流有几个options可选：

- objectMode：默认值false，设置为true时`writable.write()`方法除了string和buffer外，还可以写入任意JavaScript对象
- highWaterMark：每次最多写入的数据量，默认值为16，即16kb
- decodeStrings：是否把传入的数据转成Buffer，默认是true

方法：

- `write()`：当要求写入的数据大于可写流的 highWaterMark 的时候，数据不会被一次写入，有一部分数据被滞留。数据有滞留的话，返回 false，如果可以处理完就会返回 true。
- `end()`：没有其他数据需要写入，可写流可以关闭了。

事件：

- `pipe`：可读流调用pipe()方法时候触发
- `unpipe`：可读流调用unpipe()方法时候触发
- `drain`：当之前存在滞留数据，也就是 writeable.write() 返回过 false，经过一段时间的消化，处理完了积压数据，可以继续写入新数据的时候触发（drain 的本意即为排水、枯竭，挺形象的）
- `finish`、`error`：调用`end()`方法并且所有数据都被写入底层后才会触发。

### back pressure 

流不是一次性把所有数据载入内存处理，而是一边读一边写。但一般读取速度快于写入速度，那么pipe()方法是如何做到供需平衡的呢？

主要依赖下面三点：

1. 可读流有流动和暂停两种模式，可以通过 `pause()` 和 `resume()` 方法切换
2. 可写流的 `write()` 方法，每次可以处理多少是 highWatermark 决定的
3. 当可写流处理完了积压数据会触发 drain 事件

```js
const { Readable, Writable } = require('stream');
// 自定义可读流
class RandomNumberStream extends Readable {
  constructor(max) {
    super();
    this.max = max;
  }
  _read() {
    setTimeout(() => {
      if (this.max) {
        const randomNumber = parseInt(Math.random() * 1000);
        this.push(`${randomNumber}\n`);
        this.max = this.max - 1;
      } else {
        // 向缓存区push一个null用于暂停操作
        this.push(null);
      }
    }, 1000)
  }
}
// 自定义可写流
class OutputStream extends Writable {
  _write(chunk, encoding, callback) {
    // 写入数据
    process.stdout.write(chunk);
    process.nextTick(callback);
  }
}
const rns = new RandomNumberStream(10);
const os = new OutputStream({
  objectMode: false,
  highWaterMark: 8,
  decodeStrings: true,
});
// data事件是流动模式
rns.on('data', chunk => {
  // 当有数据滞留时，转换成暂停模式
  if (os.write(chunk) === false) {
    console.log('pause');
    rns.pause();
  }
});
// 如果有积压的数据，就触发drain事件，转换成流动模式
os.on('drain', () => {
  console.log('drain');
  rns.resume();
});
```

## 双工流

双流就是同时实现 Readable 和 Writable 流，在Node.js中双工流常用如下两种：

- Duplex
- Transform

### Duplex

和可读流、可写流类似，实现双工流需要三步：

1. 继承 Duplex 类
2. 实现 _read() 方法
3. 实现 _write() 方法

```js
const { Duplex } = require('stream');
class MyDuplex extends Duplex {
  constructor(options) {
    super(options);
  }
  _write(chunk, encoding, callback) { }
  _read(size) { }
}
```

### Transform

和Duplex对比两者区别：Duplex 虽然同时具备可读流和可写流，但**两者是相对独立的**；Transform 的**可读流的数据会经过一定的处理过程自动进入可写流。**

实现Transform转换流需要三步：

1. 继承 Transform 类
2. 实现 _transform() 方法
3. 实现 _flush() 方法

`_transform(chunk, encoding, callback)`：**不能直接调用，必须子类实现。**用来接收数据，并产生输出。在`_transform()`方法内部可以调用 `this.push(data)`生产数据，交给可写流，也可以不调用，意味这输入不会产生输出。

当数据处理完成后必须调用 `callback(err, data)`，err传递错误信息，data传入效果和 this.push(data) 一样。

```js
transform.prototype._transform = function (data, encoding, callback) {
  this.push(data);
  callback();
};
transform.prototype._transform = function (data, encoding, callback) {
  callback(null, data);
};
```

`_flush()`：**不能直接调用，必须子类实现。**当没有更多的写入数据被消耗时，但在触发 `end`事件以表示可读流结束之前，将调用此方法。

Transform 事件：

- `finish`：当调用`transform.end()`并且数据被`_transform()`处理完后会触发finish
- `end`：调用`_flush()`后所有数据输出完毕，触发end事件

# 五、Web应用

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



