import { v4 as uuid, validate } from 'uuid'

export type UniqueId = string

const Id = Object.freeze({
  create: uuid,
  validate: validate,
})

export default Id
