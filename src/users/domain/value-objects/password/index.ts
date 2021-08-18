import { sequenceT } from 'fp-ts/lib/Apply'
import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import * as RNEA from 'fp-ts/lib/ReadonlyNonEmptyArray'

import predicates from '../../../../core/utils/predicates'
import {
  PasswordCapitalLetterRequiredError,
  PasswordSpecialCharacterRequiredError,
  PasswordTooShortError,
  PasswordValidationError,
} from './errors'
import * as Password from './password'

export type PasswordSpecification = {
  minLength: number
  capitalLetterRegex: RegExp
  specialCharactersRegex: RegExp
}

export const validate = ({
  minLength,
  capitalLetterRegex,
  specialCharactersRegex,
}: PasswordSpecification): ((
  value: string
) => E.Either<
  RNEA.ReadonlyNonEmptyArray<PasswordValidationError>,
  Password.IPassword
>) => {
  const testCapitalLetter = predicates.regex(capitalLetterRegex)
  const testSpecialCharacters = predicates.regex(specialCharactersRegex)

  const validateMinLength = E.fromPredicate(
    predicates.minLength(minLength),
    (errValue) => RNEA.of(PasswordTooShortError.of(errValue, minLength))
  )

  const validateCapitalLetter = E.fromPredicate(testCapitalLetter, (errValue) =>
    RNEA.of(PasswordCapitalLetterRequiredError.of(errValue, capitalLetterRegex))
  )

  const validateSpecialCharacters = E.fromPredicate(
    testSpecialCharacters,
    (errValue) =>
      RNEA.of(
        PasswordSpecialCharacterRequiredError.of(
          errValue,
          specialCharactersRegex
        )
      )
  )

  const V = E.getApplicativeValidation(
    RNEA.getSemigroup<PasswordValidationError>()
  )

  return (value) =>
    pipe(
      sequenceT(V)(
        validateMinLength(value),
        validateCapitalLetter(value),
        validateSpecialCharacters(value)
      ),
      E.map(() => Password.of(value))
    )
}
