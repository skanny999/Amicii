import React from "react"
import { Text, View, StyleSheet} from "react-native"
import { DARK_GRAY, PRIMARY } from "../assets/styles/colors"
import { TabBarIconType } from "../types"
import Icon from "./Icon"

const TabBarIcon = ({ focused, iconName, text}: TabBarIconType) => {
    const isFocused = focused ? PRIMARY : DARK_GRAY

    return (
        <View style={styles.iconMenu}>
           <Icon name={iconName} size={16} color={isFocused}/>
           <Text style={[styles.buttonText, { color: isFocused}]}>{text}</Text> 
        </View>
    )
}

export default TabBarIcon

const styles = StyleSheet.create({
    iconMenu: {
        alignItems: "center"
    },
    buttonText: {
        textTransform: "uppercase"
    }
})