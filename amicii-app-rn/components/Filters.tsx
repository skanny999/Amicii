import React from "react";
import {Text, TouchableOpacity, StyleSheet} from 'react-native'
import Icon from './Icon'

const Filters = () => (
    <TouchableOpacity style={styles.general}>
        <Text style={styles.text}>
            <Icon name='filter' size={13} color={'dark_grey'}/> Filters
        </Text>
    </TouchableOpacity>
)

export default Filters

const styles = StyleSheet.create({
    general: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 20,
        width: 90,
        elevation: 1,
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
