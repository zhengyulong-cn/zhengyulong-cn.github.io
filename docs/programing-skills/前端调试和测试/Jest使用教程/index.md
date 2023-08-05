# Jest使用教程

## 开始

### 使用Jest

依赖安装和`package.json`配置：

```bash
npm install --save-dev jest
```

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

### 使用TypeScript

安装Babel和TypeScript相关依赖：

```bash
npm install babel-jest @babel/core @babel/preset-env @babel/preset-typescript --save-dev
```

配置`babel.config.js`：

```js
module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {node: 'current'}}],
    '@babel/preset-typescript',
  ],
};
```

## 匹配器

```js
test('two plus two is four', () => {
  // .toBe(4)是匹配器
  expect(2 + 2).toBe(4);
});

test('对象赋值', () => {
  const data = {one: 1};
  data['two'] = 2;
  expect(data).toEqual({one: 1, two: 2});
});
```

匹配器：

- `toBe`：严格等于
- `toEqual`和`toStrictEqual`：对象匹配
  - `toStrictEqual`会考虑`undefined`的值
- `toBeNull`：只匹配 `null`
- `toBeUndefined`：只匹配 `undefined`
  - `toBeDefined` 与 `toBeUndefined` 相反
- `toBeTruthy`：匹配任何 `if` 语句为真
  - `toBeFalsy`：匹配任何 `if` 语句为假
- `toBeGreaterThan`：大于数字
  - `toBeGreaterThanOrEqual`：大于等于数字
  - `toBeLessThan`：小于数字
  - `toBeLessThanOrEqual`：小于等于数字
- `toMatch`：匹配正则
- `toContain`：检查数组或可迭代对象是否包含某个特定项
- `toThrow`：抛出错误

::: tip

可以通过`.not.toBe()`来取反。

可以通过`test.only()`来只运行该用例。

:::

## 测试异步代码

### Promise

等待resolve状态，匹配到表示测试成功

```js
test('the data is peanut butter', () => {
  return fetchData().then(data => {
    expect(data).toBe('peanut butter');
  });
});
```

### Async/Await

```js
test('the data is peanut butter', async () => {
  const data = await fetchData();
  expect(data).toBe('peanut butter');
});

// 也可以将async/await和.resolves或.rejects一起使用
test('the data is peanut butter', async () => {
  await expect(fetchData()).resolves.toBe('peanut butter');
});
```

### 回调

将带有测试匹配语句的函数以回调的形式传入

```js
test('the data is peanut butter', done => {
  function callback(error, data) {
    if (error) {
      done(error);
      return;
    }
    try {
      expect(data).toBe('peanut butter');
      done();
    } catch (error) {
      done(error);
    }
  }

  fetchData(callback);
});
```

## 安装和移出

运行测试前后可以做一些准备工作。

- beforeAll
- beforeEach
- afterAll
- afterEach

```js
// 在每次测试前调用initializeCityDatabase方法，在每次测试后调用clearCityDatabase方法
beforeEach(() => {
  initializeCityDatabase();
});

afterEach(() => {
  clearCityDatabase();
});

test('city database has Vienna', () => {
  expect(isCity('Vienna')).toBeTruthy();
});

test('city database has San Juan', () => {
  expect(isCity('San Juan')).toBeTruthy();
});
```

## 模拟函数

### 使用mock函数

通过调用`jest.fn()`函数函数创建mock函数，传入一个回调函数，**回调函数就是生成的mock的传入参数和返回值**。

```js
test('jest/mock Test', () => {
  const myMock = jest.fn(x => x + 100)
  const res1 = myMock(52)
  const res2 = myMock(88)
  console.log(res1, res2, myMock(1), myMock.mock)	// 152 188 101
})
```

生成的mock函数的`.mock`属性会保存该函数如何被调用、调用时返回值信息。

比如在上述例子中，`myMock.mock`打印输出：

```json
{
  calls: [ [ 52 ], [ 88 ], [ 1 ] ],
  contexts: [ undefined, undefined, undefined ],
  instances: [ undefined, undefined, undefined ],
  invocationCallOrder: [ 1, 2, 3 ],
  results: [
    { type: 'return', value: 152 },
    { type: 'return', value: 188 },
    { type: 'return', value: 101 }
  ],
  lastCall: [ 1 ]
}
```

除了上述传入回调函数方式，还可以通过`mockReturnValue`和`mockReturnValueOnce`函数来手动设置mock函数的返回值。

```js
const myMock = jest.fn();
console.log(myMock());		// undefined
myMock.mockReturnValueOnce(10).mockReturnValueOnce('x').mockReturnValue(true);
console.log(myMock(), myMock(), myMock(), myMock());	// 10, 'x', true, true
```

### 手写mock覆盖模块依赖

为了测试`getUsers()`方法而不实际调用API，可以用`jest.mock()`函数自动模拟axios模块。模拟模块后，可以为`.get`提供`mockResolvedValue`来用于假数据测试。

```js
import axios from 'axios';
jest.mock('axios');
function getUsers() {
  return axios.get('/users.json').then(resp => resp.data)
}
test('should fetch users', () => {
  const users = [{name: 'Bob'}]
  const resp = {data: users}
  axios.get.mockResolvedValue(resp)
  return getUsers().then(data => expect(data).toEqual(users))
});
```

### 替换指定返回值

替换函数返回值

- `jest.fn`
- `mockImplementationOnce`

```js
const myMockFn = jest.fn(cb => cb(null, true));
myMockFn((err, val) => console.log(val));   // true
```

```js
// 当mockImplementationOnce定义的实现逐个调用完毕时，如果定义了jest.fn则使用jest.fn 。
const myMockFn = jest
  .fn()
  .mockImplementationOnce(cb => cb(null, true))
  .mockImplementationOnce(cb => cb(null, false));
myMockFn((err, val) => console.log(val));   // true
myMockFn((err, val) => console.log(val));   // false
```

替换模块的返回值：

```js
jest.mock('../foo'); // this happens automatically with automocking
const foo = require('../foo');
// foo是个mock函数
foo.mockImplementation(() => 42);
foo();  // 42
```