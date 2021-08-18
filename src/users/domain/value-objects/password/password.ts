export interface IPassword {
  _tag: 'Password'
  value: string
  isHashed: boolean
}

export const of = (value: string): IPassword => {
  return Object.freeze({
    _tag: 'Password',
    value,
    isHashed: false,
  })
}

export const fromHashed = (value: string): IPassword => {
  return Object.freeze({
    _tag: 'Password',
    value,
    isHashed: true,
  })
}
