import React, { useState } from 'react'
import { StyleSheet, View, ImageBackground } from 'react-native';
import CardStack, { Card } from 'react-native-card-stack-swiper'
import Filters from "../components/Filters";
import Location from "../components/Location";
import MockUsers from '../assets/data/mockUsers'
import CardItem from "../components/CardItem";
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../assets/styles/sizes';


const Home = () => {
    const [swiper, setSwiper] = useState<CardStack | null>(null)
    
    return (
        <ImageBackground
            source={require('../assets/images/background.png')}
            style={styles.background}
        >
            <View style={styles.container}>
                <View style={styles.top}>
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

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10
    },
    background: {
        flex: 1,
        resizeMode: 'cover',
        width: WINDOW_WIDTH,
        height: WINDOW_HEIGHT
    },
    top: {
        paddingTop: 50,
        marginHorizontal: 10,
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center'
    }
})

