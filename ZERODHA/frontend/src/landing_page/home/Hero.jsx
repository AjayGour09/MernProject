import React from 'react'
const Hero = () => {
  return (
    <>
    <div className='container p-5'>
      <div className='row text-center mb-5'>
       
          <img src='media/images/homeHero.png' alt="Hero image" className='mb-5'/>
          <h1 className='mt-5'>Invest in everything</h1>
          <p>Online platform to invest in stocks, derivatives, mutual funds, and more</p>
          <button className='w-25 btn btn-outline-primary mt-2 p-2 mb-5' style={{width:"25%",margin: "0 auto"}}>Signup now</button>
      </div>
    </div>
    </>
  )
}

export default Hero;