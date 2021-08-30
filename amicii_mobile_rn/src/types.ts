export type IconType = {
  name: any
  size: number
  color: string
  style?: any
}

export type UserType = {
  id: string
  username: string
  age: number
  bio: string
  genderM: number
  genderF: number
  profileEmoji: string
  createdOn: string
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

export type CardItemType = {
  user: UserType
  isLarge: boolean
  editable: boolean
  newUser: boolean
  handleEditEmoji?: (item: number) => void
  handleEditBio?: (text: string) => void
  handleEditAge?: (age: string) => void
  handleEditGender?: (gender: string) => void
}

export type TabBarIconType = {
  focused: boolean
  iconName: string
  text: string
}

export type MessageType = {
  emoji: string
  name: string
}

// eslint-disable-next-line no-shadow
export enum PickerType {
  age,
  gender,
}
