import horsechatlogo from '../assets/horsechatlogo.svg'
import { signOut } from 'firebase/auth'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { auth } from '../firebase'

const Navbar = () => {
  const {currentUser} = useContext(AuthContext)
  return (
    <div className='navbar'>
      <div className="horseChat">
        <img src={horsechatlogo} alt="" />
        <span className='logo'>Horse Chat</span>
      </div>
      <div className="user">
        <img src={currentUser?.photoURL} alt="" />
        <span>{currentUser.displayName}</span>
        <button onClick={() => signOut(auth)}>Logout</button>
      </div>
    </div>
  )
}

export default Navbar