## overview
stream包含了一系列状态控制，可以说一个stream就是一个状态管理单元

### readable stream
流动模式--flowing mode
监听 data

资源的数据流并不是直接流向消费者，而是先 push 到缓存池，缓存池有一个水位标记 highWatermark，超过这个标记阈值，push 的时候会返回 false，什么场景下会出现这种情况呢？

消费者主动执行了 .pause()
消费速度比数据 push 到缓存池的生产速度慢

暂停模式--paused mode
监听 readable
1. _readableState.flow = null，暂时没有消费者过来
2. _readableState.flow = false，主动触发了 .pause()
3. _readableState.flow = true，流动模式

buffer 大小也是有上限的，默认设置为 16kb，也就是 16384 个字节长度，它最大可设置为 8Mb，没记错的话，这个值好像是 Node 的 new space memory 的大小。

### writable stream
当生产者写入速度过快，把队列池装满了之后，就会出现「背压」，这个时候是需要告诉生产者暂停生产的，当队列释放之后，Writable Stream 会给生产者发送一个 drain 消息，让它恢复生产。
