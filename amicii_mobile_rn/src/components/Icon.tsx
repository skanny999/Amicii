import React from 'react'

import {IconType} from '../types'
import Ionicons from 'react-native-vector-icons/Ionicons'

Ionicons.loadFont().then()

const Icon = ({name, size, color, style}: IconType) => (
  <Ionicons name={name} size={size} color={color} style={style} />
)

export default Icon
