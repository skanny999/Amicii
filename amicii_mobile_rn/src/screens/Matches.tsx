import React, { useState } from 'react'
import { ImageBackground, View, Text, TouchableOpacity, FlatList, Modal, Pressable } from 'react-native'
import MockUsers from '../assets/data/mockUsers'
import Icon from '../components/Icon'
import CardItem from '../components/CardItem'
import styles, { DARK_GRAY } from '../assets/styles'
import { UserType } from '../types';

const Matches = () => {

    const [modalVisible, setModalVisible] = useState(false)

    const showUserDetails = (user: UserType) => {
        setModalVisible(true)
    }

    return (
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
                    <TouchableOpacity onPress={() => showUserDetails(item)}>
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
                        <Modal
                            animationType="slide"
                            transparent={false}
                            visible={modalVisible}
                            onRequestClose={() => {
                              setModalVisible(!modalVisible);
                            }}>
                        <View style={styles.modalCenteredView}>
                            <View style={styles.modalView}>
                            <Pressable
                                style={[styles.modalButton, styles.modalButtonClose]}
                                onPress={() => setModalVisible(!modalVisible)}>
                                <Text style={styles.modalTextStyle}>Close</Text>
                            </Pressable>
                            <CardItem
                            emoji={item.emoji}
                            name={item.name}
                            bio={item.bio}
                            age={item.age}
                            features={item.features}
                            isLarge={true}
                            editable={false} 
                            handleEditEmoji={() => {}}/>
                            </View>
                            </View>
                        </Modal>
                    </TouchableOpacity>
                )}/>
            </View>
        </ImageBackground>
    )
}

export default Matches
