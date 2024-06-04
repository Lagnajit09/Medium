import Logo from '../assets/logo.svg'
import DarkLogo from "../assets/logo-dark.svg"
import { useNavigate } from 'react-router-dom';
import { Avatar } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useRecoilState } from 'recoil';
import { authUserAtom } from '../store/authAtom';
import { RxPencil2 } from "react-icons/rx";
import { GoBell } from "react-icons/go";
// import { FaRegCircleUser } from "react-icons/fa6";
// import { FiSettings } from "react-icons/fi";
// import { FaRegBookmark } from "react-icons/fa6";
// import { FiHelpCircle } from "react-icons/fi";
import { logOutHandler } from '../handlers/authHandlers';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '../ThemeContext';


const Navbar = () => {
    const navigate = useNavigate();
    const [authUser, setAuthUser] = useRecoilState(authUserAtom)
    const [showDropdown, setShowDropdown] = useState(false)
    const optionsRef = useRef<HTMLDivElement>(null);
    const { theme, toggleTheme } = useTheme();


    const authenticated = useMemo(() => {
        if(localStorage.getItem('medium-userId'))
            return true
    }, [authUser, localStorage])

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

    return (
        <div className={`flex items-center justify-between px-20 ${authenticated ? 'py-1' : 'py-3' }  border-b-2 bg-white dark:bg-gray-900 dark:border-black`}>
            <div className='flex items-center gap-3 cursor-pointer' onClick={() => navigate(`${authenticated ? '/home' : '/'}`)}>
                <img className='w-18 h-14' src={theme==='dark'?DarkLogo:Logo} alt='' />
                <h1 className='font-bold text-3xl dark:text-gray-200'>Medium</h1>
            </div>
            <div className='flex items-center gap-8'>
                <span className=' flex gap-1 items-center cursor-pointer hover:border-b-2 dark:text-gray-200' onClick={() => {navigate('/new-story', {
                    state: {title: '', data: {}}
                })}}>
                    <RxPencil2 className='w-6 h-6' />
                    Write
                </span>
                <GoBell className='w-6 h-6 mr-1 cursor-pointer dark:text-gray-200' />
                <Avatar
                        className='cursor-pointer font-semibold border border-gray-900 dark:text-gray-200'
                        sx={{ bgcolor: theme==='dark' ? grey[300] : grey[900] }}
                        alt={(authUser as any).user.email?.toUpperCase()}
                        src={(authUser as any).user.image ? (authUser as any).user.image : '../broken-img.png'}
                        onClick={() => setShowDropdown(!showDropdown)}
                />
            </div>
            {authenticated && showDropdown && <div className='flex flex-col items-start gap-4 pt-4 pb-4 absolute right-10 top-16 bg-white border-2 rounded-md shadow-xl z-20 dark:bg-gray-800 dark:border-black' ref={optionsRef}>
                <div className='px-10 py-1 w-full cursor-pointer text-gray-600 hover:text-black dark:text-white'><span>Profile</span></div>
                <div className='px-10 py-1 w-full cursor-pointer text-gray-600 hover:text-black dark:text-white'><span>Library</span></div>
                <div className='px-10 py-1 w-full cursor-pointer text-gray-600 hover:text-black dark:text-white'><span>Settings</span></div>
                <div className='px-10 py-1 w-full cursor-pointer text-gray-600 hover:text-black dark:text-white'><span>Help</span></div>
                <div className='px-10 py-1 w-full cursor-pointer text-gray-600 hover:text-black dark:text-white'><span>Membership</span></div>
                <div
                    onClick={toggleTheme}
                    className="px-10 py-1 w-full cursor-pointer text-gray-600 hover:text-black dark:text-white"
                >
                    <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                </div>
                <div className='px-10 py-1 w-full cursor-pointer text-red-600 hover:text-red-500' onClick={() => { logOutHandler(setAuthUser); navigate('/') }}><span>Sign Out</span></div>
            </div>}
        </div>
    )
}

export default Navbar;
