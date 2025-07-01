import type { Equal, Expect } from '@type-challenges/utils'

type IsNever<T> = [T] extends [never] ? true : false
/**
 * 这里要小心，TypeScript 的条件类型在遇到联合类型时是“分发式”的，所以用[]包起来
 */
type cases = [
  Expect<Equal<IsNever<never>, true>>,
  Expect<Equal<IsNever<never | string>, false>>,
  Expect<Equal<IsNever<''>, false>>,
  Expect<Equal<IsNever<undefined>, false>>,
  Expect<Equal<IsNever<null>, false>>,
  Expect<Equal<IsNever<[]>, false>>,
  Expect<Equal<IsNever<{}>, false>>,
]