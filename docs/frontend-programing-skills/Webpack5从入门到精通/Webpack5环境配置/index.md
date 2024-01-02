# Webpack5环境配置

## 使用Babel

> 在Webpack场景下，只需使用 `babel-loader` 即可接入Babel转译功能。

1.安装依赖

```Shell
npm i -D @babel/core @babel/preset-env babel-loader
```

2.添加模块处理规则

```js
module.exports = {
  /* ... */
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
            loader: 'babel-loader',
        },
      },
    ],
  },
};
```

3.接入后，可以使用 `.babelrc` 文件或 `rule.options` 属性配置Babel功能逻辑

配置到 `webpack.config.js` 中的 `rule.options` 属性中：

```js
module.exports = {
  /* ... */
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
```

配置到 `.babelrc.json` 文件中：

```JSON
 {
   "presets": ["@babel/preset-env"]
 }
```

Babel 预设规则集 Preset：

- `@babel/preset-env`：允许使用最新的 JavaScript，而无需管理目标环境需要哪些语法转换。
- `@babel/preset-react`：包含 React 常用插件的规则集，支持 preset-flow、syntax-jsx、transform-react-jsx 等。
- `@babel/preset-typescript`：用于转译 TypeScript 代码的规则集。
- `@babel/preset-flow`：用于转译 Flow 代码的规则集。

## 使用TypeScript

### @babel/preset-typescript

如果项目中已经使用了 `babel-loader`，可以使用 `@babel/preset-typescript` 规则集来完成 JavaScript 与 TypeScript 的转码工作

1.安装依赖

```Shell
npm i -D @babel/preset-typescript
```

2.配置 `webpack.config.js`：

```js
module.exports = {
  /* ... */
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-typescript'],
          },
        },
      },
    ],
  },
};
```

### ts-loader

1.安装依赖

```Shell
npm i -D typescript ts-loader
```

2.配置 `webpack.config.js`

```js
module.exports = {
  /* ... */
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader'
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  }
};
```

### 两者区别

1. `babel-loader` 会忽略TypeScript类型检查，能让整个转换操作变得更快。
2. `ts-loader` 用于将 `Typescript` 转换为 `Javascript`；`babel-loader` 则用于根据我们的要求将该 `Javascript` 转换为目标浏览器友好的代码版本。

## 使用ESLint

1.安装ESLint

```Shell
npm install -D eslint eslint-webpack-plugin
```

Eslint规范需要另外安装。

2.配置 `webpack.config.js`

```js
const ESLintPlugin = require('eslint-webpack-plugin');
module.exports = {
  /* ... */
  plugins: [new ESLintPlugin(options)],
};
```

## 处理CSS

Webpack处理CSS文件，通常需要：

- `css-loader`：将CSS等价翻译为形如 `module.exports = "${css}"` 的JavaScript代码，使得Webpack能处理解析CSS内容与资源依赖。
- `style-loader`：在产物中注入一系列runtime代码，这些代码会将CSS内容注入到页面的 `<style>` 标签，使样式生效。
- `mini-css-extract-plugin`：将CSS代码抽离到单独的 `.css` 文件，并通过 `<link>` 标签方式插入到页面中。

1.安装相关loader和插件

```Shell
npm install css-loader style-loader mini-css-extract-plugin --save-dev
```

