import React, { useEffect, useState } from 'react';
import { usePubNub } from "pubnub-react";
import { ListenerParameters } from 'pubnub';
import { UserType } from '../types';
import { emojiFromString } from '../helpers/emojiEncoder';
import { Chat, MessageType, defaultTheme } from '@flyerhq/react-native-chat-ui'

const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.floor(Math.random() * 16)
      const v = c === 'x' ? r : (r % 4) + 8
      return v.toString(16)
    })
   }

const ChatDetails = (props: {userId: string, profileEmoji: string, username: string, chatName: string}) => {

  const userId = props.userId

  const pubnub = usePubNub();

  const [messages, setMessages] = useState<MessageType.Text[]>([]);

  const addMessage = (message: MessageType.Text) => {
      setMessages([{ ...message, status: 'read'}, ...messages])
  }

  useEffect(() => {

    if (pubnub) {

      pubnub.setUUID(userId)

      pubnub.fetchMessages({
            channels: [props.chatName],
            end: '15343325004275466',
            count: 100
        },
        (status, response) => {
            const messages = response["channels"][props.chatName]
            .map(channel => channel["message"])
            setMessages(messages)
        })

      const listener: ListenerParameters = {
        message: envelope => {
            if (envelope.message.authorId !== userId) {
                setMessages(msgs => [
                  ...msgs,
                  {
                      authorId: envelope.message.authorId,
                      id: envelope.message.id,
                      text: envelope.message.text,
                      timestamp: envelope.message.timestamp,
                      type: 'text'
                  }
                ])
            }
        }
      }

      pubnub.addListener(listener);
      pubnub.subscribe({ channels: [props.chatName] });

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
      pubnub.publish({ channel: props.chatName, message: textMessage });
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