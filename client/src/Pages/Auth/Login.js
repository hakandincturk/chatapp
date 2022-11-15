import React, { useState } from 'react'
import { Form, Button, FormLabel } from 'react-bootstrap'

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default function Login({ onIdSubmit }) {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      
      await signInWithEmailAndPassword(getAuth(), email, password)
        .then((res) => {
          console.log(res);
          sessionStorage.setItem('Auth Token', res._tokenResponse.refreshToken)
          onIdSubmit(email)
        })
        .catch((err) => {
          if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
            setError('Email veya sifre hatali.')
          }
          else console.log(err.code);
        })

    } catch (error) {
      console.log(error)
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
      <Button type="submit" className="mr-2">Giriş Yap</Button>
    </Form>
  )
}
