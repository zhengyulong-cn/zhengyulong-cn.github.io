# 内置组件

## Transition

### 触发

触发条件：

- v-if切换
- v-show切换
- `<component>`切换的动态组件

::: danger
Transition仅支单个元素或组件作为其插槽内容，如果内容是组件，这个组件必须仅有一个根元素。
:::

当Transition组件中的元素被插入或移除时，会发生如下：

1. Vue会自动检测目标元素是否应用了CSS过渡或动画，如果是，则一些CSS过渡class在适当时机添加或移除。
2. 如果有作为监听器的JavaScript钩子，钩子会在适当时期调用。
3. 如果没有过渡和钩子，那么相关DOM操作将在浏览器下一个动画帧后执行。

### 基于CSS的过渡效果

#### 动态效果解析

整个插入动画是这样的：

1. 在元素插入前添加类名`v-enter-from`、`v-enter-active`
2. 元素插入完成，浏览器进入下一动画帧，移除`v-enter-from`，添加`v-enter-to`
3. 应用整个进入动画阶段，动画结束后移除`v-enter-active`、`v-enter-to`
4. 最终应用类名没有`v-enter-*`

相关类名作用：
- `v-enter-from`：进入动画的起始状态
- `v-enter-active`：进入动画的生效状态
- `v-enter-to`：进入动画的结束状态
- `v-leave-from`：离开动画的起始状态
- `v-leave-active`：离开动画的生效状态
- `v-leave-to`：离开动画的结束状态

#### 过渡类名的命名

过渡效果是可以通过name命名的，相应的类名前缀也要修改：

```vue
<script setup>
import { ref } from 'vue'
const show = ref(true)
</script>

<template>
  <button @click="show = !show">Toggle</button>
  <Transition name="fade" appear>
    <p v-if="show">hello</p>
  </Transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

::: tip
如果你想在某个节点初次渲染时应用一个过渡效果，你可以添加`appear`
:::

#### active状态

active阶段可以是过渡，也可以是动画，搭配原生的CSS中transition或animation属性使用。

上面例子展示的是transition，下面给出一个animation的例子：

```vue
<script setup>
import { ref } from 'vue'
const show = ref(true)
</script>

<template>
	<button @click="show = !show">Toggle</button>
  <Transition name="bounce">
    <p v-if="show" style="margin-top: 20px; text-align: center;">
      弹性文字
    </p>
  </Transition>
</template>

<style>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
</style>
```

#### 自定义过渡类名

有时候想用第三方动画库比如Animate.css，这时候就需要自定义过渡class了：
- `enter-from-class`
- `enter-active-class`
- `enter-to-class`
- `leave-from-class`
- `leave-active-class`
- `leave-to-class`

```vue
<!-- 假设你已经在页面中引入了 Animate.css -->
<Transition
  name="custom-classes"
  enter-active-class="animate__animated animate__tada"
  leave-active-class="animate__animated animate__bounceOutRight"
>
  <p v-if="show">hello</p>
</Transition>
```

#### 深层级过渡

```vue
<script setup>
import { ref } from 'vue'
const show = ref(true)
</script>

<template>
  <button @click="show = !show">Toggle</button>
  <Transition duration="550" name="nested">
    <div v-if="show" class="outer">
      <div class="inner">
   			Hello
      </div>
    </div>
  </Transition>
</template>

<style>
.outer, .inner {
	background: #eee;
  padding: 30px;
  min-height: 100px;
}
.inner { 
  background: #ccc;
}
/* 外层动画效果 */
.nested-enter-active, .nested-leave-active {
	transition: all 0.3s ease-in-out;
}
/* 添加过渡延迟，这样内外动画就有先后顺序了 */
.nested-leave-active {
  transition-delay: 0.25s;
}
.nested-enter-from,
.nested-leave-to {
  transform: translateY(30px);
  opacity: 0;
}
/* 内层动画效果 */
.nested-enter-active .inner,
.nested-leave-active .inner { 
  transition: all 0.3s ease-in-out;
}
.nested-enter-active .inner {
	transition-delay: 0.25s;
}
.nested-enter-from .inner,
.nested-leave-to .inner {
  transform: translateX(30px);
  opacity: 0.001;
}
</style>
```

默认情况下，Transition组件是监听根元素的第一个transitioned或animationed事件来自动判断过渡何时结束的，而在嵌套过渡中，期望等等内部元素过渡完成。因此，可以向Transaction组件传入duration来显示指定过渡持续时间（ms）

### 钩子
```vue
<Transition
  :css="false"
  @before-enter="onBeforeEnter"
  @enter="onEnter"
  @after-enter="onAfterEnter"
  @enter-cancelled="onEnterCancelled"
  @before-leave="onBeforeLeave"
  @leave="onLeave"
  @after-leave="onAfterLeave"
  @leave-cancelled="onLeaveCancelled"
