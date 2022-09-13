import { doc, onSnapshot } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../context/ChatContext';
import { db } from '../firebase';
import Message from './Message'

const Messages = () => {

  const[messages, setMessages] = useState([]);
  const {data} = useContext(ChatContext);

  console.log('data', data)

  useEffect(() => {
      const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      console.log('doc :>> ', doc);
      doc.exists() && setMessages(doc.data().messages);
    })

    return () => unSub();
  },[data.chatId])

  console.log('messages', messages)

  return (
    <div className='messages'>
      {messages.map(message => (
        <Message key={message.id} message={message}/>
      ))}
    
    </div>
  )
}

export default Messages