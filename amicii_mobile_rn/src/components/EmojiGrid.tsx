import React from "react"
import { FlatList, StyleSheet, Text } from "react-native"
interface EmojiProps {
    emojis: string[],
    editable: boolean,
    isLarge: boolean
}

const EmojiGrid = (props: EmojiProps) => {

    return(
        <FlatList
            contentContainerStyle={emojiStyles(props.isLarge).grid}
            scrollEnabled={false}
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
        marginBottom: 20,
        marginTop: 20,
        paddingBottom: 30,
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