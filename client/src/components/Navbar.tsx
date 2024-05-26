import React from 'react'
import logo from '../assets/logo.svg'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const navigate = useNavigate()

  return (
    <div className='flex items-center justify-between px-20 py-3 border-b-[2px] bg-white'>
        <div className='flex items-center gap-3 cursor-pointer' onClick={() => navigate('/')}>
            <img className='w-18 h-14' src={logo} alt='' />
            <h1 className='font-bold text-3xl'>Medium</h1>
        </div>
        <div className='flex items-center gap-8'>
            <span className='cursor-pointer hover:border-b-2'>Our Story</span>
            <span className='cursor-pointer hover:border-b-2'>Membership</span>
            <span className='cursor-pointer hover:border-b-2'>Write</span>
            <span className='cursor-pointer hover:border-b-2' onClick={() => navigate('/signin')}>Sign in</span>
            <button className='text-white bg-black px-4 py-2 rounded-3xl cursor-pointer' onClick={() => navigate('/signup')}>Get Started</button>
        </div>
    </div>
  )
}

export default Navbar