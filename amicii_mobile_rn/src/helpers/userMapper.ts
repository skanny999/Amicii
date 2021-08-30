import { CandidatesQuery, MatchesQuery, User } from '../services/AmiciiAPI'
import { UserType } from '../types'

export const responseToUser = (response: User): UserType => {
  const user: UserType = {
    id: response.id!,
    username: response.username!,
    age: response.age!,
    bio: response.bio!,
    genderM: response.genderM!,
    genderF: response.genderF!,
    profileEmoji: response.profileEmoji!,
    createdOn: response.createdOn!,
    features: [
      response.features![0]!.emoji!,
      response.features![1]!.emoji!,
      response.features![2]!.emoji!,
      response.features![3]!.emoji!,
      response.features![4]!.emoji!,
      response.features![5]!.emoji!,
      response.features![6]!.emoji!,
      response.features![7]!.emoji!,
      response.features![8]!.emoji!,
      response.features![9]!.emoji!,
    ],
  }
  return user
}

export const responseToCandidates = (response: CandidatesQuery) => {
  return response.candidates!.map((user) => responseToUser(user!))
}

export const responseToMatches = (response: MatchesQuery) => {
  return response.matches!.map((user) => responseToUser(user!))
}
