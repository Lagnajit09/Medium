import React, { useState } from 'react'
import LandingImg from '../assets/landing_page.webp'
import Signup from './Signup'
import Signin from './Signin';

interface landingPageType {
    showSignIn : boolean;
    showSignUp: boolean;
    setShowSignUp: Function;
    setShowSignIn: Function;
}

const landing = ({showSignIn, showSignUp, setShowSignIn, setShowSignUp}: landingPageType) => {
    
  return (
    <div className='h-[80vh] w-full flex'>
        {showSignUp && !showSignIn && <Signup setShowSignUp={setShowSignUp} setShowSignIn={setShowSignIn}/>}
        {!showSignUp && showSignIn && <Signin setShowSignIn={setShowSignIn} setShowSignUp={setShowSignUp}/>}
        <div className='  flex flex-col items-start gap-8 pl-20 py-32 '>
            <h1 className='font-bold text-8xl flex flex-col'>Human <span>Stories and Ideas</span></h1>
            <p className='text-xl'>A place to read, write, and deepen your understanding</p>
            <button className='px-10 py-2 bg-black text-white font-semibold text-xl rounded-3xl cursor-pointer'>Get Started</button>
        </div>
        <img src={LandingImg} className='w-1/3 h-screen absolute -z-10 -right-0 -top-3' alt='landing_page image' />
    </div>
  )
}

export default landing