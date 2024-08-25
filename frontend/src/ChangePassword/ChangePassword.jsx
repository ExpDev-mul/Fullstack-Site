import { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import styles from './ChangePassword.module.css'

import Header from '../Header/Header.jsx'

export default function ChangePassword(){
    const [message, setMessage] = useState('')
    const [messageColor, setMessageColor] = useState('rgb(255, 0, 0)')
    const { token } = useParams();

    // Reference each input box to later grab their values
    const password = useRef(null)
    const confirmPassword = useRef(null)

    const navigate = useNavigate();

    const submit = async () => {
        // Grab all the values from the input fields
        const passwordValue = password.current.value
        const confirmPasswordValue = confirmPassword.current.value

        if (passwordValue != confirmPasswordValue){
            setMessage("Passwords must match each other.")
            return
        }

        // Make an HTTP call to the server requesting a creation of the user
        const response = await fetch(`http://localhost:3000/api/changepassword/${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                password: passwordValue
            })
        })

        const data = await response.json()

        console.log(data.message)
        
        if (data.message == "SUCCESS"){
            // Store the token within the local storage
            setMessageColor("rgb(0, 255, 125)")
            setMessage("Your password was succesfully reset!")
        } else {
            setMessage(data.message || "An unexpected error occurred. Please try again later.")
        }
    }
        
    return (
        <>
            <Header/>
            <div className={styles.container}>
                <input className={styles.input} type='password' placeholder='Password...' ref={password}></input>
                <input className={styles.input} type='password' placeholder='Confirm password...' ref={confirmPassword}></input>
                <p className={styles.message} style={{color: messageColor}}>{message}</p>
                <button className={styles.submit} onClick={submit}>Change Password</button>
            </div>
        </>
        
    );
}
