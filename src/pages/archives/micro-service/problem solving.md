---
title: 排障指南
series: Vite 微前端实践
description: ""
createdAt: 2023/6/30 15:42:27
updatedAt: 2023/6/30 15:42:27
category: Front End
tags:
  - micro-service
  - vite
---
## 必备知识

### exposes 需要被多个构建器处理

从 [`@module-federation/vite` 插件工作原理](/archives/micro-service/technical_selection) 可以看到： shared libs 均由 adapter 中的构建器处理，如 esbuild 。

而 exposes 在 dev 时是 vite server 转发的，所以是通过 vite 处理，而非 adapter 中的构建器处理，只有在构建时才会通过 esbuild 处理。

所以在验证场景时，需要分别验证 dev 场景与 build 场景。

### 配置了 shared 不代表依赖库就会共享成功

由于 vite alias 的存在，如果在启动服务时，还针对依赖库开启 alias （包括 tsconfig 中的 alias 或者 vite 中的 alias ），都会导致依赖库指向不同文件，部分依赖库会共享失败，如： `@vue/composition-api` 等。

共享失败的原因是：

依赖库在文件中通过 IIFE 的形式定义了全局的 Symbol 常量，多个依赖库中的 Symbol 值不同，所以导致各种问题，如依赖库报错、响应性丢失等等。

### 导入的模块名

共享依赖库会在 `@module-federation/vite` 插件中添加为 external ，而此时 vite 会将其解析为 `/base/${moduleName}` 的形式，在插件中 [进行 transform 替换](https://github.com/module-federation/vite/blob/main/src/dev-externals-mixin.ts#L22) 导入的模块名。

### 导入文件的 url 地址

由于依赖库加载依赖于 [importmap](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) 特性，该特性的浏览器兼容性较差，低版本不能很好的兼容。

在 [native-federation](https://github.com/angular-architects/module-federation-plugin/tree/main/libs/native-federation-core) 内部[集成了 es-module-shim 依赖](https://github.com/angular-architects/module-federation-plugin/blob/main/libs/native-federation-core/README.md?plain=1#L308) ，需要通过 [es-module-shim](https://github.com/guybedford/es-module-shims) 兼容 importmap 特性。

对应的导入文件 url 是在 [es-module-shim 中解析处理](https://github.com/guybedford/es-module-shims/blob/main/src/resolve.js) 的。

同时，考虑到直接使用 `new URL` 的性能问题，所以解析地址时是 es-module-shim 自行分词解析的，也就意味着，有可能存在场景未覆盖导致的解析 url 异常，导致最终请求的地址错误。

## 排障指南

## 示例
