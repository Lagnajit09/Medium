import React, { useEffect, useRef, useState } from 'react'
import Logo from "../assets/logo.svg"
import { useRecoilValue } from 'recoil'
import { authUserAtom } from '../store/authAtom'
import { Avatar } from '@mui/material'
import { grey } from '@mui/material/colors'
import Button from './Button'
import { FiMoreHorizontal } from "react-icons/fi";

const EditorBar = () => {
    const authUser = useRecoilValue(authUserAtom);
    const [showDropdown, setShowDropdown] = useState(false)

    const optionsRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
            setShowDropdown(false);
        }
    };

    const handleScroll = () => {
        setShowDropdown(false);
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', handleScroll);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handlePublish = async () => {}

  return (
    <div className=' w-[70%] mx-auto p-3 flex justify-between items-center relative'>
        <div className=' flex gap-4 items-center'>
            <img src={Logo} alt='logo.svg' className=' w-12 h-12' />
            <p className=' text-gray-700'>{(authUser as { email: string }).email}</p>
        </div>
        <div className=' flex gap-6 items-center'>
            <Button title='Publish' onClick={handlePublish} buttonStyles=' bg-green-600 text-white rounded-full text-sm cursor-pointer' />

            <div ref={optionsRef}>
                <FiMoreHorizontal className=' w-6 h-6 cursor-pointer' onClick={() => setShowDropdown(!showDropdown)} />
                {showDropdown && <div className=' p-3 pr-8 flex flex-col border-2 rounded-md border-gray-100 gap-2 absolute top-14 right-12 shadow-sm text-sm  text-gray-700' >
                    <span className=' cursor-pointer hover:text-black'>Save</span>
                    <span className=' cursor-pointer hover:text-black'>Share</span>
                    <span className=' cursor-pointer hover:text-black'>Help</span>
                </div>}
            </div>

            <Avatar
                className='cursor-pointer font-semibold'
                sx={{ bgcolor: grey[900] }}
                alt={(authUser as { email: string }).email?.toUpperCase()}
                src="/broken-image.jpg"
            />
        </div>
        
    </div>
  )
}

export default EditorBar