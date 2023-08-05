# Escape Hatches

## Refs

### 引用值

ref可以指向任何类型，通过`ref.current`来访问和更新值。与state一样，refs会在重新渲染之间由React保留，但更改ref不会触发重新渲染组件。

遵循一些原则使用refs能让组件健壮性更高：

- 将refs视为一个窗口，当使用外部API时它很有用，但尽量避免大部分应用程序和数据流依赖于refs。
- 不要在渲染过程中读写`ref.current`。如果渲染期间的信息需要修改，使用state更好。由于React不知道`ref.current`啥时候修改，即使在渲染期间读取它让你的组件行为很难预测。

当你修改ref当前值时，它会立即改变，state状态限制不适用于refs，ref本身是一个普通的JavaScript对象。当使用ref时候也不需要担心避免变异，只要改变的对象不用于渲染，React就不会关心你对ref或内容做了啥。

### 操作DOM

使用步骤：

1. 定义`const inputRef = useRef(null)`
2. 在DOM中引用`<input ref={inputRef} />`
3. 定义操作refs的函数，通过`ref.current`读写

```jsx
import { useRef } from "react";

export default function App() {
  const inputRef = useRef(null)
  const handleClick = () => {
    inputRef.current.focus();
  }
  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>Focus the input</button>
    </>
  )
}
```

如果ref是引用在封装的组件上，这时候就需要ref转发了，使用步骤如下：

1. 定义`const inputRef = useRef(null)`
2. 在DOM中引用`<MyInput ref={inputRef} />`
3. 定义操作refs的函数，通过`ref.current`读写
4. 对于封装的MyInput组件，需要转发ref，`const MyInput = forwardRef((props, ref) => {})`

```jsx
import { forwardRef, useRef } from "react";
const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />
});
export default function App() {
  const inputRef = useRef(null);
  function handleClick() {
    inputRef.current.focus();
  }
  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

在React中，每个更新分为两个阶段：

- 渲染：React会调用组件来确定屏幕上该显示的内容
- 提交：React将更改应用于DOM

不要在渲染期间访问refs，在提交阶段设置`rer.current`。在更新DOM前，React将受影响的`ref.current`设置为null；更新DOM后，React立即将它们设置为相应的DOM节点。

在一般情况下，你是通过事件处理器访问refs的，如果想不依赖于特定事件对ref做些事情，就需要使用Effect了。

## Effect

### 编写useEffect

前面我们在描述UI和添加交互章节知道它们是如何使用和编写代码的。但有时候，会有一些副产物操作，比如ChatRoom组件只要在屏幕上可见就必须连接到聊天服务器，这个操作不是纯粹的计算，不会在渲染过程中发生，但有没有触发事件。

Effects允许你指定**由渲染本身而不是特定事件引起**的副作用。

不要急于将Effects添加到组件中，Effects通常用于跳出React代码并与某些外部系统同步，包括浏览器API、第三方部件、网络等等。

书写Effect的步骤如下：

1. 声明一个Effect
2. 指定效果依赖项，通过依赖项指定副作用执行条件
3. 根据需要添加清理。某些Effects需要指定如何停止、撤销或清除它们正在执行的操作。

React每次都会**在Effect再次运行之前调用清理函数，或在最后一次在组件卸载时调用**。

```jsx
import { useEffect, useRef, useState } from "react";

