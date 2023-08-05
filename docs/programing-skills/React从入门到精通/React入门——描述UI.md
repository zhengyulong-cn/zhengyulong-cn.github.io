# React入门——描述UI

> 来源[react beta英文版教程](https://beta.reactjs.org/)，不再使用class component了，之后都是用hooks。

## 创建React App

## 组件基础

React组件是一个JavaScript函数，你可以在其中添加标记。

三要素：

- 导出，`export default`
- 函数定义
- 返回带有标记的JSX

使用上述定义的Profile组件：

```jsx
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3Am.jpg"
      alt="Katherine Johnson"
    />
  )
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

经过组件调用，Gallery组件最终在浏览器中渲染如下：

```html
<section>
  <h1>Amazing scientists</h1>
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
</section>
```

::: warning
使用组件时候有以下点需要注意：

1. **禁止在组件内部定义组件**，必须在组件外部定义其他组件，然后调用。
2. 组件命名必须大写，否则无法识别。
:::

## 导入导出组件

将上面的Gallery组件导入到App组件：

```jsx
import Gallery from './Gallery.jsx';
export default function App() {
  return (
    <Gallery />
  );
}
```

当然，一个文件是可以导出多个组件的，前提是组件支持导出：

```jsx
export function Profile() {
  // ...
}
```

```jsx
import { Profile } from './Gallery.js';
```

## JSX

### 使用规则

JSX是对JavaScript语法的扩展，能让你在JavaScript文件中写类似于HTML的标记。

::: warning
JSX和React是两个独立的东西。它们通常一起使用，但您可以彼此独立使用它们。JSX是一个语法扩展，而React是一个JavaScript库。
:::

JSX的规则：

1. 返回单个根元素。一般用`div`或`Fragment`包裹。

```jsx
export default function TodoList() {
  return (
    <>
      <h1>Hedy Lamarr's Todos</h1>
      <p>My Content</p>
    </>
  );
}
```

::: success
为啥多个JSX tags需要被包裹？

JSX看起来像HTML，但它本质上会被转换为JavaScript对象，如果不包裹到数组中，函数就不能返回多个对象。
:::

2. JSX元素必须显式闭合（`<img/>`、`<span></span>`）。和原始HTML不同，HTML即使没写闭合标签，也能在浏览器中正确解析，但JSX必须写闭合。

3. 驼峰式写法。由于JSX最终要转换为对象，因此不能包含短横线或class这样的关键字。

::: warning
由于历史原因，`aria-*`和`data-*`属性在HTML中写成带破折号的。
:::

### {}

JSX中的`{}`可以传入字符串、数字、对象、JavaScript表达式等等。

```jsx
export default function Avatar() {
  const avatar = 'https://i.imgur.com/7vQD0fPs.jpg';
  const description = 'Gregorio Y. Zara';
  return (
    <img
      className="avatar"
      src={avatar}
      alt={description}
    />
  );
}
```

`{}`的使用位置：

1. 作为文本插入到JSX标签。比如：`<h1>{name}'s Todo List</h1>`。
2. 属性值。比如：`src={avatar}`

有时候会传入对象，这时候会显示双大括号的情况，但注意外面一层括号和里面一层括号含义是不同的。

::: warning
注意：JSX中的内联样式以小驼峰式命名。
:::

```jsx
export default function TodoList() {
  return (
    <ul style={{
      backgroundColor: 'black',
      color: 'pink'
    }}>
      <li>Improve the videophone</li>
      <li>Prepare aeronautics lectures</li>
      <li>Work on the alcohol-fuelled engine</li>
    </ul>
  );
}
```

## Props

### 传入属性

父组件向子组件传值，子组件通过props对象访问到相关属性。

```jsx
// 给Avatar组件传值，为size指定默认值为100
function Avatar({ person, size = 100 }) {
  return (
    <img
      className="avatar"
      src={person.imageSrc}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}
export default function Profile() {
  return (
    <Avatar
      person={{ name: 'Alice', imageSrc: 'https://i.imgur.com/YfeOqp2s.jpgs' }}
      size={150}
    />
  );
}
```

如果一个组件需要将所有的props都转发给子组件，可以使用Spread语法：

```jsx
export default function Profile(props) {
  return (
    <div className="card">
      <Avatar {...props} />
    </div>
  );
}
```

### 传入组件

传入的组件需要用`props.children`接收，接收的参数可在组件中通过`{ children }`使用。

可以将具有`children prop`的组件视为具有“孔”，可以由其父组件使用任意JSX填充，可以将经常使用`children prop`进行视觉包装：面板、网格等。

```jsx
function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}
function Avatar({ person, size = 100 }) {
  return (
    <img
      className="avatar"
      src={person.imageSrc}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}
export default function Profile() {
  return (
    <Card>
      <Avatar
        person={{ name: 'Alice', imageSrc: 'https://i.imgur.com/YfeOqp2s.jpgs' }}
        size={150}
      />
    </Card>
  );
}
```

### 随时间变化的prop

```jsx
export default function Clock({ color, time }) {
  return (
    <h1 style={{ color: color }}>
      {time}
    </h1>
  );
}
```

在上面这个例子中，传入的time不是静止的，是随时变化的。即使更换颜色，也是随时变化的。

props反映组件在任何时间点的数据，而不仅仅是在开始时。

props是不可变的（immutable），当组件需要修改props时，它将不得不要求父组件传递不同props，即一个新对象，而旧的props会被丢弃，最终被JavaScript引擎回收。

不要尝试修改props，当需要响应用户输入时，应使用`set state`。

## 条件渲染

- if条件语句
- 三目运算符
- &&：从左往右执行，左边为true才会执行右边的

```jsx
function Item({ name, isPacked }) {
  if (isPacked) {
    return null;
  }
  return <li className="item">{name}</li>;
}

function Item2({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}
```

## 列表渲染

- 使用map遍历数组，每项写入到innerHTML中
- 设定key值，兄弟之间必须唯一

::: success
不管是Vue还是React，列表渲染都有key值，这和虚拟DOM渲染标记相关，此处暂不讨论。
:::

```jsx
export default function List() {
  const listItems = people.map(person =>
    <li key={ person.id }>
      <img src={getImageUrl(person)} alt={ person.name } />
      <p>{ person.profession }</p>
    </li>
  );
  return <ul>{ listItems }</ul>;
}
```

## 纯函数

纯函数只执行计算，通过严格将组件编写为纯函数，可以避免代码量增长带来的不可预测行为，纯函数需要遵循一些规则。

在计算机科学中，纯函数一般具有如下特征：

1. 只管自己的事，在它调用前不会修改任何对象或变量。
2. 相同输入就有相同输出。

```js
function double(number) {
  return 2 * number;
}
```

上述的`double()`就是一个纯函数，传入3总会返回6，不可能是其他的。React就是围绕着这个概念设计的，你每写的一个纯函数组件，如果传入相同值，就必须返回相同JSX。

比如下面这个例子，就不是纯函数：

```jsx
let guest = 0;

function Cup() {
  // Bad: changing a preexisting variable!
  guest = guest + 1;
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
```

这个组件会读写外部`guest`变量，就是说会多次调用该组件会产生不同JSX，如果其他组件读取`guest`，也会生成不同JSX，具体取决于它们的渲染时间，这是不可预测的！

如何修复？可以使用props：

```jsx
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}
```

虽然函数式编程很大程度依赖于纯度，但在某些时候需要更改数据、动画等等，这些更改被称作副作用，是以副作用发生的，而不是渲染过程中的。
