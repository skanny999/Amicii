// import Amplify from 'aws-amplify'
// import config from '../src/aws-exports'
// import { AmiciiBackendCdkStack } from '../cdk-exports.json'

import React from "react";
import { NavigationContainer} from '@react-navigation/native'
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { PRIMARY, DARK_GRAY, WHITE, BLACK } from "./src/assets/styles";
import Home from './src/screens/Home'
import Matches from './src/screens/Matches' 
import TabBarIcon from './src/components/TabBarIcon';
import Profile from "./src/screens/Profile";

// const CDKConfig = {
//   aws_appsynch_graphqlEndpoint: AmiciiBackendCdkStack.awsappsynchgraphqlEndpoint,
//   aws_appsynch_authenticationType: AmiciiBackendCdkStack.awsappsynchauthenticationType,
//   aws_appsynch_apikey: AmiciiBackendCdkStack.awsappsynchapikey
// }

// Amplify.configure({
//   ...config, CDKConfig
// })

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => (

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
);

export default App;
