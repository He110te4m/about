---
title: Chrome 下 URL 重写问题
description: "一. 问题重现\r\n1. 运行环境\r\nApache 2.4\r\nPHP 5.6\r\nMySQL 5.5\r\nrewrite 扩展\r\nPDO 扩展\r\n2. 问题代码\r\nPHP 会重写到默认首页，以下是默认首页中的代码："
createdAt: 2017/8/10 14:57:10
category: PHP
tags:
  - URL rewrite
  - Chrome
---

## 一. 问题重现

### 1. 运行环境

-   Apache 2.4
-   PHP 5.6
-   MySQL 5.5
-   rewrite 扩展
-   PDO 扩展

### 2. 问题代码

PHP  会重写到默认首页，以下是默认首页中的代码：

```php
$db = new PDO('mysql:host=localhost;dbname=db;charset=utf8', 'root', 'root');
$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
$db->query('SET NAMES UTF8');
$sth = $db->prepare("INSERT INTO table (id, name) VALUES (NULL, ?)");
$sth->execute(['name']);
```

### 3. 问题详情

在执行代码的时候，本来应该是只插入一条记录的，但是在执行的时候却插入了两次，打印执行次数的时候却只执行过一次

## 二. 解决过程

### 1. 打印执行次数

在  PHP  函数中打印字符串，根据打印的次数确定执行次数，结果只执行了一次

### 2. 查询数据库日志

数据库插入语句在  MySQL  中执行了两次，而默认首页只执行了一次，所以必定是发包的问题，数据包被发送了两次

### 3. 查看控制台

发现  Chrome  发出了两个请求，其中一个是请求默认首页，另一个是请求网站  ICO  图标
由于我本机并没有  ICO  图标，所以请求  404  页面，而我的程序中并没有  404  页面，所以会重定向到了我的默认首页中，也就执行了第二次插入语句，并且由于这个页面请求时浏览器没有显示出页面，所以统计次数的时候只显示了页面请求时的字符串，所以看起来只执行了一次

## 三. 解决方法

### 1. 添加 ICO 图标

之所以会重定向到默认首页，是因为  Chrome  自动寻找  ICO  图标，查找不到文件所以才会重定向到了默认首页，故而只要添加上了  ICO  图标，即可解决

### 2. rewrite 规则屏蔽 ICO

在  rewrite  中添加屏蔽规则，不对  ICO  文件进行重写  URL，则不会触发路由规则，也就不会重定向到默认首页了

### 3. 编写 404 错误页面

存在  404  错误页面时，会显示  404  页面，故而不会跳转到默认首页

## 四. 总结

各个浏览器都有不同的特点，比如在  Firefox  上便不会出现这个问题，还是得去了解下浏览器的特性才行
