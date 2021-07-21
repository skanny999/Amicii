import React from "react";
import {Text, TouchableOpacity, View} from 'react-native'
import Icon from './Icon'
import {CardItemType} from '../types'
import styles, { DISLIKE, DUNNO, LIKE, WINDOW_WIDTH, }from '../assets/styles'

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
            margin: isLarge ? 20 : 0, 
            borderRadius: 8
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
        <View style={styles.cardItemContainer}>
            <View style={profileImageStyle}>
                <Text style={{
                    paddingTop: isLarge ? 30 : 20,
                    textAlign: 'center',
                    fontSize: isLarge ? 120 : 60
                }}>{emoji}</Text>
            </View>
            <Text style={nameStyle}>{name}</Text>
            {bio && (
             <Text style={styles.cardItemBio}>{bio}</Text>
            )}
            {hasAction && (
                <View style={styles.cardItemAction}>
                    <TouchableOpacity style={styles.cardItemButton}>
                        <Icon name='close' size={35} color={DISLIKE}/>
                    </TouchableOpacity>
                <TouchableOpacity style={styles.cardItemSmallButton}>
                        <Icon name='help' size={35} color={DUNNO}/>    
                    </TouchableOpacity>
                <TouchableOpacity style={styles.cardItemButton}>
                        <Icon name='checkmark' size={35} color={LIKE}/>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}

export default CardItem