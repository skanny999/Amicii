import React, { useState } from 'react'
import { ImageBackground, Modal, Pressable, Text, View } from 'react-native'
import styles from '../../assets/styles'
import CancelButton from '../../components/CancelButton'
import CardItem from '../../components/CardItem'
import EditButton from '../../components/EditButton'
import EmojiPicker from '../../components/EmojiPicker'
import { stringFromEmoji } from '../../helpers/emojiEncoder'
import { updateCurrentUser } from '../../services/APIService'
import { UserType } from '../../types'

const Profile = (props: { user?: UserType }) => {
  const userIsSetup = () => {
    if (currentUser == null) {
      return false
    } else {
      return (
        currentUser.age >= 18 &&
        currentUser.bio.length > 0 &&
        !(currentUser.genderM === 0 && currentUser.genderF === 0) &&
        !currentUser.profileEmoji.includes('PH') &&
        validFeatures(currentUser)
      )
    }
  }

  const setUpCompleted = () => {
    const completed = userIsSetup() && savedUser.age < 18
    return completed
  }

  const validFeatures = (user: UserType) => {
    for (const feature of user.features) {
      if (feature.includes('PH')) {
        return false
      }
    }
    return true
  }

  const [savedUser, setSavedUser] = useState(props.user!)
  const [currentUser, setCurrentUser] = useState(props.user!)
  const [emojiIndexToChange, setEmojiIndexToChange] = useState<number>(-2)
  const [modalVisible, setModalVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(!userIsSetup())

  const handleSelectEmoji = (emoji: string) => {
    const emojiString = stringFromEmoji(emoji)
    if (emojiIndexToChange < 0) {
      setCurrentUser({ ...currentUser, profileEmoji: emojiString })
    } else {
      const updatedFeatures = currentUser.features
      const emojiToUpdate = updatedFeatures.includes(emojiString)
        ? 'PH'
        : emojiString // no duplicates allowed
      updatedFeatures[emojiIndexToChange] = emojiToUpdate
      setCurrentUser({ ...currentUser, features: updatedFeatures })
    }
    setModalVisible(false)
  }

  const emojiToBeUpdated = (index: number) => {
    setEmojiIndexToChange(index)
    setModalVisible(true)
  }

  const updateBio = (text: string) => {
    setCurrentUser({ ...currentUser, bio: text })
  }

  const updateAge = (age: string) => {
    setCurrentUser({ ...currentUser, age: parseInt(age, 10) })
  }

  const updatedGender = (gender: string) => {
    console.log(gender)
    switch (gender) {
      case 'M':
        setCurrentUser({ ...currentUser, genderM: 1, genderF: 0 })
        break
      case 'F':
        setCurrentUser({ ...currentUser, genderM: 0, genderF: 1 })
        break
      case ' ':
        setCurrentUser({ ...currentUser, genderM: 1, genderF: 1 })
        break
      default:
        setCurrentUser({ ...currentUser, genderM: 0, genderF: 0 })
    }
    setIsEditing(true)
  }

  const saveChanges = () => {
    if (userIsSetup()) {
      if (isEditing) {
        updateCurrentUser(currentUser)
        setSavedUser(currentUser)
      }
      console.log('it was editiong')
      setIsEditing(!isEditing)
    } else {
      console.log('user is not setup: ', currentUser)
    }
  }
  const cancelEditing = () => {
    setCurrentUser(props.user!)
    setIsEditing(!isEditing)
  }

  return (
    <>
      <ImageBackground
        source={require('../../assets/images/background.png')}
        style={styles.profileBackground}
      >
        <View testID={'ProfileScreen'} style={styles.profileTop}>
          <EditButton
            isEditing={isEditing || !userIsSetup()}
            handlePress={saveChanges}
          />
          {isEditing && setUpCompleted() && (
            <CancelButton handlePress={cancelEditing} />
          )}
        </View>
        <View style={styles.cardItemContainer}>
          <CardItem
            user={currentUser}
            isLarge={true}
            editable={isEditing}
            newUser={!userIsSetup()}
            handleEditEmoji={emojiToBeUpdated}
            handleEditBio={updateBio}
            handleEditAge={updateAge}
            handleEditGender={updatedGender}
          />
        </View>
      </ImageBackground>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible)
        }}
      >
        <View style={styles.modalCenteredView}>
          <View style={styles.modalView}>
            <Pressable
              style={[styles.modalButton, styles.modalButtonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.modalTextStyle}>Close</Text>
            </Pressable>
            <EmojiPicker selectedEmoji={handleSelectEmoji} />
          </View>
        </View>
      </Modal>
    </>
  )
}

export default Profile
