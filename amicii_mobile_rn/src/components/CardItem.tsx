import React from "react";
import {Text, TextInput, TouchableOpacity, View} from 'react-native'
import {CardItemType} from '../types'
import styles, { DISLIKE, DUNNO, LIKE, WINDOW_WIDTH, }from '../assets/styles'
import EmojiGrid from "./EmojiGrid";
import { nonEmpty } from "../helpers/stringHelper";

const CardItem = ({
    user,
    isLarge,
    editable,
    newUser,
    handleEditEmoji,
    handleEditBio,
    handleEditAge,
    handleEditGender
}: CardItemType) => {

    const gender = (newUser) ? '   Select Gender' : (user.genderM === 1) ? 'M' : (user.genderF === 1) ? 'F' : ''
    const age = (newUser) ? 'Select Age   ' : user.age!
    const profileEmoji = (newUser) ? '❓' : user.profileEmoji!

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

    const ageGenderStyle = [
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
                }}>{profileEmoji}</Text>
            </TouchableOpacity>
            <Text style={nameStyle}>{user.username!}</Text>
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity onPress={handleEditAge} disabled={!newUser}>
                    <Text style={ageGenderStyle}>{age}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleEditGender} disabled={!newUser}>
                    <Text style={ageGenderStyle}>{gender}</Text>
                </TouchableOpacity>
            </View>
            <EmojiGrid handlePress={handleEditEmoji!!} emojis={user.features} editable={editable || newUser} isLarge={isLarge}/>
            {nonEmpty(user.bio!) && isLarge && (
             <TextInput 
             editable={editable || newUser}
             multiline={true}
             style={styles.cardItemBio}
             onChangeText={handleEditBio}
             >{user.bio!}</TextInput>
            )}
            <View style={{padding:isLarge ? 20 : 10 }}/>
        </View>
    )
}

export default CardItem