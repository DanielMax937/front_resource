1. auth的原理
    1. 需要客户端和服务端两个client，服务端的client需要处理cookie，服务端每次create都是一个新的实例，客服端是单例
    2. server component不能写cookie到response，所以需要在中间件里处理。而cookieStore这个是一个存储cookie的对象，让supabse知道如何读取并修改session。session通过cookie来获取权限。由于在server componet里remove或者set会抛出错误，需要catch下

    3. 邮箱验证通过server-side auth，需要在 https://supabase.com/dashboard/project/zgnjzxhqrfkyfdpvazlu/auth/templates 设置 链接成 {{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=email
    4. 根据邮件链接到达的页面，设置对应的路由
    5. 不要使用supabase.auth.getSession()，因为cookie可以被伪造，所以不安全。使用supabase.auth.getUser()，因为这个每次请求都会在发送请求到supbase服务端进行验证auth token
    6. 请注意，cookies 在任何对 Supabase 的调用之前被调用，这会使 fetch 请求不受 Next.js 缓存的影响。对于需要身份验证的数据获取，这一点非常重要，以确保用户只能访问自己的数据。
    7. 回到中间件，主要起如下作用
        + 通过getUser来刷新Auth token
        + 将刷新后的token设置到request的cookie中，这样server component不需要自己刷新token
        + 将刷新后的token设置到返回头里，供游览器使用
    8. 在中间件需要注意，不要在createServerClient和getUser跑任何代码，避免代码引入错误导致不小心的登出
    9. 返回必须返回supabase的response，不然cookie会不同步


2. 接入方式
    1. 到supabase官网初始化表
    2. 设置表后设置policy
    3. 设置policy后设置auth
    4. npx create-next-app -e with-supabase，初始化这个项目
    5. 设置环境变量NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY， 在project setting的data api
    6. 在对应的server或者client中设置好supbase的创建方式，一般是server。主要利用cookie的方式来鉴定权限

3. api和server action的区别
  [image](./screenshot-20250310-165239.png)
  
    1. 如果需要处理数据获取或支持多种 HTTP 方法（如 GET、PUT、DELETE），选择 API 路由。例如，获取初始待办事项列表或处理第三方 webhook。

    2. 如果处理用户交互如表单提交，且逻辑与组件紧密相关，选择服务器操作。例如，提交新待办事项表单，服务器操作可以直接处理插入数据库并返回结果。

    3. 对于性能关键操作，服务器操作可能更优，因其减少了单独 API 请求的开销；但对于大文件上传或需要自定义 HTTP 方法的场景，API 路由更合适。




4. app 路由和 page 路由的区别
    1. 目录结构和路由
        + 页面路由器：使用 pages 目录，每个文件对应一个路由。例如，pages/index.js 是主页。
        + 应用路由器：使用 app 目录，采用嵌套文件夹结构。例如，app/products/page.js 对应 /products 路由。这允许更灵活的路由组织。

    2. 组件渲染
        + 页面路由器：所有组件都是客户端组件。服务器端渲染通过在服务器上获取道具（props）并传递给客户端组件实现。
        + 应用路由器：引入服务器组件（Server Components），可在服务器上运行，无需客户端水合（hydration），提升性能。交互部分使用客户端组件（Client Components）。

    3. 布局管理
        + 页面路由器：布局通常通过全局 _app.js 文件或页面组件中的 getLayout() 实现。
        + 应用路由器：支持通过 layout.js 文件定义嵌套布局，提供更细粒度的控制。

    4. 数据获取
        + 页面路由器：使用 getServerSideProps 和 getStaticProps 获取数据。
        + 应用路由器：使用 fetch() 在服务器组件或路由处理程序（Route Handlers）中获取数据，利用 React 的 Suspense 提升性能。

    5. 头部管理与元数据
        + 页面路由器：使用 next/head 管理 <head> 元素。
        + 应用路由器：内置 Metadata 支持，通过 layout.js 简化并增强页面元数据控制。

    6. API 路由
        + 页面路由器：API 路由定义在 pages/api/*。
        + 应用路由器：使用 app/*/route.ts 中的路由处理程序（Route Handlers）实现服务器端功能。

    7. 性能与功能
        + 应用路由器：利用 React 18 的并发渲染和 Suspense，提供更好的性能和现代功能，适合复杂应用。
        + 页面路由器：适合现有项目或简单应用，但可能不具备最新功能。

    应用路由器是 Next.js 13 引入的推荐选择，适合新项目，而页面路由器仍受支持，适合现有或简单项目。迁移到应用路由器可利用更多现代功能，但需注意复杂性。

5. JWT
JSON Web Token（JWT）是一种数据结构，表示为字符串，通常包含用户的身份和授权信息。它编码了自身的有效期信息，并使用加密密钥进行签名，以防止篡改。

Supabase 访问令牌（Access Tokens）就是 JWT。每次请求 Supabase 服务时，都会附带 JWT。通过验证令牌并检查其中的声明（claims），可以决定是否允许访问资源。行级安全（Row Level Security，RLS）策略基于 JWT 中包含的信息进行控制。

