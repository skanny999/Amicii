import React, { useEffect, useState } from "react"
import { ImageBackground,Modal,Pressable,StyleSheet,Text,View } from 'react-native'
import styles from "../assets/styles"
import CardItem from "../components/CardItem"
import Edit from "../components/Edit"
import EmojiPicker from "../components/EmojiPicker"

import { UserType } from "../types"

const Profile = (props: {user?: UserType}) => {

  const [currentUser, setCurrentUser] = useState(props.user!)
  const [emojiIndexToChange, setEmojiIndexToChange] = useState<number>(-2)
  const [modalVisible, setModalVisible] = useState(false)
  const [currentBio, setCurrentBio] = useState(currentUser?.bio)

  const userIsSetup = () => {
    if (currentUser == null) {
        return false
    } else {
        return currentUser.age > 18 &&
        currentUser.bio.length > 0 &&
        !(currentUser.genderM == 0 && currentUser.genderF == 0) &&
        !currentUser.profileEmoji.includes('PH') &&
        validFeatures(currentUser)
    }
  }

  const validFeatures = (user: UserType) => {
    for (const feature of user.features) {
        if (feature.includes('PH')) {
            return false
        }
    }
    return true
  }

  const handleSelectEmoji = (emoji: string) => {
    if (emojiIndexToChange < 0) {
      setCurrentUser({...currentUser, profileEmoji: emoji});
    } else {
      const updatedFeatures = currentUser.features 
      updatedFeatures[emojiIndexToChange] = emoji
      setCurrentUser({...currentUser, features: updatedFeatures})
    }
    setModalVisible(false)
  }

  const emojiToBeUpdated = (index: number) => {
      setEmojiIndexToChange(index)
      setModalVisible(true)
  }

  const updateBio = (text: string) => {
    setCurrentBio(text)
    setCurrentUser({...currentUser, bio: currentBio})
  }

  const updateAge = (age: string) => {
    console.log(age)
  }

  const updatedGender = (gender: string) => {
    console.log(gender)
  }

  return (
    <ImageBackground source={require('../assets/images/background.png')} style={styles.profileBackground}>
      <View style={styles.profileTop}>
      <Edit/>
      </View>
          <View style={styles.cardItemContainer}>
          <CardItem
              user={currentUser}
              isLarge={true}
              editable={true}
              newUser={!userIsSetup()}
              handleEditEmoji={emojiToBeUpdated}
              handleEditBio={updateBio}
              handleEditAge={updateAge}
              handleEditGender={updatedGender}
          />
      </View>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
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