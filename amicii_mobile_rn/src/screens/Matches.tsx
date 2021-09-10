import React, { useEffect, useState } from 'react'
import {
  ImageBackground,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
} from 'react-native'
import Icon from '../components/Icon'
import CardItem from '../components/CardItem'
import styles, { DARK_GRAY } from '../assets/styles'
import { UserType } from '../types'
import { getMatches } from '../services/APIService'

const Matches = (props: { userId: string }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [matches, setMatches] = useState<UserType[] | null>(null)

  const showUserDetails = (_user: UserType) => {
    setModalVisible(true)
  }

  useEffect(() => {
    const processUser = async () => {
      try {
        if (props.userId !== '') {
          const matchesResponse = await getMatches(props.userId)
          console.log(matchesResponse)
          setMatches(matchesResponse!)
        }
      } catch (err) {
        console.log(err)
      }
    }
    processUser()
  }, [props.userId])

  return (
    <ImageBackground
      source={require('../assets/images/background.png')}
      style={styles.matchesBackground}
    >
      <View style={styles.matchesContainer}>
        <View style={styles.matchesTop}>
          <Text style={styles.matchesTitle}>Matches</Text>
          <TouchableOpacity>
            <Icon name="ellipsis-vertical" color={DARK_GRAY} size={20} />
          </TouchableOpacity>
        </View>
        <FlatList
          numColumns={2}
          data={matches}
          keyExtractor={(_item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => showUserDetails(item)}
              style={{ marginBottom: -80 }}
            >
              <CardItem
                user={item}
                isLarge={false}
                editable={false}
                newUser={false}
              />
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
                    <CardItem
                      user={item}
                      isLarge={true}
                      editable={false}
                      newUser={true}
                    />
                  </View>
                </View>
              </Modal>
            </TouchableOpacity>
          )}
        />
      </View>
    </ImageBackground>
  )
}

export default Matches
