export type IconType = {
    name: any,
    size: number,
    color: string,
    style?: any
}

export type UserType = {
    id?: string | undefined,
    username?: string | undefined,
    age?: number | undefined,
    bio?: string | undefined,
    genderM?: number | undefined,
    genderF?: number | undefined,
    profileEmoji?: string | undefined,
    createdOn?: string | undefined,
    features: [string, string, string, string, string, string, string, string, string, string],
}


export type CardItemType = {
    user: UserType,
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