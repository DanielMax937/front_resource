import type { Equal, Expect } from '@type-challenges/utils'

type Space = ' ' | '\n' | '\t'
type Trim<S extends string> = S extends `${Space}${infer R}` ? Trim<R> : S extends `${infer R}${Space}` ? Trim<R> : S

type cases = [
  Expect<Equal<Trim<'str'>, 'str'>>,
  Expect<Equal<Trim<' str'>, 'str'>>,
  Expect<Equal<Trim<'     str'>, 'str'>>,
  Expect<Equal<Trim<'str   '>, 'str'>>,
  Expect<Equal<Trim<'     str     '>, 'str'>>,
  Expect<Equal<Trim<'   \n\t foo bar \t'>, 'foo bar'>>,
  Expect<Equal<Trim<''>, ''>>,
  Expect<Equal<Trim<' \n\t '>, ''>>,
]