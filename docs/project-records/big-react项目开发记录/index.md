# big-react项目开发记录

## 项目初始化

1.使用pnpm初始化基本结构

```bash
pnpm init
```

然后创建 `pnpm-workspace.yaml` 文件并配置：

```yaml
packages:
  - 'packages/*'
```

创建 `packages/*` 目录。

2.安装 `eslint` 处理代码规范

执行 `npx eslint --init` 初始化 `eslint` 配置文件，然后安装相关依赖：

```bash
pnpm -w install @typescript-eslint/eslint-plugin @typescript-eslint/parser -D
```

`eslint` 配置文件，并在这个基础上修改：

```js
module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier',
		'plugin:prettier/recommended'
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module'
	},
	plugins: ['@typescript-eslint'],
	rules: {}
};

```

3.安装 `prettier` 处理代码风格

```bash
pnpm -w install prettier -D
```

为了让 `prettier` 集成到 `eslint` 中，需要另外安装：

```bash
pnpm -w install eslint-config-prettier eslint-plugin-prettier -D
```

然后添加 `.prettierrc.json` 配置文件：

```json
{
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": true,
  "singleQuote": true,
  "semi": true,
  "trailingComma": "none",
  "bracketSpacing": true
}
```

配置 `.vscode/settings.json`：

```json
{
  "editor.tabSize": 2,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

4.安装 `husky` 以规范 commit

```bash
# 安装husky
pnpm -w install husky -D
# 初始化husky
npx husky install
```

将 `pnpm lint` 纳入到 husky 执行脚本：

```bash
npx husky add .husky/pre-commit "pnpm lint"
```

通过 `commitlint` 对 `git` 提交信息进行检查，首先安装必要的库：

```bash
pnpm -w install commitlint @commitlint/cli @commitlint/config-conventional -D
```

新建配置文件 `.commitlintrc.js`：

```js
module.exports = {
  extends: ["@commitlint/config-conventional"]
};
```

集成到 husky 中：

```bash
npx husky add .husky/commit-msg "npx --no-install commitlint -e $HUSKY_GIT_PARAMS"
```

:::tip

conventional 规范集意义：

```
// 提交的类型: 摘要信息
<type>: <subject>
```

常用的`type`值包括如下:

- feat：添加新功能
- fix：修复 Bug
- chore：一些不影响功能的更改
- docs：专指文档的修改
- perf：性能方面的优化
- refactor：代码重构
- test：添加一些测试代码等等

:::