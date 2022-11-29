import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import toast  from 'react-hot-toast';

import { setDoc, doc } from 'firebase/firestore'
import db from '../../../Helpers/FirebaseHelper'


export default function Register({ onIdSubmit }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()

    try {

      await createUserWithEmailAndPassword(getAuth(), email, password)
      .then(async (res) => {
        sessionStorage.setItem('access-token', res._tokenResponse.refreshToken)

        await setDoc(doc(db, 'users', email), {
          email,    
          password,
          contacts: [],
          conversations: [],
        }).then((setDocRes) => {
          onIdSubmit(email)
        }).catch((err) => {
          console.log('setDoc.err.code --> ', err.code);
          toast.error('Hata meydana geldi.')
        } );  

      }).catch((err) => {
        if (err.code === 'auth/invalid-email') {
          toast.error('Email hatali.')
        }
        else if(err.code === 'auth/email-already-in-use') {
          toast.error('Email kullanimda.')
        } 
        else if (err.code === 'auth/weak-password') {
          toast.error('Zayif sifre.')
        }
        else console.log('createUser.err.code --> ', err.code);
      } )
    } catch (error) {
      console.log('button.error.code --> ', error.code);
    }
    
  }
  return (
    <Form onSubmit={handleSubmit} className="w-100 d-flex flex-column">
      <Form.Group>
        <Form.Label>Email</Form.Label>
        <Form.Control type="text" value={email} onChange={(v) => setEmail(v.target.value)} required />
      </Form.Group>
      <Form.Group>
        <Form.Label>Password</Form.Label>
        <Form.Control type="text" value={password} onChange={(v) => setPassword(v.target.value)} required />
      </Form.Group> 
      <Button type="submit" className="mr-2">Kayıt Ol</Button>
    </Form>
  )
}