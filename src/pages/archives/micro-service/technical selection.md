---
title: Vite 微前端技术选型
series:
  title: Vite 微前端实践
  order: 1
description: ""
createdAt: 2023/6/30 15:42:24
updatedAt: 2023/6/30 15:42:24
category: Front End
tags:
  - micro-service
  - vite
---
## 微前端简介

微前端的基本概念网上非常多，所以就不过多提及了。

这里主要明确一下微前端的两个主要目的，微前端不论技术如何演进，最终的目的都离不开这两者：

- 隔离：样式隔离、技术栈隔离、 JS 运行环境隔离 等等。
- 共享：组件共享、逻辑共享、页面共享 等等。

目前的工具基本都有偏向，如：

- iframe 是典型的重隔离轻共享，共享需要通过 UMD 的方式来复用。
- module federation 是典型的轻隔离重共享，基本没有隔离措施，需要业务侧自行处理。

所以有时候，会同时使用多种微前端技术，来达成不同的目的。

## 技术选型

简单提一下部分技术栈的原理跟对应工具的具体实现方式，毕竟：

- 了解原理才能更好的明确技术适用场景。
- 了解具体实现才能知道具体细节是否能够被支持，又或者需要如何让其支持。

### iframe

iframe 作为 W3C 原生支持的嵌入技术，应该不需要过多介绍原理了，可以直接查看 [MDN iframe](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe)。

最大的好处在于隔离：

- 性能好，使用门槛低（原生支持）。
- 适用场景广（啥都能隔离，包括 CSS 、 JS 乃至 DOM 事件、 worker 等都能隔离）。
- 构建工具无关（不需要考虑服务的构建工具、构建产物差异， dev 时也不需要单独考虑热更新兼容问题）。

用于嵌入屎山代码的话，是一款相当优秀的技术。

但是由于其：

- 通信方式老旧（来回发事件，可读性较差，也缺少对应的类型）
- 共享代码时较为繁琐（需要构建一个 UMD 版本，子应用通过 window 读取依赖包）

