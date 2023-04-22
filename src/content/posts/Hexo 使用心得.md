---
title: "Hexo 使用心得"
description: "Hexo 从入门到放弃"
pubDate: 1486106867000
category: "前端开发"
---

# 一. Hexo 是什么

Hexo 是一款基于 Node.js 的全静态开源可扩展的博客程序(我是这么理解的)，官方解释请查看：[Hexo 官方网站](https://hexo.io/zh-cn/docs/)，值得一提的是，这款令我眼前一亮的博客程序来自于台湾，所以就语言支持而已，对中文的友好程度还是不错的，如果觉得查阅官方文档太烦的话可以看作者自己的总结：

> -   超快速度 Node.js 所带来的超快生成速度，让上百个页面在几秒内瞬间完成渲染。
> -   支持 Markdown Hexo 支持 GitHub Flavored Markdown 的所有功能，甚至可以整合 Octopress 的大多数插件。
> -   一键部署 只需一条指令即可部署到 GitHub Pages, Heroku 或其他网站。
> -   丰富的插件 Hexo 拥有强大的插件系统，安装插件可以让 Hexo 支持 Jade, CoffeeScript。

# 二. 环境安装

通过查阅官方文档，可以发现 Hexo 需要 Node.js 支持，果断安装 Node.js，这个倒是没什么难度，一路 Next 即可

除此之外最好再安装一个 Linux shell 的虚拟环境，最简单的就是 Git，相关资料 Google 有很多了，包括文档、图文、视频等多种形式

# 三. 安装 Hexo

查看官方文档可以看到，安装 Hexo 时可以使用 `npm install hexo-cli -g`

## 1. npm 速度太慢

npm 实际上是在国外的服务器上下载东西，所以慢是肯定的，解决方法如下：

-   翻墙。这是最简单的思路，既然是国外的速度慢那就翻墙
-   使用国内 npm 镜像。可以在 [这里](https://npm.taobao.org/) 获取 Node.js 镜像列表，建立镜像可以参考 [这个项目](https://github.com/cnpm/cnpmjs.org)。关于使用 npm 镜像主要有以下三种方法，我使用的是第一种

> -   使用命令：`npm --registry https://registry.npm.taobao.org info underscor`
> -   通过 config 命令：
>
> 1.  `npm config set registry https://registry.npm.taobao.org`
> 2.  `npm info underscore` (如果上面配置正确这个命令会有字符串 response)
>
> -   搜索 .npmrc 文件，加入下面内容：`registry = https://registry.npm.taobao.org`

## 2. 安装 Hexo 时的大坑

安装 Hexo 时，有一个大坑，Hexo 安装后如果出现什么问题一定要用 **命令卸载**(`npm uninstall hexo-cli -g`)，千万不要直接删除，因为直接删除会卸载不干净，无法安装新的 Hexo，也就是说，更新也是需要先卸载当前版本再重新安装。

## 3. Hexo 大坑解决方法

如果真的不小心删除了，也不用紧张，就算你重装 Node.js 也没办法再次安装，必须先 **安装相关依赖包**(`npm install`)，可以理解为类似于头文件、dll 库一类的东西，在重装之前必须先 **删除 node_modules 文件夹**，该文件夹是存放 Node.js 依赖包的，直接删除后重新安装即可

## 4. 关于安装 Hexo 的其他说明

按照命令，安装完成后并没有完全安装 Hexo，因为这只是安装了一个程序而已，需要部署到指定文件夹，并且新版的 Hexo 精简了很多插件，包括部署到 Git 的插件，都精简掉了，所以需要重新安装

# 四. 部署 Hexo

## 1. 部署 Hexo 到指定文件夹

在 命令行 或者 Git Bash 中切换到需要放置博客程序的文件夹中，使用命令 `Hexo init` 即可

## 2. 为 Hexo 添加依赖和插件

使用命令 `npm install`，npm 会自动检测你的程序需要的依赖和插件并为你安装，只需要等待安装完成即可

# 五. 查看 Hexo

Hexo 官方提供了一系列的命令：

-   `hexo generate` (生成 public 文件夹，也就是生成的博客存放的地方)
-   `hexo server` (启动本地服务器，启动后可以在 localhost:4000 查看网站)
-   `hexo deploy` (部署网站，可以将网站部署到 Github pages 之类的地方， **必须要生成 public 文件夹后才能部署**)
-   `hexo clean` (清理生成好的博客页面，也就是删除 public 文件夹和一些数据)
-   `hexo g` (`hexo generate` 命令的简写)
-   `hexo s` (`hexo server` 命令的简写)
-   `hexo d` (`hexo deploy` 命令的简写)
-   `hexo s -g` (等价于 `hexo generate` + `hexo server` 命令，不会生成 public 文件夹)
-   `hexo d -g` (等价于 `hexo generate` + `hexo deploy` 命令，会生成 public 文件夹)

# 六. 部署 Hexo 到 Github Pages

首先得先注册了 Github 并开通一个仓库，仓库名为：`Github 用户名.github.io`，如果是其他项目也能使用 Github Pages 服务，但是不能放在 master 分支，故而暂且不提，然后将 Hexo 博客所在文件夹 (例如：D:\\Blog) 与该仓库关联，具体就是设置远程连接那一套，网上有很多图文教程、视频教程，如果不懂可以参考，要是还不懂，建议使用 csdn 博客、新浪博客 等

之后就是为 Hexo 添加 Github Pages 关联了，在 Hexo 博客所在文件夹 (例如：D:\\Blog) 里找到 \_config.yml，搜索 Deployment，修改成下面这样

```yaml
# Deployment
## Docs: https://hexo.io/docs/deployment.html
deploy:
    type: git
    repo: git@github.com:He110te4m/He110te4m.github.io.git
    branch: master
```

其中 type 字段是表示上传的方式是 Git，repo 则是指向仓库的 ssh 地址，branch 是仓库的分支名

这些完成后还不能部署到 Github Pages，因为新版的 Hexo 不集成 Git 部署插件，所以需要我们自己安装插件，方法很简单，使用命令 `npm install hexo-deployer-git --save` 即可

全部完成后可以使用命令 `hexo d -g` 完成上传到 Github Pages

# 七. 为 Hexo 绑定独立域名

博客搭建好后，我们可以通过之前设置好的 GitHub 仓库地址来访问，比如我的：`http://he110te4m.github.io`，而且 GitHub 是免费替我们托管的的，如果我们想要设置自己的专属的域名，我们可以去阿里云购买域名，我们点击添加记录，设置主机记录为 **@**，类型为 **CNAME**，到`he110te4m.github.io`(固定值)，最后需要在 Hexo 所在文件夹下的 `source` 文件夹中创建新的文件，命名为 `CNAME`，在里面输入你的域名即可

# 八. 为 Github Pages 添加 SSL 支持

CloudFlare 提供了免费的 SSL 服务，我使用的就是 CloudFlare 的 SSL

## 1. 主要步骤

1. 注册 CloudFlare，添加个人网站，获取 CLoudFlare 提供的 NS 服务器地址(即 NameServers)
2. 修改自己的域名提供商，把站点的 NS 服务器修改为 CloudFlare 提供的 NS 服务器
3. 等待 CloudFlare 添加的网站为激活状态，使用 https 打开个人网站
4. 修改网站模版，使 http 自动跳转到 https

## 2. 详细步骤

### 1). 注册 CloudFlare

注册按流程走，注册完按照提示 `Add Websites`，然后输入自定义域名，点击 `Begin Scan`
![Begin Scan](https://raw.githubusercontent.com/He110te4m/img/master/hexo%E5%BF%83%E5%BE%97/1.jpg)
到达最后一步，会提示把自己网站的域名 NS 服务器 更换为：

```html
charles.ns.cloudflare.com ivy.ns.cloudflare.com
```

![Change NameServers](https://raw.githubusercontent.com/He110te4m/img/master/hexo%E5%BF%83%E5%BE%97/2.jpg)

### 2). 修改域名提供商的 Nameservers

本站使用的是万网的域名，在域名管理中点击需要修改的域名，进入如图界面后修改
![修改万网域名 NS 服务器](https://raw.githubusercontent.com/He110te4m/img/master/hexo%E5%BF%83%E5%BE%97/3.jpg)

### 3). 等待 CloudFlare 确认

接下来就是等待 CloudFlare 确认了，一般这个过程是几分钟至十几分钟即可完成激活
![激活完成](https://raw.githubusercontent.com/He110te4m/img/master/hexo%E5%BF%83%E5%BE%97/4.jpg)

### 4). 修改网站模板强制 HTTPS

在网站首页添加如下 HTML 代码：

```html
<script type="text/javascript">
    var host = 'yoursite.com';
    if (host == window.location.host && window.location.protocol != 'https:') window.location.protocol = 'https';
</script>
```

即可完成强制跳转，一般首页是在主题文件夹的 \_layout.swig 文件中，不知道位置可以直接搜索，慢慢尝试
