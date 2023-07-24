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

从 [`@module-federation/vite` 插件工作原理](https://me.he110.site/archives/micro-service/technical_selection) 可以看到： shared libs 均由 adapter 中的构建器处理，如 esbuild 。

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

## 常见问题

### remote 中的样式与 host 中加载的 remote 样式不一致

#### 查看依赖关系

由于 remote 导出时需要走构建，所以需要有对应的 import 才能声明关系，构建时才会一起导出。

所以可以先查看 remote 中的样式是否通过全局注入，如果是全局注入需要修改，只需要让构建工具能够标识到依赖即可，备选方案如下：

- 编码 import 语句，声明依赖关系（推荐）。
- 所有服务中共享全局注入逻辑。
- 插件中处理，为每次构建都添加对应的模块导出。

#### 查看网络请求

在构建时会修改静态资源路径，由于微服务构建后的 `host` 、 `baseUrl` 等都不尽相同，可能在构建后的静态资源路径解析异常，导致资源加载失败，参见下文 [静态资源 url 解析错误](#静态资源-url-解析错误) 章节。

#### 导入语句构建后消失

由于 remote 构建是使用 adapter 构建（目前只有 esbuild 的 adapter ，可以直接等同于用 esbuild 构建）的，所以需要查看 esbuild 的构建是如何处理对应的导入的。

可以使用 [`ESBuild Playground`](https://esbuild.github.io/try/#YgAwLjE4LjE2AHsKICBtaW5pZnk6IHRydWUsCiAgYnVuZGxlOiB0cnVlLAogIG91dGZpbGU6ICdvdXQuanMnLAogIGZvcm1hdDogJ2VzbScsCn0AZQBlbnRyeS50cwBjb25zdCBDb21wb25lbnQgPSB7fQoKZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50CgppbXBvcnQgJy4vdGVzdC5jc3MnAAB0ZXN0LmNzcwAuYSB7CiAgY29sb3I6IHJlZDsKfQ) 尝试复现，如果 esbuild 中无法解析模块，则需要使用插件将资源转为 esbuild 能够识别的模块，如： [issue: 支持 `inline css`](https://github.com/evanw/esbuild/issues/3109) 。

### 第三方库加载失败，提示 `Uncaught (in promise) SyntaxError: The requested module 'blob:http://${host}/${uuid}' does not provide an export named '${varName}'`

#### 查看第三方包中是否含有对应的 export

部分第三方包是 esm 的，没有总入口，或者提供的入口是不完整的。

根据 [`@module-federation/vite` 插件工作原理](https://me.he110.site/archives/micro-service/technical_selection) ，工具会对第三方包入口进行构建（ `package.json` 中的 `main` 等字段）。

在构建工具构建过程中，针对非入口模块的导入导出会转换为其他语法，如： `__export()` 、 `__reExport()` 、 `defineProperties` 等方式，所以只在内部模块中导出，而入口文件没有导出的情况下，构建后直接使用入口访问是获取不到对应的 `export` 内容的。

这也就导致了构建后，找不到 `export named` 报错。

#### shared libs 配置错误

大部分情况下，报错的依赖库都是共享的库。

可以通过 Chrome 的 Source 面板查看构建后的内容是否正确：

1. 除了 shared lib 之外没有额外的 import （部分包被声明为 peer 后构建时被忽略了，从而导致构建产物异常）。
2. 没有 import 自身（如在 `my-components` 中导入 `my-components/Button` ）。
3. 导入的非 shared libs 中，不存在文件单例（即在文件中直接定义变量作为单例，如内容为 `const foo = 'bar'; export { foo }` 的文件中， `foo` 就是文件单例）。

大部分情况下，都是上述问题导致的共享异常。

### 第三方库 url 解析错误

1. 查看 html 中注册的 importmap 与实际 network 中请求的 url 是否匹配、是否正确。
2. 如果不匹配，可能是 alias 的影响，查看 `vite.config.ts` 、 `tsconfig.json` 等配置文件中的别名配置。
3. 如果不正确，可以在修改 es-module-shim 配置，配置 [`custom resolve`](https://github.com/guybedford/es-module-shims#resolve-hook) 查看解析是否正确。
4. 如果解析 url 错误，源地址正确，到 [`es-module-shims` 仓库](https://github.com/guybedford/es-module-shims) 中提交 issue 。
5. 如果源地址错误，查看请求由哪个文件发送，文件中的 url 是否正确。

### 静态资源 url 解析错误

1. 查看静态资源 url 是否正确。
2. 如果不正确，查看请求从哪里发送（部分请求会通过 浏览器 发送，而非 es-module-shim 发送）。
3. 如果请求通过浏览器发送，需要做反向代理转发请求，或者修正资源地址为完整 url ，而非相对、绝对路径。
4. 如果请求通过 es-module-shim 发送，配置 [`custom resolve`](https://github.com/guybedford/es-module-shims#resolve-hook) 查看解析是否正确。
4. 如果解析 url 错误，源地址正确，到 [`es-module-shims` 仓库](https://github.com/guybedford/es-module-shims) 中提交 issue 。
5. 如果源地址错误，查看请求由哪个文件发送，文件中的 url 是否正确。

### 构建后 XX 功能没有生效， dev 时是正常的

1. 单独查看构建产物，确认以下清单：
   - [ ] 产物中对应功能代码是否丢失。
   - [ ] 产物运行时是否报错。
   - [ ] 产物需要是否有对应的 plugin 进行处理，如 vue 需要 `esbuild-vue` 进行处理。
   - [ ] plugin 处理后的结果是否符合预期，如 `esbuild-vue` 默认将 css 内联，导致 esbuild 不会构建 css 代码，需要手动声明 `{ extractCss: true }` 。
2. 代码丢失可参考 [remote 中的样式与 host 中加载的 remote 样式不一致](#remote-中的样式与-host-中加载的-remote-样式不一致) 排查问题。
3. 运行报错根据具体问题排查，可参考 [常见问题](#常见问题) 。
