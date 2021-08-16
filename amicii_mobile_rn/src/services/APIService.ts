import { user, candidates } from '../graphql/queries';
import { createUser, updateUser } from '../graphql/mutations';
import * as AmiciiAPI from '../AmiciiAPI'
import API, {GraphQLResult, graphqlOperation} from '@aws-amplify/api';
import { UserType } from '../types';
import { responseToCandidates, responseToUser, responseToMatches } from '../helpers/userMapper';

// MUTATIONS

export async function createNewUser(userId: string, username: string) {
    try {
        const createUserMutationVariable: AmiciiAPI.CreateUserMutationVariables = { userId: userId, username: username };
        const createUserRequest: GraphQLResult<AmiciiAPI.CreateUserMutation> = await API.graphql(
          graphqlOperation(createUser, createUserMutationVariable)
          ) as GraphQLResult<AmiciiAPI.CreateUserMutation>;
        if (createUserRequest.data) {
            const createUserMutation: AmiciiAPI.CreateUserMutation = createUserRequest.data;
            if (createUserMutation.createUser) {
              console.log(createUserMutation.createUser)
              return userId
            }
          }
    } catch (err) {
        console.log(err)
    }
}

export async function updateCurrentUser(user: UserType) {
  try {
    const updateInput: AmiciiAPI.UpdateUserInput = {
      id: user.id,
      username: user.username || '',
      age: user.age || 0,
      bio: user.bio || '',
      genderM: user.genderM || 0,
      genderF: user.genderF || 0,
      profileEmoji: user.profileEmoji || '',
      createdOn: user.createdOn,
      features: [
        {emoji: user.features[0]},
        {emoji: user.features[1]},
        {emoji: user.features[2]},
        {emoji: user.features[3]},
        {emoji: user.features[4]},
        {emoji: user.features[5]},
        {emoji: user.features[6]},
        {emoji: user.features[7]},
        {emoji: user.features[8]},
        {emoji: user.features[9]},
      ],
    }
    const updateUserMutationVariables: AmiciiAPI.UpdateUserMutationVariables = { user: updateInput}
    const updateUserResult: GraphQLResult<AmiciiAPI.UpdateUserMutation> = await API.graphql(
      graphqlOperation(updateUser, updateUserMutationVariables)
      ) as GraphQLResult<AmiciiAPI.UpdateUserMutation>
    if (updateUserResult.data) {
      const updateUserMutation: AmiciiAPI.UpdateUserMutation = updateUserResult.data
      if (updateUserMutation.updateUser) {
        return updateUserMutation.updateUser
      }
    }
  } catch (err) {
    console.log(err)
  }
}

export async function likeUser(userId: string, otherUserId: string) {
  try {
      const createLikeUserVariable: AmiciiAPI.LikeUserMutationVariables = { userId: userId, otherUserId: otherUserId };
      const createLikeUserRequest: GraphQLResult<AmiciiAPI.LikeUserMutation> = await API.graphql(
        graphqlOperation(createUser, createLikeUserVariable)
        ) as GraphQLResult<AmiciiAPI.LikeUserMutation>;
      if (createLikeUserRequest.data) {
          const createLikeUserMutation: AmiciiAPI.LikeUserMutation = createLikeUserRequest.data;
          if (createLikeUserMutation.likeUser) {
            console.log("Liked user: ", createLikeUserMutation.likeUser)
            return otherUserId
          }
        }
  } catch (err) {
      console.log(err)
  }
}

export async function dislikeUser(userId: string, otherUserId: string) {
  try {
      const createDislikeUserVariable: AmiciiAPI.DislikeUserMutationVariables = { userId: userId, otherUserId: otherUserId };
      const createDislikeUserRequest: GraphQLResult<AmiciiAPI.DislikeUserMutation> = await API.graphql(
        graphqlOperation(createUser, createDislikeUserVariable)
        ) as GraphQLResult<AmiciiAPI.DislikeUserMutation>;
      if (createDislikeUserRequest.data) {
          const createDislikeUserMutation: AmiciiAPI.DislikeUserMutation = createDislikeUserRequest.data;
          if (createDislikeUserMutation.dislikeUser) {
            console.log("Disliked user: ", createDislikeUserMutation.dislikeUser)
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
      const userQV: AmiciiAPI.UserQueryVariables = {userId: userId}
      const userResult: GraphQLResult<AmiciiAPI.UserQuery> = await API.graphql(
        graphqlOperation(user, userQV)
        ) as GraphQLResult<AmiciiAPI.UserQuery> 
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
      const candidatesQV: AmiciiAPI.CandidatesQueryVariables = {userId: userId}
      const candidatesResult: GraphQLResult<AmiciiAPI.CandidatesQuery> = await API.graphql(graphqlOperation(candidates, candidatesQV)) as GraphQLResult<AmiciiAPI.CandidatesQuery> 
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
    try {
      const userQV: AmiciiAPI.MatchesQueryVariables = {userId: userId}
      const userResult: GraphQLResult<AmiciiAPI.MatchesQuery> = await API.graphql(graphqlOperation(user, userQV)) as GraphQLResult<AmiciiAPI.MatchesQuery> 
      if (userResult.data) {
        const query: AmiciiAPI.MatchesQuery = userResult.data
        if (query.matches) {
          return responseToMatches(query)
        }
      }
    } catch (err) {
      console.log(err)
    }
}