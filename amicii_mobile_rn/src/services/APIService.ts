import { user, candidates } from '../graphql/queries';
import * as AmiciiAPI from '../AmiciiAPI'
import API, {GraphQLResult, graphqlOperation} from '@aws-amplify/api';

// QUERIES

export async function getUser(userId: string) {
    try {
      const userQV: AmiciiAPI.UserQueryVariables = {userId: userId}
      const userResult: GraphQLResult<AmiciiAPI.UserQuery> = await API.graphql(graphqlOperation(user, userQV)) as GraphQLResult<AmiciiAPI.UserQuery> 
      if (userResult.data) {
        const query: AmiciiAPI.UserQuery = userResult.data
        if (query.user) {
          return query.user
        //   console.log('User: ', user)
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