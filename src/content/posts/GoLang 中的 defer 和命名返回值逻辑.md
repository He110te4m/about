---
title: "GoLang 中的 defer 和命名返回值逻辑"
description: "GoLang 常考考点之一，defer 和 return 结合使用的一些注意事项"
pubDate: 1548772799000
category: "GoLang"
---

## GoLang 特性之 defer ##

GoLang 中提供了 defer 操作，即将 defer 修饰的语句压栈，等待函数调用结束后，弹栈执行，即先 defer 的语句后执行，和栈的逻辑是一样的。需要注意的是，defer 后必须是可以调用的函数，如表达式之类的是不可以的，比如赋值操作，参考如下代码：

```
package main

import (
    "fmt"

    "database/sql"
    _ "github.com/go-sql-driver/mysql"
)

func main() {
    fmt.Println("The val in db")
}

func test() (int) {
    var val string
    db, err := sql.Open(conf.DB.Kind, fmt.Sprintf("%s:%s@tcp(%s)/%s?charset=utf8&amp;parseTime=true&amp;loc=Local", "root", "root", "localhost", "test"))
    defer db.Close()

    if !check(err) {
        return "
    }

    err = db.QueryRow("SELECT `value` FROM `defined` WHERE `key` = &#39;name&#39; LIMIT 1").Scan(&amp;val)
    if check(err) {
        return val
    } else {
        return "
    }
}

func check(err error) bool {
    if err != nil {
        panic("connect mysql error!")
        return false
    }
    return true
}
```

以上只是 defer 的简单应用，可以看到，defer 主要用于释放资源，并且跟在资源打开的语句后，不会因为遗忘而造成资源没能及时释放。

除此之外，defer 还可以跟着多行语句，如下：

```
package main

// 省略其他函数以及 include

func test() {
    // 省略数据库的  connect 等操作
    defer func () {
        // 可以添加其他代码，如往通道发送数据等等
        db.Close()
    }()
}
```

## GoLang 特性之命名返回值 ##

GoLang 中还有另一个特性，即命名返回值。GoLang 中的多返回值让很多代码得以简化，如最经典的变量交换问题，而 GoLang 中为了避免 return 时，需要 return 的变量太多（我猜的），增加了返回值命名特性，只要给返回值命名，在代码中直接 return，则函数会自动寻找函数作用域内同名的变量作为返回值，如下：

```
func test() (name string) {
    // name 已经在返回值列表中定义了，故可以直接使用，如果再定义会提示重复定义 name
    name = "Welcome to He110&#39;s Blog"
    // return 是必不可少的
    return
}
```

在多个返回值的情况下，这将大大节省 return 语句的长度，节省代码量。

## defer 与命名返回值 ##

可以看出 defer 和命名返回值都是很好用的特性，而当这两种特性混合使用时，就不是那么“好用”了，新手很容易在这里混乱，可以看如下代码：

```
func test() (count int) {
    count = 1
    defer func() {
        count++
    }()
    defer func() {
        count = 2
    }()
    return
}
```

当出现这种情况的时候，test 的返回值将会是 3，原因是：对于命名返回值变量来说，返回的时候会返回变量本身。我大致梳理下这个函数的执行过程，如下：

1. count 变量定义
2. count 赋值为 1
3. 将两个 defer 按顺序压栈
4. 遇到 return 语句，开始调用 defer
5. 根据 defer 后进先出（LIFO）开始执行 count = 2，由于 count 是在返回值列表中定义的，在此时是不会返回的，此时操作的 count 就是步骤 1 中定义的 count
6. 执行 count++ 语句，操作的 count 和步骤 5 相同
7. defer 调用完毕，此时真正结束 count 的生命期，同时结束函数的生命期，返回的是被修改后的 count

总结来说，就是 GoLang 中的命名返回值的生命期并不是在 return 的时候就结束了，而是在所有 defer 调用完毕后才结束，并且命名返回值返回的时候，是将本身返回。

## defer 与普通函数返回值 ##

接受了上述理论后，可以再看看如下例子，使用 defer 但是并没有使用命名返回值：

```
func test() (int) {
    var count = 1
    defer func() {
        count++
    }()
    defer func() {
        count = 2
    }()
    return count
}
```

根据上述的理论，如果返回值是命名的，肯定返回的是 3，而这个函数使用的不是命名返回值，其返回值为 1，其函数流程如下：

1. 定义 count
2. 执行 count = 1，压栈两个 defer
3. count 作为返回结果被保留起来，执行值拷贝，拷贝到另一个变量中，继续执行 defer
4. 执行两个 defer 函数，defer 修改的还是定义好的 count
5. **return 的时候返回的是步骤 3 中拷贝的值**

可以看出，命名返回值和非命名返回值返回的时候是不一样的，命名返回值返回变量本身，而非命名返回值返回的是变量的拷贝

## 总结 ##

GoLang 中的语法都有内在的逻辑，理清楚执行流程和逻辑，其实并不会混乱。
