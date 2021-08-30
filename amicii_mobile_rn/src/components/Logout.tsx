import React from 'react'
import {Text, TouchableOpacity} from 'react-native'
import styles, {GRAY} from '../assets/styles'
import Icon from './Icon'

const Logout = (props: {handlePress: () => void}) => (
  <TouchableOpacity
    testID={'LogoutButton'}
    style={styles.buttonGeneral}
    onPress={props.handlePress}>
    <Text style={styles.buttonText}>
      <Icon name="log-out-outline" size={13} color={GRAY} /> Logout
    </Text>
  </TouchableOpacity>
)

export default Logout
