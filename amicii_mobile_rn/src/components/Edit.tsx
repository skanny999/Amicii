import React from "react"
import { Text, TouchableOpacity } from "react-native"
import styles, { GRAY } from "../assets/styles"
import Icon from './Icon'

const Edit = () => (
    <TouchableOpacity style={styles.buttonGeneral}>
    <Text style={styles.buttonText}>
        <Icon name='ios-create-outline' size={13} color={GRAY}/> Edit
    </Text>
</TouchableOpacity>
)

export default Edit