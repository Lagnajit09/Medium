import { Avatar } from '@mui/material'
import { useTheme } from '../ThemeContext'
import { grey } from '@mui/material/colors'
import { FaRegComment } from "react-icons/fa6";
import { LuShare } from "react-icons/lu";
import { FaRegBookmark } from "react-icons/fa6";
import { useMemo, useRef, useState } from 'react';
import ShareBlog from './ShareBlog';
import { CLIENT } from '../config';


interface blogAuthorDataType {
    id:number,
    author: {
        name: string,
        image: string,
    },
    createdAt: string
    len: number
}

const BlogAuthorDetail = ({id, author: {name, image}, createdAt, len}:blogAuthorDataType) => {

    const {theme} = useTheme()
    const [showShareOpts, setShowShareOpts] = useState(false)
    const shareOptsRef = useRef<HTMLDivElement>(null);

    const date = useMemo(() => {
        const date = new Date(createdAt);
        const options: Intl.DateTimeFormatOptions = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        };
        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
        return formattedDate
    }, [createdAt])

    const minsToRead = () => {
        const words = (len + 500) / 5;
        const readingTime = words/100;
        if(readingTime < 1) 
            return `1 min read`
        else return `${Math.round(readingTime)} min read`
    }


  return (
    <div className='flex flex-col w-[90%] md:w-[48%] mx-auto mt-10 '>
        <div className=" flex gap-3 items-center pb-4 border-b border-gray-200 dark:border-gray-600">
            <Avatar 
                className='cursor-pointer font-semibold'
                sx={{ bgcolor: theme==='dark' ? grey[900] : grey[800] }} 
                src={image ? image : '../broken-img.png'} alt={name.toUpperCase()} 
                style={{width: '35px', height: '35px', fontSize: '16px', border: theme==='dark'?'1px solid white':'1px solid black'}} 
            />
            <div className=" text-gray-900 dark:text-gray-100">
                <span className='font-bold text-xl'>{name}</span>
                <div className="flex gap-4 font-thin text-sm text-gray-700 dark:text-gray-300">
                    <span>{minsToRead()}</span>
                    <span>{date}</span>
                </div>
            </div>
        </div>
        <div className=" flex justify-between px-4 py-4 text-xl text-gray-600 dark:text-gray-100 border-b border-gray-200 dark:border-gray-600 relative">
            <FaRegComment className='cursor-pointer' />
            <div className=" flex gap-6">
                <FaRegBookmark className='cursor-pointer' />
                <LuShare className='cursor-pointer' onClick={() => setShowShareOpts(true)} />
            </div>
            {showShareOpts && 
                <div className=" absolute -right-5 md:-right-20 top-12" ref={shareOptsRef}>
                    <ShareBlog copyLink={`${CLIENT}/blog/${id}`} setShowShareOpts={setShowShareOpts} />
                </div>
            }
        </div>
    </div>
  )
}

export default BlogAuthorDetail