import React, { useState } from 'react'
import { View, ImageBackground, TouchableOpacity, Modal, Pressable, Text } from 'react-native';
import CardStack, { Card } from 'react-native-card-stack-swiper'
import styles, { DISLIKE, DUNNO, LIKE } from '../assets/styles'
import Filters from "../components/Filters";
import MockUsers from '../assets/data/mockUsers'
import CardItem from "../components/CardItem";
import Icon from '../components/Icon'
import Logout from '../components/Logout';
import Auth from '@aws-amplify/auth'
import { UserType } from '../types';

const Home = (props: {userId?: string}) => {
    
    const [swiper, setSwiper] = useState<CardStack | null>(null)
    const [candidates, setCandidates] = useState<UserType[] | null>(null)
    const [modalVisible, setModalVisible] = useState(false)

    const logoutPressed = () => Auth.signOut()
    const handleShowFilter = () => setModalVisible(true)

    return (
        <ImageBackground
            source={require('../assets/images/background.png')}
            style={styles.homeBackground}>
            <View style={styles.homeContainer}>
                <View style={styles.homeTop}>
                    <Filters handlePress= { handleShowFilter }/>
                    <Logout handlePress={ logoutPressed }/>
                </View>
                <View style={{flex: 2}}>
                    <CardStack
                        loop
                        verticalSwipe={true}
                        renderNoMoreCards={() => null}
                        ref={(newSwiper): void => setSwiper(newSwiper)}>
                        {MockUsers.map((user) => (
                            <Card key={user.id}>
                                <CardItem 
                                name={user.username!} 
                                emoji={user.profileEmoji!} 
                                age={user.age!}
                                bio={user.bio!}
                                genderM={user.genderM!}
                                genderF={user.genderF!}
                                features={user.features}
                                hasAction={true}
                                isLarge={true}
                                editable={false}
                                />
                            </Card>
                        ))}
                    </CardStack>
                </View>
                <View style={styles.cardStackAction}>
                    <TouchableOpacity 
                    style={styles.cardStackButton}
                    onPress={() => swiper?.swipeLeft()}>
                        <Icon name='close' size={35} color={DISLIKE}/>
                    </TouchableOpacity>
                <TouchableOpacity 
                style={styles.cardStackSmallButton}
                onPress={() => swiper?.swipeTop()}>
                        <Icon name='help' size={35} color={DUNNO}/>    
                    </TouchableOpacity>
                <TouchableOpacity 
                style={styles.cardStackButton} 
                onPress={() => swiper?.swipeRight()}>
                        <Icon name='checkmark' size={35} color={LIKE}/>
                    </TouchableOpacity>
                </View>
            </View>
            <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalCenteredView}>
          <View style={styles.modalView}>
            <Pressable
              style={[styles.modalButton, styles.modalButtonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.modalTextStyle}>Close</Text>
            </Pressable>
        
          </View>
        </View>
      </Modal>
        </ImageBackground>
    )
}

export default Home
