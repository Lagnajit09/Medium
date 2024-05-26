import logo from '../assets/logo.svg'
import { useNavigate } from 'react-router-dom';
import { Avatar } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useRecoilState } from 'recoil';
import { authUserAtom } from '../store/authAtom';
import { RxPencil2 } from "react-icons/rx";
import { GoBell } from "react-icons/go";
import { FaRegCircleUser } from "react-icons/fa6";
import { FiSettings } from "react-icons/fi";
import { FaRegBookmark } from "react-icons/fa6";
import { FiHelpCircle } from "react-icons/fi";
import { logOutHandler } from '../authHandlers';
import { useState } from 'react';



interface navbarPropsTypes {
    setShowSignUp: Function;
    setShowSignIn: Function;
    setAuthenticated: Function;
    authenticated: boolean;
    session: string;
}

const Navbar = ({setShowSignIn, setShowSignUp, authenticated, setAuthenticated, session}: navbarPropsTypes) => {
    const navigate = useNavigate()
    const [authUser, setAuthUser] = useRecoilState(authUserAtom)
    const [showDropdown, setShowDropdown] = useState(false)

  return (
    <div className='flex items-center justify-between px-20 py-3 border-b-[2px] bg-white'>
        <div className='flex items-center gap-3 cursor-pointer' onClick={() => navigate('/')}>
            <img className='w-18 h-14' src={logo} alt='' />
            <h1 className='font-bold text-3xl'>Medium</h1>
        </div>
        <div className='flex items-center gap-8'>
            {!authenticated && <><span className='cursor-pointer hover:border-b-2'>Our Story</span>
            <span className='cursor-pointer hover:border-b-2'>Membership</span></>}
            <span className=' flex gap-1 items-center cursor-pointer hover:border-b-2'> 
            {authenticated && <RxPencil2 className='w-6 h-6'/> }
            Write</span>
            {authenticated && <GoBell className='w-6 h-6 mr-1 cursor-pointer' />}
            {authenticated ? 
            <Avatar
                className=' cursor-pointer'
                sx={{ bgcolor: grey[500] }}
                alt={(authUser as { email: string }).email?.toUpperCase()}
                src="/broken-image.jpg"
                onClick={()=>setShowDropdown(!showDropdown)}
            />
                : 
            <>
                <span className='cursor-pointer hover:border-b-2' onClick={() => {setShowSignIn(true); setShowSignUp(false)}}>
                    Sign In
                </span>
                <button className='text-white bg-black px-4 py-2 rounded-3xl cursor-pointer' onClick={() => {setShowSignUp(true); setShowSignIn(false)}}>
                        Get Started
                </button>
            </>}
        </div>
        {authenticated && showDropdown && <div className=' flex flex-col items-start gap-4 pt-4 pb-4 absolute right-10 top-16 bg-white border-2 rounded-md shadow-xl'>
            <div className='px-10 py-1 w-full cursor-pointer text-gray-600 hover:text-black'><span>Profile</span></div>
            <div className='px-10 py-1 w-full cursor-pointer text-gray-600 hover:text-black'><span>Library</span></div>
            <div className='px-10 py-1 w-full cursor-pointer text-gray-600 hover:text-black'><span>Settings</span></div>
            <div className='px-10 py-1 w-full cursor-pointer text-gray-600 hover:text-black'><span>Help</span></div>
            <div className='px-10 py-1 w-full cursor-pointer text-gray-600 hover:text-black'><span>Membership</span></div>
            <div className='px-10 py-1 w-full cursor-pointer text-gray-600 hover:text-black' onClick={()=>{logOutHandler(setAuthUser, setAuthenticated, session); navigate('/')}}><span>Sign Out</span></div>
        </div>}
    </div>
  )
}

export default Navbar