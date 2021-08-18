import { sequenceS } from 'fp-ts/lib/Apply'
import * as E from 'fp-ts/lib/Either'
import { flow } from 'fp-ts/lib/function'
import * as RNEA from 'fp-ts/lib/ReadonlyNonEmptyArray'

import Id from '../../../../core/domain/id'
import * as Email from '../../value-objects/email'
import * as Password from '../../value-objects/password'
import { UserIdInvalidError, UserValidationError } from './errors'
import * as User from './user'

const validateId = E.fromPredicate(Id.validate, (errValue) =>
  RNEA.of(UserIdInvalidError.of(errValue))
)

const validatePassword = Password.validate({
  minLength: 8,
  capitalLetterRegex: /[A-Z]/,
  specialCharactersRegex: /[#?!@$ %^&*-]/,
})

const V = E.getApplicativeValidation(RNEA.getSemigroup<UserValidationError>())

export const validate = flow(
  ({ id = Id.of(), email, password }) =>
    sequenceS(V)({
      id: validateId(id),
      email: Email.validate(email),
      password: validatePassword(password),
    }),
  E.map((result) => User.of({ ...result }))
)
