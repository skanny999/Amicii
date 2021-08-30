import React from 'react'
import {Text, TouchableOpacity} from 'react-native'
import styles, {GRAY} from '../assets/styles'
import Icon from './Icon'

const CancelButton = (props: {handlePress: () => void}) => (
  <TouchableOpacity style={styles.buttonGeneral} onPress={props.handlePress}>
    <Text style={styles.cancelButtonText}>
      <Icon name="ios-close" size={14} color={GRAY} /> CANCEL
    </Text>
  </TouchableOpacity>
)

export default CancelButton
