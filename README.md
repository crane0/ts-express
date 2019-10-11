# 项目介绍

这是 [ts_react_app项目的redux版本](https://github.com/crane0/ts_react_app/tree/redux-version) 的服务端开发环境，

## 38，搭建服务端环境

对员工管理页面，员工查询，新增员工，编辑员工信息，删除员工，员工信息列表的导出，这些看代码自行完成。

目前使用的数据，都是基于本地的，现在实现一个真实的 API Server，为应用提供数据。

分为3节，

1. 搭建基于 ts 的服务端开发环境，
2. 实现数据库操作，为应用提供增删改查功能，
3. 实现文件的下载功能，为应用实现员工列表的导出。

### 1，服务端环境搭建

1. 安装依赖，

全局安装 express 的应用生成器
```
npm i -g express-generator
```

2. 用 express 生成应用，
```
express ts-express  // 应用名称
```

进入 `ts-express ` 目录，运行 `npm i`

3. 改造为 ts 项目，

现在运行 `npm start`，程序就可以启动了。

但本项目是基于 ts 开发的，与一般的 node 工程有所区别，需要进行一些改造。

```
// 安装 ts 
npm i typescript -D

// 生成配置文件
tsc --init
```

将应用中所有的 js 文件，重命名为 ts 文件