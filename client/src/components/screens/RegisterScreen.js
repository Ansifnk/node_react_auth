import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
import './RegisterScreen.css'

const RegisterScreen = ({ history }) => {
    const [username, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        if (localStorage.getItem("authToken")) {
            history.push('/')
        }
    }, [history])


    const registerHandler = async (e) => {
        e.preventDefault()
        const config = {
            header: {
                "Content-Type": "application/json"
            }
        }
        if (password != confirmPassword) {
            setPassword('')
            setConfirmPassword('')
            setTimeout(() => {
                setError('')
            }, 5000)
            return setError('passwrd do not match')
        }
        try {
            const { data } = await axios.post('/api/auth/register', { username, email, password }, config)
            localStorage.setItem("authToken", data.token)
            history.push('/')
        } catch (error) {
            setError(error.response.data.error)
            setTimeout(() => {
                setError('')
            }, 5000)
        }

    }

    return (


        <div className="register-screen">
            <form action="" className="register-screen__form" onSubmit={registerHandler} >
                <h3 className='register-screen__title'>Register</h3>
                {error && <span className='error-message'>{error}</span>}
                <div className="form-group">
                    <label htmlFor="name">UserName</label>
                    <input type="text" name="" required id="'name" placeholder='Username' value={username}
                        onChange={(e) => setUserName(e.target.value)} />
                </div>

                <div className="form-group">
                    <label htmlFor="email">email address</label>
                    <input type="email" name="" required id="'email" placeholder='email' value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="password">password</label>
                    <input type="password" name="" required id="'password" placeholder='password' value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmpassword">confirmpassword</label>
                    <input type="password" name="" required id="'confirmpassword" placeholder='confirm password' value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>

                <button type='submit' className='btn btn-primary'>Register</button>
                <span className='register-screen__subtext' >Already have an account <Link to='/login' >Login</Link> </span>
            </form>
        </div>
    )
}
export default RegisterScreen