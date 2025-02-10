import React from 'react'
import SignIn from './Login/SignIn'
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Register from './Login/Register';
import Home from './Home/Home';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn/>} />
        <Route path='/register' element={<Register/>}/>
        <Route path='/home' element={<Home/>}/>
      </Routes>
    </Router>
  )
}

export default App