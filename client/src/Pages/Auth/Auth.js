import React from 'react'
import { Container, Tabs, Tab } from 'react-bootstrap'

import Register from './Register'
import Login from './Login'

export default function Auth({ onIdSubmit }) {

  return (
    <Container className="align-items-center justify-content-center d-flex flex-column" style={{ height: '100vh', width: '100%' }}>
      <Tabs
      defaultActiveKey="login"
      id="uncontrolled-tab-example"
      className="mb-3"
      style={{width: '60vw'}}
    >
      <Tab eventKey="login" title="Giriş Yap" style={{width: '60vw'}}>
        <Login onIdSubmit={onIdSubmit}/>
      </Tab>
      <Tab eventKey="register" title="Kayıt Ol" style={{width: '60vw'}}>
        <Register onIdSubmit={onIdSubmit} />
      </Tab>
    </Tabs>
      
    </Container>
  )
}