>
  <!-- ... -->
</Transition>
```

钩子函数：

- `onBeforeEnter(el)`：在元素插入到DOM前调用，用来设置enter-from状态。
- `onEnter(el, done)`：元素插入到DOM后下一帧调用，用来开始进入动画，调用回调函数done表示过渡结束。
- `onAfterEnter(el)`：过渡完成时调用。
- `onEnterCancelled(el)`：过渡完成时调用。
- `onBeforeLeave(el)`：在leave钩子前调用。
- `onLeave(el, done)`：在离开过渡开始时调用，用来开始离开动画，调用回调函数done表示回调结束。
- `onAfterLeave(el)`：在离开过渡完成且元素从DOM中移除时调用。
- `onLeaveCancelled(el)`：仅在v-show过渡中调用。

::: tip
在使用仅由JavaScript执行的动画时，最好添加:css="false"来显示跳过对CSS过渡的自动探测，性能更好。
:::

### 过渡模式
有时候想要先执行离开动画，然后在其完成之后再执行进入动画，这时候可以通过修改mode属性来实现这一行为。

mode：
- `in-out`：先入后出
- `out-in`：先出后入

```vue
<Transition mode="out-in">...</Transition>
```

### 组件间过渡

除了v-if和v-show来触发，也可用于动态组件切换：

```vue
<Transition name="fade" mode="out-in">
  <component :is="activeComponent"></component>
</Transition>
```

## TransitionGroup

用于对v-for列表中元素或组件的插入、移除、顺序改变添加动画效果。

### 对比Transition

大体上和Transition是基本相同的props、CSS过渡class和JavaScript钩子监听器，但也有一些区别：
- 默认不会渲染一个容器元素，需要传入tag来指定一个元素作为容器元素来渲染。
- 过渡模式不可用，因为元素之间不是互斥的。
- 列表每个元素都必须有key。
- 过渡class会应用在列表元素上，而不是容器元素上。

### 动画示例

```vue
<script setup>
import { shuffle as _shuffle } from 'lodash-es'
import { ref } from 'vue'

const getInitialItems = () => [1, 2, 3, 4, 5]
const items = ref(getInitialItems())
let id = items.value.length + 1

function insert() {
  const i = Math.round(Math.random() * items.value.length)
  items.value.splice(i, 0, id++)
}
function reset() {
  items.value = getInitialItems()
}
function shuffle() {
  items.value = _shuffle(items.value)
}
function remove(item) {
  const i = items.value.indexOf(item)
  if (i > -1) {
    items.value.splice(i, 1)
  }
}
</script>

<template>
  <button @click="insert">插入到任意位置</button>
  <button @click="reset">重置</button>
  <button @click="shuffle">洗牌</button>

  <TransitionGroup tag="ul" name="fade" class="container">
    <div v-for="item in items" class="item" :key="item">
      {{ item }}
      <button @click="remove(item)">x</button>
    </div>
  </TransitionGroup>
</template>

<style>
.container {
  position: relative;
  padding: 0;
}
.item {
  width: 100%;
  height: 30px;
  background-color: #f3f3f3;
  border: 1px solid #666;
  box-sizing: border-box;
}
/* 1.声明进入和离开的状态 */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}
/* 2.声明过渡效果 */
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
/* 3.确保离开的项目被移除出了布局流，以便正确地计算移动时的动画效果 */
.fade-leave-active {
  position: absolute;
}
</style>
```

## KeepAlive

### 基本使用

作用：缓存内部组件相关实例。

```vue
<!-- 非活跃的组件将会被缓存！ -->
<KeepAlive>
  <component :is="activeComponent" />
