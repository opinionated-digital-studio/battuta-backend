import { sequenceT } from 'fp-ts/lib/Apply'
import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import * as RNEA from 'fp-ts/lib/ReadonlyNonEmptyArray'

import ValidationError, { MinLengthError } from '../../core/domain/validation'
import predicates from '../../core/utils/predicates'

export interface Password {
  value: string
  isHashed?: boolean
}

const minLength = 8

class PasswordTooShortError extends MinLengthError {
  constructor(value: unknown) {
    super(
      'PasswordTooShortError',
      minLength,
      value,
      `The entered password is too short`
    )
  }

  public static of(value: unknown): PasswordTooShortError {
    return new PasswordTooShortError(value)
  }
}

class PasswordCapitalLetterRequiredError extends ValidationError {
  constructor(value: unknown) {
    super(
      'PasswordCapitalLetterRequiredError',
      value,
      'The entered password is missing a capital letter'
    )
  }

  public static of(value: unknown): PasswordCapitalLetterRequiredError {
    return new PasswordCapitalLetterRequiredError(value)
  }
}

class PasswordSpecialCharacterRequiredError extends ValidationError {
  constructor(value: unknown) {
    super(
      'PasswordSpecialCharacterRequiredError',
      value,
      'The entered password is missing at least one special character (#, ?, !, @, $, %, ^, &, *, -) or space'
    )
  }

  public static of(value: unknown): PasswordCapitalLetterRequiredError {
    return new PasswordCapitalLetterRequiredError(value)
  }
}

export type PasswordValidationError =
  | PasswordTooShortError
  | PasswordCapitalLetterRequiredError
  | PasswordSpecialCharacterRequiredError

const createPassword = (
  i: Password
): E.Either<RNEA.ReadonlyNonEmptyArray<PasswordValidationError>, Password> => {
  const testCapitalLetter = predicates.regex(/[A-Z]/)
  const testSpecialCharacter = predicates.regex(/[#?!@$ %^&*-]/)

  const validateCapitalLetter = E.fromPredicate(testCapitalLetter, (x) =>
    RNEA.of(new PasswordCapitalLetterRequiredError(x))
  )

  const validateSpecialCharacter = E.fromPredicate(testSpecialCharacter, (x) =>
    RNEA.of(new PasswordSpecialCharacterRequiredError(x))
  )

  const validateMinLength = E.fromPredicate(
    predicates.minLength(minLength),
    (x) => RNEA.of(new PasswordTooShortError(x))
  )

  const V = E.getApplicativeValidation(
    RNEA.getSemigroup<PasswordValidationError>()
  )

  return i.isHashed
    ? E.of(Object.freeze(i))
    : pipe(
        sequenceT(V)(
          validateMinLength(i.value),
          validateSpecialCharacter(i.value),
          validateCapitalLetter(i.value)
        ),
        E.map(() =>
          Object.freeze({
            ...i,
            isHashed: false,
          })
        )
      )
}

export default createPassword
