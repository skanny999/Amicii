import React from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { CardItemType, PickerType } from '../types'
import styles, { WINDOW_WIDTH } from '../assets/styles'
import EmojiGrid from './EmojiGrid'
import AGPicker from './Picker'
import { emojiFromString } from '../helpers/emojiEncoder'

const CardItem = ({
  user,
  isLarge,
  editable,
  newUser,
  handleEditEmoji,
  handleEditBio,
  handleEditAge,
  handleEditGender,
}: CardItemType) => {
  const gender = () => {
    if (newUser && user.genderM === 0 && user.genderF === 0) {
      return '  Select Gender'
    } else if (user.genderM === 1 && user.genderF === 1) {
      return ' '
    } else if (user.genderM === 1) {
      return 'M'
    } else {
      return 'F'
    }
  }

  const age = newUser && user.age < 18 ? 'Select Age  ' : `${user.age!}`
  const profileEmoji =
    user.profileEmoji === '' ? '❓' : emojiFromString(user.profileEmoji!)

  const profileImageStyle = [
    {
      width: isLarge ? WINDOW_WIDTH - 80 : WINDOW_WIDTH / 2 - 30,
      height: isLarge ? 150 : 100,
      margin: 0,
      borderRadius: 8,
    },
  ]

  return (
    <View style={styles.cardItemContainer}>
      <TouchableOpacity
        style={profileImageStyle}
        disabled={!editable}
        onPress={() => handleEditEmoji!(-1)}
      >
        <Text
          style={{
            paddingTop: 20,
            textAlign: 'center',
            fontSize: isLarge ? 100 : 60,
          }}
        >
          {profileEmoji}
        </Text>
      </TouchableOpacity>
      <Text
        style={{
          paddingTop: isLarge ? 15 : 10,
          paddingBottom: isLarge ? 5 : 3,
          color: '#363637',
          fontSize: isLarge ? 30 : 20,
          fontWeight: '500',
        }}
      >
        {user.username!}
      </Text>
      <View style={{ flexDirection: 'row' }}>
        <AGPicker
          type={PickerType.age}
          value={age}
          isLarge={isLarge}
          disabled={!newUser}
          handlePickedValue={handleEditAge!}
        />
        <AGPicker
          type={PickerType.gender}
          value={gender()}
          isLarge={isLarge}
          disabled={!newUser}
          handlePickedValue={handleEditGender!}
        />
      </View>
      <EmojiGrid
        handlePress={handleEditEmoji!}
        emojis={user.features}
        editable={editable}
        isLarge={isLarge}
      />
      {isLarge && (
        <TextInput
          testID="bio"
          returnKeyType={'done'}
          maxLength={300}
          scrollEnabled={false}
          onBlur={() => console.log('is on blur')}
          editable={editable}
          multiline={true}
          style={styles.cardItemBio}
          onChangeText={handleEditBio}
          placeholder={'Add something about yourself'}
        >
          {user.bio!}
        </TextInput>
      )}
      <View style={{ padding: isLarge ? 20 : 10 }} />
    </View>
  )
}

export default CardItem
