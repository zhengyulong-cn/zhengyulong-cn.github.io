# art-gallery开发记录
## Vite通用配置

### 区别移动端和PC端

#### A.通过尺寸区别

尽量使用`useWindowSize()`来响应式的获取窗口宽度，当然不使用响应式也是可以的。

```typescript
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'

// 通过vueuse库获取响应式的窗口宽度
const { width } = useWindowSize();
export const PC_DEVICE_WIDTH = 1280;
export const isMobileTerminal = computed(() => {
  return width.value < PC_DEVICE_WIDTH;
})
```

#### B.通过userAgent区别

```typescript
import { computed } from 'vue'
export const isMobileTerminal = computed(() => {
  return /Android|webOS|iPhone|iPad|BlackBerry|IEMobile|Opera Mini/i.test(
  	navigator.userAgent
  )
})
```

### 定义软链接

需要修改两个地方：

1.`vite.config.ts`配置文件

```ts
resolve: {
  alias: {
    '@': path.resolve(__dirname, 'src')
  }
},
```

2.`tsconfig.json`配置文件

```ts
"paths": {
  "@/*": [
    "src/*"
  ]
},
"baseUrl": "./",
```

### 动态rem的值

### Vite处理环境变量

### Vite引入图标



