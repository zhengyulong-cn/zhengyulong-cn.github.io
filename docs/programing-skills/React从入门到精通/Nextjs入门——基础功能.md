# Nextjs入门——基础功能

## 启动

```bash
npx create-next-app@latest
# or
yarn create next-app
# or
pnpm create next-app
```

如果使用TypeScript，则：

```bash
npx create-next-app@latest --typescript
# or
yarn create next-app --typescript
# or
pnpm create next-app --typescript
```

然后运行`npm run dev`来启动服务，`http://localhost:3000`。

## 页面

### 路由

在Next.js中，页面是在`pages`目录下导出的React组件，每个页面绑定其文件名路由。

比如：创建`pages/about.js`组件，那么通过访问`/about`就能访问到这个组件。

Next.js支持动态路由，如果创建文件名为`pages/posts/[id].js`，那么就能访问`posts/1`、`posts/2`等等。

### 预渲染

默认情况下，Next.js预呈现每个页面，这意味着Next.js提取为每个页面生成HTML，而不是由客户端JavaScript完成所有工作。预渲染能带来更好性能和SEO。

每个生成的HTML都与页面尽可能少的JavaScript代码相关联，当浏览器加载页面时，其JavaScript代码会运行并使页面完全交互，这个过程称为水合作用。

Next.js有两种预渲染方式：

- 静态生成：HTML在build时候生成并复用于每个请求。要使页面使用静态生成，请导出页面组件，或导出`getStaticProps`（如有必要，还可以导出`getStaticPaths`）。
- 服务端渲染（SSR）：HTML在每个请求中生成。要使页面使用服务器端呈现，请导出`getServerSideProps`。

Next.js运行选择对于某个页面的呈现方式，可以对大多数页面使用静态生成，对其他页面使用SSR呈现。静态生成的页面可以由CDN缓存，无需额外配置即可提高性能。

静态生成：

1.页面内容依赖于外部数据

使用`getStaticProps`来将数据传入到组件中。

```tsx
export async function getStaticProps() {
    const res = await fetch('https://.../posts')
    const posts = await res.json()
    return { props: { posts } }
}

export default function Blog({ posts }: { posts: Array<IBlog> }) {
    return (
        <div>
            {posts.map(post => (
                <div key={post.id}>
                    <h2>{post.title}</h2>
                    <p>{post.content}</p>
                </div>
            ))}
        </div>
    )
}
```

2.页面路径依赖于外部数据

`http://localhost:3000/posts/1`、`http://localhost:3000/posts/2`、`http://localhost:3000/posts/3`都能访问，但`http://localhost:3000/posts/4`不能访问到。