function VideoPlayer({ src, isPlaying }: { src: string, isPlaying: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    if(ref.current) {
      isPlaying ? ref.current.play() : ref.current.pause()
    }
    return () => {
      console.log('VideoPlayer清除')
    }
  }, [isPlaying])
  return <video src={src} ref={ref} loop playsInline/>
}
export default function App() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isShow, setIsShow] = useState<boolean>(false);
  return (
    <>
      { isShow && <VideoPlayer isPlaying={isPlaying} src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" />}
      <button onClick={() => setIsPlaying(!isPlaying)} >{isPlaying ? '停止' : '播放'}</button>
      <button onClick={() => setIsShow(!isShow)} >{isShow ? '展示' : '消失'}</button>
    </>
  );
}
```

### 处理useEffect执行两次的问题

React有意在开发中重新挂载你的组件，useEffect内容会执行两次，这样好处是能帮助找到如忘记断开连接这样的错误。正确想法不是“如何运行一次效果”，而是“如何修复我的效果，使其在重新挂载后正常工作”。

通常答案是实现清理功能，即设置--->清理--->设置的序列。

下面有一些例子：

1.控制弹窗

在开发环境，Effect将会调用`showModal()`，然后立即调用`close()`，然后再次调用`showModal()`，这是正常的用户行为；在生产环境中`showModal()`则会调用一次。

```jsx{5}
useEffect(() => {
  const dialog = dialogRef.current;
  dialog.showModal();
  return () => dialog.close();
}, []);
```

2.触发动画

```jsx
useEffect(() => {
  const node = ref.current;
  node.style.opacity = 1; // Trigger the animation
  return () => {
    node.style.opacity = 0; // Reset to the initial value
  };
}, []);
```

3.请求数据

```jsx
useEffect(() => {
  let ignore = false;
  async function startFetching() {
    const json = await fetchTodos(userId);
    if (!ignore) {
      setTodos(json);
    }
  }
  startFetching();
  return () => {
    ignore = true;
  };
}, [userId]);
```

4.初始化应用

一些逻辑只在应用启动后运行一次，可以放在组件外部。

```js
if (typeof window !== 'undefined') { // Check if we're running in the browser.
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

5.由特定交互引起的，应该使用事件处理器，而不是用useEffect。

### 移除不必要的Effects

有两种情况不需要Effects：

- 不需要Effects来转换数据以进行渲染。假如想在显示列表前进行过滤，可能想编写一个Effect在列表更改时更新状态变量，但这种方式是低效的。当更新组件状态时，React将首先调用组件函数来计算屏幕上显示的内容，然后将更改提交到DOM来更新屏幕，再运行Effect，如果Effect也立即更新状态，整个过程将从头开始。为了不必要的渲染过程，请转换组件顶层所有数据，只要props或state发生变化，该代码就自动执行。
- 不需要Effects来处理用户事件。比如在用户触发购买操作时发送`/api/but POST`，这种操作放在事件处理器中更好。

下面将给出一些具体案例：

1.基于props或state的更新

当可以从现有的props或state计算出某些东西时候，不要放在状态中，相反在渲染期间计算它，这样会让代码更快（避免意外级联更新），更简单（删除冗余代码）并不容易出错（避免由不同状态变量彼此不同步导致的错误）。

```jsx
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 Avoid: 冗余和不必要Effect
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);

  // ✅ Good: 在渲染时计算
  const fullName = firstName + ' ' + lastName;
}
```

2.缓存昂贵的计算

```jsx
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');

  // 🔴 Avoid: 冗余和不必要Effect
  const [visibleTodos, setVisibleTodos] = useState([]);
  useEffect(() => {
    setVisibleTodos(getFilteredTodos(todos, filter));
  }, [todos, filter]);

  const visibleTodos = useMemo(() => {
    // ✅ 除非todos和filter发生改变，否则不会执行getFilteredTodos()调用
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);
}
```

除非todos或filter发生变化，useMemo内部函数不会运行，React会在初始渲染期间记住`getFilteredTodos()`的返回值，在下一次渲染期间，它将检查依赖项是否不同。如果和上次相同，useMemo将返回它存储的最后一个结构，如果不同会再次调用包装的函数。

useMemo包裹的函数在渲染期间运行，因此是纯函数。

3.当prop改变时候重置所有state

这是低效的，`ProfilePage`和它的孩子首先使用过时的值渲染，并再次渲染。也是复杂的，因为你需要在有相同state的每个组件中做这个。

相反，你可以告知React每个用户配置文件在概念上都是不同的配置文件，方法是给它一个明确的key，并将组件一分为二，并将key书写从外部组件传入到内部。

**每当key更改时候，React将重新创建DOM并重置Profile组件及其所有子组件的状态**。

```jsx
export default function ProfilePage({ userId }) {
  const [comment, setComment] = useState('');

  // 🔴 Avoid: 在Effect中当props改变时候重置state
  useEffect(() => {
    setComment('');
  }, [userId]);
  // ...
}
```

```jsx
export default function ProfilePage({ userId }) {
  return (
    <Profile
      userId={userId}
      key={userId}
    />
  );
}

function Profile({ userId }) {
  // ✅ This and any other state below will reset on key change automatically
  const [comment, setComment] = useState('');
  // ...
}
```

4.在props更改时调整state

```jsx
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // 🔴 Avoid: 在props更改时调整state
  useEffect(() => {
    setSelection(null);
  }, [items]);
  // ...
}
```

```jsx
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  // ✅ Best: 在渲染时候计算
  const selection = items.find(item => item.id === selectedId) ?? null;
  // ...
}
```

5.发送POST请求

`Form`组件发送两个POST请求，当挂载时发送`/analytics/event`请求，当点击提交按钮时候将发送`/api/register`请求。

```jsx
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ Good: 组件展示时运行此处逻辑
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    // ✅ Good: 此处逻辑在事件触发时运行
    post('/api/register', { firstName, lastName });
  }
  // ...
}
```

6.计算链

下面四个变量在useEffect之间构成了计算链条，card值改变就会触发所有useEffect。大量的useEffect会让页面特别卡顿，下面写法是非常不推荐的。

```jsx
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);

  // 🔴 Avoid: 相关触发调整state的Effect链条
  useEffect(() => {
    if (card !== null && card.gold) {
      setGoldCardCount(c => c + 1);
    }
  }, [card]);

  useEffect(() => {
    if (goldCardCount > 3) {
      setRound(r => r + 1)
      setGoldCardCount(0);
    }
  }, [goldCardCount]);

  useEffect(() => {
    if (round > 5) {
      setIsGameOver(true);
    }
  }, [round]);

  useEffect(() => {
    alert('Good game!');
  }, [isGameOver]);

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    } else {
      setCard(nextCard);
    }
  }
}
```

将useEffect链条拆分：

```jsx
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);

  // ✅ Calculate what you can during rendering
  const isGameOver = round > 5;

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    }

    // ✅ Calculate all the next state in the event handler
    setCard(nextCard);
    if (nextCard.gold) {
      if (goldCardCount <= 3) {
        setGoldCardCount(goldCardCount + 1);
      } else {
        setGoldCardCount(0);
        setRound(round + 1);
        if (round === 5) {
          alert('Good game!');
        }
      }
    }
  }
}
```

7.初始化程序

```jsx
function App() {
  // 🔴 Avoid: Effects with logic that should only ever run once
  useEffect(() => {
    loadDataFromLocalStorage();
    checkAuthToken();
  }, []);
  // ...
}
```

上面的写法会在开发中运行两次，可以使用一个顶级变量开关跟踪它是否执行，并始终跳过重新运行它：

```jsx
let didInit = false;

function App() {
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      // ✅ Only runs once per app load
      loadDataFromLocalStorage();
      checkAuthToken();
    }
  }, []);
  // ...
}
```

或者在组件外面初始化：

```jsx
if (typeof window !== 'undefined') { // Check if we're running in the browser.
   // ✅ Only runs once per app load
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

8.通知父组件state更新

让useEffect依赖于onChange是非常不推荐的写法。

```jsx
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);
  
  // 🔴 Avoid: The onChange handler runs too late
  useEffect(() => {
    onChange(isOn);
  }, [isOn, onChange])

  function updateToggle(nextIsOn) {
    // ✅ Good: Perform all updates during the event that caused them
    setIsOn(nextIsOn);
    onChange(nextIsOn);
  }

  function handleClick() {
    updateToggle(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      updateToggle(true);
    } else {
      updateToggle(false);
    }
  }

  // ...
}
```

9.订阅外部store

下面是自定义了一个Hook。

有时组件可能需要订阅React state外的数据，可能来自第三方库或内置浏览器API。由于这些数据可以在 React 不知情的情况下更改，因此您需要手动为您的组件订阅它。

```js
function useOnlineStatus() {
  // Not ideal: Manual store subscription in an Effect
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function updateState() {
      setIsOnline(navigator.onLine);
    }

    updateState();

    window.addEventListener('online', updateState);
    window.addEventListener('offline', updateState);
    return () => {
      window.removeEventListener('online', updateState);
      window.removeEventListener('offline', updateState);
    };
  }, []);
  return isOnline;
}
```

在这里，组件订阅外部数据存储，由于服务器上不存在此API，因此最初状态设置为true，每当该数据存储的值在浏览器中更改时，组件都会更新其状态。

上面使用useEffect是没有问题的，但React有一个专门构建的Hook，用于订阅首选的外部存储。

```jsx
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function useOnlineStatus() {
  // ✅ Good: 用Hook订阅外部store
  return useSyncExternalStore(
    subscribe, // 只要你传递相同的函数，React就不会重新订阅
    () => navigator.onLine, // 如何从客户端获取值
    () => true // 如何从服务器获取值
  );
}
```

10.请求数据和竞态条件

```jsx
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // 🔴 Avoid: Fetching without cleanup logic
    fetchResults(query, page).then(json => {
      setResults(json);
    });
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

