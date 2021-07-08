import React from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, Text, View } from 'react-native';

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
            name="Tab"
            options={ {animationEnabled: false, headerShown: false} }
        >
          {() => (
              <Tab.Navigator
                tabBarOptions={{
                  activeTintColor: "red",
                  inactiveTintColor: "dark_gray",
                  showLabel: false,
                  labelStyle: { fontSize: 14, textTransform: 'uppercase', paddingTop: 10 },
                  style: styles.tabBar
                }}
              >


              </Tab.Navigator>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    backgroundColor: 'WHITE',
    marginBottom: 0,
    borderTopWidth: 0,
    shadowColor: 'black',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { height: 0, width: 0 }
  }
});
