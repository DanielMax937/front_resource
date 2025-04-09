## Promise

1. Promise里的关键要保证，then方法传入的参数onFulfilled和onRejected，必须在then方法被调用的那一轮事件循环之后的新执行栈中执行
2. 真正的链式Promise是指在当前Promise达到fulfilled状态后，即开始进行下一个promise
3. Promise必须是以下三种状态：等待态pending、完成态fulfilled、拒绝态rejected

## 流程
1.	Promise 只能 resolve/reject 一次，后续调用无效。
2.	then() 的返回值会传递给下一个 then()。
3.	如果 then() 没有 return 值，默认返回 undefined，传递给下一个 then() 的回调函数。
4.  我们可以使用 Promise.resolve 和 Promise.reject 方法，用于将于将非 Promise 实例包装为 Promise 实例。

```javascript
function Promise(fn) {
    let state = 'pending';
    let value = null;
    const callbacks = [];

    function handle(callback) {
        if(state === 'pending') {
            callbacks.push(callback);
            return;
        }

        const cb = state === 'fulfilled' ? callback.onFulfilled:callback.onRejected;
        const next = state === 'fulfilled'? callback.resolve:callback.reject;

        if(!cb){
            next(value)
            return;
        }
         try {
            const ret = cb(value)
            next(ret)
        } catch (e) {
            callback.reject(e);
        } 
    }

    this.then = function(onFulfilled, onRejected) {
        return new Promise((resolve, reject) => {
            handle({
                onFulfilled,
                resolve,
                onRejected,
                reject
            })
        })
    }

    this.resolve = function (value){
            if (value && value instanceof Promise) {
                return value;
            } else if (value && typeof value === 'object' && typeof value.then === 'function'){
                let then = value.then;
                return new Promise(resolve => {
                    then(resolve);
                });
            } else if (value) {
                return new Promise(resolve => resolve(value));
            } else {
                return new Promise(resolve => resolve());
            }
        }

    this.catch = function (onError){
            this.then(null,onError)
        }

        this.finally = function (onDone){
            this.then(onDone,onDone)
        }

    function resolve(newValue) {
        const fn = () => {
            // 只有pending才执行
            if(state !== 'pending') return;
            if(newValue && (typeof newValue === 'object' || typeof newValue === 'function')){
                const {then} = newValue
                if(typeof then === 'function'){
                    // newValue 为新产生的 Promise,此时resolve为上个 promise 的resolve
                    //相当于调用了新产生 Promise 的then方法，注入了上个 promise 的resolve 为其回调
                    then.call(newValue,resolve, reject)
                    return
                }
            }
            state = 'fulfilled';
            value = newValue;
            handleCb();
        }

        setTimeount(fn, 0);
    }

     function reject(error){
        const fn = ()=>{
            if(state !== 'pending')return

            if(error && (typeof error === 'object' || typeof error === 'function')){
                const {then} = error
                if(typeof then === 'function'){
                    then.call(error,resolve, reject)
                    return
                }
            }
            state = 'rejected';
            value = error
            handelCb()
        }
        setTimeout(fn,0)
    }

    function handleCb() {
        while(callbacks.length) {
            const fulfilledFn = callbacks.shift();
            handle(fulfilledFn);
        }
    }

    fn(resolve)
}
```

## 模型
这里最关键的点就是在 then 中新创建的 Promise，它的状态变为 fulfilled 的节点是在上一个 Promise的回调执行完毕的时候。也就是说当一个 Promise 的状态被 fulfilled 之后，会执行其回调函数，而回调函数返回的结果会被当作 value，返回给下一个 Promise(也就是then 中产生的 Promise)，同时下一个 Promise的状态也会被改变(执行 resolve 或 reject)，然后再去执行其回调,以此类推下去...链式调用的效应就出来了。


## Promise.all
入参是一个 Promise 的实例数组，然后注册一个 then 方法，然后是数组中的 Promise 实例的状态都转为 fulfilled 之后则执行 then 方法。这里主要就是一个计数逻辑，每当一个 Promise 的状态变为 fulfilled 之后就保存该实例返回的数据，然后将计数减一，当计数器变为 0 时，代表数组中所有 Promise 实例都执行完毕。

## Promise.race
有了 Promise.all 的理解，Promise.race 理解起来就更容易了。它的入参也是一个 Promise 实例数组，然后其 then 注册的回调方法是数组中的某一个 Promise 的状态变为 fulfilled 的时候就执行。因为 Promise 的状态只能改变一次，那么我们只需要把 Promise.race 中产生的 Promise 对象的 resolve 方法，注入到数组中的每一个 Promise 实例中的回调函数中即可


## 总结
Promise 源码不过几百行，我们可以从执行结果出发，分析每一步的执行过程，然后思考其作用即可。其中最关键的点就是要理解 then 函数是负责注册回调的，真正的执行是在 Promise 的状态被改变之后。而当 resolve 的入参是一个 Promise 时，要想链式调用起来，就必须调用其 then 方法(then.call),将上一个 Promise 的 resolve 方法注入其回调数组中。

## 补充说明
虽然 then 普遍认为是微任务。但是浏览器没办法模拟微任务，目前要么用 setImmediate ，这个也是宏任务，且不兼容的情况下还是用 setTimeout 打底的。还有，promise 的 polyfill (es6-promise) 里用的也是 setTimeout。因此这里就直接用 setTimeout,以宏任务来代替微任务了。