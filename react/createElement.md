## overview
1. jsx的底层实现，每个JSX标签最终都会呗转换成一个createElement的调用
2. 它返回的是虚拟DOM的节点描述，不是真实的DOM元素

## key
1. React元素是不可变对象，更新UI时，React会创建新元素，而不是修改旧元素
