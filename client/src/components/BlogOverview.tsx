import { Avatar } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useMemo } from "react";
import { PiBookmarksSimpleLight } from "react-icons/pi";

interface overviewType {
    title: string;
    content: string;
    author: string;
    topic: string;
    createdAt: string;
    id: {
        topic: number;
        author: string;
    }
}

const BlogOverview = ({title, content, author, topic, createdAt, id}: overviewType) => {

    const parsedContent = useMemo(() => {
        return JSON.parse(content)
    }, [content])

    console.log(parsedContent)

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
            .map((item: any) => item.data.text)
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
    <div className="w-[70%] flex mb-10 border-b pb-5">
        <div className="left w-[80%] flex flex-col gap-2 pr-10">
            <div className="top w-auto flex text-sm items-center gap-4">
                <div className="flex items-center gap-2 cursor-pointer">
                    <Avatar className='cursor-pointer font-semibold'
                        sx={{ bgcolor: grey[800] }} src="../broken-image.png" alt={author.toUpperCase()} style={{width: '25px', height: '25px', fontSize: '14px'}} />
                    <p>{author}</p>
                </div>
                <p className=" text-xs text-gray-400">{date}</p>
            </div>
            <div className="medium">
                <h2 className=" cursor-pointer">{title}</h2>
                <p className=" text-sm text-gray-600 cursor-pointer">{slicedContent()}</p>
            </div>
            <div className="bottom flex items-center justify-between mt-3">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <div className=" py-1 px-2 border rounded-full bg-gray-100 text-gray-700 cursor-pointer">{topic}</div>
                    <div>{minsToRead()}</div>
                </div>
                <div className=" cursor-pointer">
                    <PiBookmarksSimpleLight style={{color:'rgb(75 85 99 / 1)', width:'20px', height: '20px'}}/>
                </div>

            </div>
        </div>
        <div className="right">
            {
                images.length > 0 ? 
                    <img src={images[0].data.file.url} alt='' width={170} height={170} className=' object-fill bg-slate-400' />
                :
                    <div className='bg-gray-100 px-10 py-16 text-center text-gray-400 text-sm'>No Image</div>
            }
        </div>
    </div>
  )
}

export default BlogOverview