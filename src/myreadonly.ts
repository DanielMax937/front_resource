import type { Equal, Expect } from '@type-challenges/utils'

type MyReadonly<T> = {
    // 在一个对象接口里使用映射类型语法，遍历T类型的每个键的字面类型，并在前面加上readonly修饰符
    readonly [K in keyof T]: T[K]
}
// interface Todo {
//     title: string
//     description: string
// }

// const todo: MyReadonly<Todo> = {
//     title: "Hey",
//     description: "foobar"
// }

// todo.title = "Hello" // Error: cannot reassign a readonly property
// todo.description = "barFoo" // Error: cannot reassign a readonly property


interface Todo1 {
    title: string
    description: string
    completed: boolean
    meta: {
      author: string
    }
  }
  
type cases = [
  Expect<Equal<MyReadonly<Todo1>, Readonly<Todo1>>>,
]
