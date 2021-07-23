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
    emoji: string,
    features: string[]
}

export type CardItemType = {
    name: string,
    emoji: string,
    age: number,
    bio: string,
    features: string[],
    hasAction?: boolean,
    isLarge: boolean,
    editable: boolean,
    handleEditEmoji?: (item: number) => void,
    handleEditBio?: (text: string) => void,
}

export type TabBarIconType = {
    focused: boolean,
    iconName: string,
    text: string
}