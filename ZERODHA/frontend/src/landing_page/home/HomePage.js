import React from 'react'
import NavBar from '../components/NavBar.js'
import Hero from './Hero.jsx'
import Award from './Award.jsx'
import Stats from './Stats.jsx'
import Pricing from "./Pricing.jsx";
import Education from './Education.jsx';
import OpenAccount from '../components/OpenAccount.jsx'
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