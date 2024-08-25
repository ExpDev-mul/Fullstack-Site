import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import styles from './Signup.module.css'

import Header from '../Header/Header.jsx'

export default function Signup(){
    const [message, setMessage] = useState('')
    const [messageColor, setMessageColor] = useState('rgb(255, 0, 0)')

    // Reference each input box to later grab their values
    const username = useRef(null)
    const email = useRef(null)
    const password = useRef(null)

    const navigate = useNavigate();

    const submit = async () => {
        // Grab all the values from the input fields
        const usernameValue = username.current.value
        const emailValue = email.current.value
        const passwordValue = password.current.value

        if (usernameValue.length < 7){
            setMessage("Username must be at least 7 characters long.")
            return;
        }

        if (emailValue.length < 5 ||!emailValue.includes('@')){
            setMessage("Invalid email format.")
            return;
        }

        const passwordRegex = /[!@#$%^&*(),.?":{}|<>]/
        if (passwordValue.length < 9){
            setMessage("Password must be at least 9 characters long.")
            return;
        }

        if (!passwordRegex.test(passwordValue)){
            setMessage("Password must contain at least one special character.")
            return;
        }
        
        // Make an HTTP call to the server requesting a creation of the user
        const response = await fetch('http://localhost:3000/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                username: usernameValue,
                email: emailValue,
                password: passwordValue
            })
        })

        const data = await response.json()
        if (data.message == "SUCCESS"){
            setMessageColor("rgb(0, 255, 125)")
            setMessage("Succesfully created your account! We're redirecting you.")

            const token = data.token
    
            // Store the token within the local storage
            localStorage.setItem('user_token', token)
            
            setTimeout(() => {
                navigate('/home')
            }, 1000);
            return;
        } else {
            setMessage(data.message || "An unexpected error occurred. Please try again later.")
        }
    }
        
    return (
        <>
            <Header/>
            <div className={styles.container}>
                <input className={styles.input} type='text' placeholder='Username...' ref={username}></input>
                <input className={styles.input} type='email' placeholder='Email...' ref={email}></input>
                <input className={styles.input} type='password' placeholder='Password...' ref={password}></input>
                <p className={styles.message} style={{color: messageColor}}>{message}</p>
                <button className={styles.submit} onClick={submit}>Sign Up</button>
            </div>
        </>
    );
}
