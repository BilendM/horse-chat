import Img from '../assets/img.png'
import Attach from '../assets/attach.png'
import { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
import { db, storage } from '../firebase'
import { v4 as uuid} from 'uuid'
import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const Input = () => {

  const [text, setText] = useState('')
  const [image, setImage] = useState(null)

  const {currentUser} = useContext(AuthContext)
  const {data} = useContext(ChatContext)

  const handleSend = async () => {
    if (image) {
      try { 
         const storageRef = ref(storage, uuid());
          await uploadBytesResumable(storageRef, image).then(() => {
          getDownloadURL(storageRef).then( async (downloadURL) => {
            try {
            await updateDoc(doc(db, "chats", data.chatId), {
            messages: arrayUnion({
              id: uuid(),
              text,
              senderId: currentUser.uid,
              date: Timestamp.now(),
              image: downloadURL
            })
          })
            } catch (error) {
              console.log('Send Error', error);
            }
          });
        })      
    } catch (error) {
      console.log('Image Upload Error', error)
    }
      
    }else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now()
        })
      })
    }

    await updateDoc(doc(db, "userChats", currentUser.uid ), {
      [data.chatId + ".lastMessage"]: {
        text
      },
      [data.chatId+".date"]: serverTimestamp()
    })
    await updateDoc(doc(db, "userChats", data.user.uid ), {
      [data.chatId + ".lastMessage"]: {
        text
      },
      [data.chatId+".date"]: serverTimestamp()
    })

    setText('')
    setImage(null)
  }

  return (
    <div className='input'>
      <input type="text" placeholder='Type something...'
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="send">
        <img src={Attach} alt="" />
        <input id='file' type="file" style={{display: 'none'}}
          onChange={(e) => setImage(e.target.files[0])}
        />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  )
}

export default Input