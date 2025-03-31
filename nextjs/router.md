1. pages/posts/[...id].js matches /posts/a, but also /posts/a/b, /posts/a/b/c and so on.
2. Use `getStaticPaths` to fetch an array of product IDs and use `getStaticProps` to fetch data for each product.

3. 区别
	+ getStaticProps 是用来获取页面数据的函数，它在构建时执行，适用于所有页面。
	+ getStaticPaths 仅用于动态路由，它告诉 Next.js 在构建时需要生成哪些路径的静态页面。（返回一个包含动态路由参数的对象，Next.js 根据这些参数生成静态页面。paths 是一个数组，每个元素表示一个路径参数，params 对象中的键对应动态路由中的参数。）

4. getStaticPaths在开发时，每次request都会执行，而在生产时只在构建执行
5. 如果fallback is false， 则getStaticPaths返回的路径以外的路径会404
6. 如果fallback is true， 构建时未生成的路径不会直接返回 404 页面。相反，Next.js 在首次请求这些路径时，会提供一个**“fallback”（备用）版本的页面。与此同时，Next.js 会在后台静态生成**该路径的页面。对于后续对相同路径的请求，Next.js 将提供已生成的页面，就像构建时预渲染的其他页面一样。
7. 如果fallback是blocking， Next.js 会在请求时生成页面（getStaticProps），然后缓存该页面以供后续请求使用。所以每个路径只发生一次，因为已经有缓存
8. getStaticPaths and getStaticProps只在服务端运行