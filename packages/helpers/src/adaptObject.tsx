import { curry, mapObjIndexed, mergeRight, omit, pipe, values } from 'ramda'

export const renameKey = curry((keysMap: { [key: string]: string }, obj: { [key: string]: any }) =>
  pipe(
    (obj: { [key: string]: any }) => mapObjIndexed((oldKey: keyof typeof obj) => obj[oldKey])(keysMap),
    mergeRight(obj),
    omit(values(keysMap)),
  )(obj),
)

export const adaptValue = curry((valuesMap: { [key: string]: Function }, obj: { [key: string]: any }) =>
  pipe(
    (obj: { [key: string]: any }) => mapObjIndexed((value: Function, key: string) => value(obj[key]))(valuesMap),
    mergeRight(obj),
  )(obj),
)

export const inertTransform = curry((fn: Function, arg: any) => (arg ? fn(arg) : arg))
