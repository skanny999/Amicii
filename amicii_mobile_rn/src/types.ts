export type IconType = {
    name: any,
    size: number,
    color: string,
    style?: any
}

export type UserType = {
    id: string
    username: string,
    age: number,
    bio: string,
    genderM: number,
    genderF: number,
    profileEmoji: string,
    createdOn: string,
    features: [string, string, string, string, string, string, string, string, string, string],
}


export type CardItemType = {
    user: UserType,
    isLarge: boolean,
    editable: boolean,
    newUser: boolean,
    handleEditEmoji?: (item: number) => void,
    handleEditBio?: (text: string) => void,
    handleEditAge?: () => void,
    handleEditGender?: () => void
}

export type TabBarIconType = {
    focused: boolean,
    iconName: string,
    text: string
}