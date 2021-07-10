import React from "react";
import {Text, TouchableOpacity, StyleSheet, Dimensions, View} from 'react-native'
import Icon from './Icon'
import {CardItemType} from "../types";
import {BLACK, DARK_GRAY, DISLIKE, GRAY, LIKE, DUNNO, WHITE} from "../assets/styles/colors";
import { WINDOW_HEIGHT, WINDOW_WIDTH } from "../assets/styles/sizes";

const CardItem = ({
    name,
    emoji,
    bio,
    hasAction
}: CardItemType) => {

    const nameStyle = [
        {
            paddingTop: 15,
            paddingBottom: 7,
            color: '#363637',
            fontSize: 30
        }
    ]

    return (
        <View style={styles.container}>
            <Text style={styles.emoji}>{emoji}</Text>
            <Text style={nameStyle}>{name}</Text>
            {bio && (
             <Text style={styles.bio}>{bio}</Text>
            )}
            {hasAction && (
                <View style={styles.action}>
                    <TouchableOpacity style={styles.button}>
                        <Icon name='close' size={35} color={DISLIKE}/>
                    </TouchableOpacity>
                <TouchableOpacity style={styles.smallButton}>
                        <Icon name='help' size={35} color={DUNNO}/>    
                    </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                        <Icon name='checkmark' size={35} color={LIKE}/>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}

export default CardItem

const styles = StyleSheet.create({
    container: {
        width: WINDOW_WIDTH - 40,
        height: WINDOW_HEIGHT * 0.6,
        backgroundColor: WHITE,
        borderRadius: 8,
        alignItems: "center",
        margin: 10,
        elevation: 1,
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowColor: BLACK,
        shadowOffset: { height: 0, width: 0 },
    },
    emoji: {
        fontSize: 100,
        textAlign: 'center'
    },
    bio: {
        color: GRAY,
        textAlign: 'center'
    },
    action: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 30
    },
    button: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: WHITE,
        marginHorizontal: 7,
        alignItems: "center",
        justifyContent: "center",
        elevation: 1,
        shadowOpacity: 0.15,
        shadowRadius: 20,
        shadowColor: DARK_GRAY,
        shadowOffset: { height: 10, width: 0 },
    },
    smallButton: {
        width: 40,
        height: 40,
        borderRadius: 30,
        backgroundColor: WHITE,
        marginHorizontal: 7,
        alignItems: "center",
        justifyContent: "center",
        elevation: 1,
        shadowOpacity: 0.15,
        shadowRadius: 20,
        shadowColor: DARK_GRAY,
        shadowOffset: { height: 10, width: 0 },
    }
})