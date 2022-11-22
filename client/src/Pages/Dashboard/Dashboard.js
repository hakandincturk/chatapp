import React, { useEffect } from 'react'
import Sidebar from '../../components/Sidebar';
import OpenConversation from '../../components/OpenConversation';
import { useConversations } from '../../contexts/ConversationsProvider';

export default function Dashboard({ id }) {
  const { selectedConversation } = useConversations()

  useEffect( () => {
    if (id === undefined || id === 1) {
      window.location.href = '';
    }
  }, [id])

  return (
    <div className="d-flex" style={{ height: '100vh' }}>
      <Sidebar id={id} />
      {selectedConversation && <OpenConversation />}
    </div>
  )
}
