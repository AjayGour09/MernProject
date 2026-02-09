import React from 'react'
import VideoImage from '../../public/mobile.png'

const LandingPage = () => {
  return (
    <div className='landingPageContainer '>
      <nav className=' text-white flex justify-between'>
        <div>
          <h2 className='text-xl p-2 cursor-pointer font-bold mt-2 text-lg ml-2.5'>Let's Connect</h2>
        </div>
        <div className='flex p-2 gap-9 font-semibold me-5 cursor-pointer'>
          <h4 className='mt-2 text-lg'>join as Guest </h4>
          <h4 className='mt-2 text-lg'>Register</h4>
          <h4 className='bg-amber-500 p-2 w-25 text-center text-lg rounded'>Login</h4>
        </div>
      </nav>
      <div className='flex justify-around items-center mt-5'>
        <div className='text-white'>
          <p className='text-3xl pt-2'><span className='text-amber-600'>Connect </span> With Your</p>
          <p className='text-3xl pt-2'>Loved Ones</p>
          <p className='dark mt-3'>Cover a distance by Let's Connect Videocall</p>
          <button className='bg-amber-500 p-2 rounded rounded-1 mt-3 cursor-pointer'>Get Started</button>
        </div>
        <div className='mt-20 w-[500px]'>
          <img src={VideoImage} alt="" />
        </div>
      </div>
    </div>
  )
}

export default LandingPage
