import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'

import Id from '../../../../core/domain/id'
import * as Password from '../../value-objects/password/password'
import * as User from './'
import { UserIdInvalidError } from './errors'

describe('user', () => {
  const validate = User.validate()
  const validateFromHashed = User.validate({
    passwordValidator: (value: string) => E.right(Password.fromHashed(value)),
  })

  it('creates an ID if it is not supplied', () => {
    pipe(
      validateFromHashed({
        email: 'valid@mail.com',
        password: 'a',
      }),
      E.map((result) => {
        expect(result.id).toBeDefined()
      })
    )
  })

  it('does not create a new ID if it is supplied', () => {
    const id = Id.of()
    pipe(
      validate({
        id,
        email: 'valid@email.com',
        password: 'ValidPassword!',
      }),
      E.map((result) => {
        expect(result.id).toEqual(id)
      })
    )
  })

  it('returns left if the ID is invalid', () => {
    pipe(
      validate({
        id: 'invalid',
        email: 'valid@email.com',
        password: 'ValidPassword!',
      }),
      E.getOrElseW((errs) => {
        expect(errs).toEqual(
          expect.arrayContaining([expect.any(UserIdInvalidError)])
        )
      })
    )
  })

  it('skips validation for hashed password', () => {
    pipe(
      validateFromHashed({
        email: 'valid@mail.com',
        password: 'a',
      }),
      E.map((result) => {
        expect(result.password.isHashed).toBeTruthy()
      })
    )
  })
})
