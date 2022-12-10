import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import toast  from 'react-hot-toast';

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default function Login({ onIdSubmit }) {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(getAuth(), email, password)
        .then((res) => {
          sessionStorage.setItem('access-token', res._tokenResponse.refreshToken)
          onIdSubmit(email)
        })
        .catch((err) => {
          if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
            toast.error('Email veya sifre hatali.')
          }
          else if (err.code === 'auth/network-request-failed') {
            toast.error('Sunucu ile baglanti kurulamadi.')
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
        <Form.Control type="password" value={password} onChange={(v) => setPassword(v.target.value)} required />
      </Form.Group>   
      <Button type="submit" className="mr-2">Giriş Yap</Button>
    </Form>
  )
}