上面代码是有问题的，如果快速输入"hello"，则在这个过程中会发送5次请求，但不能保证按顺序返回，比如"hell"响应可能在"hello"响应后到达，最后调用`setResults()`，就会显示错误结果。这称作“竞态条件”：两个不同请求相互竞争并以预期不同的顺序出现。

要修改竞争条件，需要添加一个清理函数来忽略陈旧的响应，确保获取数据时候，除了最后一次响应外的所有响应全部忽略。

```jsx
function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let ignore = false;
    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setData(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [url]);
  return data;
}

function SearchResults({ query }) {
  const [page, setPage] = useState(1);
  const params = new URLSearchParams({ query, page });
  const results = useData(`/api/search?${params}`);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

当然，关于竞态条件这块有三方库可以用，他们写的更好。

### 响应式Effect的生命周期

Effect生命周期和组件是不同的，组件有挂载、更新和卸载，一个Effect只做两件事：开始同步一些东西、之后停止同步它。这个循环能发生多次，React提供正确辨识Effect依赖的规则，让你的Effect同步到最新的props或state。

每个React组件经历相同生命周期：

- 当添加到屏幕时组件挂载
- 当接受到新props或state时组件更新
- 当从屏幕移除时组件卸载

```jsx
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    // 开始同步
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      // 停止同步
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

