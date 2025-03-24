## pre-rendering
nextjs默认会对所有页面进行预渲染，这意味着nextjs会在构建时生成HTML文件，这样访问页面时就不需要等待服务器渲柃页面了。这样可以提高页面的加载速度。 这个也叫 hydration

nextjs有两种预渲染方式：静态生成和服务器端渲染

### 静态生成
静态生成是nextjs默认的预渲染方式，nextjs会在构建时生成HTML文件，这样访问页面时就不需要等待服务器渲染页面了。这样可以提高页面的加载速度。这个是每次请求都复用，只需要生成一次。发生在构建时
用于在用户请求前就知道页面长什么样子，比如首页，博客，产品列表等

getStaticProps allows you to tell Next.js: "Hey, this page has some data dependencies — so when you pre-render this page at build time, make sure to resolve them first!"

用法是export async function getStaticProps() { return { props: {} } }

getStaticPaths 只允许在page中被export


### 服务器端渲染
服务器端渲染是在每次请求时生成HTML文件，这样可以根据请求的参数动态生成页面。这个是每次请求都生成。发生在请求时

