import type { Equal, Expect } from '@type-challenges/utils'

// infer推断某个部分的类型
type Pop<T extends any[]> = T extends [...infer R, any] ? R : []

type cases = [
  Expect<Equal<Pop<[3, 2, 1]>, [3, 2]>>,
  Expect<Equal<Pop<['a', 'b', 'c', 'd']>, ['a', 'b', 'c']>>,
  Expect<Equal<Pop<[]>, []>>,
]