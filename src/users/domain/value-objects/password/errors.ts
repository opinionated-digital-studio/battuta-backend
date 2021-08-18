import {
  CharactersRequiredError,
  MinLengthError,
} from '../../../../core/domain/validation'

export class PasswordTooShortError extends MinLengthError {
  private constructor(value: unknown, minLength: number) {
    super('PasswordTooShortError', 'Password', value, minLength)
  }

  public static of(value: unknown, minLength: number): PasswordTooShortError {
    return new PasswordTooShortError(value, minLength)
  }
}

export class PasswordCapitalLetterRequiredError extends CharactersRequiredError {
  private constructor(value: unknown, regex: RegExp) {
    super('PasswordCapitalLetterRequiredError', 'Password', value, regex)
  }

  public static of(
    value: unknown,
    regex: RegExp
  ): PasswordCapitalLetterRequiredError {
    return new PasswordCapitalLetterRequiredError(value, regex)
  }
}

export class PasswordSpecialCharacterRequiredError extends CharactersRequiredError {
  private constructor(value: unknown, regex: RegExp) {
    super('PasswordSpecialCharacterRequiredError', 'Password', value, regex)
  }

  public static of(
    value: unknown,
    regex: RegExp
  ): PasswordSpecialCharacterRequiredError {
    return new PasswordSpecialCharacterRequiredError(value, regex)
  }
}

export type PasswordValidationError =
  | PasswordTooShortError
  | PasswordCapitalLetterRequiredError
  | PasswordSpecialCharacterRequiredError
