import React from 'react'
import {Text, TouchableOpacity} from 'react-native'
import styles, {GRAY} from '../assets/styles'
import Icon from './Icon'

const EditButton = (props: {isEditing: boolean; handlePress: () => void}) => (
  <TouchableOpacity style={styles.buttonGeneral} onPress={props.handlePress}>
    <Text style={styles.buttonText}>
      <Icon name="ios-create-outline" size={15} color={GRAY} />{' '}
      {`${props.isEditing ? 'SAVE' : 'EDIT'}`}
    </Text>
  </TouchableOpacity>
)

export default EditButton