```tsx
export async function getStaticPaths() {
    // const res = await fetch('https://.../posts')
    const posts: Array<IBlog> = [
        { id: 1, title: '博客', content: '博客正文' },
        { id: 2, title: '博客2', content: '博客正文2' },
        { id: 3, title: '博客3', content: '博客正文3' },
    ]
    const paths = posts.map((post) => ({
        params: {
            id: String(post.id),
        },
    }))
    return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
    const res = await fetch(`https://.../posts/${params.id}`)
    const posts = await res.json()
    return { props: { posts } }
}
```

SSR：

和`getStaticProps`类似，使用`getServerSideProps`来将数据传入到组件中。

```tsx
export async function getServerSideProps() {
    const posts: Array<IBlog> = [
        { id: 10, title: '博客10 SSRBlog', content: '博客正文10' },
        { id: 11, title: '博客11 SSRBlog', content: '博客正文11' },
        { id: 12, title: '博客12 SSRBlog', content: '博客正文12' },
    ]
    return {
        props: {
            posts,
        }
    }
}
```

## 数据请求

1.getStaticProps

如果从页面导出名为`getStaticProps`（静态站点生成）的函数，Next.js将使用`getStaticProps`返回的props在构建时预呈现此页面。

`getStaticProps`运行情况：

- 始终在服务器上运行，从不在客户端运行。
- 总是在构建期间运行
- 使用`fallback: true`或`revalidate`时在后台运行
- 使用`fallback: blocking`时在初始化渲染前调用
- 使用`revalidate()`时在后台运行按需运行

2.getStaticPaths

如果页面具有动态路由并使用`getStaticProps`，则需要定义要静态生成的路径列表。当您从使用动态路由的页面导出名为`getStaticPaths`（静态站点生成）的函数时，Next.js将静态预呈现 `getStaticPath`指定的所有路径。

3.getServerSideProps

如果从页面导出名为`getServerSideProps`（服务器端渲染）的函数，Next.js将使用`getServerSideProps`返回的数据在每个请求上预呈现此页面。

4.客户端数据请求。可以使用普通方式，在事件或useEffect中请求，也可以使用react-query或swr等库实现数据请求。

## CSS支持

1. 全局CSS，写在`styles`文件夹下，引入即可。

```tsx
import '@/styles/globals.css'
```

2. CSS Modules

```tsx
import styles from './index.module.css'
export function Button() {
  return (
    <button
      type="button"
      className={styles.error}
    >
      Destroy
    </button>
  )
}
```

3. Sass/Less

4. Tailwind CSS

::: danger
注意：不支持`styled-components`。
:::

## 布局

写在`components/layout.tsx`下，用于显示公共布局。

```tsx
export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
```

## 图像

引入next.js自带的Image组件，然后装入图片即可。

```js
import Image from 'next/image'
import profilePic from '../public/me.png'

function Home() {
  return (
    <>
      <h1>My Homepage</h1>
      <Image
        src={profilePic}
        alt="Picture of the author"
        width={500} automatically provided
        height={500} automatically provided
      />
      <p>Welcome to my homepage!</p>
    </>
  )
}
```

## 字体

1.在`_app.tsx`中引入字体，这样对所有组件都生效。

```tsx{1-2,5}
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} className={inter.className}/>
}
```

如果想引入到`<head>`元素，可以如下写：

```tsx{1-2,6-10}
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </>
  )
}
```

2.使用本地字体

```tsx
import localFont from 'next/font/local'

// const myFont = localFont({ src: './my-font.woff2' })
const myFont = localFont({
  src: [
    {
      path: './Roboto-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './Roboto-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: './Roboto-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './Roboto-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
})

export default function MyApp({ Component, pageProps }) {
  return (
    <main className={myFont.className}>
      <Component {...pageProps} />
    </main>
  )
}
```

## ESLint

```json
"scripts": {
  "lint": "next lint"
}
```

运行`npm run lint`来检查，运行后你会看到如下，并进行选择（建议选择Strict模式）：

```bash
# ? How would you like to configure ESLint?
#
# ❯   Base configuration + Core Web Vitals rule-set (recommended)
#     Base configuration
#     None
```

使用`eslint-config-next`以下推荐规则将被使用，是优于`next.config.js`中的配置：

- `eslint-plugin-react`
- `eslint-plugin-react-hooks`
- `eslint-plugin-next`

## 环境变量

定义在`.env.local`文件中，通过带有`process.env`前缀访问。

```
DB_HOST=localhost
DB_USER=myuser
DB_PASS=mypassword
```

访问：

```ts
export async function getStaticProps() {
  const db = await myDB.connect({
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
  })
}
```

在`.env`文件中，是可以访问定义的变量的，通过`$`访问：

```
HOSTNAME=localhost
PORT=8080
HOST=http://$HOSTNAME:$PORT
```

env文件：

- `.env`：所有环境
- `.env.development`：开发环境
- `.env.production`：生成环境

`.env.local`始终覆盖默认设置。

::: tip
`.env`、`.env.development`和`.env.production`文件应包含在存储库中，因为它们定义了默认值。`.env*.local`应该添加到`.gitignore`中，因为这些文件应该被忽略。`.env.local`是可以存储机密的地方。
:::

## Script

```tsx{1,6}
import Script from 'next/script'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Script src="https://example.com/script.js" />
      <Component {...pageProps} />
    </>
  )
}
```
