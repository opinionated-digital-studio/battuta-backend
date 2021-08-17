export default class ValidationError extends Error {
  public _tag: string
  public value: unknown

  constructor(tag: string, value: unknown, message: string) {
    super(message)
    this._tag = tag
    this.value = value
  }
}

export class MinLengthError extends ValidationError {
  public minLength: number

  constructor(
    _tag: string,
    minLength: number,
    value: unknown,
    message: string
  ) {
    super(_tag, value, `${message} (minimum length: ${minLength})`)
    this.minLength = minLength
  }
}
