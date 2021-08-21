import React from 'react';
import { View, Text } from 'react-native';
import styles from '../assets/styles';
import { emojiFromString } from '../helpers/emojiEncoder';
import { MessageType } from '../types';


const Message = ({emoji, name}: MessageType) => (
    <View style={styles.containerMessage}>
        <Text style={styles.messageEmoji}>{emojiFromString(emoji)}</Text>
        <Text style={styles.messageName}>{name}</Text>
    </View>
)

export default Message
