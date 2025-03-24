import type { Equal, Expect } from '@type-challenges/utils'

// 先解构成目标的结构，然后再替换拼接
type Replace<S extends string, From extends string, To extends string> =
S extends `${infer L}${From extends '' ? never : From}${infer R}`
  ? `${L}${To}${R}`
  : S

type cases = [
  Expect<Equal<Replace<'foobar', 'bar', 'foo'>, 'foofoo'>>,
  Expect<Equal<Replace<'foobarbar', 'bar', 'foo'>, 'foofoobar'>>,
  Expect<Equal<Replace<'foobarbar', '', 'foo'>, 'foobarbar'>>,
  Expect<Equal<Replace<'foobarbar', 'bar', ''>, 'foobar'>>,
  Expect<Equal<Replace<'foobarbar', 'bra', 'foo'>, 'foobarbar'>>,
  Expect<Equal<Replace<'', '', ''>, ''>>,
]