2.配置 `webpack.config.js`

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
  /* ... */
  module: {
    rules: [
      {
        // style-loader(css-loader(css))链式调用
        test: /\.css$/i,
        use: [
          (process.env.NODE_ENV === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader), 
          'css-loader'
        ],
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin(),
  ],
}
```

经过 `css-loader` 处理后，CSS 代码会被转译为等价 JS 字符串，但这些字符串还不会对页面样式产生影响，需要继续接入 `style-loader` 加载器。

在不同环境中的配置：

- 开发环境：使用 `style-loader` 将样式代码注入到页面 `<style>` 标签；
- 生产环境：使用 `mini-css-extract-plugin` 将样式代码抽离到单独产物文件，并以 `<link>` 标签方式引入到页面中。

> `mini-css-extract-plugin` 必须和 `html-webpack-plugin` 同时使用，才能将产物路径以 `<link>` 方式插入到HTML中。

## 使用预处理器

1.安装预处理器loader

```Shell
# less
npm install less less-loader --save-dev
# sass
npm install sass sass-loader --save-dev
# stylus
npm install stylus stylus-loader --save-dev
```

2.配置 `webpack.config.js`

```js
module.exports = {
  /* ... */
  module: {
    rules: [
      {
        test: /\.less$/i,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.styl$/i,
        use: [
          'style-loader',
          'css-loader',
          'stylus-loader'
        ]
      }
    ]
  },
}
```

## 使用PostCSS

1.安装

```Shell
# postcss
npm install postcss postcss-loader --save-dev
# autoprefixer
npm install autoprefixer --save-dev
```

2.配置 `webpack.config.js`

```js
module.exports = {
  /* ... */
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            // importLoaders为1时，使用css-loader加载CSS文件前会执行一个预处理加载器。这样会先通过postcss-loader执行PostCSS相关功能
            options: {
              importLoaders: 1
            }
          },
          'postcss-loader'
        ]
      }
    ]
  },
}
```

3.配置 `postcss.config.js`

```js
module.exports = {
  plugins: [
    require("autoprefixer")
  ],
};
```

PostCSS最大的优势在于其简单、易用、丰富的插件生态，基本上已经能够覆盖样式开发的方方面面。实践中，经常使用的插件有：

- `autoprefixer`：基于Can I Use网站上的数据，自动添加浏览器前缀。
- `postcss-preset-env`：一款将最新CSS语言特性转译为兼容性更佳的低版本代码的插件。
- `postcss-less`：兼容Less语法的PostCSS插件，类似的还有：postcss-sass、poststylus。
- `stylelint`：一个现代CSS代码风格检查器，能够帮助识别样式代码中的异常或风格问题。

## 资源管理

### 图片和字体

资源模块类型有四种：

- `asset/resource`：将模块单独导出一个文件，并提供一个 URL 来使用该文件。
- `asset/inline`：将文件通过 `base64` 编码转为 `Data URI` 的格式 ，并内联到使用它的文件中。
- `asset/source`：不做任何转译，只是简单将文件内容复制到产物中。
- `asset`：默认情况下小于 8kb 文件将被是为 `asset/inline` 类型，大于 8kb 则被视为 `asset/resource` 类型。
  - 可以通过 `parser.dataUrlCondition.maxSize` 属性来修改默认的大小。

以下是OA系统中试用资源模块的相关配置：

```js
module.exports = {
  /* ... */
  module: {
    rules: [
      {
        test: /\.(eot|ttf|woff|woff2)(\?\S*)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[hash][ext][query]',
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 3 * 1024,
          },
        },
        generator: {
          filename: 'images/[hash][ext][query]',
        },
      },
    ]
  },
}
```

### 图形优化

#### 图像压缩

图像压缩可以减少网络上需要传输的流量，推荐使用 `image-webpack-loader` 插件。

```js
module.exports = {
  // ...
  module: {
    rules: [{
      test: /\.(gif|png|jpe?g|svg)$/i,
      type: "asset/resource",
      use: [{
        loader: 'image-webpack-loader',
        options: {
          mozjpeg: {
            quality: 80
          },
          // disable: process.env.NODE_ENV === 'development',
        }
      }]
    }],
  },
};
```

`image-webpack-loader` 底层依赖于 `imagemin` 及一系列的图像优化工具：

- `mozjpeg`：用于压缩 JPG(JPEG) 图片；
- `optipng`：用于压缩 PNG 图片；
- `pngquant`：同样用于压缩 PNG 图片；
- `svgo`：用于压缩 SVG 图片；
- `gifsicle`：用于压缩 Gif 图；
- `webp`：用于将 JPG/PNG 图压缩并转化为 WebP 图片格式。

:::danger

注意：图像压缩是一种非常耗时的操作，建议只在生产环境下开启。

:::

#### 雪碧图

将许多细小的图片合并成一张大图，从而将复数次请求合并为一次请求，之后配合 CSS 的 `background-position` 控制图片的可视区域，这种技术被称作“雪碧图”。在 Webpack 中，我们可以使用 `webpack-spritesmith` 插件自动实现雪碧图效果。

`webpack-spritesmith` 插件会将 `src.cwd` 目录内所有匹配 `src.glob` 规则的图片合并成一张大图并保存到 `target.image` 指定的文件路径，同时生成兼容 SASS/LESS/Stylus 预处理器的 mixins 代码。

```js
module.exports = {
  // ...
  resolve: {
    modules: ["node_modules", "assets"]
  },
  plugins: [
    new SpritesmithPlugin({
      // 需要
      src: {
        cwd: path.resolve(__dirname, 'src/icons'),
        glob: '*.png'
      },
      target: {
        image: path.resolve(__dirname, 'src/assets/sprite.png'),
        css: path.resolve(__dirname, 'src/assets/sprite.less')
      }
    })
  ]
};
```

:::warning

雪碧图曾经是一种使用广泛的性能优化技术，但 HTTP2 实现 TCP 多路复用之后，雪碧图的优化效果已经微乎其微，甚至是反优化。可以预见随 HTTP2 普及率的提升，未来雪碧图的必要性会越来越低。

:::

#### 响应式图片

Webpack 如果想使用响应式图片，需要安装 `resize-image-loader`、`html-loader-srcset`、`responsive-loader` 等。

实践中我们通常没必要对项目里所有图片都施加响应式特性，因此这里使用 `resourceQuery` 过滤出带 `size/sizes` 参数的图片引用。

```js
module.exports = {
  // ...
  module: {
    rules: [{
      test: /\.(png|jpg)$/,
      oneOf: [{
        type: "javascript/auto",
        resourceQuery: /sizes?/,
        use: [{
          loader: "responsive-loader",
          options: {
            adapter: require("responsive-loader/sharp"),
          },
        }],
      }, {
        type: "asset/resource",
      }],
    }],
  }
};
```

使用：

引用参数 `./webpack.jpg?sizes[]=300,sizes[]=600,sizes[]=1024` 最终将生成宽度分别为 300、600、1024 三张图片，之后设置 `img` 标签的 `srcSet` 属性即可实现图片响应式功能。

```js
// 引用图片，并设置响应式参数
import responsiveImage from './webpack.jpg?sizes[]=300,sizes[]=600,sizes[]=1024';

const Picture = function () {
  return (
    <img
      srcSet={responsiveImage.srcSet}
      src={responsiveImage.src}
      sizes="(min-width: 1024px) 1024px, 100vw"
      loading="lazy"
    />
  );
};
```

在 CSS 中，也能通过 `size` 参数精确控制不同条件下的图像尺寸：

```css
.foo {
  background: url("./webpack.jpg?size=1024");
}

@media (max-width: 480px) {
  .foo {
    background: url("./webpack.jpg?size=300");
  }
}
```

### 数据集

对于 xml 或 csv 数据集，可以使用相应的 loader 来加载：

```js
module.exports = {
  /* ... */
  module: {
    rules: [
      {
        test: /\.(csv|tsv)$/i,
        use: ['csv-loader'],
      },
      {
        test: /\.xml$/i,
        use: ['xml-loader'],
      },
    ]
  },
}
```

