import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'

import * as Password from './'
import {
  PasswordCapitalLetterRequiredError,
  PasswordSpecialCharacterRequiredError,
  PasswordTooShortError,
} from './errors'

describe('Password', () => {
  const validate = Password.validate({
    minLength: 8,
    capitalLetterRegex: /[A-Z]/,
    specialCharactersRegex: /[#?!@$ %^&*-]/,
  })

  it('returns a left with an array of errors if invalid', () => {
    pipe(
      '',
      validate,
      E.getOrElseW((errs) => {
        expect(errs).toEqual(
          expect.arrayContaining([expect.any(PasswordTooShortError)])
        )
        expect(errs).toEqual(
          expect.arrayContaining([
            expect.any(PasswordCapitalLetterRequiredError),
          ])
        )
        expect(errs).toEqual(
          expect.arrayContaining([
            expect.any(PasswordSpecialCharacterRequiredError),
          ])
        )
      })
    )
  })

  it('returns a left with an array of the applicable errors', () => {
    pipe(
      'abcdefg!',
      validate,
      E.getOrElseW((errs) => {
        expect(errs).toEqual(
          expect.arrayContaining([
            expect.any(PasswordCapitalLetterRequiredError),
          ])
        )
      })
    )
  })

  it('returns a right with the password if valid', () => {
    const validPassword = 'ValidPassword!'
    pipe(
      validPassword,
      validate,
      E.map((val) => {
        expect(val.value).toEqual(validPassword)
      })
    )
  })
})
