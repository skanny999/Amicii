import React, { useState } from 'react'
import { View, ImageBackground } from 'react-native';
import CardStack, { Card } from 'react-native-card-stack-swiper'
import styles from '../assets/styles'
import Filters from "../components/Filters";
import Location from "../components/Location";
import MockUsers from '../assets/data/mockUsers'
import CardItem from "../components/CardItem";


const Home = () => {
    const [swiper, setSwiper] = useState<CardStack | null>(null)
    
    return (
        <ImageBackground
            source={require('../assets/images/background.png')}
            style={styles.homeBackground}
        >
            <View style={styles.homeContainer}>
                <View style={styles.homeTop}>
                    <Location/>
                    <Filters/>
                </View>
                <CardStack
                    loop
                    verticalSwipe={false}
                    renderNoMoreCards={() => null}
                    ref={(newSwiper): void => setSwiper(newSwiper)}
                >
                    {MockUsers.map((user) => (
                        <Card key={user.id}>
                            <CardItem 
                            name={user.name} 
                            emoji={user.emoji} 
                            bio={user.bio}
                            hasAction={true}
                            isLarge={true}
                            />
                        </Card>
                    ))}
                </CardStack>
            </View>
        </ImageBackground>
    )
}

export default Home
