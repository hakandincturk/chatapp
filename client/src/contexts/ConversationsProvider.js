import React, { useContext, useState, useEffect, useCallback } from 'react'
import useLocalStorage from '../hooks/useLocalStorage';
import { useContacts } from './ContactsProvider';
import { useSocket } from './SocketProvider';
import { doc, setDoc, collection, getDocs, Timestamp, orderBy, query } from 'firebase/firestore'
import db from '../Helpers/FirebaseHelper'
import { uuidv4 } from '@firebase/util';
import moment from 'moment';

const ConversationsContext = React.createContext()

export function useConversations() {
  return useContext(ConversationsContext)
}

export function ConversationsProvider({ id, children }) {
  const [conversations, setConversations] = useLocalStorage('conversations', [])
  const [selectedConversationIndex, setSelectedConversationIndex] = useState(0)
  const { contacts } = useContacts()
  const socket = useSocket()

  useEffect(() => {
    setConversations([])
    const func = async () => {


      // const snap = await getDoc(doc(db, 'users', id ))
      await getDocs(query(collection(db, "conversations"), orderBy('updatedAt', 'desc')))
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (doc?.data()?.recipients.includes(id)) {

              const findLoggedUserIndex = doc.data().recipients.filter(x => x !== id)
              
              setConversations(prevConversations => {
                return [
                  ...prevConversations, 
                  {
                    id: doc.data().id,
                    messages: doc.data()?.messages,
                    recipients: findLoggedUserIndex,
                    createdAt: doc.data()?.createdAt,
                    updatedAt: doc.data()?.updatedAt
                  }
                ]
              })
            }
          });
        })
    }
    func()
  }, [id, setConversations])

  async function createConversation(recipients) {

    const newUUID = uuidv4();
    setDoc(doc(db, 'conversations', `${newUUID}`), {
      id: newUUID,
      messages: [],
      recipients: [...recipients, id],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    setConversations(prevConversations => {
      return [...prevConversations, 
        { 
          id: newUUID,
          recipients,
          messages: [],
          updatedAt: Timestamp.now(),
          createdAt: Timestamp.now()
      }]
    })
  }

  const addMessageToConversation = useCallback(({ conversationId, recipients, text, sender }) => {
    setConversations(prevConversations => {
      let madeChange = false
      const newMessage = { sender, text, createdAt: Timestamp.now() }
      const newConversations = prevConversations.map(conversation => {
        if (arrayEquality(conversation.recipients, recipients)) {
          madeChange = true
          return {
            ...conversation,
            messages: [...conversation.messages, newMessage],
            updatedAt: Timestamp.now()
          }
        }

        return conversation
      })

      const updatedConversation = newConversations.filter(x => x.id === conversationId)[0]

      if (madeChange) {
        setDoc(doc(db, 'users', `${id}`), {
          conversations: newConversations,
          updatedAt: Timestamp.now()
        }, {merge: true});
        setDoc(doc(db, 'conversations', `${conversationId}`), {
          messages: updatedConversation.messages,
          updatedAt: Timestamp.now()
        }, {merge: true}); 
        return newConversations
      } else {
        setDoc(doc(db, 'users', `${id}`), {
          conversations: [
            ...prevConversations,
            { recipients, messages: [newMessage], updatedAt: Timestamp.now() }
          ]
        }, {merge: true}); 
        setDoc(doc(db, 'conversations', `${conversationId}`), {
          messages: updatedConversation.messages,
          updatedAt: Timestamp.now()
        }, {merge: true}); 
        return [
          ...prevConversations,
          { recipients, messages: [newMessage], updatedAt: Timestamp.now() }
        ]
      }
    })

  }, [id, setConversations])

  useEffect(() => {
    if (socket == null) return

    socket.on('receive-message', addMessageToConversation)

    return () => socket.off('receive-message')
  }, [socket, addMessageToConversation])

  function sendMessage(conversationId, recipients, text) {
    socket.emit('send-message', { conversationId, recipients, text })

    addMessageToConversation({ conversationId, recipients, text, sender: id })
  }

  const formatted = (conversationId) => {
    const selectedObj = formattedConversations?.find((x) => x.selected);
    return selectedObj;
  }

  const formattedConversations = conversations.map((conversation, index) => {
    const recipients = conversation.recipients.map(recipient => {
      const contact = contacts.find(contact => {
        return contact.id === recipient
      })
      const name = (contact && contact.name) || recipient
      return { id: recipient, name }
    })

    const messages = conversation.messages.map(message => {
      const contact = contacts.find(contact => {
        return contact.id === message.sender
      })
      const name = (contact && contact.name) || message.sender
      const fromMe = id === message.sender
      return { ...message, senderName: name, fromMe }
    })

    
    const selected = conversation.id === selectedConversationIndex
    return { ...conversation, messages, recipients, selected, id: conversation.id }
  })

  const sortConversations = () => {
    console.log(2);
    console.log('conversations -->', conversations);
    const x = conversations.sort((a, b) => 
        (
          moment(new Date(a?.updatedAt?.seconds * 1000 + a?.updatedAt?.nanoseconds / 1000000)) <
          moment(new Date(b?.updatedAt?.seconds * 1000 + b?.updatedAt?.nanoseconds / 1000000))
        ) ? 1 : 
        (
          (
            moment(new Date(b?.updatedAt?.seconds * 1000 + b?.updatedAt?.nanoseconds / 1000000)) <
            moment(new Date(a?.updatedAt?.seconds * 1000 + a?.updatedAt?.nanoseconds / 1000000))
          ) ? 
          -1 :
          0
        ))
      

    console.log('x -->', x);

    setConversations(x)

    console.log('conversations 2--> ', conversations);
  }

  const value = {
    conversations: formattedConversations,
    selectedConversation: formatted(selectedConversationIndex),
    sendMessage,
    selectConversationIndex: setSelectedConversationIndex,
    createConversation,
    setConversations,
  }

  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  )
}

function arrayEquality(a, b) {
  if (a.length !== b.length) return false

  a.sort()
  b.sort()

  return a.every((element, index) => {
    return element === b[index]
  })
}

