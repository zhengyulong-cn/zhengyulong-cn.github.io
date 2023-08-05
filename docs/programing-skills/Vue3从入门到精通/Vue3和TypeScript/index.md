# Vue3和TypeScript

## 搭配TypeScript使用Vue

### 总览

IDE支持：

- 推荐适用VScode，安装`Volar`和`TypeScript Vue Plugin`插件。使用Volar时必须禁止`Vetur`。

配置`tsconfig.json`：

- 通过`create-vue`搭建的项目包含了预先配置好的`tsconfig.json`，项目中可以使用`Project References`来确保运行在不同环境下代码的类型正确。
- 手动配置`tsconfig.json`时，需要注意：
  - `compilerOptions.isolatedModules`应当设置为true，因为Vite使用esbuild来转义TypeScript，并受限于单文件转译的限制。
  - 如果你正在使用选项式API，需要将`compilerOptions.strict`设置为true，才可以获得对组件选项中this的类型检查。否则this会被认为是any。
  - 如果你在构建工具中配置了路径解析别名，例如`@/*`这个别名被默认配置在了`create-vue`项目中，你需要通过`compilerOptions.paths`选项为TypeScript再配置一遍。

Volar的Takeover模式：项目里运行两个预约服务实例，一个来自Volar，一个来自VScode内置服务，在大型项目中会带来一些性能问题。

1. 在当前项目的工作空间下，用`Ctrl + Shift + P`(macOS：`Cmd + Shift + P`) 唤起命令面板。
2. 输入`built`，然后选择“Extensions：Show Built-in Extensions”。
3. 在插件搜索框内输入`typescript`(不要删除`@builtin`前缀)。
点击“TypeScript and JavaScript Language Features”右下角的小齿轮，然后选择“Disable (Workspace)”。
重新加载工作空间。Takeover 模式将会在你打开一个 Vue 或者 TS 文件时自动启用。

### 常见使用说明

1. 为了能让TypeScript正确推导出组件选项内的类型，需要通过`defineComponent()`这个全局API来定义组件。
2. 单文件组件建议使用`<script setup lang="ts">`，使用后`<template>`在绑定表达式中也支持TypeScript。

```vue
<script setup lang="ts">
let x: string | number = 1
</script>

<template>
  <!-- 出错，因为 x 可能是字符串 -->
  {{ x.toFixed(2) }}
</template>
```

## TS和组合式API

::: tip
根据官方文档，一些API既可以使用“运行时声明”，也可以使用“基于类型声明”，这里选一套较好的写法，后续就无需纠结了。
:::

### props

基于类型声明在默认值这块还有问题，建议使用运行时声明。

```vue
<script setup lang="ts">
const props = defineProps({
  foo: { type: String, required: true },
  bar: Number
})
props.foo // string
props.bar // number | undefined
</script>
```

### emits

两种均可，但更推荐基于类型：

```vue
<script setup lang="ts">
// 运行时
const emit = defineEmits(['change', 'update'])
// 基于类型
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
</script>
```

### ref

```ts
import { ref } from 'vue'
const year = ref<number | string>('2020')
```

### reactive

```ts
import { reactive } from 'vue'
interface Book {
  title: string
  year?: number
}
const book: Book = reactive({ title: 'Vue 3 指引' })
```

### computed

```ts
const double = computed<number>(() => {
  // 若返回值不是 number 类型则会报错
})
```

### 事件处理函数

```ts
function handleChange(event: Event) {
  console.log((event.target as HTMLInputElement).value)
}
```

### 模板引用

#### 普通模板

```ts
const el = ref<HTMLInputElement | null>(null)
```

#### 组件模板

```ts
import MyModal from './MyModal.vue'
const modal = ref<InstanceType<typeof MyModal> | null>(null)
```

### provide/inject

provide和inject通常会在不同组件中运行，Vue提供了一个`InjectionKey`接口，它继承来自`Symbol`的泛型类型。

定义key值：

```ts
import type { InjectionKey } from 'vue';
export const key = Symbol() as InjectionKey<string>;
```

provide：

```ts
import { provide } from 'vue';
import { key } from '@/inject';
provide(key, 'Message');
```

inject：

```ts
import { inject } from 'vue';
import { key } from '@/inject';
const ij1 = inject<string>(key);
```

