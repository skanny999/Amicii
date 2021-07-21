import React from "react"
import { ImageBackground, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import styles,{ WHITE } from "../assets/styles"
import Icon from "../components/Icon"

const Profile = () => {
    return (
        <ImageBackground source={require('../assets/images/background.png')} style={styles.profileBackground}>
            <ScrollView style={{ marginHorizontal: 0 }}>
                <ImageBackground source={require('../assets/images/background.png')}>
                    <View style={styles.profileTop}>
                        <TouchableOpacity>
                            <Icon
                                name='chevron-back'
                                size={20}
                                color={WHITE}
                                style={{paddingLeft: 20}}/>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Icon
                                name='ellipsis-vertical'
                                size={20}
                                color={WHITE}
                                style={{paddingRight: 20}}/>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </ScrollView>
        </ImageBackground>
    )
}

export default Profile