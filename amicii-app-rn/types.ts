export type IconType = {
    name: any,
    size: number,
    color: string,
    style?: any
}

export type UserType = {
    id: number,
    name: string,
    bio: string,
    age: number,
    emoji: string
}

export type CardItemType = {
    name: string,
    emoji: string,
    bio: string,
    hasAction?: boolean,
}