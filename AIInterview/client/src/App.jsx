import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import { useEffect } from "react";
import axios from "axios";

export const serverURL = "http://localhost:8080"

function App() {

  useEffect(()=>{
    const getUser = async()=>{
      try {
        const result = await axios.get(serverURL + "/api/user/current-user", {withCredentials:true})
        console.log(result.data);
        
      } catch (error) {
        console.log(error);
        
      }
    }
    getUser()
  },[])
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