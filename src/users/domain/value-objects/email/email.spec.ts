import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'

import * as Email from './'
import { EmailInvalidError } from './errors'

describe('email', () => {
  it('returns a left if the email is empty or invalid', () => {
    const invalidEmails = ['', 'invalidEmail']

    invalidEmails.forEach((email) => {
      pipe(
        email,
        Email.validate,
        E.getOrElseW((errs) => {
          expect(errs).toEqual(
            expect.arrayContaining([expect.any(EmailInvalidError)])
          )
        })
      )
    })
  })

  it('validates an email', () => {
    const validEmail = 'valid@email.com'

    pipe(
      validEmail,
      Email.validate,
      E.map((val) => {
        expect(val.value).toEqual(validEmail)
      })
    )
  })
})
