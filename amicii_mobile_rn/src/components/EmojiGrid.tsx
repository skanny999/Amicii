import React from "react"
import { FlatList, StyleSheet, Text, TouchableOpacity } from "react-native"
import { emojiFromString } from "../helpers/emojiEncoder"
interface EmojiProps {
    emojis: string[],
    editable: boolean,
    isLarge: boolean,
    handlePress: (index: number) => void,
}

const EmojiGrid = (props: EmojiProps) => {

    const emoji = (item: string) => {
        if (!item) {
            return '❓'
        } else {
            return (item.includes('PH')) ? '❓' : emojiFromString(item)
        }
    }

    return(
        <FlatList
            contentContainerStyle={emojiStyles(props.isLarge).grid}
            scrollEnabled={false}
            numColumns={5}
            data={props.emojis}
            keyExtractor={(item, index) => "E" + index.toString()}
            renderItem={({ item, index }) => {
                return  <TouchableOpacity 
                            disabled={!props.editable} 
                            onPress={() => props.handlePress(index)} >       
                            <Text style={emojiStyles(props.isLarge).item}>{emoji(item)}</Text>
                        </TouchableOpacity>
            }}
        />
    )
}

export default EmojiGrid

const emojiStyles = (isLarge: boolean) => StyleSheet.create({
    grid: {
        marginBottom: 20,
        marginTop: 20,
        paddingBottom: 30,
        alignItems: 'center'
    },
    item: {
        margin: 5,
        width: isLarge ? 35 : 20,
        color: 'white',
        alignItems: 'center',
        fontSize:isLarge ? 20 : 12
    },
})