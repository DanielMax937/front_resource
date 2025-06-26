## overview
1. 身份验证（Authentication）用于确认你的身份；权限授权（Authorization）则决定你可以访问哪些资源。
2. 如果组件在服务端运行（比如page），并且你想使用 cookies()、headers()、或解析 searchParams 来获取 URL 参数，而且这个过程是 异步的，那么需要使用 React.lazy() + <Suspense> 或用 async 函数组合 use()。
3. next-auth 是一个用于 Next.js 的身份验证库，提供了多种身份验证方式（如 OAuth、Email、Credentials 等），并且支持会话管理。
4. 在authConfig中配置
   - providers: 定义身份验证提供者（如 Google、GitHub 等）。
   - callbacks: 定义回调函数，如 session、jwt 等。
   - pages: 自定义登录、注册等页面。
   - events: 监听身份验证事件。
5. NextAuth导出auth，signIn、signOut、useSession等方法。其中auth用于middleware中