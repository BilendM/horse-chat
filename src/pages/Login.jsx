import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth} from '../firebase'
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const [error, setError] = useState('')
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/')
    } catch (error) {
      console.log('error', error)
      setError(error.message);
    }

  }
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Horse Chat</span>
        <span className="title">Login</span>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email"/>
          <input type="password" placeholder="Password" />
          <button>Sign In</button>
          {error && <span className="error">{error}</span>}
        </form>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  )
}

export default Login