import React from 'react'
// import Login from './Login'
import Auth from '../Pages/Auth/Auth'
import useLocalStorage from '../hooks/useLocalStorage';
import Dashboard from './Dashboard'
import { ContactsProvider } from '../contexts/ContactsProvider'
import { ConversationsProvider } from '../contexts/ConversationsProvider';
import { SocketProvider } from '../contexts/SocketProvider';
import db from '../Helpers/FirebaseHelper'

function App() {
  const [id, setId] = useLocalStorage('id')

  const dashboard = (
    <SocketProvider id={id}>
      <ContactsProvider>
        <ConversationsProvider id={id}>
          <Dashboard id={id} />
        </ConversationsProvider>
      </ContactsProvider>
    </SocketProvider>
  )

  return (
    // id ? dashboard : <Login onIdSubmit={setId} />
    id === 1 ? <Auth onIdSubmit={setId} /> : dashboard
  )
}

export default App;
