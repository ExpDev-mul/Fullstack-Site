import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import Home from './Home/Home.jsx'
import Signup from './Signup/Signup.jsx'
import Login from './Login/Login.jsx'
import ForgotPassword from './ForgotPassword/ForgotPassword.jsx'
import ChangePassword from './ChangePassword/ChangePassword.jsx'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const routes = [
  {
    path: "/",
    element: <Home/>
  },

  {
    path: "/home",
    element: <Home/>
  },

  {
    path: "/login",
    element: <Login/>
  },

  {
    path: "/signup",
    element: <Signup/>
  },

  {
    path: "/forgotpassword",
    element: <ForgotPassword/>
  },

  {
    path: "/changepassword/:token",
    element: <ChangePassword/>
  },
]

const router = createBrowserRouter(routes)

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <RouterProvider router={router}/>
  </>
)
