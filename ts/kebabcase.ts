import type { Equal, Expect } from '@type-challenges/utils'

// 这个类型体操的主要策略是：
// 1.	使用递归拆解字符串
// 2.	判断每个字符是否为大写字母
// 3.	决定是否要加 -
// 4.	小写化大写字母，拼接递归结果

type isUpperLetter<T extends string> = T extends Uppercase<T>
  ? T extends Lowercase<T> // 这个说明不是英文字母，因为大小写都一样
    ? false
    : true
  : false

type strigula<F extends string, T> = T extends true
  ? ''
  : isUpperLetter<F> extends true
  ? '-'
  : ''

type kebab<
  F extends string,
  R extends string
> = `${isUpperLetter<F> extends true ? Lowercase<F> : F}${KebabCase<R, false>}`

type KebabCase<
  S extends string,
  T extends boolean = true
> = S extends `${infer F}${infer R}` ? `${strigula<F, T>}${kebab<F, R>}` : S

type cases = [
  Expect<Equal<KebabCase<'FooBarBaz'>, 'foo-bar-baz'>>,
  Expect<Equal<KebabCase<'fooBarBaz'>, 'foo-bar-baz'>>,
  Expect<Equal<KebabCase<'foo-bar'>, 'foo-bar'>>,
  Expect<Equal<KebabCase<'foo_bar'>, 'foo_bar'>>,
  Expect<Equal<KebabCase<'Foo-Bar'>, 'foo--bar'>>,
  Expect<Equal<KebabCase<'ABC'>, 'a-b-c'>>,
  Expect<Equal<KebabCase<'-'>, '-'>>,
  Expect<Equal<KebabCase<''>, ''>>,
  Expect<Equal<KebabCase<'😎'>, '😎'>>,
]