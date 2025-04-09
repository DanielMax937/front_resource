import type { Equal, Expect } from '@type-challenges/utils'

// 利用Distributive Conditional Types，将Union变成数组，但下面的只是拿到第一个
type S1<U> = U extends any ? [U] : never
// 循环
// 上面的式子里U被map拆掉了,那么我们还需要一份完整的copy,用于之后继续传递, 所以增加一个C=U
type S2<U, C=U> =  U extends any? [U, S2<Exclude<C, U>>]: never
// 去除never
//注意, 如果这里还是用 Union extends xxx 的形式就又 Distribute 分支了, 所以这里把传入[U] 整体进条件
type Permutation<U, C = U> = [U] extends [never] ? [] : U extends C  ? [U, ...Permutation<Exclude<C, U>>]:never


type cases = [
  Expect<Equal<Permutation<'A'>, ['A']>>,
  Expect<Equal<Permutation<'A' | 'B' | 'C'>, ['A', 'B', 'C'] | ['A', 'C', 'B'] | ['B', 'A', 'C'] | ['B', 'C', 'A'] | ['C', 'A', 'B'] | ['C', 'B', 'A']>>,
  Expect<Equal<Permutation<'B' | 'A' | 'C'>, ['A', 'B', 'C'] | ['A', 'C', 'B'] | ['B', 'A', 'C'] | ['B', 'C', 'A'] | ['C', 'A', 'B'] | ['C', 'B', 'A']>>,
  Expect<Equal<Permutation<boolean>, [false, true] | [true, false]>>,
  Expect<Equal<Permutation<never>, []>>,
]