import React from "react";
import {Text, TextInput, TouchableOpacity, View} from 'react-native'
import Icon from './Icon'
import {CardItemType} from '../types'
import styles, { DISLIKE, DUNNO, LIKE, WINDOW_WIDTH, }from '../assets/styles'
import EmojiGrid from "./EmojiGrid";

const CardItem = ({
    name,
    emoji,
    age,
    bio,
    features,
    hasAction,
    isLarge,
    editable,
    handleEditEmoji,
    handleEditBio
}: CardItemType) => {


    const profileImageStyle = [
        {
            width: isLarge ? WINDOW_WIDTH - 80 : WINDOW_WIDTH / 2 - 30,
            height: isLarge ? 150 : 100,
            margin: 0, 
            borderRadius: 8
        }
    ]

    const nameStyle = [
        {
            paddingTop: isLarge ? 15 : 10,
            paddingBottom: isLarge ? 5 : 3,
            color: '#363637',
            fontSize: isLarge ? 30 : 20
        }
    ]


    const ageStyle = [
        {
            paddingBottom: isLarge ? 15 : 10,
            color: '#363637',
            fontSize: isLarge ? 20 : 15
        }
    ]

    return (
        <View style={styles.cardItemContainer}>
            <TouchableOpacity 
            style={profileImageStyle}
            disabled={!editable}
            onPress={() => handleEditEmoji!!(-1)}>
                <Text style={{
                    paddingTop: 20,
                    textAlign: 'center',
                    fontSize: isLarge ? 100 : 60
                }}>{emoji}</Text>
            </TouchableOpacity>
            <Text style={nameStyle}>{name}</Text>
            <Text style={ageStyle}>{age}</Text>
            <EmojiGrid handlePress={handleEditEmoji!!} emojis={features} editable={editable} isLarge={isLarge}/>
            {bio && isLarge &&(
             <TextInput 
             editable={editable}
             multiline={true}
             style={styles.cardItemBio}
             onChangeText={handleEditBio}
             >{bio}</TextInput>
            )}
            <View style={{padding:isLarge ? 20 : 10 }}/>
        </View>
    )
}

export default CardItem