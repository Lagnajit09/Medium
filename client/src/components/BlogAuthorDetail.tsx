import { Avatar } from '@mui/material'
import { useTheme } from '../ThemeContext'
import { grey } from '@mui/material/colors'
import { FaRegComment } from "react-icons/fa6";
import { LuShare } from "react-icons/lu";
import { FaRegBookmark } from "react-icons/fa6";


interface blogAuthorDataType {
    data: {
        author: string,
        authorImg: string,
        readTime: string,
        createdAt: string
    }
}

const BlogAuthorDetail = ({data: {author, authorImg, readTime, createdAt}}:blogAuthorDataType) => {

    const {theme} = useTheme()

  return (
    <div className='flex flex-col w-[48%] mx-auto mt-10 '>
        <div className=" flex gap-3 items-center pb-4 border-b border-gray-600">
            <Avatar 
                className='cursor-pointer font-semibold'
                sx={{ bgcolor: theme==='dark' ? grey[900] : grey[800] }} 
                src={authorImg ? authorImg : '../broken-img.png'} alt={author.toUpperCase()} 
                style={{width: '35px', height: '35px', fontSize: '14px', border: theme==='dark'?'1px solid white':'1px solid black'}} 
            />
            <div className=" text-gray-900 dark:text-gray-100">
                <span className='font-bold text-xl'>{author}</span>
                <div className="flex gap-4 font-thin text-sm text-gray-700 dark:text-gray-300">
                    <span>{readTime}</span>
                    <span>{createdAt}</span>
                </div>
            </div>
        </div>
        <div className=" flex justify-between px-4 py-4 text-xl text-gray-800 dark:text-gray-100 border-b border-gray-600">
            <FaRegComment />
            <div className=" flex gap-6">
                <FaRegBookmark />
                <LuShare />
            </div>
        </div>
    </div>
  )
}

export default BlogAuthorDetail