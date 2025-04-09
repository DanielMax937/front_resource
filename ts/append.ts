import type { Equal, Expect } from '@type-challenges/utils'

type AppendArgument<T extends (...args: any[]) => any, U> =
  T extends (...args: infer A) => infer R
    ? (...args: [...A, U]) => R // 目标函数先写好，然后再将需要的类型在extends中去获取，使用infer来推导出参数类型
    : never

type Case1 = AppendArgument<(a: number, b: string) => number, boolean>
type Result1 = (a: number, b: string, x: boolean) => number

type Case2 = AppendArgument<() => void, undefined>
type Result2 = (x: undefined) => void

type cases = [
  Expect<Equal<Case1, Result1>>,
  Expect<Equal<Case2, Result2>>,
  // @ts-expect-error
  AppendArgument<unknown, undefined>,
]