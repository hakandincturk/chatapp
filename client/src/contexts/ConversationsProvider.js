import React, { useContext, useState, useEffect, useCallback } from 'react'
import useLocalStorage from '../hooks/useLocalStorage';
import { useContacts } from './ContactsProvider';
import { useSocket } from './SocketProvider';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore'
import db from '../Helpers/FirebaseHelper'

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
      await getDocs(collection(db, "conversations"))
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
                    recipients: findLoggedUserIndex
                  }
                ]
              })
            }
          });
        })
    }
    func()
  }, [id, setConversations])

  function createConversation(recipients) {
    setConversations(prevConversations => {
      return [...prevConversations, { recipients, messages: [] }]
    })
  }

  const addMessageToConversation = useCallback(({ conversationId, recipients, text, sender }) => {
    console.log('conversationId --> ', conversationId);
    setConversations(prevConversations => {
      let madeChange = false
      const newMessage = { sender, text }
      const newConversations = prevConversations.map(conversation => {
        if (arrayEquality(conversation.recipients, recipients)) {
          madeChange = true
          return {
            ...conversation,
            messages: [...conversation.messages, newMessage]
          }
        }

        return conversation
      })


      if (madeChange) {
        setDoc(doc(db, 'users', `${id}`), {
          conversations: newConversations
        }, {merge: true}); 
        return newConversations
      } else {
        setDoc(doc(db, 'users', `${id}`), {
          conversations: [
            ...prevConversations,
            { recipients, messages: [newMessage] }
          ]
        }, {merge: true}); 
        return [
          ...prevConversations,
          { recipients, messages: [newMessage] }
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

    addMessageToConversation({ recipients, text, sender: id })
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
    
    const selected = index === selectedConversationIndex
    return { ...conversation, messages, recipients, selected, id: conversation.id }
  })

  const value = {
    conversations: formattedConversations,
    selectedConversation: formattedConversations[selectedConversationIndex],
    sendMessage,
    selectConversationIndex: setSelectedConversationIndex,
    createConversation
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