在侧重共享、通信的场景下还是选用较少，或者使用其他工具来辅助，如 [tRPC](https://trpc.io) 。

### module federation

module federation 是 webpack5 中的一大亮点，通过将共享代码作为 entry 单独构建的形式进行复用，详细概念可以参考 [webpack module federation](https://webpack.js.org/concepts/module-federation) 。

用一个更加通俗的例子来解释module federation 的原理，那就是组件库。

本质上组件库是将可复用的代码构建后给业务复用，而module federation 也是类似的，将需要共享的内容作为入口构建，给业务复用，差异在于：

- module federation 需要支持 dev 场景，即热更新、运行时转发到对应的模块内等等。
- module federation 需要远程加载进来，而非直接安装 npm 包后构建时直接输出到构建产物中。

模块联邦的优势在于共享，即全局同一个 window ，同一个 dom / cssom ，所以复用依赖包的方式就很多了，比如声明为 external 使用 importmap 指向同一文件，比如 UMD 模块，比如 service worker 共享 cache 等等。

相对应的，模块联邦也很容易出现污染，比如事件未销毁、样式污染等等。而一旦出现了，就是偶现问题了，加载与不加载对应的模块会影响是否出现污染，或者与加载次数有关，较难排查，需要利用工具记录操作日志或者提前检查。

### 结论

由于实际的应用场景更侧重共享，所以最终还是选择了使用模块联邦。

构建工具需要使用 vite 而非 webpack ，原因如下：

- 减少项目的改造成本。
- vue 社区未来很长一段时间的发展基本都会绑定在 vite 上，如果不能支持 vite 将会与 vue 社区脱钩，发展滞后。

## 工具选择

根据 vite 官方提供的 [`awesome-vite`](https://github.com/vitejs/awesome-vite#plugins)，以及 [对微前端 feature 的回复](https://github.com/vitejs/vite/issues/6749#issuecomment-1029295158) 来看，首推的是 [`@originjs/vite-plugin-federation`](https://github.com/originjs/vite-plugin-federation)。

而根据 [webpack module federation 作者](https://github.com/ScriptedAlchemy) 的 GitHub 首页来看，还有另一个选择： [`@module-federation 组织`](https://github.com/module-federation) 维护的 [`@module-federation/vite`](https://github.com/module-federation/vite)。

### [`@originjs/vite-plugin-federation`](https://github.com/originjs/vite-plugin-federation) 插件

[`@originjs/vite-plugin-federation`](https://github.com/originjs/vite-plugin-federation) 的 issue 相当活跃，得益于此，可以很快发现这个工具的局限性，对于实际场景来说基本是灾难性的缺陷：

- [无法使用包括 Vue `composition-api` 、 React `useEffect` 等使用了文件单例的功能](https://github.com/originjs/vite-plugin-federation/issues/248)
- [消费方需要提供生产方 shared 的所有依赖](https://github.com/originjs/vite-plugin-federation/issues/251)
- [影响最终构建产物，导致 chunk 异常](https://github.com/originjs/vite-plugin-federation/issues/246)
- [需要先 build 再启动 preview ，不能使用 dev 也就不能热更新](https://github.com/originjs/vite-plugin-federation/discussions/264#discussioncomment-4010315)
- [vue 响应性丢失](https://github.com/originjs/vite-plugin-federation/issues/334)

由于这些 bug 的存在，出于功能适配度、开发体验、使用成本等维度，基本无法选择此方案了。

深入分析这些 issue 的根因，大都源自耦合：插件的功能过于依赖 vite ，而 vite 是一个运行时 bundless 的工具，也就意味着， vite 的 dev 与 prod 是完全不同的形态，很难无法在 dev 阶段处理 build 的工作，同时由于其预置了大量的配置，使得插件在处理构建过程时，对整体构建的控制能力较差（需要重新覆盖预配置，部分配置还无法覆盖，如 [`outDir`](https://github.com/vitejs/vite/issues/11096) ）

因此，它并适合充当 module federation 构建器，从底层的场景适配就不能满足。

由于使用了 bundless ，很多 expose 是无法在 dev 时获取到的，需要通过 build 获取，除了引发了很多运行时 bug 之外，本身的开发体验也并不足够友好。

所以，我们需要一个跟构建工具解耦的、能独立工作的构建器来打包 module federation expose 的代码。

通过与构建工具解耦的形式来减少大部分的问题。

### [`@module-federation/vite`](https://github.com/module-federation/vite) 插件

[`@module-federation/vite`](https://github.com/module-federation/vite) 就是跟构建工具解耦的，能够独立进行 module federation 构建的工具。

底层是脱胎于 [`@angular-architects/native-federation`](https://www.npmjs.com/package/@angular-architects/native-federation) 封装的 [`@softarc/native-federation`](https://www.npmjs.com/package/@softarc/native-federation)

通过 [ES Build 适配器](https://www.npmjs.com/package/@softarc/native-federation-esbuild) 嵌入构建工具 esbuild ，实际在构建 module federation 时使用的是 esbuild 而非 vite。

所以，显而易见，此方案也有问题，需要将对应的插件提供一个 esbuild 的兼容版本。

对于这一点，可以借助 [UNplugin](https://github.com/unjs/unplugin) ，通过与 vite 相似的 API 来迁移插件，同时支持 vite 与 esbuild 。

如果有时间也可以参考 [ES Build 适配器](https://www.npmjs.com/package/@softarc/native-federation-esbuild) 构建一个 vite/rollup 的适配器。

## `@module-federation/vite` 工作流程

整个工作流程需要结合模块联邦的原理来看，分为 dev 与 prod 两种模式，工作流程并不相同。

### prod 模式

#### build 阶段

此阶段主要进行多入口构建，同时将依赖包作为

1. vite 正常进行构建流程
2. `@module-federation/vite` 进行依赖收集，包括 shared libs 、 exposes 等
3. 将 shared libs 与 exposes 分别作为入口，开始构建成单文件，将 shared libs 作为 externals 传入构建器中处理，同时将相关信息如：名称、版本、文件名等等收集到清单中
4. 构建完成后，将清单中的内容输出到 `remoteEntry.json` 中

#### server / preview 阶段

1. 项目通过 `initFederation` 函数初始化 `remoteEntry.json` ，包括：
   1. 注册依赖库的 importmap
   2. 初始化 remote 及其 `remoteEntry.json`
2. 进入应用初始化逻辑，如初始化 Vue 等
3. 加载共享依赖库
   > 依赖库通过 [importmap](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) 匹配依赖库地址，指向 build 阶段单独构建的 shared libs 文件。
   >
   > 由于项目中使用的 importmap 的存在，共享的依赖库将会指向同一个 url 地址。
   >
   > 所以能保证依赖库共享且只被执行一次。
4. 应用内通过 `loadRemoteModule` 加载远程模块
5. 查找对应的服务是否已经初始化，若未初始化则会自动初始化
6. 查找对应的服务是否有匹配的 expose ，若无则报错，若有则获取内容（通过 http 请求获取）并返回

### dev 模式

#### shared lib 预构建

1. vite 正常进行构建流程
2. `@module-federation/vite` 进行依赖收集，只收集 shared libs 等
3. 将 shared libs 作为入口，开始构建成单文件，将 shared libs 作为 externals 传入构建器中处理，同时将相关信息如：名称、版本、文件名等等收集到清单中
4. 构建完成后，将清单中的内容输出到 `remoteEntry.json` 中

#### exposes 转发

由于 dev 下并没有对 exposes 进行构建，所以当请求到其他服务的 exposes 时，会转发到对应服务的 vite server 上获取内容，同时连接上对应的 websocket。

也就意味着， exposes 的内容是可以支持热更新的。
