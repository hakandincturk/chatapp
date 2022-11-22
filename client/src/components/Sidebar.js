import React, { useState } from 'react'
import { Tab, Nav, Button, Modal } from 'react-bootstrap'
import Conversations from './Conversations'
import Contacts from './Contacts'
import NewContactModal from './NewContactModal'
import NewConversationModal from './NewConversationModal'
import ProfileModal from './ProfileModal'

import useLocalStorage from '../hooks/useLocalStorage';


import { IoExit } from 'react-icons/io5'
import { CgProfile } from 'react-icons/cg'

const CONVERSATIONS_KEY = 'conversations'
const CONTACTS_KEY = 'contacts'

export default function Sidebar({ id }) {
  const [idd, setId] = useLocalStorage('id')
  const [activeKey, setActiveKey] = useState(CONVERSATIONS_KEY)
  const [modalOpen, setModalOpen] = useState(false)
  const conversationsOpen = activeKey === CONVERSATIONS_KEY
  const [profileOpenModal, setProfileOpenModal] = useState(false)
  
  const closeModal = () => {
    setModalOpen(false)
  }

  const closeProfileModal = () => {
    setProfileOpenModal(false)
  }

  const exitButtonHandle = () => {
    setId(undefined)
    window.location.href = '';
  }

  const profileButtonHandle = () => {
    console.log(123);
  }

  return (
    <div style={{ width: '250px' }} className="d-flex flex-column">
      <Tab.Container activeKey={activeKey} onSelect={setActiveKey}>
        <Nav variant="tabs" className="justify-content-center">
          <Nav.Item>
            <Nav.Link eventKey={CONVERSATIONS_KEY}>Konusmalar</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={CONTACTS_KEY}>Kisiler</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content className="border-right overflow-auto flex-grow-1">
          <Tab.Pane eventKey={CONVERSATIONS_KEY}>
            <Conversations />
          </Tab.Pane>
          <Tab.Pane eventKey={CONTACTS_KEY}>
            <Contacts />
          </Tab.Pane>
        </Tab.Content>
        <div className="p-2 border-top border-right small d-flex align-items-center align-content-center justify-content-between">
          <div 
            className='d-flex align-items-center align-content-center justify-content-between'
            style={{cursor:'pointer'}}
            onClick={() => setProfileOpenModal(true)}
          >
            <CgProfile size={20} color={'#ccc'}/>
            <span className="text-muted ml-2">{id}</span>
          </div>
          <div className='p-1' onClick={exitButtonHandle} style={{cursor:'pointer'}}>
            <IoExit size={20} color={'#ccc'}/>
          </div>
        </div>
        <Button onClick={() => setModalOpen(true)} className="rounded-0">
          Yeni {conversationsOpen ? 'Konusma' : 'Kisi'} 
        </Button>
      </Tab.Container>

      <Modal key={1} show={modalOpen} onHide={closeModal}>
        {conversationsOpen ?
          <NewConversationModal closeModal={closeModal} /> :
          <NewContactModal closeModal={closeModal} />
        }
      </Modal>

      <Modal key={2} show={profileOpenModal} onHide={closeProfileModal}>
        <ProfileModal closeModal={closeProfileModal} />
      </Modal>
    </div>
  )
}
