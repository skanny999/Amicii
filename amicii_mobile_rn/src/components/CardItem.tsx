import React from "react";
import {Text, TouchableOpacity, StyleSheet, View} from 'react-native'
import Icon from './Icon'
import {CardItemType} from '../types'
import {BLACK, DARK_GRAY, DISLIKE, GRAY, LIKE, DUNNO, WHITE} from '../assets/styles/colors'
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../assets/styles/sizes'

const CardItem = ({
    name,
    emoji,
    bio,
    hasAction,
    isLarge
}: CardItemType) => {

    const profileImageStyle = [
        {
            width: isLarge ? WINDOW_WIDTH - 80 : WINDOW_WIDTH / 2 - 30,
            height: 170,
            margin: isLarge ? 20 : 0
        }
    ]

    const emojiStyle = [
        {
            paddingTop: isLarge ? 30 : 20,
            textAlign: 'center',
            fontSize: isLarge ? 120 : 60
        }
    ]

    const nameStyle = [
        {
            paddingTop: isLarge ? 15 : 10,
            paddingBottom: isLarge ? 7 : 5,
            color: '#363637',
            fontSize: isLarge ? 30 : 15
        }
    ]

    return (
        <View style={styles.container}>
            <View style={profileImageStyle}>
                <Text style={{
                    paddingTop: isLarge ? 30 : 20,
                    textAlign: 'center',
                    fontSize: isLarge ? 120 : 60
                }}>{emoji}</Text>
            </View>
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

const cardHeigth = WINDOW_HEIGHT * 0.75

const styles = StyleSheet.create({
    container: {
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
    profileImage: {
        
    },
    emoji: {
        paddingTop: 30,
        fontSize: 120,
        textAlign: 'center'
    },
    bio: {
        color: GRAY,
        textAlign: 'center',
        height: cardHeigth / 4
    },
    action: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        // alignItems: 'baseline',
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