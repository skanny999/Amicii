import {UserType} from '../types'

export const chatNameForUsers = (firstUser: UserType, lastUser: UserType) => {
  return [firstUser.id.substr(-6), lastUser.id.substr(-6)].sort().join('')
}
