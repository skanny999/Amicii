import React from 'react'
import {Text, TouchableOpacity} from 'react-native'
import styles, {GRAY} from '../assets/styles'
import Icon from './Icon'

const Filters = (props: {handlePress: () => void}) => (
  <TouchableOpacity style={styles.buttonGeneral} onPress={props.handlePress}>
    <Text style={styles.buttonText}>
      <Icon name="filter" size={13} color={GRAY} /> Filters
    </Text>
  </TouchableOpacity>
)

export default Filters
