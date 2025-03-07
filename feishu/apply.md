## apply and call

它们的共同点是，都能够改变函数执行时的上下文，将一个对象的方法交给另一个对象来执行，并且是立即执行的。

区别主要是传参方式不同：
Function.call(obj,[param1[,param2[,…[,paramN]]]])
Function.apply(obj, [argsArray])

call用来继承

apply主要可以用在数组上，比如取最大值，最小值等。

