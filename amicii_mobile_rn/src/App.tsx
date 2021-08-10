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
import { createNewUser, getCandidates, getUser, updateCurrentUser } from './services/APIService';
import { UserType } from './types'



const configuration = {
  ...config, 
  aws_appsync_graphqlEndpoint: AmiciiBackendCdkStack.awsappsynchgraphqlEndpoint,
  aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
  aws_appsync_region: "eu-west-2",
  Analytics: {
    disabled: true,
  },
}

Amplify.configure(configuration)

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export const sampleUser: UserType = {
  id: "test2",
  username: "mark",
  age: 22,
  bio: "this sapore",
  genderM: 1,
  genderF: 0,
  profileEmoji: "1f45e",
  features: [
    '1f614',
    '1f452',
    '1f367',
    '1f343',
    '26a7',
    '26f9 1f3fd 200d 2640 fe0f',
    '1f682',
    '1f558',
    '1f9ae',
    '1f54b',
  ]
};

const App = () => {

  useEffect(() => {

  }, [])

  

  // const authenticatedUser = Auth.currentAuthenticatedUser().then(user => console.log("AUTHENTICATED USER: ", user))


  const currentUser = Auth.currentUserInfo()
  currentUser.then(result => console.log(`CURRENT USER: ${result.id}`))




  return (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="Tab"
        options={{ headerShown: false, animationEnabled: false }}
      >
        {() => (
          <Tab.Navigator
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
              component={Home}
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
              component={Matches}
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
              component={Profile}
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
