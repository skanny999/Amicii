import mockUsers from '../../assets/data/mockUsers'
import { chatNameForUsers } from '../chatHelper'
import { emojiFromString, stringFromEmoji } from '../emojiEncoder'
import { extractUserId, nonEmpty } from '../stringHelper'

describe('Helpers', () => {
  describe('Chat', () => {
    test('chat name for users', () => {
      const chatName = chatNameForUsers(mockUsers[1], mockUsers[2])
      expect(chatName).toEqual('abcdefgh')
    })
  })
  describe('Emoji Encoder', () => {
    test('encode emoji', () => {
      const encoded = stringFromEmoji('👩🏽‍⚖️')
      expect(encoded).toEqual('1f469 1f3fd 200d 2696 fe0f')
    })
    test('decode emoji', () => {
      const encoded = emojiFromString('1f469 1f3fd 200d 2696 fe0f')
      expect(encoded).toEqual('👩🏽‍⚖️')
    })
  })
  describe('String Helper', () => {
    test('extract user id', () => {
      const userId = extractUserId('location:12345')
      expect(userId).toEqual('12345')
    })
    test('empty string return space', () => {
      const space = nonEmpty('')
      expect(space).toEqual(' ')
    })
    test('non empty string returns string', () => {
      const myString = nonEmpty('test')
      expect(myString).toEqual('test')
    })
  })
})
