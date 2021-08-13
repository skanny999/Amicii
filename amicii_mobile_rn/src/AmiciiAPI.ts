/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type User = {
  __typename: "User",
  id?: string,
  username?: string,
  age?: number,
  bio?: string,
  genderM?: number,
  genderF?: number,
  profileEmoji?: string,
  createdOn?: string,
  features?:  Array<Feature | null > | null,
};

export type Feature = {
  __typename: "Feature",
  emoji?: string,
};

export type UpdateUserInput = {
  id?: string | null,
  username: string,
  age: number,
  bio: string,
  genderM: number,
  genderF: number,
  profileEmoji: string,
  features?: Array< FeatureInput | null > | null,
};

export type FeatureInput = {
  emoji: string,
};

export type CreateUserMutationVariables = {
  userId?: string | null,
  username?: string | null,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    id: string,
    username: string,
    age: number,
    bio: string,
    genderM: number,
    genderF: number,
    profileEmoji: string,
    createdOn: string,
    features?:  Array< {
      __typename: "Feature",
      emoji: string,
    } | null > | null,
  } | null,
};

export type UpdateUserMutationVariables = {
  user?: UpdateUserInput | null,
};

export type UpdateUserMutation = {
  updateUser?:  {
    __typename: "User",
    id: string,
    username: string,
    age: number,
    bio: string,
    genderM: number,
    genderF: number,
    profileEmoji: string,
    createdOn: string,
    features?:  Array< {
      __typename: "Feature",
      emoji: string,
    } | null > | null,
  } | null,
};

export type LikeUserMutationVariables = {
  userId?: string | null,
  otherUserId?: string | null,
};

export type LikeUserMutation = {
  likeUser?:  {
    __typename: "User",
    id: string,
    username: string,
    age: number,
    bio: string,
    genderM: number,
    genderF: number,
    profileEmoji: string,
    createdOn: string,
    features?:  Array< {
      __typename: "Feature",
      emoji: string,
    } | null > | null,
  } | null,
};

export type DislikeUserMutationVariables = {
  userId?: string | null,
  otherUserId?: string | null,
};

export type DislikeUserMutation = {
  dislikeUser?:  {
    __typename: "User",
    id: string,
    username: string,
    age: number,
    bio: string,
    genderM: number,
    genderF: number,
    profileEmoji: string,
    createdOn: string,
    features?:  Array< {
      __typename: "Feature",
      emoji: string,
    } | null > | null,
  } | null,
};

export type UserQueryVariables = {
  userId?: string | null,
};

export type UserQuery = {
  user?:  {
    __typename: "User",
    id: string,
    username: string,
    age: number,
    bio: string,
    genderM: number,
    genderF: number,
    profileEmoji: string,
    createdOn: string,
    features?:  Array< {
      __typename: "Feature",
      emoji: string,
    } | null > | null,
  } | null,
};

export type CandidatesQueryVariables = {
  userId?: string | null,
};

export type CandidatesQuery = {
  candidates?:  Array< {
    __typename: "User",
    id: string,
    username: string,
    age: number,
    bio: string,
    genderM: number,
    genderF: number,
    profileEmoji: string,
    createdOn: string,
    features?:  Array< {
      __typename: "Feature",
      emoji: string,
    } | null > | null,
  } | null > | null,
};

export type MatchesQueryVariables = {
  userId?: string | null,
};

export type MatchesQuery = {
  matches?:  Array< {
    __typename: "User",
    id: string,
    username: string,
    age: number,
    bio: string,
    genderM: number,
    genderF: number,
    profileEmoji: string,
    createdOn: string,
    features?:  Array< {
      __typename: "Feature",
      emoji: string,
    } | null > | null,
  } | null > | null,
};

export type OnCreateUserSubscription = {
  onCreateUser?:  {
    __typename: "User",
    id: string,
    username: string,
    age: number,
    bio: string,
    genderM: number,
    genderF: number,
    profileEmoji: string,
    createdOn: string,
    features?:  Array< {
      __typename: "Feature",
      emoji: string,
    } | null > | null,
  } | null,
};

export type OnUpdateUserSubscription = {
  onUpdateUser?:  {
    __typename: "User",
    id: string,
    username: string,
    age: number,
    bio: string,
    genderM: number,
    genderF: number,
    profileEmoji: string,
    createdOn: string,
    features?:  Array< {
      __typename: "Feature",
      emoji: string,
    } | null > | null,
  } | null,
};
