import React, { useState } from 'react'
import { StyleSheet, Text, View, Dimensions, ImageBackground } from 'react-native';
import CardStack, { Card } from 'react-native-card-stack-swiper'
import Filters from "../components/Filters";
import Location from "../components/Location";
import MockUsers from '../assets/data/mockUsers'
import CardItem from "../components/CardItem";

const Home: React.FC = () => {
    const [swiper, setSwiper] = useState<CardStack | null>(null)
    
    return (
        <ImageBackground
            source={require('../assets/images.background.png')}
            style={styles.background}
        >
            <View style={{marginHorizontal: 10}}>
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
                    <CardItem name={user.name} emoji={user.emoji} bio={user.bio}/>
                   </Card>
                ))}
            </CardStack>
        </ImageBackground>
    )
}

export default Home

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height
    },
    top: {
        paddingTop: 50,
        marginHorizontal: 10,
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center'
    }
})

