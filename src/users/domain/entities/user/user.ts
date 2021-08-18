import { UniqueId } from '../../../../core/domain/id'
import { IEmail } from '../../value-objects/email/email'
import { IPassword } from '../../value-objects/password/password'

export type IUser = {
  _tag: 'User'
  id: UniqueId
  email: IEmail
  password: IPassword
}

export const of = ({
  id,
  email,
  password,
}: {
  id: UniqueId
  email: IEmail
  password: IPassword
}): IUser => {
  return Object.freeze({
    _tag: 'User',
    id,
    email,
    password,
  })
}
