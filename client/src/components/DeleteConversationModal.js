import React from 'react'
import { Button, FormText, Modal } from 'react-bootstrap'
import useLocalStorage from '../hooks/useLocalStorage';

import { getDoc, doc, setDoc } from 'firebase/firestore'
import db from '../Helpers/FirebaseHelper'


export default function DeleteConversationModal({ closeModal, conversationId }) {

  const [email, setEmail] = useLocalStorage('id')

  

  const deleteButtonHandle = async () => {
    const conversationData = await getDoc(doc(db, 'conversations', conversationId))
    if (conversationData.exists()) {

      if(!conversationData.data()?.deletedFrom.includes(email)) {
        const deletedFrom = [ email ]
        for (const dbDeletedFrom of conversationData.data()?.deletedFrom) {
          deletedFrom.push(dbDeletedFrom)
        }

        await setDoc(doc(db, 'conversations', conversationId), {
          deletedFrom
        }, {merge: true});  

        const messages = []
        for (const dbMessages of conversationData.data()?.messages) {
          if (!dbMessages?.deletedFrom?.includes(email)) {

            const newDeletedFrom = [email]

            for (const messageDeletedForms of dbMessages?.deletedFrom) {
              newDeletedFrom.push(messageDeletedForms)
            }

            console.log('newDeleteFrom --> ', newDeletedFrom);

            messages.push({ 
              text: dbMessages?.text,
              createdAt: dbMessages?.createdAt,
              sender: dbMessages?.sender,
              deletedFrom: newDeletedFrom
            })
          }
          else {
            messages.push({ 
              text: dbMessages?.text,
              createdAt: dbMessages?.createdAt,
              sender: dbMessages?.sender,
              deletedFrom: dbMessages?.deletedFrom
            })
          }
          
        }

        await setDoc(doc(db, 'conversations', conversationId), {
          messages
        }, {merge: true});
      }

      closeModal(true)
        
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      closeModal(true)
    }

    
    // console.log("Document written with ID: ", docRef.id);
      
    // closeModal(true)
  }

  return (
    <>
      <Modal.Header closeButton>Profil</Modal.Header>
      <Modal.Body>
        <FormText className='mb-2'>Bu konusmayi silmek istediginize emin misiniz?</FormText>
        <Button onClick={() => closeModal(true)}>Vazgec</Button>
        <Button onClick={async () => await deleteButtonHandle()} className='ml-2'>Sil</Button>
      </Modal.Body>
    </>
  )
}
