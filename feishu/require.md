## require处理顺序

1. 如果是内置模块，则
    a. 返回该模块
    b. 不再继续执行

2. 如果以 `./` 或 `../` 开头，则
    a. 根据所在父模块，确定X的绝对路径
    b. 将X当成文件，依次查找下面文件，只要其中有一个存在，就返回该文件，不再继续执行
        - X
        - X.js
        - X.json
        - X.node

    c. 当成目录，依次查找下面的文件，只要其中有一个存在，就返回该文件，不再继续执行
        - X/package.json(main字段)
        - X/index.js
        - X/index.json
        - X/index.node

3. 如果不带路径
    a. 根据X所在的父模块，确定X可能的安装目录
    b. 依次在每个目录中，将X当成文件名或者目录名加载

4. 抛出 "not found" 错误

模块实例的requrie方法
1. Module._load就两个关键步骤
    a. Module._resolveFilename() ：确定模块的绝对路径
    b. module.load()：加载模块


模块的加载实质上就是，注入exports、require、module三个全局变量，然后执行模块的源码，然后将模块的 exports 变量的值输出。
module._compile 方法用于模块的编译。