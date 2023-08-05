# React入门——与TypeScript联用

## 函数组件

### `JSX.Element`和`React.ReactNode`

一个有效的React节点与`React.createElement`返回的节点不是一回事，无论组件最终呈现什么，`React.createElement`总是返回一个对象，即JSX。但`React.ReactNode`是组件所有可能返回值的集合。

- `JSX.Element`：`React.createElement`的返回值
- `React.ReactNode`：组件返回值

### 函数组件的定义

```jsx
type AppProps = {
  message: string;
};
const App = ({ message }: AppProps): JSX.Element => <div>{message}</div>;
```

为啥不建议使用`React.FC`呢？

1. `React.FunctionComponent`对返回类型是显式的，而不同函数版本式是隐式的。
2. 它为静态属性（如displayName、propTypes、defaultProps）提供类型检查，但`defaultProps`和`React.FunctionComponent`在一起使用存在一些问题。
3. 在React18前，`React.FunctionComponent`提供一个隐含的子项定义，引起了激烈讨论，也是`React.FunctionComponent`从`Create React App TypeScript`从模板中移除的原因之一。

大多数情况下，两种方式式没有区别的，但还是推荐第一种。

但第一种模式也有缺陷：

1. 不支持条件渲染。

这是因为由于编译器的限制，函数组件不能返回 JSX 表达式或 null 以外的任何内容，否则它会抱怨一条神秘的错误消息，指出另一种类型不可分配给 Element。

```jsx
const MyConditionalComponent = ({ shouldRender = false }) => shouldRender ? <div /> : false; // don't do this in JS either
const el = <MyConditionalComponent />;
```

2. 不支持`Array.fill`

```jsx
const MyArrayComponent = () => Array(5).fill(<div />);
const el2 = <MyArrayComponent />; // throws an error
```

## Hooks

### useState

```js
const [list, setList] = useState<Array<string> | null>(null)
```

### useEffect系列

包括useEffect、useLayoutEffect。正常使用，无需多定义。

### useReducer

```jsx
import { useReducer } from "react"
interface ACTIONTYPE {
  type: "increment" | "decrement"
  payload: number
}
const initialState = {
  count: 0
}
/**
 * reducer函数，传入的state和返回值类型是相同的
 */
function reducer(state: typeof initialState, action: ACTIONTYPE): typeof initialState {
  switch (action.type) {
    case "increment":
      return { count: state.count + action.payload };
    case "decrement":
      return { count: state.count - action.payload };
    default:
      throw new Error();
  }
}
export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <>
    Count: {state.count}
    <button onClick={() => dispatch({ type: "decrement", payload: 5 })}>
      -
    </button>
    <button onClick={() => dispatch({ type: "increment", payload: 5 })}>
      +
    </button>
  </>
}
```

### useMemo/useCallback

正常定义传入的函数类型即可。

```js
const memoizedCallback = useCallback(
  (param1: string, param2: number) => {
    console.log(param1, param2)
    return { ok: true }
  },
  [...],
);
```

### useRef

```jsx
function Foo() {
  // 使用HTMLDivElement比HTMLElement更精确，虽然两者都是可以的
  const divRef = useRef<HTMLDivElement>(null);
  // 如果divRef.current用不为null，可以使用如下定义
  // const divRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    if (!divRef.current) throw Error("divRef is not assigned");
    doSomethingWith(divRef.current);
  });

  return <div ref={divRef}>etc</div>;
}
```

### useImperativeHandle

定义的CountdownHandle类型最终会约束useImperativeHandle内的回调函数返回值；CountdownProps是props类型，即外部组件调用该组件要传入的值类型。

```jsx
export type CountdownHandle = {
  start: () => void;
};

type CountdownProps = {};

const Countdown = forwardRef<CountdownHandle, CountdownProps>((props, ref) => {
  useImperativeHandle(ref, () => ({
    // start() has type inference here
    start() {
      alert("Start");
    },
  }));

  return <div>Countdown</div>;
});
```

## 事件

以下是源码中的相关定义：

```ts
onChange?: ChangeEventHandler<T> | undefined;
type ChangeEventHandler<T = Element> = EventHandler<ChangeEvent<T>>;
type EventHandler<E extends SyntheticEvent<any>> = { bivarianceHack(event: E): void }["bivarianceHack"];

interface BaseSyntheticEvent<E = object, C = any, T = any> {
  nativeEvent: E;
  currentTarget: C;
  target: T;
  bubbles: boolean;
  cancelable: boolean;
  defaultPrevented: boolean;
  eventPhase: number;
  isTrusted: boolean;
  preventDefault(): void;
  isDefaultPrevented(): boolean;
  stopPropagation(): void;
  isPropagationStopped(): boolean;
  persist(): void;
  timeStamp: number;
  type: string;
}
interface SyntheticEvent<T = Element, E = Event> extends BaseSyntheticEvent<E, EventTarget & T, EventTarget> {}
interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
  target: EventTarget & T;
}
```

尝试着代换，可得event为`ChangeEvent<T>`类型，`T`为元素相关泛型，如`HTMLInputElement`、`HTMLDivElement`、`HTMLSelectElement`，它们都继承于`HTMLElement`类型，而`HTMLElement`又继承于`Element`等类型。

泛型`T`要通过`target`对象下才能访问。

同时`ChangeEvent`继承于`SyntheticEvent`，而`SyntheticEvent`又继承于`BaseSyntheticEvent`，那么event对象自然就有了`BaseSyntheticEvent`相关属性值了。

同理，不止有`ChangeEvent`，还有`FormEvent`、`FocusEvent`、`MouseEvent`、`AnimationEvent`等等。

```ts
interface ChangeEvent<T = Element> extends BaseSyntheticEvent<T> {
  target: EventTarget & T;
}
onChange?: (event: ChangeEvent<T>) => void | undefined;
```

通过上面分析，在具体使用时这样写：

```jsx
const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
  console.log(event.target.value)
}
```

## context

```ts
type ThemeContextType = "light" | "dark";
const ThemeContext = createContext<ThemeContextType>("light");
```

Provider：

```jsx
const App = () => {
  const [theme, setTheme] = useState<ThemeContextType>("light");

  return (
    <ThemeContext.Provider value={theme}>
      <MyComponent />
    </ThemeContext.Provider>
  );
};
```

Consumer：

```jsx
const MyComponent = () => {
  const theme = useContext(ThemeContext);
  return <p>The current theme is {theme}.</p>;
};
```
