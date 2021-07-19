import React from "react";
import {Text, TouchableOpacity, StyleSheet} from 'react-native'
import Icon from './Icon'
import {BLACK, DARK_GRAY, GRAY, WHITE} from "../assets/styles/colors";

const Filters = () => (
    <TouchableOpacity style={styles.general}>
        <Text style={styles.text}>
            <Icon name='filter' size={13} color={GRAY}/> Filters
        </Text>
    </TouchableOpacity>
)

export default Filters

const styles = StyleSheet.create({
    general: {
        backgroundColor: WHITE,
        padding: 10,
        borderRadius: 20,
        width: 90,
        elevation: 1,
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowColor: BLACK,
        shadowOffset: {height: 0, width: 0}
    },
    text: {
        color: DARK_GRAY,
        fontSize: 13,
        textAlign: 'center'
    }
})
