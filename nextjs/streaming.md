## streaming
1. 通过streaming来讲一个route拆成更小的chunks，然后渐进式的来从服务器渲染到客户端。streaming的好处是可以更快的让用户看到页面的内容，提升用户体验。它允许用户与部分页面进行观看和交互

2. streaming的实现是通过`ReadableStream`来实现的。`ReadableStream`是一个内置的Web API，它允许我们创建一个可读流，并通过它来逐步发送数据到客户端。我们可以使用`ReadableStream`来将数据分成多个块，然后逐个发送到客户端。

3. nextjs中，实现stream主要通过suspense
    + At the page level, with the loading.tsx file (which creates <Suspense> for you).
    + At the component level, with <Suspense> for more granular control.

## route groups
1. 使用圆括号来创建一个路由组。路由组的名称不会出现在URL中。路由组可以帮助我们组织路由结构，避免在URL中出现多余的部分。也可以用了控制优先级（比如loading之类的）