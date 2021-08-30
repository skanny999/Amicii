import React from 'react'
import {Text, View} from 'react-native'
import styles, {DARK_GRAY, PRIMARY} from '../assets/styles'
import {TabBarIconType} from '../types'
import Icon from './Icon'

const TabBarIcon = ({focused, iconName, text}: TabBarIconType) => {
  const isFocused = focused ? PRIMARY : DARK_GRAY

  return (
    <View style={styles.tabBarIconMenu}>
      <Icon name={iconName} size={16} color={isFocused} />
      <Text style={[styles.tabBarIconText, {color: isFocused}]}>{text}</Text>
    </View>
  )
}

export default TabBarIcon
