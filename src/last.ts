import type { Equal, Expect } from '@type-challenges/utils'

// 在数组开头多加一个元素，然后通过索引取最后一个元素
type Last<T extends any[]> = [never, ...T][T['length']]

type cases = [
  Expect<Equal<Last<[]>, never>>,
  Expect<Equal<Last<[2]>, 2>>,
  Expect<Equal<Last<[3, 2, 1]>, 1>>,
  Expect<Equal<Last<[() => 123, { a: string }]>, { a: string }>>,
]