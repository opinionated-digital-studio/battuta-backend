export class ValidationError extends Error {
  public _tag: string
  public value: unknown
  public fieldName: string

  constructor(tag: string, fieldName: string, value: unknown, message: string) {
    super(message)
    this._tag = tag
    this.fieldName = fieldName
    this.value = value
  }
}

export class MinLengthError extends ValidationError {
  public minLength: number

  constructor(
    _tag: string,
    fieldName: string,
    value: unknown,
    minLength: number
  ) {
    super(
      _tag,
      fieldName,
      value,
      `${fieldName} does not contain enough characters (minimum: ${minLength})`
    )
    this.minLength = minLength
  }
}

export class CharactersRequiredError extends ValidationError {
  public regex: RegExp

  constructor(_tag: string, fieldName: string, value: unknown, regex: RegExp) {
    super(
      _tag,
      fieldName,
      value,
      `${fieldName} is missing character(s) (regex: ${regex})`
    )
    this.regex = regex
  }
}
