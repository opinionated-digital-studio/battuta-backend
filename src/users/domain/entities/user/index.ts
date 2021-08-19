import { sequenceS } from 'fp-ts/lib/Apply'
import * as E from 'fp-ts/lib/Either'
import { flow } from 'fp-ts/lib/function'
import * as RNEA from 'fp-ts/lib/ReadonlyNonEmptyArray'

import Id, { UniqueId } from '../../../../core/domain/id'
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

type ValidateUserResult = E.Either<
  RNEA.ReadonlyNonEmptyArray<UserValidationError>,
  User.IUser
>

interface ValidateUserInput {
  id?: UniqueId
  email: string
  password: string
}

interface UserSpecification {
  emailValidator?: (value: string) => Email.ValidateEmailResult
  passwordValidator?: (value: string) => Password.ValidatePasswordResult
}

export const validate = ({
  emailValidator = Email.validate,
  passwordValidator = validatePassword,
}: UserSpecification = {}): ((
  input: ValidateUserInput
) => ValidateUserResult) => {
  return flow(
    ({ id = Id.of(), email, password }) =>
      sequenceS(V)({
        id: validateId(id),
        email: emailValidator(email),
        password: passwordValidator(password),
      }),
    E.map((result) => User.of({ ...result }))
  )
}
