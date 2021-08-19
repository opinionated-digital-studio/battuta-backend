import * as E from 'fp-ts/lib/Either'
import { flow } from 'fp-ts/lib/function'
import * as RNEA from 'fp-ts/lib/ReadonlyNonEmptyArray'

import predicates from '../../../../core/utils/predicates'
import * as Email from './email'
import { EmailInvalidError, EmailValidationError } from './errors'

export type EmailSpecification = {
  emailRegex: RegExp
}

const validateEmail = E.fromPredicate(predicates.email, (errValue) =>
  RNEA.of(
    EmailInvalidError.of(
      errValue,
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ) as EmailValidationError
  )
)

export type ValidateEmailResult = E.Either<
  RNEA.ReadonlyNonEmptyArray<EmailInvalidError>,
  Email.IEmail
>

export const validate: (value: string) => ValidateEmailResult = flow(
  validateEmail,
  E.map(Email.of)
)
