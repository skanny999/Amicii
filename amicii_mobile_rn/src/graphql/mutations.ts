/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser($userId: String, $username: String) {
    createUser(userId: $userId, username: $username) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser($user: UpdateUserInput) {
    updateUser(user: $user) {
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
export const likeUser = /* GraphQL */ `
  mutation LikeUser($userId: String, $otherUserId: String) {
    likeUser(userId: $userId, otherUserId: $otherUserId) {
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
export const dislikeUser = /* GraphQL */ `
  mutation DislikeUser($userId: String, $otherUserId: String) {
    dislikeUser(userId: $userId, otherUserId: $otherUserId) {
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
