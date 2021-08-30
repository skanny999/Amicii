import { user, candidates, matches } from '../graphql/queries'
import {
  createUser,
  updateUser,
  likeUser,
  dislikeUser,
} from '../graphql/mutations'
import * as AmiciiAPI from '../AmiciiAPI'
import API, { GraphQLResult, graphqlOperation } from '@aws-amplify/api'
import { UserType } from '../types'
import {
  responseToCandidates,
  responseToUser,
  responseToMatches,
} from '../helpers/userMapper'

// MUTATIONS

export async function createNewUser(userId: string, username: string) {
  try {
    const createUserMutationVariable: AmiciiAPI.CreateUserMutationVariables = {
      userId: userId,
      username: username,
    }
    const createUserRequest: GraphQLResult<AmiciiAPI.CreateUserMutation> =
      (await API.graphql(
        graphqlOperation(createUser, createUserMutationVariable)
      )) as GraphQLResult<AmiciiAPI.CreateUserMutation>
    if (createUserRequest.data) {
      const createUserMutation: AmiciiAPI.CreateUserMutation =
        createUserRequest.data
      if (createUserMutation.createUser) {
        console.log(createUserMutation.createUser)
        return userId
      }
    }
  } catch (err) {
    console.log(err)
  }
}

export async function updateCurrentUser(currentUser: UserType) {
  console.log('updating user: ', currentUser)
  try {
    const updateInput: AmiciiAPI.UpdateUserInput = {
      id: currentUser.id,
      username: currentUser.username || '',
      age: currentUser.age || 0,
      bio: currentUser.bio || '',
      genderM: currentUser.genderM || 0,
      genderF: currentUser.genderF || 0,
      profileEmoji: currentUser.profileEmoji || '',
      createdOn: currentUser.createdOn,
      features: [
        { emoji: currentUser.features[0] },
        { emoji: currentUser.features[1] },
        { emoji: currentUser.features[2] },
        { emoji: currentUser.features[3] },
        { emoji: currentUser.features[4] },
        { emoji: currentUser.features[5] },
        { emoji: currentUser.features[6] },
        { emoji: currentUser.features[7] },
        { emoji: currentUser.features[8] },
        { emoji: currentUser.features[9] },
      ],
    }
    const updateUserMutationVariables: AmiciiAPI.UpdateUserMutationVariables = {
      user: updateInput,
    }
    const updateUserResult: GraphQLResult<AmiciiAPI.UpdateUserMutation> =
      (await API.graphql(
        graphqlOperation(updateUser, updateUserMutationVariables)
      )) as GraphQLResult<AmiciiAPI.UpdateUserMutation>
    if (updateUserResult.data) {
      const updateUserMutation: AmiciiAPI.UpdateUserMutation =
        updateUserResult.data
      if (updateUserMutation.updateUser) {
        console.log('Updated user: ', updateUserMutation.updateUser)
        return updateUserMutation.updateUser
      }
    }
  } catch (err) {
    console.log('Error updating user', err)
  }
}

export async function postLikeUser(userId: string, otherUserId: string) {
  try {
    const createLikeUserVariable: AmiciiAPI.LikeUserMutationVariables = {
      userId: userId,
      otherUserId: otherUserId,
    }
    const createLikeUserRequest: GraphQLResult<AmiciiAPI.LikeUserMutation> =
      (await API.graphql(
        graphqlOperation(likeUser, createLikeUserVariable)
      )) as GraphQLResult<AmiciiAPI.LikeUserMutation>
    if (createLikeUserRequest.data) {
      const createLikeUserMutation: AmiciiAPI.LikeUserMutation =
        createLikeUserRequest.data
      if (createLikeUserMutation.likeUser) {
        console.log('Liked user: ', createLikeUserMutation.likeUser)
        return otherUserId
      }
    }
  } catch (err) {
    console.log(err)
  }
}

export async function postDislikeUser(userId: string, otherUserId: string) {
  try {
    const createDislikeUserVariable: AmiciiAPI.DislikeUserMutationVariables = {
      userId: userId,
      otherUserId: otherUserId,
    }
    const createDislikeUserRequest: GraphQLResult<AmiciiAPI.DislikeUserMutation> =
      (await API.graphql(
        graphqlOperation(dislikeUser, createDislikeUserVariable)
      )) as GraphQLResult<AmiciiAPI.DislikeUserMutation>
    if (createDislikeUserRequest.data) {
      const createDislikeUserMutation: AmiciiAPI.DislikeUserMutation =
        createDislikeUserRequest.data
      if (createDislikeUserMutation.dislikeUser) {
        console.log('Disliked user: ', createDislikeUserMutation.dislikeUser)
        return userId
      }
    }
  } catch (err) {
    console.log(err)
  }
}

// QUERIES

export async function getUser(userId: string) {
  console.log('getting user with id: ', userId)
  try {
    const userQV: AmiciiAPI.UserQueryVariables = { userId: userId }
    const userResult: GraphQLResult<AmiciiAPI.UserQuery> = (await API.graphql(
      graphqlOperation(user, userQV)
    )) as GraphQLResult<AmiciiAPI.UserQuery>
    if (userResult.data) {
      const query: AmiciiAPI.UserQuery = userResult.data
      if (query.user) {
        return responseToUser(query.user)
      }
    }
  } catch (err) {
    console.log(err)
  }
}

export async function getCandidates(userId: string) {
  console.log('getting candidates for user with id: ', userId)
  try {
    const candidatesQV: AmiciiAPI.CandidatesQueryVariables = { userId: userId }
    const candidatesResult: GraphQLResult<AmiciiAPI.CandidatesQuery> =
      (await API.graphql(
        graphqlOperation(candidates, candidatesQV)
      )) as GraphQLResult<AmiciiAPI.CandidatesQuery>
    if (candidatesResult.data) {
      const query: AmiciiAPI.CandidatesQuery = candidatesResult.data
      if (query.candidates) {
        return responseToCandidates(query)
      }
    }
  } catch (err) {
    console.log(err)
  }
}

export async function getMatches(userId: string) {
  console.log('getting matches for user with id: ', userId)
  try {
    const matchesQV: AmiciiAPI.MatchesQueryVariables = { userId: userId }
    const matchesResult: GraphQLResult<AmiciiAPI.MatchesQuery> =
      (await API.graphql(
        graphqlOperation(matches, matchesQV)
      )) as GraphQLResult<AmiciiAPI.MatchesQuery>
    if (matchesResult.data) {
      const query: AmiciiAPI.MatchesQuery = matchesResult.data
      if (query.matches) {
        return responseToMatches(query)
      }
    }
  } catch (err) {
    console.log(err)
  }
}