</KeepAlive>
```

默认情况下是缓存内部的所有组件实例，但可用用include和exclude来定制该行为。这两个参数可用是逗号分割的字符串、正则表达式、数组：

```vue
<!-- 以英文逗号分隔的字符串 -->
<KeepAlive include="a,b" :max="10">
  <component :is="view" />
</KeepAlive>
<!-- 正则表达式 (需使用 `v-bind`) -->
<KeepAlive :include="/a|b/" :max="10">
  <component :is="view" />
</KeepAlive>
<!-- 数组 (需使用 `v-bind`) -->
<KeepAlive :include="['a', 'b']" :max="10">
  <component :is="view" />
</KeepAlive>
```

通过传入max来限制可被缓存的最大组件实例数，缓存的调度或销毁符合LRU算法。

### 缓存实例的生命周期

当组件实例从DOM上移除但被KeepAlive缓存为组件树的一部分时，它将变为不活跃状态而不是被卸载。当组件实例作为缓存树一部分插入到DOM中时，将被重新激活。

一个持续存在的组件开业通过`onActivated()`和`onDeactivated()`注册相应的两个状态的生命周期钩子：

```vue
<script setup>
import { onActivated, onDeactivated } from 'vue'
onActivated(() => {
  // 调用时机为首次挂载
  // 以及每次从缓存中被重新插入时
})
onDeactivated(() => {
  // 在从 DOM 上移除、进入缓存
  // 以及组件卸载时调用
})
</script>
```

注意：

- `onActivated`在组件挂载时也会调用，`onDeactivated`在组件卸载时也会调用。
- 这两个钩子不仅仅适用于`KeepAlive`缓存的根组件，也适用于后代组件。

## Teleport

### 基本用法

将一个组件内部的一部分模板“传送”到该组件的 DOM 结构外层的位置去。

```vue
<template>
  <button @click="open = true">Open Modal</button>
  <Teleport to="body">
    <div v-if="open" class="modal">
      <p>Hello from the modal!</p>
      <button @click="open = false">Close</button>
    </div>
  </Teleport>
</template>
```

`<Teleport>`接收一个`to`来指定传送的目标。`to`的值可以是一个CSS选择器字符串，也可以是一个DOM元素对象。这段代码的作用就是告诉Vue把以下模板片段传送到`body`标签下。

`<Teleport>`只改变了渲染的DOM结构，它不会影响组件间的逻辑关系。包裹的组件虽然在渲染时候会跑到其它位置，但它们还是保持逻辑上的父子关系，传入的props和触发的事件也会照常工作。

在某些场景下需要禁用Teleport，可用对其传入disabled来处理：

```vue
<Teleport :disabled="isMobile">...</Teleport>
```

### 多个Teleport共享目标

多个Teleport组件可用将其内容挂载到同一个目标元素上，顺序就是依次叠加。

比如例子：

```vue
<Teleport to="#modals">
  <div>A</div>
</Teleport>
<Teleport to="#modals">
  <div>B</div>
</Teleport>
```

渲染结果：

```html
<div id="modals">
  <div>A</div>
  <div>B</div>
</div>
```

## Suspense

### 基本使用

Suspense可以等待的异步依赖有两种：

- 带有`setup()`钩子的组件，也包含使用`<script setup>`时有顶层`await`表达式的组件
- 异步组件

组合式API中的组件可以是异步的：

```js
export default {
  async setup() {
    const res = await fetch(...)
    const posts = await res.json()
    return {
      posts
    }
  }
}
```

如果使用`<script setup>`，那么顶层await表达式会让该组件成为一个异步依赖：

```vue
<script setup>
const res = await fetch(...)
const posts = await res.json()
</script>
<template>
  {{ posts }}
</template>
```

### 加载中状态

`<Suspense>`组件有两个插槽：`#default`和`#fallback`，两个插槽都只允许一个直接子节点。

```vue
<template>
  <Suspense>
    <!-- 具有深层异步依赖的组件 -->
    <Dashboard />
    <!-- 在 #fallback 插槽中显示 “正在加载中” -->
    <template #fallback>
      Loading...
    </template>
  </Suspense>
</template>
```

