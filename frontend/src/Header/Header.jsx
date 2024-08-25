import {useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css'

import { jwtDecode } from 'jwt-decode'


export default function Home(){
    // States
    const [username, setUsername] = useState('')

    // References
    const signup = useRef(null)
    const login = useRef(null)

    useEffect(() => {
        const user_token = localStorage.getItem('user_token')
        async function main(){
            /*
            */
        }
        
        main()

        if (user_token){
            try{
                // Wrap in a protected call
                const decodedToken = jwtDecode(user_token)
                setUsername(decodedToken.username)
            } catch(error) {

            }
            
        }
    }, [])

    const navigate = useNavigate();

    const loginNavigate = () => {
        navigate('/login')
    }

    const signupNavigate = () => {
        navigate('/signup')
    }

    const homeNavigate = () => {
        navigate('/home')
    }

    const signout = () => {
        localStorage.removeItem('user_token')
        window.location.reload()
    }

    return (
        <>
            <header className={styles.header}>
                <div className={styles.header_left}>
                    <button className={`${styles.header_button_left} ${username != '' ? 'invisible' : ''}`} onClick={homeNavigate}>Home</button>
                    <button className={`${styles.header_button_left} ${username != '' ? 'invisible' : ''}`} onClick={signupNavigate}>Sign Up</button>
                    <button className={`${styles.header_button_left} ${username != '' ? 'invisible' : ''}`} onClick={loginNavigate}>Log In</button>

                    <button className={`${styles.header_button_left} ${username == '' ? 'invisible' : ''}`} onClick={signout}>Sign Out</button>
                </div>

                <div className={styles.header_right}>
                    <span className={styles.username}>{username}</span>
                </div>
            </header>
        </>
    );
}