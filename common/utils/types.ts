/**
 * Converts union to intersection type.
 */
export type UnionToIntersect<U> =
  (U extends unknown ? (arg: U) => void : never) extends (
    arg: infer Intersect
  ) => void
    ? Intersect
    : never;

/**
 * Converts union to tuple type using an accumulator.
 *
 * Discussion on Github: {@link https://github.com/fabian-hiller/valibot/discussions/1234#discussioncomment-13580436}
 * For more information: {@link https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-5.html#tail-recursion-elimination-on-conditional-types}
 */
export type UnionToTuple<U, Result extends unknown[] = []> =
  UnionToIntersect<
    U extends never ? never : () => U
  > extends () => infer Last
    ? UnionToTuple<Exclude<U, Last>, [Last, ...Result]>
    : Result;
