import { ValidationError } from '../../../../core/domain/validation'
import { EmailValidationError } from '../../value-objects/email/errors'
import { PasswordValidationError } from '../../value-objects/password/errors'

export class UserIdInvalidError extends ValidationError {
  private constructor(value: unknown) {
    super('UserIdInvalidError', 'UserId', value, 'The user ID is invalid')
  }

  public static of(value: unknown): UserIdInvalidError {
    return new UserIdInvalidError(value)
  }
}

export type UserValidationError =
  | UserIdInvalidError
  | EmailValidationError
  | PasswordValidationError
