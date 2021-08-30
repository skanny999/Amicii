import React, { useEffect, useState } from 'react'
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Pressable,
  Text,
  ActivityIndicator,
} from 'react-native'
import CardStack, { Card } from 'react-native-card-stack-swiper'
import styles, { DISLIKE, DUNNO, LIKE } from '../assets/styles'
import Filters from '../components/Filters'
import CardItem from '../components/CardItem'
import Icon from '../components/Icon'
import Logout from '../components/Logout'
import Auth from '@aws-amplify/auth'
import { UserType } from '../types'
import {
  getCandidates,
  postLikeUser,
  postDislikeUser,
} from '../services/APIService'

const Home = (props: { userId: string }) => {
  const [swiper, setSwiper] = useState<CardStack | null>(null)
  const [candidates, setCandidates] = useState<UserType[] | null>(null)
  const [filtersModalVisible, setFiltersModalVisible] = useState(false)

  const logoutPressed = () => Auth.signOut()
  const handleShowFilter = () => setFiltersModalVisible(true)

  useEffect(() => {
    const loadCandidates = async () => {
      if (props.userId !== '') {
        console.log('Processing user with id: ', props.userId)
        try {
          const candidatesResponse = await getCandidates(props.userId)
          console.log(candidatesResponse)
          setCandidates(candidatesResponse!)
        } catch (err) {
          console.log(err)
        }
      }
    }
    loadCandidates()
  }, [props.userId])

  if (candidates == null)
    return (
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <ActivityIndicator size="large" color="black" />
      </View>
    )

  return (
    <ImageBackground
      source={require('../assets/images/background.png')}
      style={styles.homeBackground}
    >
      <View testID={'HomeScreen'} style={styles.homeContainer}>
        <View style={styles.homeTop}>
          <Filters handlePress={handleShowFilter} />
          <Logout handlePress={logoutPressed} />
        </View>
        <View style={{ flex: 2 }}>
          <CardStack
            verticalSwipe={true}
            renderNoMoreCards={() => null}
            ref={(newSwiper): void => setSwiper(newSwiper)}
          >
            {candidates.map((user) => (
              <Card
                key={user.id}
                onSwipedRight={() => postLikeUser(props.userId, user.id!)}
                onSwipedLeft={() => postDislikeUser(props.userId, user.id!)}
              >
                <CardItem
                  user={user}
                  isLarge={true}
                  editable={false}
                  newUser={false}
                />
              </Card>
            ))}
          </CardStack>
        </View>
        <View style={styles.cardStackAction}>
          <TouchableOpacity
            style={styles.cardStackButton}
            onPress={() => swiper?.swipeLeft()}
          >
            <Icon name="close" size={35} color={DISLIKE} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cardStackSmallButton}
            onPress={() => swiper?.swipeTop()}
          >
            <Icon name="help" size={35} color={DUNNO} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cardStackButton}
            onPress={() => swiper?.swipeRight()}
          >
            <Icon name="checkmark" size={35} color={LIKE} />
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={false}
        visible={filtersModalVisible}
        onRequestClose={() => {
          setFiltersModalVisible(!filtersModalVisible)
        }}
      >
        <View style={styles.modalCenteredView}>
          <View style={styles.modalView}>
            <Pressable
              style={[styles.modalButton, styles.modalButtonClose]}
              onPress={() => setFiltersModalVisible(!filtersModalVisible)}
            >
              <Text style={styles.modalTextStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  )
}

export default Home
