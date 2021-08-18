import { CharactersRequiredError } from '../../../../core/domain/validation'

export class EmailInvalidError extends CharactersRequiredError {
  private constructor(value: unknown, regex: RegExp) {
    super('EmailInvalidError', 'Email', value, regex)
  }

  public static of(value: unknown, regex: RegExp): EmailInvalidError {
    return new EmailInvalidError(value, regex)
  }
}

export type EmailValidationError = EmailInvalidError
