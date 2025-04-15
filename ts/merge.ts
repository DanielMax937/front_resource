import type { Equal, Expect } from '@type-challenges/utils'

// 你的答案
type Merge<F, S, O = F & S> = { [K in keyof O]: K extends keyof S ? S[K] : O[K] }

type Foo = {
  a: number
  b: string
}
type Bar = {
  b: number
  c: boolean
}

type cases = [
  Expect<Equal<Merge<Foo, Bar>, {
    a: number
    b: number
    c: boolean
  }>>,
]