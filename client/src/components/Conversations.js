/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { ListGroup, Modal } from 'react-bootstrap'
import { useConversations } from '../contexts/ConversationsProvider';
import useLocalStorage from '../hooks/useLocalStorage';

import { BsFillTrashFill } from 'react-icons/bs'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import db from '../Helpers/FirebaseHelper'

import DeleteConversationModal from './DeleteConversationModal';


export default function Conversations() {

  const [convs, setConvs] = useState([])
  const [pureConvs, setPureConvs] = useState([])
  const [id, setId] = useLocalStorage('id')
  const [deletedConversationId, setDeletedConversationId] = useState('')
  const [profileOpenModal, setProfileOpenModal] = useState(false)

  const { 
    conversations,
    selectedConversationIndex,
    selectConversationIndex,
    format } = useConversations()

    // moment(new Date(a?.updatedAt?.seconds * 1000 + a?.updatedAt?.nanoseconds / 1000000)) - 
    // moment(new Date(b?.updatedAt?.seconds * 1000 + b?.updatedAt?.nanoseconds / 1000000)))

    useEffect( () => {
      const q = query(collection(db, "conversations"), orderBy('updatedAt', 'desc'));
      onSnapshot(q, (querySnapshot) => {
        setPureConvs([])
        querySnapshot.forEach(doc => {
          if (doc?.data()?.recipients.includes(id) && !doc?.data()?.deletedFrom.includes(id)) {
            const findLoggedUserIndex = doc.data().recipients.filter(x => x !== id)
            setPureConvs(prevConversations => {
              // console.log('!prevConversations?.deletedFrom?.includes(id) -->', !prevConversations?.deletedFrom?.includes(id));
              return [
                ...prevConversations, 
                format({
                  id: doc.data().id,
                  messages: doc.data()?.messages,
                  recipients: findLoggedUserIndex,
                  createdAt: doc.data()?.createdAt,
                  updatedAt: doc.data()?.updatedAt,
                  deletedFrom: doc.data()?.deletedFrom
                })
              ]
            })
          }
        })
      })
      setConvs(pureConvs)
    }, [format, id, setConvs])


    useEffect(() => {
      console.log(convs);
    }, [convs])

  const handleDeleteButton = (index) => {
    const findedConv = conversations[index]
    setDeletedConversationId(findedConv.id)
    setProfileOpenModal(true)
    console.log('findedConv --> ', findedConv);
  }

  const closeProfileModal = () => {
    setProfileOpenModal(false)
  }

  return (
    <>
    <ListGroup variant="flush">
      {convs?.map((conversation, index) => (
        <ListGroup.Item
          key={conversation.id}
          action
          onClick={() => selectConversationIndex(conversation.id)}
          active={conversation.id === selectedConversationIndex}
          className='d-flex align-content-lg-center align-items-center justify-content-between'
        >
          {conversation.recipients.map(r => r.name).join(', ')} 
          
          <BsFillTrashFill size={14} onClick={() => {handleDeleteButton(index)}} className='pointer'/>
        </ListGroup.Item>
      ))}
    </ListGroup>
    <Modal key={3} show={profileOpenModal} onHide={closeProfileModal}>
        <DeleteConversationModal closeModal={closeProfileModal} conversationId={deletedConversationId} />
    </Modal>
    </>
    
  )
}
