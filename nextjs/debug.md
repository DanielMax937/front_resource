## 构建相关
1. 开启构建调试 next build --debug
2. ssr渲染在dev时直接返回失败html，而构建时则直接报错。在dev时，如果失败则重新hydrate，如果是服务端则返回init html。相关代码如下(源码为nextjs/src/client/app-index.tsx)
```js
if (
    document.documentElement.id === '__next_error__' ||
    !!window.__next_root_layout_missing_tags?.length
  ) {
    let element = reactEl
    // Server rendering failed, fall back to client-side rendering
    if (
      process.env.NODE_ENV !== 'production' &&
      shouldRenderRootLevelErrorOverlay()
    ) {
      const { createRootLevelDevOverlayElement } =
        require('./components/react-dev-overlay/app/client-entry') as typeof import('./components/react-dev-overlay/app/client-entry')

      // Note this won't cause hydration mismatch because we are doing CSR w/o hydration
      element = createRootLevelDevOverlayElement(element)
    }

    ReactDOMClient.createRoot(appElement, reactRootOptions).render(element)
  } else {
    React.startTransition(() => {
      ReactDOMClient.hydrateRoot(appElement, reactEl, {
        ...reactRootOptions,
        formState: initialFormStateData,
      })
    })
  }
```
3. 服务端渲染逻辑
    1. 通过ReactDOMServer.renderToString(<App />);组装服务端的html的string形式，但是不包含事件，useEffect等
    2. 通过ReactDOMServer.hydrateRoot(<App />);将服务端的html和客户端的react组件进行绑定，完成事件绑定等操作
        1.	重新执行组件，计算出虚拟 DOM。
        2.	比较虚拟 DOM 和实际 DOM，更新不一致的部分（如果有的话）。
        3.	绑定事件监听器，让 React 处理用户交互。（绑定在根节点）
        4.	执行副作用，如 useEffect 等，确保动态行为正常工作。