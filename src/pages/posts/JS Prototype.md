---
title: 原型继承及其衍生的问题
description: 原型继承是 ES6 以前实现继承的方式之一，但是其衍生出来的问题，可谓是不少，本文以一道面试题为引，引出 JS 内部的一些机制
createdAt: 2019/3/20 23:33:46
category: Front end
tags:
  - Prototype
  - ES6
---

## 面试题 ###

本文将以一道面试题引出，题目如下：

```js
// 父类
function A(name) {
  this.name = name || 'Tom'
}

// 子类
function B() {

}

// 原型继承
B.prototype = new A()
```

这是很标准的原型继承方式，而题目的问题就是，如果将 `B.prototype = new A()` 改成 `B.prototype = A`，那么 `new B()` 会发生什么？

## 问题分析 ##

想要知道答案，首先需要分析，改动前后，什么变了。

很明显，是少了一个 `new`，那么，想要知道 `new B()` 会发生什么，就得看看 `new` 到底做了什么

## new 做了什么  ##

以 `new B()` 为例

```js
// 第一步，创建一个空 Object
var obj = {}

// 第二步，将构造函数原型链赋予 obj
obj.__proto__ = B.prototype

// 第三步，修改 this 指针
var res = B.call(obj)
```

根据这几部，我们可以跟踪出 `new B()` 之后的返回值是什么

```js
// 第一步，创建空 Object
var obj = {}

// 第二步，修改原型
obj.__proto__ = B.prototype // 即 obj.__proto__ = A

// 第三步，修改 this 指针
var res = B.call(obj) // res 还是空的 Object
```

结论出来了，`new B()` 之后，结果将是空对象

## 衍生问题 ##

既然 `new B()` 之后出现的是空对象，那么，还能不能访问到父类的对象呢？我们可以做个试验

```
var obj = new B()
console.log(obj)       // {}
console.log(obj.name)  // A
```

是不是觉得很奇怪，为什么出现的，既不是默认的 Tom，也不是 `undefined`，反而是父构造函数的函数名 A

其实问题的答案涉及到两个方面：

1. 当访问对象的属性不存在时，会查找其原型链上是否有该属性，如果不存在，则往原型链的原型链上找，递归下去
2. `Function` 的原型链上，存在一个属性 `name`，其值为 function 的函数名

结案了，根据上面的第一点，`obj.name` 调用的，其实是其是 `A.name`，根据上面第二点，`A.name` 的值，就是 A

## 总结 ##

JavaScript 是一门看似简单，实则玄妙的语言，深究下去，还是有很多值得发掘的东西，尤其是涉及到原型和继承，更是复杂。
