import React from "react"
import { FlatList, StyleSheet, Text } from "react-native"
import styles from "../assets/styles"
interface EmojiProps {
    emojis: string[],
    editable: boolean,
    isLarge: boolean
}

const EmojiGrid = (props: EmojiProps) => {

    return(
        <FlatList
            contentContainerStyle={emojiStyles(props.isLarge).grid}
            numColumns={5}
            data={props.emojis}
            keyExtractor={(item, index) => "E" + index.toString()}
            renderItem={({ item }) => {
                return <Text style={emojiStyles(props.isLarge).item}>{item}</Text>
            }}
        />
    )
}

export default EmojiGrid

const emojiStyles = (isLarge: boolean) => StyleSheet.create({
    grid: {
        marginBottom: isLarge ? 32 : 32,
        marginTop: isLarge ? 10 : 8,
        alignItems: 'center'
    },
    item: {
        margin: 5,
        width: isLarge ? 25 : 15,
        color: 'white',
        alignItems: 'center',
        fontSize:isLarge ? 20 : 12
    },
})