import React, { useEffect, useState } from "react"
import { ImageBackground,Modal,Pressable,StyleSheet,Text,View } from 'react-native'
import styles from "../assets/styles"
import CardItem from "../components/CardItem"
import {user} from "../assets/data/mockUsers"
import Edit from "../components/Edit"
import EmojiPicker from "../components/EmojiPicker"
import { getUser } from "../services/APIService"

const me = user

const Profile = (props: {userId: string}) => {

    const [thisUser, setUser] = useState(me)
    const [emojiIndexToChange, setEmojiIndexToChange] = useState<number>(-2)
    const [modalVisible, setModalVisible] = useState(false)
    const [currentBio, setCurrentBio] = useState(me.bio)

    useEffect(() => {
      const processUser = async () => {
          console.log('Processing user with id: ', props.userId)
          try {
            const userResponse =  await getUser(props.userId)
            console.log(userResponse)
            setUser(userResponse!)
          } catch (err) {
              console.log(err)
          }
      }
      processUser()
  },[props.userId])

    const handleSelectEmoji = (emoji: string) => {
      if (emojiIndexToChange < 0) {
        setUser({...thisUser, profileEmoji: emoji});
      } else {
        const updatedFeatures = thisUser.features 
        updatedFeatures[emojiIndexToChange] = emoji
        setUser({...thisUser, features: updatedFeatures})
      }
      setModalVisible(false)
    }

    const emojiToBeUpdated = (index: number) => {
        setEmojiIndexToChange(index)
        setModalVisible(true)
    }

    const updateBio = (text: string) => {
      setCurrentBio(text)
      setUser({...thisUser, bio: currentBio})
    }

    return (
        <ImageBackground source={require('../assets/images/background.png')} style={styles.profileBackground}>
            <View style={styles.profileTop}>
            <Edit/>
            </View>
                <View style={styles.cardItemContainer}>
                {/* <View style={{paddingBottom: WINDOW_HEIGHT / 20}}/> */}
                <CardItem
                    name={thisUser.username!}
                    emoji={thisUser.profileEmoji!}
                    bio={thisUser.bio!}
                    genderM={thisUser.genderM!}
                    genderF={thisUser.genderF!}
                    age={thisUser.age!}
                    features={thisUser.features}
                    hasAction={false}
                    isLarge={true}
                    editable={true}
                    handleEditEmoji={emojiToBeUpdated}
                    handleEditBio={updateBio}
                />
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
            <EmojiPicker selectedEmoji={handleSelectEmoji}/>
          </View>
        </View>
      </Modal>
      </ImageBackground>
    )
}

export default Profile

const modelStyles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 0
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    buttonClose: {
      backgroundColor: "#2196F3",
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "left"
    }
  });