import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import {setUserData} from './redux/userSlice.js'

export const serverURL = "http://localhost:8080"

function App() {

  const dispatch = useDispatch()

  useEffect(()=>{
    const getUser = async()=>{
      try {
        const result = await axios.get(serverURL + "/api/user/current-user", {withCredentials:true})
        dispatch(setUserData(result.data))
        
      } catch (error) {
        console.log(error);
        dispatch(setUserData(null))
        
      }
    }
    getUser()
  },[dispatch])
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </div>
  );
}

export default App;