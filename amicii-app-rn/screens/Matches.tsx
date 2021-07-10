import React from 'react'
import { ImageBackground, StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native'
import { DARK_GRAY } from '../assets/styles/colors'
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../assets/styles/sizes'
import MockUsers from '../assets/data/mockUsers'
import Icon from '../components/Icon'
import CardItem from '../components/CardItem'

const Matches = () => (
    <ImageBackground
    source={require('../assets/images/background.png')}
    style={styles.background}
    >
        <View style={styles.container}>
            <View style={styles.top}>
                <Text style={styles.title}>Matches</Text>
                <TouchableOpacity>
                    <Icon name='ellipsis-vertical' color={DARK_GRAY} size={20}></Icon>
                </TouchableOpacity>
            </View>
        </View>

        <FlatList
        numColumns={2}
        data={MockUsers}
        keyExtractor={(user, index) => index.toString()}
        renderItem={({item}) => (
            <TouchableOpacity>
                <CardItem
                emoji={item.emoji}
                name={item.name}
                bio={item.bio}
                />
            </TouchableOpacity>
        )}
        />
    </ImageBackground>
)

export default Matches

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        width: WINDOW_WIDTH,
        height: WINDOW_HEIGHT
    },
    container: {
        justifyContent: 'space-between',
        flex: 1,
        paddingHorizontal: 10
    },
    top: {
        paddingTop: 50,
        marginHorizontal: 10,
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        paddingBottom: 10, 
        fontSize: 22, 
        color: DARK_GRAY 
    }
})
