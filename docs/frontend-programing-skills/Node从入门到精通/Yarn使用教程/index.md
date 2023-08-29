# Yarn

## 快速开始

### 安装Yarn

管理 Yarn 的首选方法是通过 Corepack，这是一个从 16.10 开始的所有 Node.js 版本附带的新二进制文件。它充当您和 Yarn 之间的中介，并允许您在多个项目中使用不同的包管理器版本，而无需再签入 Yarn 二进制文件。

如果node >= 16.10，则执行：

```bash
corepack enable
```

### 初始化项目

在项目目录中，执行：

```bash
# -2表示Yarn的第二个版本
yarn init -2
```

### Yarn的版本

更新到最新稳定版本：

```bash
yarn set version stable
```

更新到最新build版本：

```bash
yarn set version from sources
```

## 使用

1. 获取命令行列表帮助

```bash
yarn help
```

2. 安装依赖

```bash
# 安装所有
yarn
yarn install
# 安装某个
yarn add [package]@[version] --dev # dev dependencies
yarn add [package]@[tag] --peer # peer dependencies
```

3. 升级依赖

```bash
yarn up [package]
yarn up [package]@[version]
yarn up [package]@[tag]
```

4. 删除某个依赖

```bash
yarn remove [package]
```

5. 初始化项目

```bash
yarn init
```

6. 升级Yarn

```bash
yarn set version latest
yarn set version from sources
```

### 编辑器SDKs

一些IDE在使用即插即用安装时需要特殊配置才能使TypeScript正常工作，编辑器SDK和设置可以使用`yarn dlx @yarnpkg/sdks`生成。

- 使用`yarn sdks vscode vim`为指定受支持编辑器生成基本SDK和设置
- 使用`yarn sdks base`生成基础SDK，然后手动调整不受支持的编辑器的配置
- 使用`yarn sdks`更新所有已安装SDK和编辑器设置

比如在VSCode：

1. 运行`yarn dlx @yarnpkg/sdks vscode`，生成叫`.yarn/sdks`的新目录
2. 在TS文件中按下`Ctrl + Shift + p`
3. 选择“Select TypeScript Version”
4. 选择“Use Workspace Version”

现在VSCode项目配置为与通常使用的完全相同的TypeScript版本，只是它现在能够正确解析类型定义！

## Plug'n'Play

node_modules的问题：

- node_modules目录通常包含大量文件。生成它们可以弥补运行`yarn install`所需时间的70%以上。即使有预先存在的安装也救不了你，因为包管理器仍然必须区分node_modules的内容和它应该包含的内容。
- 因为node_modules生成是一个 I/O 密集型操作，包管理器除了简单的文件复制之外没有太多优化它的余地——即使它可以在可能的情况下使用硬链接或写时复制，它在进行一堆系统调用来操作磁盘之前，仍然需要区分文件系统的当前状态。
- 因为Node没有包的概念，它也不知道文件是否要被访问。完全有可能您编写的代码在开发中工作了一天，但后来在生产中崩溃了，因为您忘记在package.json中列出您的依赖项之一。
- 即使在运行时，Node解析也必须进行大量的stat和readdir调用，以确定从哪里加载每个需要的文件。这是非常浪费的，也是启动Node应用程序花费如此多时间的部分原因。
- 最后，node_modules文件夹的设计是不切实际的，因为它不允许包管理器正确地删除重复包。即使可以使用一些算法来优化树布局（提升），我们仍然无法优化某些特定的模式。不仅导致磁盘使用率高于需要，而且一些包在内存中被多次实例化.

使用Plug'n'Play的安装模式，Yarn会生成一个单独的`.pnp.cjs`文件，而不是通常包含各种包副本的node_modules文件夹。`.pnp.cjs`文件包含各种映射：

- 将包名称和版本链接到它们在磁盘上的位置
- 将包名称和版本链接到它们的依赖项列表

有了这些查找表，Yarn 可以立即告诉Node在哪里可以找到它需要访问的任何包，只要它们是依赖树的一部分，并且只要这个文件加载到您的环境中。

## Workspaces

Yarn Workspaces旨在和monorepos配合，，允许多个项目存在同一存储库中，并交叉相互引用。

工作树的声明是通过传统的`package.json`文件定义，区别不同的是：

- 必须声明`workspaces`字段，是个glob模式的数组，用于定位为工作树生效的工作区。比如：添加`packages/*`，那么`packages`文件夹就是工作区。
- 必须级联到项目级`package.json`，在项目级中通常定义单个工作树。如果尝试设置嵌套工作区，则必须确保工作室定义为其父工作树的有效工作区。

工作区的两个重要属性：

- 只能访问工作区的依赖项，即严格执行工作区依赖项。
- 如果包管理器要解析工作区可以满足的范围，它将首选工作区解决而不是远程解决。这是monorepo的支柱：您的项目包将相互连接并使用存储在存储库中的代码，而不是使用注册表中的远程包。

