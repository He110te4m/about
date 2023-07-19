---
title: "排障指南"
series:
  title: "Vite 微前端实践"
  order: 3
description: ""
createdAt: 1688110944938
updatedAt: 1688110944938
category: "Front End"
tags: ["micro-service", "vite"]
---
# 必备知识

## exposes 需要被多个构建器处理

从 [`@module-federation/vite` 插件工作原理](/archives/micro-service/technical_selection) 可以看到： shared libs 均由 adapter 中的构建器处理，如 esbuild 。

而 exposes 在 dev 时是 vite server 转发的，所以是通过 vite 处理，而非 adapter 中的构建器处理，只有在构建时才会通过 esbuild 处理。

所以在验证场景时，需要分别验证 dev 场景与 build 场景。

## 配置了 shared 不代表依赖库就会共享成功

由于 vite alias 的存在，如果在启动服务时，还针对依赖库开启 alias （包括 tsconfig 中的 alias 或者 vite 中的 alias ），都会导致依赖库指向不同文件，部分依赖库会共享失败，如： `@vue/composition-api` 等。

共享失败的原因是：

依赖库在文件中通过 IIFE 的形式定义了全局的 Symbol 常量，多个依赖库中的 Symbol 值不同，所以导致各种问题，如依赖库报错、响应性丢失等等。

# 排障指南

# 示例
