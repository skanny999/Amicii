import React from "react";
import { Ionicons } from "@expo/vector-icons"
import { IconType } from '../types'

const Icon = ({ name, size, color, style }: IconType) => (
    <Ionicons name={name} size={size} color={color} style={style}/>
)

export default Icon

