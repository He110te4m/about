---
title: ESBuild 常见问题踩坑指南
createAt: 1689816057902
---

# 别名解析

ESBuild 中存在单独的别名配置，而在 ts 项目中，ESBuild 也会直接使用 tsconfig.json 中的别名。

故而 tsconfig 中的别名并不只是在构建类型时生效，与 vite、rollup、webpack 等主流构建工具是不同的。

如果 tsconfig 配置混乱，可能会导致构建时错误的查找文件，导致构建失败或者是产物内容错误。

# transform

ESBuild 没有单独的 transform 阶段，只有 resolve 与 load 。

当文件被其中一个插件的 load 处理完成，返回了非 undefined 或 null 的值时，其他插件的 onLoad 回调将不会接收到该文件，也就无法继续处理。

所以需要通过外置的级联插件，如： `esbuild-plugin-pipe` 、 `esbuild-plugin-transform` 等来级联插件。

# 装饰器

## 语法解析

ESBuild 中只有 ts、tsx 语法支持装饰器，并且需要在 tsconfig 中开启装饰器功能。

书写在 `.js` 文件中的代码时不会被 `ts` 处理的，也就不能直接使用装饰器。

解决方案是配置 `loader` ，将 `.js` 的语法解析指向 `ts` 解析器，将 `.jsx` 指向 `.tsx` 解析器。

当处理 vue 等单文件语法时，由于无法直接映射语法，所以需要使用 plugin ，利用插件级联的功能在 esbuild-vue 等插件处理完成后，对语法的 loader 进行修改，如：

```js
{
  name: 'fix-vue-syntax-loader',
  setup(build) {
    build.onLoad(/\.vue$/, async (args) => {
      const contents = await readFile(args)

      return {
        contents,
        loader: 'tsx',
      }
    })
  },
}
```

## 默认导出装饰器

在 vue 中使用 vue-class 时，由于编译后会将 `export default class name` 转为 `var name = class {}; export default name;` 的形式，所以在 esbuild 中识别不出标准的 class，导致装饰器应用失败。

如果需要支持 vue-class 的写法， 需要修改为：

```ts
@Component
class name extends Vue {
  // xxx
}

export default name
```
