import { useContext, useEffect, useRef } from "react"
import { AuthContext } from "../context/AuthContext"
import { ChatContext } from "../context/ChatContext"
import { formatDistanceToNow, fromUnixTime } from 'date-fns'

const Message = ({message}) => {

  const messageTime = fromUnixTime( message?.date?.seconds)

  const {currentUser} = useContext(AuthContext)
  const {data} = useContext(ChatContext)

  const ref = useRef()

  useEffect(() => {
    ref.current?.scrollIntoView({behavior: 'smooth'})
  },[message])

  return (
    <div ref={ref} className={`message ${message.senderId === currentUser.uid && 'owner'}`}>
      <div className="messageInfo">
        <img src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL} alt="" />
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {message.image && <img src={message.image} alt="" />}
        <span style={{fontSize: '12px'}}>{formatDistanceToNow(messageTime, {addSuffix: true})}</span>

      </div>
    </div>
  )
}

export default Message