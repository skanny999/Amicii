import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { UserType } from '../types';
import ChatDetails from './ChatDetails';
import ChatList from './ChatList';


const Stack = createStackNavigator();

const Chat = (props: {user: UserType}) => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ChatList" component={ChatList} />
        <Stack.Screen name="ChatDetails" component={ChatDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Chat