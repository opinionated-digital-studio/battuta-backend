export interface IEmail {
  _tag: 'Email'
  value: string
  isVerified: boolean
}

export const of = (value: string): IEmail => {
  return Object.freeze({
    _tag: 'Email',
    value,
    isVerified: false,
  })
}

export const fromVerified = (value: string): IEmail => {
  return Object.freeze({
    _tag: 'Email',
    value,
    isVerified: true,
  })
}
