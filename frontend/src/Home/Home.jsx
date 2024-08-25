import {useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css'

import { jwtDecode } from 'jwt-decode'

import Header from '../Header/Header.jsx'


export default function Home(){
 
    return (
        <>
            <Header/>
            
        </>
    );
}