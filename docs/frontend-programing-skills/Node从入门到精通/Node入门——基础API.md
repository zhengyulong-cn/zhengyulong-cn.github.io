# Node入门——基础API

## path

path模块在Windows和POSIX（Linux、Mac OS）上处理是有差异的。

- `path.basename()`：返回路径最后部分。

```js
path.basename('/foo/bar/baz/asdf/quux.txt');	// quux.txt
path.basename('/foo/bar/baz/asdf/quux.txt','.txt');		// quux
path.basename('/foo/bar/baz/asdf/quux.txt','.html');	// quux.txt
```

- `path.dirname(path)`：返回路径目录名
- `path.extname(path)`：返回路径扩展名，如果没有扩展名则返回空字符串
- `path.delimiter`：操作系统界定符号
  - Windows：`;`
  - POSIX：`:`
- `path.sep`：路径分隔符
  - Windows：`\`
  - POSIX：`/`
- `path.parse(path)`和`path.format(pathObject)`：文件路径字符串和对象互转
- `path.normalize(path)`：规范化给定路径字符串。比如`path.win32.normalize('C:////temp\\\\/\\/\\/foo/bar');`就返回`'C:\\temp\\foo\\bar'`
- `path.join([...paths])`：path路径连接
- `path.resolve([...paths])`：后续path会被追加到前面，直到构建绝对路径
- `path.relative(from, to)`：返回from到to的绝对路径

## events

发布订阅模式，维护了一个事件数组。

- `emitter.on(eventName, listener)`：订阅，加入到事件数组尾部。
- `emitter.once(eventName, listener)`：订阅一次
- `emitter.emit(eventName[, ...args])`：发布
- `emitter.off(eventName, listener)`：取消订阅
- `emitter.removeListener(eventName, listener)`：取消订阅
- `emitter.prependListener(eventName, listener)`：把 listener 添加到事件数组头部。

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

- `process.title`：当前进程名称
- `process.pid`：当前进程pid，pid是进程唯一标识
- `process.ppid`：当前进程的父进程pid
- `process.platform`：当前进程运行的操作系统
- `process.version`：Node.js版本
- `process.env`：当前Shell的所有环境变量
  - Windows不支持`NODE_ENV=production`的设置方式，这时候可以借助`cross-env`
- `process.execPath`：执行当前脚本的Node二进制文件绝对路径。
- `process.execArgv`：返回数组，数组元素是传入的**一组特定于Node.js的命令行选项**。
- `process.argv`：返回数组，前两项固定
  - 第一项：`process.execPath`
  - 第二项：正在执行的JavaScript文件路径
  - 第三项：任何其他命令行参数

```js
const process = require('process')
console.log(process.argv0)
console.log(process.argv)
console.log(process.execArgv)
console.log(process.execPath)
// 在控制台执行node --harmony test.js one two=你好 --three four-4
/*
node
[
  '/home/zhengyu/.nvm/versions/node/v16.15.0/bin/node',
  '/home/zhengyu/node-test/test.js',
  'one',
  'two=你好',
  '--three',
  'four-4'
]
[ '--harmony' ]
/home/zhengyu/.nvm/versions/node/v16.15.0/bin/node
*/
```

- `process.uptime()`：当前进程运行多长时间，单位是秒。
- `process.memoryUsage()`：进程占用的内存，单位为字节。
- `process.cpuUsage([previousValue])`：CPU使用时间耗时，单位为毫秒。
  - user：用户程序代码运行占用时间
  - system：系统占用时间
- `process.exit([code])`：强制终止进程。
  - 绝大多数情况没有必要显示调用，如果事件循环中，没有其他待处理的工作，则 Node.js 进程将自行退出。
  - 即使仍有未完全完成的异步操作挂起，比如IO，也会强制终止进程。为了解决终止前IO未完全写入等操作，建议使用`process.exitCode`设置退出码，然后不给事件循环中安排工作。
- `process.kill(pid[, signal])`：将signal发送到由pid标识的进程。
- `process.nextTick(fn)`：异步微任务，将fn添加到下一个时间点的队列执行。
- `process.cwd()`：返回**当前工作路径**。
- `process.chdir(directory)`：切换当前工作路径。

::: tip
`process.cwd()`和`__dirname`区别：前者返回当前工作路径，后者返回源代码所在目录。

|命令	| `process.cwd()` |	`__dirname` |
| --- | --- | --- |
|`node index.js` | `d:\dir`	| `d:\dir` |
|`node dir\index.js` |	`d:` | `d:\dir` |
:::

- 事件
  - `exit`：和`process.exit()`作用相同
  - `beforeExit`：当事件循环清空且没有其他工作要安排时，会触发该事件。
  - `uncaughtException`：当前进程抛出一个没有被捕捉的错误时会触发该事件。
- 标准输入输出：`process.stdin`、`process.stdout`、`process.stderr`分别代表进程的标准输入、标准输出、标准错误输出。

## url

## zlib

## 定时器

