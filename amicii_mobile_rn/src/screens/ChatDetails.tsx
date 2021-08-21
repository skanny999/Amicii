import React, { useEffect, useState } from 'react';
import { usePubNub } from "pubnub-react";
import { ListenerParameters } from 'pubnub';
import { Chat, MessageType, defaultTheme } from '@flyerhq/react-native-chat-ui'
import { ChatNavProps } from './ChatParamList';

const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.floor(Math.random() * 16)
      const v = c === 'x' ? r : (r % 4) + 8
      return v.toString(16)
    })
   }

const ChatDetails = ({route, navigation}: ChatNavProps<'ChatDetails'>) => {

  const { userId, chatName} = route.params

  const pubnub = usePubNub();

  const [messages, setMessages] = useState<MessageType.Text[]>([]);

  const addMessage = (message: MessageType.Text) => {
      setMessages([{ ...message, status: 'read'}, ...messages])
  }

  useEffect(() => {

    if (pubnub) {
      pubnub.setUUID(userId)

      pubnub.fetchMessages({
            channels: [chatName],
            end: '15343325004275466',
            count: 100
        },
        (status, response) => {
          try {
            const messages = response["channels"][chatName]
            .map(channel => channel["message"])
            .reverse()
            setMessages(messages)
          } catch (err) {
            console.log(err)
          }
        })

      const listener: ListenerParameters = {
        message: envelope => {
            if (envelope.message.authorId !== userId) {
                const textMessage: MessageType.Text  = {
                  authorId: envelope.message.authorId,
                  id: envelope.message.id,
                  text: envelope.message.text,
                  timestamp: envelope.message.timestamp,
                  type: 'text'
              }
              addMessage(textMessage)
            }
        }
      }

      pubnub.addListener(listener);
      pubnub.subscribe({ channels: [chatName] });

      return () => {
        pubnub.removeListener(listener);
        pubnub.unsubscribeAll();
      };
      }  
    }, [pubnub])


  const handleSubmit = (message: MessageType.PartialText) => {
      const textMessage: MessageType.Text = {
          authorId: userId,
          id: uuidv4(),
          text: message.text,
          timestamp: Math.floor(Date.now() / 1000),
          type: 'text'
      }
      addMessage(textMessage)
      pubnub.publish({ channel: chatName, message: textMessage });
  }

  return (
    <Chat
        messages={messages}
        onSendPress={handleSubmit}
        user={{ id: userId }}
        theme={{
            ...defaultTheme,
            colors: { ...defaultTheme.colors, inputBackground: 'mediumslateblue' },
          }}
    />
  );
}

export default ChatDetails