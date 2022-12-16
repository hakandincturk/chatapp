/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { ListGroup } from 'react-bootstrap'
import { useConversations } from '../contexts/ConversationsProvider';

import { BsFillTrashFill } from 'react-icons/bs'
import moment from 'moment';


export default function Conversations() {
  const { conversations, setConversations, selectConversationIndex } = useConversations()

    // moment(new Date(a?.updatedAt?.seconds * 1000 + a?.updatedAt?.nanoseconds / 1000000)) - 
    // moment(new Date(b?.updatedAt?.seconds * 1000 + b?.updatedAt?.nanoseconds / 1000000)))

    useEffect( () => {
      console.log('first --> ', conversations)
    }, [])

  const handleDeleteButton = (index) => {

    console.log('conversations -->', conversations);

    const findedConv = conversations[index]
    console.log('findedConv --> ', findedConv);
  }

  return (
    <ListGroup variant="flush">
      {conversations?.map((conversation, index) => (
        <ListGroup.Item
          key={index}
          action
          onClick={() => selectConversationIndex(conversation.id)}
          active={conversation.selected}
          className='d-flex align-content-lg-center align-items-center justify-content-between'
        >
          {conversation.recipients.map(r => r.name).join(', ')} 
          
          <BsFillTrashFill size={14} onClick={() => {handleDeleteButton(index)}} className='pointer'/>
        </ListGroup.Item>
      ))}
    </ListGroup>
  )
}
