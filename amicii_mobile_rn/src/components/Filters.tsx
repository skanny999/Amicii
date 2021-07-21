import React from "react";
import {Text, TouchableOpacity} from 'react-native'
import styles, { GRAY } from "../assets/styles";
import Icon from './Icon'

const Filters = () => (
    <TouchableOpacity style={styles.buttonGeneral}>
        <Text style={styles.buttonText}>
            <Icon name='filter' size={13} color={GRAY}/> Filters
        </Text>
    </TouchableOpacity>
)

export default Filters
