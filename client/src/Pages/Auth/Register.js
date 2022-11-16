import React, { useDebugValue, useState } from 'react'
import { Form, Button, FormLabel } from 'react-bootstrap'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import db from '../../Helpers/FirebaseHelper'

export default function Register({ onIdSubmit }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      await createUserWithEmailAndPassword(getAuth(), email, password)
      .then(async (res) => {

        sessionStorage.setItem('Auth Token', res._tokenResponse.refreshToken)
        onIdSubmit(email)
      }).catch((err) => {
        if (err.code === 'auth/invalid-email') {
          setError('Email hatali.')
        }
        else if(err.code === 'auth/email-already-in-use') {
          setError('Email kullanimda.')
        } 
        else console.log(err.code);
      } )
    } catch (error) {
      console.log(error);
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
      { error && <FormLabel className='small text-danger mt-0 mb-2'>{error}</FormLabel> }
      <Button type="submit" className="mr-2">Kayıt Ol</Button>
    </Form>
  )
}