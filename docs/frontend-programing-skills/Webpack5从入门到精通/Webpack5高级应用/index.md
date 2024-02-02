# Webpack5高级应用

## 性能分析

如何收集数据呢？

Webpack 内置了 `stats` 接口，专门用于统计模块构建耗时、模块依赖关系等信息。

1.`webpack.config.js` 中配置 `profile = true`。

2.运行编译命令`npx webpack --json=stats.json`，参数值为最终生成的统计文件名。

3.查看生成的`stats.json`文件。

然后通过一些插件工具分析：

- Statoscope
- Webpack Bundle Analyzer
- Webpack Visualizer
- Webpack Dashboard
- Speed Measure Plugin
- UnusedWebpackPlugin