import { length } from 'ramda'

const lengthArrOrStr = <T>(arrayOrString: string | T[]): number => {
  if (Array.isArray(arrayOrString)) {
    return length(arrayOrString)
  } else if (typeof arrayOrString === 'string') {
    return arrayOrString.length
  } else {
    return 0
  }
}

const parsers = Object.freeze({
  lengthArrOrStr,
})

export default parsers
