import { sequenceS } from 'fp-ts/lib/Apply'
import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import * as RNEA from 'fp-ts/lib/ReadonlyNonEmptyArray'

import Id, { UniqueId } from '../../core/domain/id'
import ValidationError from '../../core/domain/validation'
import createEmail, { EmailProps, EmailValidationError } from './email'
import createPassword, {
  PasswordProps,
  PasswordValidationError,
} from './password'

interface UserProps {
  id?: UniqueId
  email: EmailProps
  password: PasswordProps
}

class UserIdValidationError extends ValidationError {
  constructor(value: unknown) {
    super('UserIdValidationError', value, 'The entered ID is invalid')
  }
}

type UserValidationError =
  | UserIdValidationError
  | PasswordValidationError
  | EmailValidationError

const createUser = (
  i: UserProps
): E.Either<RNEA.ReadonlyNonEmptyArray<UserValidationError>, UserProps> => {
  const validateId = E.fromPredicate(Id.validate, (x) =>
    RNEA.of(new UserIdValidationError(x))
  )

  const V = E.getApplicativeValidation(RNEA.getSemigroup<UserValidationError>())
  return pipe(
    i,
    ({ id, email, password }) =>
      sequenceS(V)({
        id: validateId(id || Id.create()),
        email: createEmail(email),
        password: createPassword(password),
      }),
    E.map((x) =>
      Object.freeze({
        ...x,
      })
    )
  )
}

export default createUser
