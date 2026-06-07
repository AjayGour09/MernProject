import React from 'react'
import { Route, Router } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Auth from './pages/Auth'

function App () {
  return (
    <div>
      <Router>
        <Route path='/' element={<Home/>}/>
        <Route path='/auth' element={<Auth/>}/>
      </Router>
    </div>
  )
}
export default App