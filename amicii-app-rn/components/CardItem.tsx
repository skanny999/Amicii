import React from "react";
import {Text, TouchableOpacity, StyleSheet, Image, Dimensions, View} from 'react-native'
import Icon from './Icon'
import {CardItemType} from "../types";

const CardItem = ({
    name,
    emoji,
    bio,
    hasAction,
    hasVariant
}: CardItemType) => {
    const fullWidth = Dimensions.get('window').width

    const imageStyle = [
        {
            borderRadius: 8,
            width: hasVariant ? fullWidth / 2 - 30 : fullWidth - 80,
            height: hasVariant ? 170 : 350,
            margin: hasVariant ? 0 : 20
        }
    ]

    const nameStyle = [
        {
            paddingTop: hasVariant ? 10 : 15,
            paddingBottom: hasVariant ? 5 : 7,
            color: '#363637',
            fontSize: hasVariant ? 15 : 30
        }
    ]

    return (
        <View style={styles.container}>
            <Text style={styles.emoji}>{emoji}</Text>
            <Text style={nameStyle}>{name}</Text>
            {bio && (
             <Text style={styles.bio}>{bio}</Text>
            )}
            {hasAction && (
                <View style={styles.action}>
                    <TouchableOpacity style={styles.smallButton}>
                        <Icon name='star' size={14} color={'yellow'}/>
                    </TouchableOpacity>
                <TouchableOpacity style={styles.smallButton}>
                        <Icon name='heart' size={25} color={'red'}/>
                    </TouchableOpacity>
                <TouchableOpacity style={styles.smallButton}>
                        <Icon name='close' size={25} color={'black'}/>
                    </TouchableOpacity>
                <TouchableOpacity style={styles.smallButton}>
                        <Icon name='flash' size={14} color={'green'}/>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}

export default CardItem

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 8,
        alignItems: 'center',
        margin: 10,
        elevation: 1,
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowColor: 'black',
        shadowOffset: {height: 0, width: 0}
    },
    emoji: {
        size: 60,
        textAlign: 'center'
    },
    bio: {
        color: 'gray',
        textAlign: 'center'
    },
    action: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 30
    },
    button: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'white',
        marginHorizontal: 7,
        alignItems: "center",
        justifyContent: "center",
        elevation: 1,
        shadowOpacity: 0.15,
        shadowRadius: 20,
        shadowColor: 'dark_grey',
        shadowOffset: { height: 10, width: 0 },
    },
    smallButton: {
        width: 40,
        height: 40,
        borderRadius: 30,
        backgroundColor: 'white',
        marginHorizontal: 7,
        alignItems: "center",
        justifyContent: "center",
        elevation: 1,
        shadowOpacity: 0.15,
        shadowRadius: 20,
        shadowColor: 'dark_grey',
        shadowOffset: { height: 10, width: 0 },
    }
})