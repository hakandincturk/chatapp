/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect, useCallback } from 'react'
import useLocalStorage from '../hooks/useLocalStorage';
import { useContacts } from './ContactsProvider';
import { useSocket } from './SocketProvider';
import { doc, setDoc, collection, Timestamp, orderBy, query, onSnapshot } from 'firebase/firestore'
import db from '../Helpers/FirebaseHelper'
import { uuidv4 } from '@firebase/util';

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
    const func = async () => {
      // const snap = await getDoc(doc(db, 'users', id ))
    const q = query(collection(db, "conversations"), orderBy('updatedAt', 'desc'));
      onSnapshot(q, (querySnapshot) => {
      setConversations([])
        querySnapshot.forEach(doc => {
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
        })
      })
        // .then((querySnapshot) => {
        //   querySnapshot.forEach((doc) => {
        //     if (doc?.data()?.recipients.includes(id)) {

        //       const findLoggedUserIndex = doc.data().recipients.filter(x => x !== id)
              
        //       setConversations(prevConversations => {
        //         return [
        //           ...prevConversations, 
        //           {
        //             id: doc.data().id,
        //             messages: doc.data()?.messages,
        //             recipients: findLoggedUserIndex,
        //             createdAt: doc.data()?.createdAt,
        //             updatedAt: doc.data()?.updatedAt
        //           }
        //         ]
        //       })
        //     }
        //   });
        // })
    }
    func()
  }, [id, setConversations])

  useEffect(() => {
  }, [conversations])

  async function createConversation(recipients) {

    let conversationId = null;

    const compareArray = (a, b) => {
      if (a.length !== b.length) return false;
      const uniqueValues = new Set([...a, ...b]);
      for (const v of uniqueValues) {
        const aCount = a.filter(e => e === v).length;
        const bCount = b.filter(e => e === v).length;
        if (aCount !== bCount) return false;
      }
      return true;
    }

    conversations.map((conversation, index) => {
      if (compareArray(conversation.recipients, recipients)) {
        conversationId = conversation.id;
        return conversation.id
      }
      return false
    })

    console.log('conversationId --> ', conversationId);

    if (conversationId) {
      setSelectedConversationIndex(conversationId)
      return 0;
    }

    const newUUID = uuidv4();
    setDoc(doc(db, 'conversations', `${newUUID}`), {
      id: newUUID,
      messages: [],
      recipients: [...recipients, id],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    setSelectedConversationIndex(newUUID)

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

  const format = (conversation) => {
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

    
    // const selected = conversation.id === selectedConversationIndex
    return { messages, recipients, selected: false, id: conversation.id }
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
  const value = {
    format,
    conversations: formattedConversations,
    selectedConversation: formatted(selectedConversationIndex),
    sendMessage,
    selectedConversationIndex,
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

