import { string } from "prop-types"
import React from "react"
import { View } from "react-native"
import EmojiSelector, { Categories } from 'react-native-emoji-selector'
import { SafeAreaView } from "react-native-safe-area-context"
import styles from "../assets/styles"

const EmojiPicker = ({selectedEmoji}: {selectedEmoji: (emoji: string) => void}) => (
        <>
        <View style={styles.profileTop} />
        <EmojiSelector
        onEmojiSelected={selectedEmoji} 
        showTabs={false}
        />
        </>
)

export default EmojiPicker