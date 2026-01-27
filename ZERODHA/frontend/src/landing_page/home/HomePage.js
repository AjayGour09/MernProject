import React from 'react'
import NavBar from '../components/NavBar.js'
import Hero from './Hero.jsx'
import Award from './Award.jsx'
import Stats from './Stats.js'
import Pricing from "./Pricing.js";
import Education from './Education.js';
import OpenAccount from '../components/OpenAccount.js'
import Footer from '../components/Footer.js'
const HomePage = () => {
  return (
    <>
    
    <NavBar />
    <Hero />
    <Award />
    <Stats />
    <Pricing />
    <Education />
    <OpenAccount />
    <Footer />
    </>
  )
}

export default HomePage