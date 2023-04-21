---
title: "Ubuntu16 中的 MySQL 默认编码修改"
description: "一. 缘由\r\n使用 MySQL 插入中文数据时提示出现了 1366 错误，查询官方文档后发现是 Mysql 的配置问题，使用 apt 安装的时候默认编码是不支持中文的，所以需要修改为 GBK 或者是 UTF8\r\n\r\n二. 本文阅读基础\r\n基本能够使用 VIM 编辑文档 (文末也有相关知识)\r\n安装 LAMP 开发环境"
pubDate: 1488871044000
category: "PHP"
---

# 一. 缘由

使用 MySQL 插入中文数据时提示出现了 1366 错误，查询官方文档后发现是 Mysql 的配置问题，使用 apt 安装的时候默认编码是不支持中文的，所以需要修改为 GBK 或者是 UTF8

# 二. 本文阅读基础

-   基本能够使用 VIM 编辑文档 (文末也有相关知识)
-   安装 LAMP 开发环境

# 三. 尝试

-   使用 `charset utf8` 尝试修改编码，但是失败了
-   修改变量编码为 UTF8，成功，但是是临时的，重新打开 shell 就失效了
-   使用命令 `show full columns from table_name;` 查看表内的字段编码状态，可以使用 `` 修改，但是需要一个个修改，但是很麻烦

# 四. 解决方案

首先寻找 MySQL 的配置文件，我是使用 `sudo` 命令安装的 (详见本站博文：LAMP 环境搭建)，故而我的 MySQL 配置文件在 `/etc/mysql/` 文件夹中，查阅官方文档和网上的资料可以了解其配置文件就是 `my.cnf`，使用 `VIM` 神器对该文件进行修改：`sudo vi /etc/mysql/my.cnf`，可以看到其配置文件引用了其他文件夹的配置文件：
![引用外部配置文件](https://raw.githubusercontent.com/He110te4m/img/master/mysql-charset/1.png)
根据文件夹可以知道我们要找的文件应该在 `mysql.conf.d` 中，打开后发现有两个文件：`mysqld.cnf` 和 `mysqld_safe_syslog.cnf`，目测第一个是我们要找的，第二个是和安全有关的配置，依旧使用 `VIM` 大法，打开 `mysqld.cnf`：`sudo vi /etc/mysql/mysql.conf.d/mysqld.cnf`，在 `skip-external-locking` 语句后面另起一行，添加服务器默认编码设置：`character-set-server=utf8`，保存
![修改服务器配置](https://raw.githubusercontent.com/He110te4m/img/master/mysql-charset/2.png)
修改完服务器配置还不行，还是会报 1366 错误，需要修改客户端字符编码设置，切换到文件夹：`/etc/mysql/conf.d/`，同样有两个文件：`mysql.cnf` 和 `mysqldump.cnf`，打开 `mysql.cnf`，添加以下语句：`default-character-set=utf8`，保存即可
![修改客户端配置](https://raw.githubusercontent.com/He110te4m/img/master/mysql-charset/3.png)
最后就是重启 MySQL 了，使用命令：`sudo service mysql restart`，接下来进入 MySQL，使用 `\\s` 查询默认编码，如果看到以下提示证明配置成功，已经可以使用中文了
![MySQL编码配置](https://raw.githubusercontent.com/He110te4m/img/master/mysql-charset/4.png)

# 五. VIM 基本操作

VIM 默认有两种模式，一种是 _Normal_ 模式，也是使用 VIM 打开文档默认进入的模式，另一种是 `Insert` 模式，在 `Normal` 模式中按下 `i` 即可进入，此时才能对文档进行编辑，进入 `Insert` 模式有一个标志，就是左下角会显示 `insert` 字样，接下来提供基本操作需要的一些指令：

```
i → Insert 模式，按 ESC 回到 Normal 模式.
x → 删除当前光标所在的字符。
:wq → 存盘 + 退出 (:w 存盘, :q 退出)，w 后面可以加文件名表示另存为...
dd → 剪切当前光标所在行
p → 粘贴剪贴板
:help <command> → 显示相关命令的帮助。你也可以就输入 :help，退出帮助需要输入:q
hjkl 对应着光标键(←↓↑→)，和光标键一样都是用来移动光标的
```

掌握了上述指令，基本的文档编辑就不成问题了
