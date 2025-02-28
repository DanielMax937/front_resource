import type { Equal, Expect } from '@type-challenges/utils'

type MyPick<T, K extends keyof T> = {
    [key in K]: T[key]
}

type cases = [
    Expect<Equal<Expected1, MyPick<Todo, 'title'>>>,
    Expect<Equal<Expected2, MyPick<Todo, 'title' | 'completed'>>>,
    // @ts-expect-error
    MyPick<Todo, 'title' | 'completed' | 'invalid'>,
]

interface Todo {
    title: string
    description: string
    completed: boolean
}

interface Expected1 {
    title: string
}

interface Expected2 {
    title: string
    completed: boolean
}

/**
 * keyof: 取interface的键后保存为联合类型
 * in: 取联合类型的值，主要用于数组和对象的构建
 * 
 * 
 * 
 */


// 这样写丧失了ts的优势：
// 无法确定返回值类型
// 无法对key进行约束
function getValue(o: object, key: string) {
    return o[key]
}
const obj1 = { name: '张三', age: 18 }
const values = getValue(obj1, 'name')

function getValue2<T extends Object, K extends keyof T>(o: T, key: K): T[K] {
    return o[key]
}
const obj2 = { name: '张三', age: 18 }
const values2 = getValue2(obj2, 'name')
