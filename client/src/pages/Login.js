import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "./login.css"

function Login() {
	const navigate = useNavigate();
	const [username, setUserName] = useState("")
	const [password, setPassword] = useState('')

	async function loginUser(event) {
		event.preventDefault()
		const response = await fetch('http://localhost:8080/api/auth/signin', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({
			username,
			password,
		  }),
		})
		const data = await response.json()
	
		if (response.ok) {
		  localStorage.setItem('token', data.accessToken)
		  alert('Login successful')
		  navigate('./dashboard',  { state: { username } })
		} else {
		  alert('Please check your username and password')
		}
	}
	const handleRegister=(e)=>{
		navigate("./register");
	}

	return (
		<div className="login-container">
			<h1>Login</h1>
			<form>
				<div>
				<div className='input-text'><span>Username</span></div>
				<input
					value={username}
					onChange={(e) => setUserName(e.target.value)}
					type="name"
					placeholder="username"
				/>
				</div>
				<br />
				<div className='input-text'><span>Password</span></div>
				<input
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					type="password"
					placeholder="Password"
				/>
				<br />
				<div className='login-page-buttons'>
				<button className="login-button" onClick={(e)=>loginUser(e)} value="Login">Login</button>
				<button className="signup-button" onClick={(e)=>handleRegister()} value="Register">Sign up</button>
				</div>
			</form>
		</div>
	)
}
export default Login;
