import { useState, useRef } from 'react'
import { useNavigate, Link} from 'react-router-dom';
import styles from './Login.module.css'

import Header from '../Header/Header.jsx'

export default function Login(){
    const [message, setMessage] = useState('')
    const [messageColor, setMessageColor] = useState('rgb(255, 0, 0)')

    // Reference each input box to later grab their values
    const email = useRef(null)
    const password = useRef(null)

    const navigate = useNavigate();

    const submit = async () => {
        // Grab all the values from the input fields
        const emailValue = email.current.value
        const passwordValue = password.current.value
        
        // Make an HTTP call to the server requesting a creation of the user
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                email: emailValue,
                password: passwordValue
            })
        })

        const data = await response.json()

        console.log(data.message)
        
        if (data.message == "SUCCESS"){
            const token = data.token

            // Store the token within the local storage
            localStorage.setItem('user_token', token)
            setMessageColor("rgb(0, 255, 125)")
            setMessage("Succesfully logged in! We're redirecting you.")
            setTimeout(() => {
                navigate('/home')
            }, 1000);
        } else {
            setMessage(data.message || "An unexpected error occurred. Please try again later.")
        }
    }
        
    return (
        <>
            <Header/>
            <div className={styles.container}>
                <input className={styles.input} type='email' placeholder='Email...' ref={email}></input>
                <input className={styles.input} type='password' placeholder='Password...' ref={password}></input>
                <p className={styles.message} style={{color:'rgb(0, 0, 0)'}}>Forgot your Password?<br/><Link to='/forgotpassword'>Reset your Password</Link></p>
                <p className={styles.message} style={{color: messageColor}}>{message}</p>

                <button className={styles.submit} onClick={submit}>Log In</button>
            </div>
        </>
    );
}
