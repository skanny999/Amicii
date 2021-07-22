import React from "react"
import { View } from "react-native"
import EmojiSelector from 'react-native-emoji-selector'
import { SafeAreaView } from "react-native-safe-area-context"
import styles from "../assets/styles"

const EmojiPicker = () => (
        <>
        <View style={styles.profileTop} />
        <EmojiSelector onEmojiSelected={emoji => console.log(emoji)} />
        </>
)

export default EmojiPicker