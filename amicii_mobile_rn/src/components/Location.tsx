import React from "react";
import {Text, TouchableOpacity, StyleSheet} from "react-native";
import Icon from './Icon'
import {BLACK, DARK_GRAY, WHITE} from "../assets/styles/colors";

const Location = () => (
    <TouchableOpacity style={styles.general}>
        <Text style={styles.text}>
            <Icon name="location" size={13} color={DARK_GRAY} /> London
        </Text>
    </TouchableOpacity>
)

export default Location

const styles = StyleSheet.create({
    general: {
        backgroundColor: WHITE,
        borderRadius: 20,
        width: 100,
        elevation: 1,
        padding: 10,
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
