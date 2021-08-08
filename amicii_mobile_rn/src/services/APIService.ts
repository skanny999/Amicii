import { user, candidates } from '../graphql/queries';
import { createUser } from '../graphql/mutations';
import * as AmiciiAPI from '../AmiciiAPI'
import API, {GraphQLResult, graphqlOperation} from '@aws-amplify/api';

// MUTATIONS

export async function createNewUser(userId: string) {
    try {
        const createUserMutationVariable: AmiciiAPI.CreateUserMutationVariables = { userId: userId };
        const createUserRequest: GraphQLResult<AmiciiAPI.CreateUserMutation> = await API.graphql(graphqlOperation(createUser, createUserMutationVariable)) as GraphQLResult<AmiciiAPI.CreateUserMutation>;
        if (createUserRequest.data) {
            const createUserMutation: AmiciiAPI.CreateUserMutation = createUserRequest.data;
            if (createUserMutation.createUser) {
              const user = createUserMutation.createUser;
              return user
            }
          }
    } catch (err) {
        console.log(err)
    }
}

// QUERIES

export async function getUser(userId: string) {
    try {
      const userQV: AmiciiAPI.UserQueryVariables = {userId: userId}
      const userResult: GraphQLResult<AmiciiAPI.UserQuery> = await API.graphql(graphqlOperation(user, userQV)) as GraphQLResult<AmiciiAPI.UserQuery> 
      if (userResult.data) {
        const query: AmiciiAPI.UserQuery = userResult.data
        if (query.user) {
          return query.user
        }
      }
    } catch (err) {
      console.log(err)
    }
}

export async function getCandidates(userId: string) {
    try {
      const candidatesQV: AmiciiAPI.CandidatesQueryVariables = {userId: userId}
      const candidatesResult: GraphQLResult<AmiciiAPI.CandidatesQuery> = await API.graphql(graphqlOperation(candidates, candidatesQV)) as GraphQLResult<AmiciiAPI.CandidatesQuery> 
      if (candidatesResult.data) {
        const query: AmiciiAPI.CandidatesQuery = candidatesResult.data
        if (query.candidates) {
          return query.candidates
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
          return query.matches
        }
      }
    } catch (err) {
      console.log(err)
    }
}