import React from "react"
import { ImageBackground,View } from 'react-native'
import styles from "../assets/styles"
import CardItem from "../components/CardItem"
import {user} from "../assets/data/mockUsers"
import Edit from "../components/Edit"

const me = user

const Profile = () => {
    return (
        <ImageBackground source={require('../assets/images/background.png')} style={styles.profileBackground}>
            <View style={styles.profileTop}>
                <View style={{marginHorizontal: 10}}>
                    <Edit/>
                </View>
                <CardItem
                    name={me.name}
                    emoji={me.emoji}
                    bio={me.bio}
                    features={me.features}
                    hasAction={false}
                    isLarge={true}
                    editable={false}
                />
            </View>
        </ImageBackground>
    )
}

export default Profile