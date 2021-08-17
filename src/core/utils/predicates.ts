import R from 'ramda'

import parsers from './parsers'

const required = R.complement(R.anyPass([R.isEmpty, R.isNil]))
const regex = (match: RegExp) => R.test(match)
const email = regex(
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
)
const minLength =
  (length: number) =>
  <T>(value: string | T[]) =>
    R.gte(parsers.lengthArrOrStr(value), length)

const predicates = Object.freeze({
  required,
  regex,
  email,
  minLength,
})

export default predicates
