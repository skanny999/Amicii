import React from "react"
import { View, TextInput, StyleProp, TextStyle } from "react-native"

const CardText = (props: {
    editable: boolean, 
    styles: StyleProp<TextStyle>, 
    handleEditText?: (text: string) => void, 
    text: string, 
    placeholder?: string
}) => {
    return (
        <View>
            <TextInput 
            multiline={true}
            placeholder={props.placeholder}
            style={props.styles} 
            onChangeText={props.handleEditText} 
            editable={props.editable}
            >{props.text}
            </TextInput>
        </View>
    )
} 
