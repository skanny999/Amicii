import Amplify from 'aws-amplify'
import Auth from '@aws-amplify/auth'
import config from '../aws-exports'
import { AmiciiBackendCdkStack } from '../cdk-exports.json'
import { withAuthenticator } from 'aws-amplify-react-native'

import React, { useEffect } from "react";
import { NavigationContainer} from '@react-navigation/native'
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { PRIMARY, DARK_GRAY, WHITE, BLACK } from "./assets/styles";
import Home from './screens/Home'
import Matches from './screens/Matches' 
import TabBarIcon from './components/TabBarIcon';
import Profile from "./screens/Profile";
import { extractUserId } from './helpers/stringHelper'
import { useState } from 'react'
import { createNewUser, getUser } from './services/APIService'
import { UserType } from './types'
import { ActivityIndicator, View } from 'react-native'
import { newMockUser } from './assets/data/mockUsers'

const configuration = {
  ...config, 
  aws_appsync_graphqlEndpoint: AmiciiBackendCdkStack.awsappsynchgraphqlEndpoint,
  aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
  aws_appsync_region: AmiciiBackendCdkStack.awsappsynchregion,
  Analytics: {
    disabled: true,
  },
}

Amplify.configure(configuration)

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {

  const [currentUserId, setCurrentUserId] = useState<string>('')
  const [initialRouteName, setInitialRouteName] = useState<string>('Explore')
  const [currentUser, setCurrentUser] = useState<UserType | undefined>()

  useEffect(() => {
    const processUser = async () => {
      try {
        const loggedInUser = await Auth.currentUserInfo();
        const userId = extractUserId(loggedInUser.id)
        const username = loggedInUser.username
        var user = await getUser(userId) 
        if (!user) {
          const createdUserId = await createNewUser(userId, username)
          if (createdUserId) {
            user = await getUser(createdUserId)
            setInitialRouteName('Profile')
          }             
        }
        setCurrentUser(user)
        setCurrentUserId(user!.id)
      } catch (error) {
        console.log('Cannot get userId: ', error)
      }
    }

    const testNewUserProcess = () => {
      setInitialRouteName('Profile')
      setCurrentUser(newMockUser)
      setCurrentUserId(newMockUser.id)
    }
    const testUser = async (userId: string) => {
      try {
        const user = await getUser(userId)
        setCurrentUser(user)
        setCurrentUserId(user!.id)
      } catch (error) {
        console.log('Cannot get userId: ', error)
      }
    }
    // testNewUserProcess()
    // testUser('1')
    processUser()
    }, [])
  
  if (currentUser == null) return (
    <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
      <ActivityIndicator size="large" color="black" />
    </View>
  )

  return (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="Tab"
        options={{ headerShown: false, animationEnabled: false }}
      >
        {() => (
          <Tab.Navigator
            initialRouteName={initialRouteName}
            tabBarOptions={{
              showLabel: false,
              activeTintColor: PRIMARY,
              inactiveTintColor: DARK_GRAY,
              labelStyle: {
                fontSize: 14,
                textTransform: "uppercase",
                paddingTop: 10,
              },
              style: {
                backgroundColor: WHITE,
                borderTopWidth: 0,
                marginBottom: 0,
                shadowOpacity: 0.05,
                shadowRadius: 10,
                shadowColor: BLACK,
                shadowOffset: { height: 0, width: 0 },
              },
            }}
          >
            <Tab.Screen
              name="Explore"
              children={() => <Home userId={currentUserId}/>}
              options={{
                tabBarIcon: ({ focused }) => (
                  <TabBarIcon
                    focused={focused}
                    iconName="search"
                    text="Explore"
                  />
                ),
              }}
            />

            <Tab.Screen
              name="Matches"
              children={() => <Matches userId={currentUserId}/>}
              options={{
                tabBarIcon: ({ focused }) => (
                  <TabBarIcon
                    focused={focused}
                    iconName="people"
                    text="Matches"
                  />
                ),
              }}
            />

            <Tab.Screen
              name='Profile'
              children={() => <Profile user={currentUser}/>}
              options={{
                tabBarIcon: ({ focused }) => (
                  <TabBarIcon
                    focused={focused}
                    iconName="person"
                    text='Profile'
                  />
                )
              }}
            />
          </Tab.Navigator>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  </NavigationContainer>
  ) 
}

export default withAuthenticator(App);
