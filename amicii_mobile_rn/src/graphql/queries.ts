/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const user = /* GraphQL */ `
  query User($userId: String) {
    user(userId: $userId) {
      id
      username
      age
      bio
      genderM
      genderF
      profileEmoji
      createdOn
      features {
        emoji
      }
    }
  }
`;
export const candidates = /* GraphQL */ `
  query Candidates($userId: String) {
    candidates(userId: $userId) {
      id
      username
      age
      bio
      genderM
      genderF
      profileEmoji
      createdOn
      features {
        emoji
      }
    }
  }
`;
export const matches = /* GraphQL */ `
  query Matches($userId: String) {
    matches(userId: $userId) {
      id
      username
      age
      bio
      genderM
      genderF
      profileEmoji
      createdOn
      features {
        emoji
      }
    }
  }
`;
