import React from "react";
import {Text, TouchableOpacity} from "react-native";
import Icon from './Icon'
import styles, { DARK_GRAY } from '../assets/styles'

const Location = () => (
    <TouchableOpacity style={styles.locationGeneral}>
        <Text style={styles.locationText}>
            <Icon name="location" size={13} color={DARK_GRAY} /> London
        </Text>
    </TouchableOpacity>
)

export default Location
