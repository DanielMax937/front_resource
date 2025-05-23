## server action
1. 在nextjs中 server action会创建一个 post 的请求，所以不需要单独创建Server API
2. next在客户端路由中存储了缓存，这样来确保用户在调整时可以快速看到内容，如果想更新，可以使用revalidatePath(url)来更新缓存