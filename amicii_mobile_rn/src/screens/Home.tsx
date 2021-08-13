import React, { useEffect, useState } from 'react'
import { View, ImageBackground, TouchableOpacity, Modal, Pressable, Text, ActivityIndicator } from 'react-native';
import CardStack, { Card } from 'react-native-card-stack-swiper'
import styles, { DISLIKE, DUNNO, LIKE } from '../assets/styles'
import Filters from "../components/Filters";
import CardItem from "../components/CardItem";
import Icon from '../components/Icon'
import Logout from '../components/Logout';
import Auth from '@aws-amplify/auth'
import { UserType } from '../types';
import { createNewUser, getUser, getCandidates, likeUser, dislikeUser } from '../services/APIService';
import mockUsers from '../assets/data/mockUsers';
import {user} from "../assets/data/mockUsers"

const Home = (props: {userId: string}) => {
    
    const [swiper, setSwiper] = useState<CardStack | null>(null)
    const [candidates, setCandidates] = useState<UserType[] | null>(null)
    const [filtersModalVisible, setFiltersModalVisible] = useState(false)
    const [newUserModalVisible, setNewUserModalVisible] = useState(false)
    const [currentUser, setCurrentUser] = useState<UserType | null>(user)

    const logoutPressed = () => Auth.signOut()
    const handleShowFilter = () => setFiltersModalVisible(true)

    useEffect(() => {
        const processUser = async () => {
            console.log('Processing user with id: ', props.userId)
            try {
                if (props.userId != '') {
                    const currentUser = await getUser(props.userId)
                    if (currentUser == null) {
                        const newUserId = await createNewUser(props.userId)
                        if (newUserId != null) {
                            const newUser = await getUser(props.userId)
                            setCurrentUser(newUser!)
                            setNewUserModalVisible(true)
                        }
                    }
                    const candidatesResponse =  await getCandidates(props.userId)
                    console.log(candidatesResponse)
                    setCandidates(candidatesResponse!)
                }
            } catch (err) {
                console.log(err)
            }
        }
        processUser()
    },[props.userId])

    if (candidates == null) return (
        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
          <ActivityIndicator size="large" color="black" />
        </View>
      )

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
                        {mockUsers.map((user) => (
                            <Card 
                            key={user.id} 
                            onSwipedRight={() => likeUser(props.userId, user.id!)}
                            onSwipedLeft={() => dislikeUser(props.userId, user.id!)}>
                                <CardItem 
                                user={user}
                                isLarge={true}
                                editable={false}
                                newUser={false}
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
        visible={filtersModalVisible}
        onRequestClose={() => { setFiltersModalVisible(!filtersModalVisible)}}
        >
            <View style={styles.modalCenteredView}>
            <View style={styles.modalView}>
                <Pressable
                style={[styles.modalButton, styles.modalButtonClose]}
                onPress={() => setFiltersModalVisible(!filtersModalVisible)}>
                    <Text style={styles.modalTextStyle}>Close</Text>
                </Pressable>
            </View>
            </View>
        </Modal>
        <Modal
            animationType="slide"
            transparent={false}
            visible={newUserModalVisible}
            onRequestClose={() => { setFiltersModalVisible(!filtersModalVisible)}}
            >
            <View style={styles.modalCenteredView}>
            <View style={styles.modalView}>
                <Pressable
                style={[styles.modalButton, styles.modalButtonClose]}
                onPress={() => setNewUserModalVisible(!newUserModalVisible)}>
                    <Text style={styles.modalTextStyle}>NewUser</Text>
                </Pressable>
            </View>
            </View>
        </Modal>
    </ImageBackground>
    )
}

export default Home
