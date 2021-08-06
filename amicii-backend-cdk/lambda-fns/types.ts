export type User = {
    id: string,
    username: string,
    age: number,
    bio: string,
    genderM: number,
    genderF: number,
    profileEmoji: string,
    createdOn: string,
    features: Feature[]
}

export type Feature = {
    id: number,
    emoji: string,
}