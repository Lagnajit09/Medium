import { Avatar } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useMemo } from "react";
import { PiBookmarksSimpleLight } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";

interface overviewType {
    title: string;
    content: string;
    author: string;
    authorImg: string;
    topic: string;
    createdAt: string;
    id: {
        topic: number;
        author: string;
        blog: number;
    }
}

function decodeHTMLEntities(text: string) {
    const element = document.createElement('textarea');
    element.innerHTML = text;
    return element.value;
}


const BlogOverview = ({title, content, author, authorImg, topic, createdAt, id}: overviewType) => {

    const navigate = useNavigate()
    const { theme } = useTheme();

    const parsedContent = useMemo(() => {
        return JSON.parse(content)
    }, [content])

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

    const blogContent = useMemo(() => {
        return parsedContent.blocks
            .filter((item: any) => item.type === 'paragraph')
            .map((item: any) => decodeHTMLEntities(item.data.text))
            .join(' ');
    }, [content]);

    const images = useMemo(() => {
        return parsedContent.blocks.filter((item:any) => item.type === 'image')
    }, [parsedContent])

    const slicedContent = () => {
        return blogContent.length > 200 ?  blogContent.slice(0,200) + '...' : blogContent;
    }

    const minsToRead = () => {
        const words = (blogContent.length + title.length + 500) / 5;
        const readingTime = words/100;
        if(readingTime < 1) 
            return `1 min read`
        else return `${Math.round(readingTime)} min read`
    }

  return (
    <div className="w-full md:w-[70%] flex mb-10 border-b p-5 dark:border-gray-950 rounded-md dark:bg-gray-700">
        <div className="left w-[80%] flex flex-col gap-2 pr-10">
            <div className="top w-auto flex text-sm items-center gap-4">
                <div className="flex items-center gap-2 cursor-pointer">
                    <Avatar 
                        className='cursor-pointer font-semibold'
                        sx={{ bgcolor: theme==='dark' ? grey[900] : grey[800] }} 
                        src={authorImg ? authorImg : '../broken-img.png'} 
                        alt={author.toUpperCase()} 
                        style={{width: '25px', height: '25px', fontSize: '14px'}} 
                    />
                    <p className=" dark:text-gray-200">{author}</p>
                </div>
                <p className=" text-xs text-gray-400">{date}</p>
            </div>
            <div className="medium cursor-pointer" onClick={() => navigate(`/blog/${id.blog}`, {
                state: {
                    id: id.blog,
                    title,
                    content: parsedContent,
                    createdAt,
                    author: {
                        name: author, 
                        image: authorImg, 
                    }
                }
            })}>
                <h2 className=" dark:text-gray-200">{title}</h2>
                <p className=" text-sm text-gray-600 dark:text-gray-300">{slicedContent()}</p>
            </div>
            <div className="bottom flex items-center justify-between mt-3">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <div className=" py-1 px-2 border rounded-full bg-gray-100 text-gray-700 cursor-pointer dark:bg-gray-800 dark:border-gray-800 dark:text-gray-300">{topic}</div>
                    <div>{minsToRead()}</div>
                </div>
                <div className=" cursor-pointer">
                    <PiBookmarksSimpleLight style={{color: theme==='dark'?'white':'rgb(75 85 99 / 1)', width:'20px', height: '20px'}}/>
                </div>

            </div>
        </div>
        <div className="right">
            {
                images.length > 0 ? 
                    <img src={images[0].data.file.url} alt='' width={170} height={170} className=' object-fill bg-slate-400' />
                :
                <div className='bg-gray-100 px-10 py-12 md:py-16 text-center text-gray-400 text-sm dark:bg-gray-600'>No Image</div>
            }
        </div>
    </div>
  )
}

export default BlogOverview