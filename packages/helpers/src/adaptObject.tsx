import { mapObjIndexed, mergeRight, omit, pipe, values } from 'ramda'

// Manual currying instead of ramda.curry — ramda's ts-toolbelt-based Curry
// type leaks a `.pnpm/…` path into declaration emit (TS2742), which breaks
// composite builds.
type Dict = { [key: string]: unknown }

// Keys rename and per-value transform both produce an object whose precise
// shape depends on the runtime map argument. TypeScript can't model that
// transformation without heavy mapped types, so we expose the output as a
// type parameter the caller pins at the declaration site.
export const renameKey =
  <TOut extends Dict = Dict>(keysMap: { [key: string]: string }) =>
  (obj: Dict): TOut =>
    pipe(
      (o: Dict) => mapObjIndexed((oldKey: keyof typeof o) => o[oldKey as keyof Dict])(keysMap),
      mergeRight(obj),
      omit(values(keysMap)),
    )(obj) as TOut

type UnknownTransform = (val: unknown) => unknown

export const adaptValue =
  <TIn extends Dict, TOut extends Dict = TIn>(valuesMap: { [K in keyof TIn]?: (val: TIn[K]) => unknown }) =>
  (obj: TIn): TOut => {
    const transforms = valuesMap as { [key: string]: UnknownTransform }
    const transformed = mapObjIndexed((fn: UnknownTransform, key: string) => fn((obj as Dict)[key]), transforms)
    return mergeRight(obj as Dict, transformed) as TOut
  }

export const inertTransform =
  <TIn, TOut>(fn: (arg: TIn) => TOut) =>
  (arg: TIn | null | undefined): TOut | null | undefined => {
    if (arg === null) return null
    if (arg === undefined) return undefined
    return fn(arg)
  }
