import React from "react"
import { ImageBackground, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { WHITE } from "../assets/styles/colors"
import { WINDOW_HEIGHT, WINDOW_WIDTH } from "../assets/styles/sizes"
import Icon from "../components/Icon"

const Profile = () => {
    return (
        <ImageBackground source={require('../assets/images/background.png')} style={styles.background}>
            <ScrollView style={{ marginHorizontal: 0 }}>
                <ImageBackground source={require('../assets/images/background.png')}>
                    <View style={styles.top}>
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

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: "cover",
        width: WINDOW_WIDTH,
        height: WINDOW_HEIGHT,
    },
    top: {
        paddingTop: 50,
        marginHorizontal: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }
})