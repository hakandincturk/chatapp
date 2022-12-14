/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react'
import { Tab, Nav, Button, Modal } from 'react-bootstrap'
import Conversations from './Conversations'
import Contacts from './Contacts'
import NewContactModal from './NewContactModal'
import NewConversationModal from './NewConversationModal'
import ProfileModal from './ProfileModal'

import useLocalStorage from '../hooks/useLocalStorage';

import { getDoc, doc } from 'firebase/firestore'
import db from '../Helpers/FirebaseHelper'

import { IoExit } from 'react-icons/io5'
import { CgProfile } from 'react-icons/cg'

const CONVERSATIONS_KEY = 'conversations'
const CONTACTS_KEY = 'contacts'

export default function Sidebar({ id }) {
  const [idd, setId] = useLocalStorage('id')
  const [contacts, setContacts] = useLocalStorage('contacts')
  const [conversations, setConversations] = useLocalStorage('conversations')
  const [userData, setUserData] = useState()
  const [activeKey, setActiveKey] = useState(CONVERSATIONS_KEY)
  const [modalOpen, setModalOpen] = useState(false)
  const conversationsOpen = activeKey === CONVERSATIONS_KEY
  const [profileOpenModal, setProfileOpenModal] = useState(false)
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const docRef = doc(db, "users", id)
        const docSnap = await getDoc(docRef);
        setUserData(docSnap.data());
      } catch (error) {
        console.log('err --> ', error)
      }
    }
    fetchUserData().catch((error) => console.log(error))
  }, [id])


  const closeModal = () => {
    setModalOpen(false)
  }

  const closeProfileModal = () => {
    setProfileOpenModal(false)
  }

  const exitButtonHandle = () => {
    setId(undefined)
    setContacts([])
    setConversations([])
    window.location.href = '';
  }

  return (
    <div style={{ minWidth: '250px' }} className="d-flex flex-column">
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
            { userData?.image !== undefined ? <img className='rounded-circle' alt='not found' src={userData.image} width={36} height={36} /> : <CgProfile size={36} color={'#ccc'}/>}
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
