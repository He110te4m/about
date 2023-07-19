---
title: "GoLang 结构体构造函数研究"
description: "参考 Rob Pike 博客的设计方法研究较为灵活的构造方式"
createdAt: 1548406522000
category: "GoLang"
tags: ["constructor", "Algorithm"]
---

## GoLang 构造函数

GoLang 是完全面向过程的，故而不存在严格意义上的构造函数，但是一般会有结构体的实例化函数，如下：

```
package main

import "fmt"

func main() {
    zs := NewPeople("张三", 18)
    fmt.Println("This is " + zs.Name)
}

type People struct {
    Name string
    Age int
}

func NewPeople(name string, age int) *People {
    return &amp;People {
        Name: name,
        Age: age,
    }
}
```

## 问题

如果这个结构体某些参数是选填的，而不是必填的，如某些新生儿还没有名字，或者婴儿是 0 岁想要简写，以及正常的名字和年龄都不为空。这个时候开发者会面临一个问题，那么就是可能需要多个构造函数（构造 Name、构造 Age、构造 Name 和 Age），但是由于 GoLang 并不支持函数重载，故而可能需要声明多个不同名字的构造函数，这相当麻烦。而笔者在 Rob Pike 的博客中看到了一种极其灵活的构造方法，可以解决这个问题，代码如下：

```
package main

import "fmt"

func main() {
    zs := NewPeople(SetName("张三"), SetAge(18))
    fmt.Println("This is " + zs.Name)
}

type People struct {
    Name string
    Age int
}

type prop func(*People)

func NewPeople(props ...prop) (*People) {
    people := new(People)
    for _, p := range props {
        p(people)
    }
    return people
}

func SetName(name string) (prop) {
    return func (p *People) {
        p.Name = name
    }
}

func SetAge(age int) (prop) {
    return func (p *People) {
        p.Age = age
    }
}
```

这种构造的优点是灵活，而且即使结构体定义修改了，构造函数也不需要修改，只需要增删对应属性的 Set 函数即可。在网上还有另一种类似的构造方法，如下：

```
package main

import "fmt"

func main() {
    zs := NewPeople().SetName("张三").SetAge(18)
    fmt.Println("This is " + zs.Name)
}

type People struct {
    Name string
    Age int
}

func NewPeople() (*People) {
    return new(People)
}

func (p *People) SetName(name string) (*People) {
    p.Name = name
    return p
}

func (p *People) SetAge(age int) (*People) {
    p.Age = age
    return p
}
```

第二种和第一种对比，有着明显的面向对象的味道，不管是面向对象还是 Set 函数，都和 Java 极其相似，和第一种方法一样，第二种即使结构体定义改变了，也不需要修改构造函数。

## 总结

就个人感受而言，我更加喜欢第一种方法，对于 GoLang 来说，这是一门完全面向过程的编程语言，强行增加面向对象的东西会有种买椟还珠的感觉，并且在 GoLang 中，函数是一等公民，灵活应用函数是 GoLang 开发的一个重点，对于第一种方法可谓是将这个概念进行到极致。
