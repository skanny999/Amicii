import React from 'react'
import { ImageBackground, StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native'
import MockUsers from '../assets/data/mockUsers'
import Icon from '../components/Icon'
import CardItem from '../components/CardItem'
import styles, { DARK_GRAY } from '../assets/styles'

const Matches = () => (
    <ImageBackground
    source={require('../assets/images/background.png')}
    style={styles.matchesBackground}
    >
        <View style={styles.matchesContainer}>
            <View style={styles.matchesTop}>
                <Text style={styles.matchesTitle}>Matches</Text>
                <TouchableOpacity>
                    <Icon name='ellipsis-vertical' color={DARK_GRAY} size={20}></Icon>
                </TouchableOpacity>
            </View>

            <FlatList
            numColumns={2}
            data={MockUsers}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
                <TouchableOpacity>
                    <CardItem
                    emoji={item.emoji}
                    name={item.name}
                    bio={item.bio}
                    age={item.age}
                    features={item.features}
                    isLarge={false}
                    editable={false} 
                    handleEditEmoji={() => {}}      
                    />
                </TouchableOpacity>
            )}
            />
        </View>
    </ImageBackground>
)

export default Matches
