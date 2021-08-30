import React, { useEffect, useState } from 'react'
import { FlatList, ImageBackground, TouchableOpacity, View } from 'react-native'
import styles from '../assets/styles'
import Message from '../components/Message'
import { chatNameForUsers } from '../helpers/chatHelper'
import { getMatches } from '../services/APIService'
import { UserType } from '../types'
import { ChatNavProps } from './ChatParamList'

const ChatList = ({ route, navigation }: ChatNavProps<'ChatList'>) => {
  const user = route.params.user

  const [matches, setMatches] = useState<UserType[] | null>(null)

  useEffect(() => {
    const processUser = async () => {
      try {
        if (user.id != null) {
          const mathchesResponse = await getMatches(user.id)
          if (mathchesResponse) {
            setMatches(mathchesResponse)
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
    processUser()
  }, [user])

  return (
    <ImageBackground
      source={require('../assets/images/background.png')}
      style={styles.matchesBackground}
    >
      <View style={styles.homeContainer}>
        <FlatList
          data={matches}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                const name = chatNameForUsers(user, item)
                const routeParams = {
                  userId: user.id,
                  chatName: name,
                }
                navigation.navigate('ChatDetails', routeParams)
              }}
            >
              <Message emoji={item.profileEmoji} name={item.username} />
            </TouchableOpacity>
          )}
        />
      </View>
    </ImageBackground>
  )
}

export default ChatList
