import React, { useEffect, useState } from 'react'
import { Modal, Form, Button, FormGroup } from 'react-bootstrap'
import useLocalStorage from '../hooks/useLocalStorage';

import { getDoc, doc } from 'firebase/firestore'
import db from '../Helpers/FirebaseHelper'


export default function ProfileModal({ closeModal }) {

  const [email, setEmail] = useLocalStorage('id')
  const [userData, setUserData] = useState()
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordAgain, setNewPasswordAgain] = useState('')

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const docRef = doc(db, "users", email)
        const docSnap = await getDoc(docRef);
        setUserData(docSnap.data());
      } catch (error) {
        console.log('err --> ', error)
      }
    }

    fetchUserData().catch((error) => console.log(error))
  }, [email])


  const formHandle = (e) => {
    e.preventDefault()
    console.log('userData --> ', userData);
  }

  return (
    <>
      <Modal.Header closeButton>Profil</Modal.Header>
      <Modal.Body>
        <Form onSubmit={formHandle}>
          
          <FormGroup>
            <Form.Label>Resim</Form.Label>
            <Form.Control type="file" />
          </FormGroup>
          <FormGroup>
            <Form.Label>Email</Form.Label>
            <Form.Control type="text" value={email} readOnly/>
          </FormGroup>
          <FormGroup>
            <Form.Label>Isim</Form.Label>
            <Form.Control type="text" value={name} onChange={e => setName(e.target.value)} />
          </FormGroup>
          <FormGroup>
            <Form.Label>Soyisim</Form.Label>
            <Form.Control type="text" value={surname} onChange={e => setSurname(e.target.value)}/>
          </FormGroup>
          <FormGroup>
            <Form.Label>Tekrar Sifre</Form.Label>
            <Form.Control type="new-password" value={newPassword} onChange={e => setNewPassword(e.target.value)}/>
          </FormGroup>
          <FormGroup>
            <Form.Label>Sifre</Form.Label>
            <Form.Control type="new-password" value={newPasswordAgain} onChange={e => setNewPasswordAgain(e.target.value)}/>
          </FormGroup>
          <Button type="submit">Guncelle</Button>
        </Form>
      </Modal.Body>
    </>
  )
}
