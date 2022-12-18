import React, { useState, useCallback, useEffect } from 'react'
import { Form, InputGroup, Button } from 'react-bootstrap'
import { useConversations } from '../contexts/ConversationsProvider';
import lodash from 'lodash'
import 'moment/locale/tr'
import moment from 'moment';



export default function OpenConversation() {
  const [groupedMessages, setGroupedMessages] = useState()
  const [text, setText] = useState('')
  const setRef = useCallback(node => {
    if (node) {
      node.scrollIntoView({ smooth: true })
    }
  }, [])
  const { sendMessage, selectedConversation } = useConversations()

  useEffect(() => {
    
    var result = lodash.chain(selectedConversation?.messages)
      .groupBy(datum => moment(new Date(new Date(datum.createdAt?.seconds * 1000 + datum.createdAt?.nanoseconds / 1000000))).format("DD MMMM ").toLocaleUpperCase() )
      .map((messages, date) => ({ date, messages })) //using ES6 shorthand to generate the objects
      .value();
      
    setGroupedMessages(result)
  }, [selectedConversation])

  function handleSubmit(e) {
    e.preventDefault()

    sendMessage(
      selectedConversation.id,
      selectedConversation.recipients.map(r => r.id),
      text
    )
    setText('')
  }

  return (
    <div className="d-flex flex-column flex-grow-1 mt-1">
      <div className="flex-grow-1 overflow-auto">
        <div className="d-flex flex-column align-items-start justify-content-end px-3">
          {groupedMessages && groupedMessages?.map((gMessages, gMessageIndex) => {

            const messages =  gMessages.messages.map((message, index) => {
              const lastMessage = gMessages.messages.length - 1 === index
              return (
                <div
                  ref={lastMessage ? setRef : null}
                  key={index}
                  className={`my-1 d-flex flex-column ${message.fromMe ? 'align-self-end align-items-end' : 'align-items-start'}`}
                >
                  <div
                    className={`rounded px-2 py-1 ${message.fromMe ? 'bg-primary text-white' : 'border'}`}>
                    {message.text}
                    <div className=' align-right' style={{fontSize: '10px', textAlign: 'right'}}>
                    {moment(new Date(new Date(message?.createdAt?.seconds * 1000 + message?.createdAt?.nanoseconds / 1000000))).format('HH:mm')}
                    </div>
                  </div>
                  <div className={`text-muted small ${message.fromMe ? 'text-right' : ''}`}>
                    {message.fromMe ? '' : message.senderName}
                  </div>
                </div>
              )
            })

            return (
              <>
                <div className='w-100 d-flex flex-row align-items-center justify-content-center mx-2 px-1' style={{ fontSize: '10px' }}>
                  <div className='py-1 px-3 badge-dark rounded' style={{opacity: 0.2}}>
                    {gMessages.date}
                  </div>
                </div>
                <>
                  {messages}
                </>
              </>
              
            )
            
          })}
        </div>
      </div>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="m-2">
          <InputGroup>
            <Form.Control
              type="textarea"
              required
              autoFocus
              value={text}
              onChange={e => setText(e.target.value)}
              style={{ height: '75px', resize: 'none' }}
            />
            <InputGroup.Append>
              <Button type="submit">Gönder</Button>
            </InputGroup.Append>
          </InputGroup>
        </Form.Group>
      </Form>
    </div>
  )
}
