import React, { useEffect } from 'react'
// import Login from './Login'
import Auth from '../Pages/Auth/Auth'
import useLocalStorage from '../hooks/useLocalStorage';
import Dashboard from '../Pages/Dashboard/Dashboard'
import { ContactsProvider } from '../contexts/ContactsProvider'
import { ConversationsProvider } from '../contexts/ConversationsProvider';
import { SocketProvider } from '../contexts/SocketProvider';
import { Toaster } from 'react-hot-toast';


function App() {
  const [id, setId] = useLocalStorage('id')

  const dashboard = (
    <SocketProvider id={id}>
      <ContactsProvider email={id}>
        <ConversationsProvider id={id}>
          <Dashboard id={id} />
        </ConversationsProvider>
      </ContactsProvider>
      <Toaster position='top-right'/>
    </SocketProvider>
    
  )

  return (
    // id ? dashboard : <Login onIdSubmit={setId} />
    id === 1 ? <Auth onIdSubmit={setId} /> : dashboard
  )
}

export default App;
