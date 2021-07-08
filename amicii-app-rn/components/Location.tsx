import React from "react";
import {Text, TouchableOpacity, StyleSheet} from "react-native";
import Icon from './Icon'

const Location = () => (
    <TouchableOpacity style={styles.general}>
        <Text style={styles.text}>
            <Icon name="location" size={13} color={'dark_gray'} /> London
        </Text>
    </TouchableOpacity>
)

export default Location

const styles = StyleSheet.create({
    general: {
        backgroundColor: 'white',
        padding: 10,
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowColor: 'black',
        shadowOffset: {height: 0, width: 0}
    },
    text: {
        color: 'dark_grey',
        fontSize: 13,
        textAlign: 'center'
    }
})
