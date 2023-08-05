# Vue3逻辑复用

## 组合式函数

组合式函数：利用Vue组合式API来封装和复用**有状态逻辑**的函数。

注意是复用有状态逻辑的函数，复用无状态逻辑的库有很多，比如lodash、dayjs等等。

### 示例一

封装一个鼠标跟踪器功能的函数：

核心逻辑一致，就把它移动到一个外部函数中去，并**返回需要暴露的状态**。

```js
import { ref, onMounted, onUnmounted } from 'vue'
// 按照惯例，组合式函数名以“use”开头
export function useMouse() {
  // 被组合式函数封装和管理的状态
  const x = ref(0)
  const y = ref(0)

  // 组合式函数可以随时更改其状态。
  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  // 一个组合式函数也可以挂靠在所属组件的生命周期上
  // 来启动和卸载副作用
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  // 通过返回值暴露所管理的状态
  return { x, y }
}
```
在组件中使用：
```vue
<script setup>
import { useMouse } from './mouse.js'
const { x, y } = useMouse()
</script>
<template>Mouse position is at: {{ x }}, {{ y }}</template>
```

### 示例二

在做异步请求时，我们常常需要处理不同状态：加载中、加载成功、加载失败。

```js
import { ref, isRef, unref, watchEffect } from 'vue'
export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)
  // 为url解包
  const urlValue = unref(url)
  const doFetch = () => {
    // 请求前重置状态
    data.value = null
    error.value = null
    fetch(unref(url))
      .then((res) => res.json())
      .then((json) => (data.value = json))
      .catch((err) => (error.value = err))
  }
  if (isRef(url)) {
    // 若输入的 URL 是一个 ref，那么启动一个响应式的请求
    watchEffect(doFetch)
  } else {
    // 否则只请求一次，避免监听器额外开销
    doFetch()
  }
}
```

### 一些约定

1.命名：use开头的小驼峰命名法

2.输入参数

- 组合式函数可以接收ref参数，建议在函数输入参数时就兼容ref和原始值，可以使用`unref()`工具函数。

```js
import { unref } from 'vue'
function useFeature(maybeRef) {
  const value = unref(maybeRef)
}
```
- 如果组合函数在接收ref为参数时会产生响应式副作用，请确保`watch()`显示监听此ref，或者在`watchEffect()`调用`unref()`来进行正确追踪。

3.推荐组合式函数始终返回一个包含多个ref的普通非响应式对象，这样该对象在组件中被解构为ref后仍可以保持响应性。

::: tip
如果使用reactive，从组合式函数中返回的响应式对象进行结构，会丢失与该响应式函数内部状态的响应式连接。因此在响应式函数内部尽量要使用ref而不是reactive。

如果希望以对象形式来使用组合式函数中返回的状态，可以将返回对象用`reactive()`包装一次，这样其中的ref会被自动解包。

```js
const mouse = reactive(useMouse())
// mouse.x 链接到了原来的 x ref
console.log(mouse.x)
```
:::

4.副作用

组合式函数中可以执行副作用，但要注意：

- 如果你的应用用到了服务端渲染 (SSR)，请确保在组件挂载后才调用的生命周期钩子中执行DOM相关的副作用，例如：`onMounted()`。
- 确保在`onUnmounted()`时清理副作用。

5.使用限制

组合式函数在`<script setup>`或`setup()`钩子中，应始终**同步**调用。

### 在选项式 API 中使用组合式函数

组合式函数必须在`setup()`中调用。且其返回的绑定必须在`setup()`中返回，以便暴露给this及其模板：

```js
import { useMouse } from './mouse.js'
import { useFetch } from './fetch.js'

export default {
  setup() {
    const { x, y } = useMouse()
    const { data, error } = useFetch('...')
    // 必须返回相关响应式参数
    return { x, y, data, error }
  },
  mounted() {
    // setup() 暴露的属性可以在通过 `this` 访问到
    console.log(this.x)
  }
  // ...其他选项
}
```

## 自定义指令

### 基本使用

自定义指令主要是为了重用涉及普通元素的底层DOM访问的逻辑。

在`<script setup>`中，任何以v开头的驼峰式命名的变量都可以被用作一个自定义指令。

```vue
<script setup>
// 在模板中启用 v-focus
const vFocus = {
  mounted: (el) => el.focus()
}
</script>

<template>
  <input v-focus />
</template>
```

在没有`<script setup>`情况下通过directives注册：

```js
export default {
  setup() {
    /*...*/
  },
  directives: {
    // 在模板中启用 v-focus
    focus: {
      /* ... */
    }
  }
}
```

全局注册：

```js
const app = createApp({})
// 使 v-focus 在所有组件中都可用
app.directive('focus', {
  /* ... */
})
```

### 指令钩子

一个指令的定义对象可以提供几个钩子函数

```js
const myDirective = {
  // 在绑定元素的 attribute 前
  // 或事件监听器应用前调用
  created(el, binding, vnode, prevVnode) {
    // 下面会介绍各个参数的细节
  },
  // 在元素被插入到 DOM 前调用
  beforeMount(el, binding, vnode, prevVnode) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都挂载完成后调用
  mounted(el, binding, vnode, prevVnode) {},
  // 绑定元素的父组件更新前调用
  beforeUpdate(el, binding, vnode, prevVnode) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都更新后调用
  updated(el, binding, vnode, prevVnode) {},
  // 绑定元素的父组件卸载前调用
  beforeUnmount(el, binding, vnode, prevVnode) {},
  // 绑定元素的父组件卸载后调用
  unmounted(el, binding, vnode, prevVnode) {}
}
```

参数：

- el：指令绑定的DOM元素
- binding
  - arg：传递给指令的参数
  - value：传递给指令的值
  - oldValue：之前的值。仅在`beforeUpdate`和`updated`可用。
  - modifiers：一个包含修饰符的对象
  - instance：使用该指令的组件实例
  - dir：指令定义的对象
- vnode：绑定元素的底层VNode
- prevNode：之前的渲染中代表指令所绑定元素的 VNode。仅在`beforeUpdate`和`updated`可用。

比如指令：

```html
<div v-example:foo.bar="baz">
```

可用得到binding对象：

```js
{
  arg: 'foo',
  modifiers: { bar: true },
  value: /* baz变量的值 */,
  oldValue: /* 上一次更新时baz变量的值 */
}

```

::: tip
除了el外，其他参数都是只读的，不要更改它们。若你需要在不同的钩子间共享信息，推荐通过元素的`dataset attribute`实现。
:::

### 简化形式

简化形式是传入包含el和binding的回调函数，只在mounted和updated时触发。

字面量可用是对象，通过`binding.value.*`访问相关值。

当在组件上使用自定义指令时，它会始终应用于组件的根节点，和透传attributes类似。

```vue
<!-- 当在组件上使用自定义指令时，它会始终应用于组件的根节点 -->
<MyComponent v-demo="{ color: 'white', text: 'hello!' }"></MyComponent>
```

```js
// 这会在mounted和updated时都调用
app.directive('demo', (el, binding) => {
  console.log(binding.value.color) // => "white"
  console.log(binding.value.text)  // => "hello!"
})
```

## 插件

引入插件：
```js
import { createApp } from 'vue'
const app = createApp({})
app.use(myPlugin, {
  /* 可选的选项 */
})
```

定义插件：
```js
const myPlugin = {
  install(app, options) {
    // 配置此应用
  }
}
```