直观地讲，你可能会认为 React 会在组件挂载时开始同步，并在组件卸载时停止同步。然而，这并不是正确的想法。

在上面例子中，如果一开始想连接的是聊天室A，这样会显示它然后运行Effect开始同步，但现在想切换到聊天室B，那么会做什么呢？

此时你希望React做两件事：

1. 停止与聊天室A同步
2. 开始与聊天室B同步

实际上React Effect其实做的就是这些，切换到聊天室B时候，执行return函数，即停止同步断开聊天室A的连接，之后开始同步连接聊天室B，这样的机制保障了连接的聊天室和UI视图是同步的。

在过去，常常是从组件角度来看的，很容易将Effects视为在特定事件触发的“回调”或“生命周期事件”，这种思维很快就会变得复杂，最好避免它。相反，应该**始终专注一个启动/循环**。组件挂载、更新、卸载是无关紧要的，你需要做的就是描述如何启动同步和如何停止同步。

::: danger
使用useEffect要避免过去的生命周期思维，要从效果，即同步开启/同步停止角度思考。
:::

每次当组件重新渲染后，React都会查看传递的依赖项数组，如果数组的任意值与上次渲染期间传递的同一位置的值不同，React将重新同步Effect。

上面例子中为何`serverUrl`不是依赖项？因为这个值是常量，始终是相同的，依赖于它是没有意义的。但如果`serverUrl`是动态输入的，可变的，这时候useEffect就也要依赖于`serverUrl`，把`serverUrl`加入到依赖数组中。

如果依赖项为空数组`[]`，从组件角度看，空依赖项意外着仅在组件挂载时候连接聊天室，仅在组件卸载时断开连接；但如果从效果角度考虑，就不要管啥挂载卸载了，重要的是已经给Effect指定了启动和停止同步功能，只是它没有响应式依赖。

组件内的所有值都是响应式的，props、state、context以及有它们计算出来的变量都是响应式的。

当不需要重复渲染时怎么做？

1.将变量放到组件外部

```jsx
const serverUrl = 'https://localhost:1234'; // serverUrl is not reactive
const roomId = 'general'; // roomId is not reactive

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ All dependencies declared
  // ...
}
```

