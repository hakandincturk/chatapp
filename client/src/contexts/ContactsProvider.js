import React, { useContext, useEffect } from 'react'
import useLocalStorage from '../hooks/useLocalStorage';
import { doc, setDoc, getDoc } from 'firebase/firestore'
import db from '../Helpers/FirebaseHelper'
const ContactsContext = React.createContext()

export function useContacts() {
  return useContext(ContactsContext)
}

export function ContactsProvider({ email, children }) {

  const [contacts, setContacts] = useLocalStorage('contacts', [])
  useEffect(() => {
    const func = async () => {
      const snap = await getDoc(doc(db, 'users', email ))
      setContacts(snap.data()?.contacts ?? []);
    }
    func()

  }, [email, setContacts])

  function createContact(id, name, email) {

    setContacts(prevContacts => {
      setDoc(doc(db, 'users', `${email}`), {
        contacts: [...prevContacts, { id, name }]
      }, {merge: true}); 
      return [...prevContacts, { id, name }]
    })
    
  }

  return (
    <ContactsContext.Provider value={{ contacts, createContact }}>
      {children}
    </ContactsContext.Provider>
  )
}
