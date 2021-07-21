import React from "react"
import { FlatList, Text } from "react-native"
import styles from "../assets/styles"

const items = ["👩🏽‍🚀", "🙈","🐭", "😁","😺", "👘","🐲", "🫓","🎭", "🏢"]

const EmojiGrid = () => {
    return(
        <FlatList
            contentContainerStyle={styles.emojiGrid}
            numColumns={5}
            data={items}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
                return <Text style={styles.emojiItem}>{item}</Text>
            }}
        />
    )
}

export default EmojiGrid