# 项目介绍

这是 [ts_react_app项目的redux版本](https://github.com/crane0/ts_react_app/tree/redux-version) 的服务端开发环境。

目前使用的数据，都是基于本地的，现在实现一个真实的 API Server，为应用提供数据。

分为3节，

1. 搭建基于 ts 的服务端开发环境，
2. 实现数据库操作，为应用提供增删改查功能，
3. 实现文件的下载功能，为应用实现员工列表的导出。

## 38，搭建服务端环境

### 1，安装依赖

全局安装 express 的应用生成器
```
npm i -g express-generator
```

2. 用 express 生成应用，
```
express ts-express  // 应用名称
```

进入 `ts-express ` 目录，运行 `npm i`

### 2，改造为 ts 项目，

1. 现在运行 `npm start`，程序就可以启动了。

但本项目是基于 ts 开发的，与一般的 node 工程有所区别，需要进行一些改造。

```
// 安装 ts 
npm i typescript -D

// 生成配置文件
tsc --init
```

2. 将应用中所有的 js 文件，重命名为 ts 文件

除了在项目目录中查找到的3个文件，一个app.js，还有 routes 下的2个文件。

还有 `bin/www` 这个文件：是该项目，即整个服务端的启动脚本。要重命名为 `server.ts`，

另外，在 `server.ts` 中，将端口号也改一下，因为在 `ts_react_app` 中 mock 的端口是 4000，所以这里 3000 --> 4001

3. 重命名后，报错修复

重命名之后，会有一些报错，有的是缺少声明文件，
```
npm i @types/node @types/express -D
```

还有一些是无法使用 ts 的类型推断，会有这样的报错：
> 参数 "xx" 隐式具有 "any" 类型

在提示报错的 ts 文件中，发现是因为使用了 `require()` 的方式导入了 express ，然后使用它的函数，

在 express 的声明文件 `node_modules/@types/express/index.d.ts` 中，可以看到代码的最后，使用的 `export =` 的方式导出，

必须用 `import =` 或 `import from` 的方式导入才可以。

所以，要将所有`require()` --> `import from` 的方式导入（不只针对 express 模块）。

并且，项目中的文件导出，`module.exports` --> `export default`

接着，又会有因为模块没有声明文件报错，要添加（-D）声明文件。

另外，在 `app.ts` 中，还是有一个函数，没有正确的类型推断，

进入声明文件查找后，发现是 ts 自己还不是很完善的原因，所以对其进行类型断言。

最后，在 `bin/server.ts` 中，还有3个报错，函数参数的报错，手动添加类型即可。

`onListening`中，因为被推断为了联合类型，而只做了一种判断，**加 ！可以去除 null 类型**
```
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr!.port;
  debug('Listening on ' + bind);
}
```

4. 编译

因为 node 是不能执行 ts 文件的，所以要将所有的 ts 文件又编译为 js 文件。

需要先指定输入目录，在 tsconfig.json 中，
```
{
  "compilerOptions": {
    "outDir": "./dist", 
  }
}
```
添加构建脚本，在 package.json 中
```
{
  "scripts": {
    "build-ts": "tsc"
  }
}
```

执行命令编译后，发现静态资源文件（public 文件夹），和模板文件（views 文件夹），并没有拷贝到 dist 中。

所以需要编写一个脚本，做拷贝工作

5. 拷贝脚本

需要shell脚本实现。
```
npm i shelljs @type/shelljs -D
```

根目录下新建 `copyStatic.ts`，编写复制命令

因为通过node执行ts文件，需要 `ts-node` 命令，
```
npm i ts-node -D
```
增加 npm 脚本，
```
{
  "scripts": {
    "copy-static": "ts-node copyStatic.ts",
    "build": "npm run build-ts && npm run copy-static"
  }
}
```
但是会发现，将 `copyStatic.ts` 也拷贝过去了。

在 tsconfig.json 中进行排除
```
{
  "exclude": [
    "copyStatic.ts"
  ]
}
```

6. 改造启动脚本
```
{
  "scripts": {
    // "start": "node ./bin/www",
    "start": "node ./dist/bin/server.js"
  }
}
```

`npm start`启动后，在浏览器打开 `localhost: 4001`，如果可以看到 express 页面，就说明本地的 API server已经启动了。

7. 添加监控模式，

因为文件更改后，需要重新构建 ts 文件，并重启服务，比较麻烦。

安装 nodemon，这样修改文件后，就不需要重启服务了。
```
npm i nodemon -D
```
添加脚本
```
{
  "scripts": {
    "watch": "nodemon ./dist/bin/server.js"
  }
}
```

这样，启动 `npm run watch`，
当更改文件后（比如修改`routes/index.ts`的 title ），还是需要重新 `npm run build`，但服务会自动重启。刷新页面就会看到效果。

以上，基于 ts 的服务端环境搭建完毕。



## 39，实现数据库操作

为了能接收客户端的请求，需要为 API Server 增加一些路由。

在 `app.ts` 中，添加了一个路由`/api/employee`，在 `routes\employee.ts`中实现子路由，

开启监听，并重新 build 之后，就可以在浏览器测试访问 `http://localhost:4001/api/employee/getEmployee`。

### 1，数据库表创建

数据库，employee_system


3个表，
- 员工列表 employee
- 部门列表 department
- 职级 level

### 2，配置数据库连接，

连接配置，`config\db.ts`

封装连接数据库的请求，`models\query.ts`，

使用的是 MySQL 的连接池进行操作，需要安装依赖
```
npm i mysql @types/mysql -D
```

### 3，连接数据库

需要改造 `routes\employee.ts`，



