import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "./register.css";

function Register() {
  const navigate = useNavigate()
  const [username, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function registerUser(event) {
    event.preventDefault()

    const response = await fetch('http://localhost:8080/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    })

    const data = await response.json()

    if (response.ok) {
      alert('Registration successful')
      navigate('/')
    }
    else{
      alert(' this username or email exist already')
    }
  }

  return (
    <div className="register-container">
      <h1>Sign Up</h1>
      <form >
        <div  className='register-text'><span>Name</span></div>
        <input
          value={username}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Name"
        />
        <br />
        <div  className='register-text'><span>Email</span></div>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
        />
        <br />
        <div className='register-text'><span>Password</span></div>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
        />
        <br />
        <div className='register-page-button'>
          <button className='register-button' onClick={(e)=>registerUser(e)} value="Register">Sign up</button>
        </div>
      </form>
    </div>
  )
}
export default Register
