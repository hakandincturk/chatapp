import React from 'react'
import { Button, ListGroup } from 'react-bootstrap'
import { useConversations } from '../contexts/ConversationsProvider';

import { BsFillTrashFill } from 'react-icons/bs'


export default function Conversations() {
  const { conversations, selectConversationIndex } = useConversations()

  const handleDeleteButton = (index) => {
    console.log('index --> ', index);
    const findedConv = conversations[index]
    console.log('findedConv --> ', findedConv);
  }

  return (
    <ListGroup variant="flush">
      
      {conversations.map((conversation, index) => (
        <ListGroup.Item
          key={index}
          action
          onClick={() => selectConversationIndex(index)}
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
