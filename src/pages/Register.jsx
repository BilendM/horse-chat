import AddAvatar from '../assets/addAvatar.png'
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 
import { auth, storage, db } from '../firebase'
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';


const Register = () => {
  const [error, setError] = useState('')
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)   
      const storageRef = ref(storage, displayName);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then( async (downloadURL) => {
          try {
            console.log('File available at', downloadURL);
          // Update Profile
          await updateProfile(userCredential.user, {
            displayName,
            photoURL: downloadURL
          });
          // Create User on Firestore
          await setDoc(doc(db, "users", userCredential.user.uid), {
            uid: userCredential.user.uid,
            displayName,
            email,
            photoURL: downloadURL
          });
         //create empty user chats on firestore
          await setDoc(doc(db, "userChats", userCredential.user.uid), {});
          navigate("/");
          } catch (error) {
            console.log('error :>> ', error);
            setError(error.message)
          }
        });
      })      
    } catch (error) {
      console.log('error', error)
      setError(error.message);
    }

  }
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Horse Chat</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Display Name" />
          <input type="email" placeholder="Email"/>
          <input type="password" placeholder="Password" />
          <input style={{display: 'none'}} type="file" id="file"/>
          <label htmlFor="file">
           <img src={AddAvatar} alt="Add Avatar Icon" />
           <span>Add an avatar</span>
          </label>
          <button>Sign Up</button>
          {error && <span className="error">{error}</span>}
        </form>
        <p>Already have an account? <Link to='/login'>Login</Link></p>
      </div>
    </div>
  )
}

export default Register