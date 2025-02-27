import type { Equal, Expect, NotAny } from '@type-challenges/utils'

type HelloWorld = string

type test = Expect<Equal<HelloWorld, string>>
