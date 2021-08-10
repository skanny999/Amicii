import React, { useState } from 'react'
import { View, ImageBackground, TouchableOpacity } from 'react-native';
import CardStack, { Card } from 'react-native-card-stack-swiper'
import styles, { DISLIKE, DUNNO, LIKE } from '../assets/styles'
import Filters from "../components/Filters";
import MockUsers from '../assets/data/mockUsers'
import CardItem from "../components/CardItem";
import Icon from '../components/Icon'
import Logout from '../components/Logout';
import Auth from '@aws-amplify/auth'





const Home = () => {
    const [swiper, setSwiper] = useState<CardStack | null>(null)

    const logoutPressed = () => {
        Auth.signOut()
    }
    
    return (
        <ImageBackground
            source={require('../assets/images/background.png')}
            style={styles.homeBackground}>
            <View style={styles.homeContainer}>
                <View style={styles.homeTop}>
                    <Filters/>
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
        </ImageBackground>
    )
}

export default Home
