import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import * as RNEA from 'fp-ts/lib/ReadonlyNonEmptyArray'

import ValidationError from '../../core/domain/validation'
import predicates from '../../core/utils/predicates'

export interface EmailProps {
  value: string
  isVerified?: boolean
}

class InvalidEmailError extends ValidationError {
  constructor(value: unknown) {
    super('InvalidEmailError', value, 'The entered email is invalid')
  }

  public static of(value: unknown): InvalidEmailError {
    return new InvalidEmailError(value)
  }
}

export type EmailValidationError = InvalidEmailError

const createEmail = (
  i: EmailProps
): E.Either<RNEA.ReadonlyNonEmptyArray<EmailValidationError>, EmailProps> => {
  const validateEmail = E.fromPredicate(predicates.email, (x) =>
    RNEA.of(new InvalidEmailError(x))
  )

  return pipe(
    i.value,
    validateEmail,
    E.map((value) =>
      Object.freeze({
        isVerified: i.isVerified || false,
        ...i,
        value,
      })
    )
  )
}

export default createEmail