2.将变量放在useEffect内部

```jsx
function ChatRoom() {
  useEffect(() => {
    const serverUrl = 'https://localhost:1234'; // serverUrl is not reactive
    const roomId = 'general'; // roomId is not reactive
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ All dependencies declared
  // ...
}
```

### 从Effects从分离Events

首先简单回顾下事件处理器和Effects区别：

1. 事件处理器响应特定交互
2. Effects在需要同步时运行

从操作上看，上面的区别论述是正确的，但可以更精确的来看这个问题。

```jsx
const serverUrl = 'https://localhost:1234';
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // ...
}
```

在组件内生命的props、state变量称为响应值，在这个例子中，`serverUrl`不是响应值，但`roomId`和`message`是，它们参与渲染数据流。

由于重新渲染，响应值是可能改变的，比如选择不同的聊天室，那么`roomId`就会不同。

事件处理器和Effects在响应变化方式上的不同：

1. 事件处理器中的逻辑不是响应式的。它不会再次运行，除非用户再次执行相同交互。事件处理器可以读取响应值，但不会对其改变做出响应。
2. Effects内部逻辑是响应式的。Effect读取的响应值就是依赖项，如果重新渲染导致该值变化，那么React会使用新值再次重新运行Effect的逻辑。

因此我们想到可以将不响应逻辑从Effects中抽离，下面将给出一个例子。

原组件，`roomId`和`theme`都是响应式的：

```jsx
const serverUrl = 'https://localhost:1234';
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]);

  return <h1>Welcome to the {roomId} room!</h1>
}
```

使用`useEffectEvent`拆解：

经过拆解，theme不是响应式的了，只有`roomId`发生改变，才会执行useEffect内容，`theme`发生改变，虽然变量会发生改变，但不是响应式的。

```jsx{2-4,8,12}
function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  })
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected()
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  return <h1>Welcome to the {roomId} room!</h1>
}
```

::: danger
useEffectEvent API当前还处于实验阶段，是不稳定版本，未来可能某个React版本就能使用了。
:::

使用useEffectEvent是有些限制的：

- 只能从Effects内部调用它
- 切勿将它们传入给其他组件或Hooks

下面就是个错误例子，将onTick传给了其他Hooks：

```jsx
function Timer() {
  const [count, setCount] = useState(0);

  const onTick = useEffectEvent(() => {
    setCount(count + 1);
  });

  useTimer(onTick, 1000); // 🔴 Avoid: Passing Effect Events

  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  useEffect(() => {
    const id = setInterval(() => {
      callback();
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay, callback]); // Need to specify "callback" in dependencies
}
```

修改下：

```jsx
function Timer() {
  const [count, setCount] = useState(0);
  useTimer(() => {
    setCount(count + 1);
  }, 1000);
  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  const onTick = useEffectEvent(() => {
    callback();
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick(); // ✅ Good: Only called locally inside an Effect
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay]); // No need to specify "onTick" (an Effect Event) as a dependency
}
```

## 自定义Hooks

### 共享逻辑

下面这个例子，SavaButton和StatusBar组件对浏览器网络状态是响应式的，但也发现它们有逻辑是共通的，因此想单独抽离做成自定义Hooks。

```jsx
import { useEffect, useState } from "react";
function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}
export default function App() {
  return (
    <>
      <StatusBar />
      <SaveButton />
    </>
  );
}
```

把判断是否有网的逻辑单独抽离，可以修改为如下：

```jsx
import { useEffect, useState } from "react";
/**
 * 返回isOnline，即是否有网
 */
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [])
  return isOnline;
}
function SaveButton() {
  const isOnline = useOnlineStatus()
  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
function StatusBar() {
  const isOnline = useOnlineStatus()
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}
export default function App() {
  return (
    <>
      <StatusBar />
      <SaveButton />
    </>
  );
}
```

自定义Hooks的命名规则：

- 以use开头，整体为小驼峰式，hooks可以返回任何值

### 何时使用自定义Hooks

你不需要为每段重复代码提取自定义Hooks，一些重复是可以的。当编写useEffect时，请考虑包裹在自定义Hooks中是否清晰，不应该经常使用useEffect。


