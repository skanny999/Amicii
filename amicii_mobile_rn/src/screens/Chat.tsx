import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { UserType } from '../types'
import ChatDetails from './ChatDetails'
import ChatList from './ChatList'
import { ChatParamList } from './ChatParamList'

interface RoutesProps {
  user: UserType
}

const Stack = createStackNavigator<ChatParamList>()

const Chat: React.FC<RoutesProps> = (props: { user: UserType }) => {
  return (
    <Stack.Navigator initialRouteName="ChatList">
      <Stack.Screen
        name="ChatList"
        component={ChatList}
        initialParams={{ user: props.user }}
      />
      <Stack.Screen name="ChatDetails" component={ChatDetails} />
    </Stack.Navigator>
  )
}

export default Chat
