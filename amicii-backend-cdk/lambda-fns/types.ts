export type User = {
    id: string,
    username: string,
    age: number,
    bio: string,
    genderM: number,
    genderF: number,
    profileEmoji: string,
    createdOn: string,
    features: [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string
    ]
}

export type Feature = {
    emoji: string,
}