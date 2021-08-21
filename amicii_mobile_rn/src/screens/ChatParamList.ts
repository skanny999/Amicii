import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { UserType } from "../types";

export type ChatParamList = {
    ChatList: {
        user: UserType
    },
    ChatDetails: {
        userId: string,
        chatName: string
    }
}

export type ChatNavProps<T extends keyof ChatParamList> = {
    navigation: StackNavigationProp<ChatParamList, T>;
    route: RouteProp<ChatParamList, T>;
  };