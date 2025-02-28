let outerVariable = 'ab';  // 全局变量

function outerFunction() {
  let capturedValue = outerVariable;  // 将外部变量的值捕获到一个局部变量中
  
  function innerFunction() {
    console.log('cc', capturedValue);  // 闭包捕获的是变量的值，而不是引用
  }
  return innerFunction;
}

const closure = outerFunction();  // 返回的 innerFunction 闭包
outerVariable = 'cd';  // 修改全局变量

closure();  // 输出 10