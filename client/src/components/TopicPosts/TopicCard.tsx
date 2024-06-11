import { useMemo } from "react"
import { postType } from "../../pages/topicPosts"
import { PiBookmarksSimpleLight } from "react-icons/pi";
import { Avatar } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../ThemeContext";


function stripHtmlTags(text:string) {
    const div = document.createElement('div');
    div.innerHTML = text;
    return div.textContent || div.innerText || '';
}


const TopicCard = ({post}:{post?:postType}) => {

    const navigate = useNavigate()
    const { theme } = useTheme();

    if(!post) return <>No posts available!</>

    const parsedContent = useMemo(() => {
        return JSON.parse(post.content)
    }, [post.content])

    const date = useMemo(() => {
        const date = new Date(post.createdAt);
        const options: Intl.DateTimeFormatOptions = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        };
        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
        return formattedDate
    }, [post.createdAt])

    const blogContent = useMemo(() => {
        return parsedContent.blocks
            .filter((item: any) => item.type === 'paragraph')
            .map((item: any) => stripHtmlTags(item.data.text))
            .join(' ');
    }, [post.content]);

    const images = useMemo(() => {
        return parsedContent.blocks.filter((item:any) => item.type === 'image')
    }, [parsedContent])

    const slicedContent = () => {
        return blogContent.length > 200 ?  blogContent.slice(0,200) + '...' : blogContent;
    }

  return (
    <div className=" w-[95%] md:w-[48%] flex gap-4 mx-auto p-5 rounded-md dark:bg-gray-700 mb-5 border-2 border-gray-200 dark:border-gray-700 shadow-md">
        <div className=" w-[25%] h-full">
            {images.length ? (
                <img 
                    src={images[0]?.data?.file.url} 
                    alt="Post-image" 
                    className=" w-42 h-32 object-contain overflow-hidden" 
                    width={145} />
            ) : (
                <div className=" w-28 md:w-36 h-28 bg-gray-600 flex items-center text-center justify-center text-xs text-gray-300">No image available.</div>
            )}
        </div>
        <div className=" w-[75%] flex flex-col gap-1 ">
            <div 
                className=" w-full min-h-[80%] flex flex-col cursor-pointer" 
                onClick={() => 
                    navigate(`/blog/${post.id}`, {
                        state: {
                            id: post.id,
                            title: post.title,
                            content: parsedContent,
                            createdAt: post.createdAt,
                            author: {
                                name: post.author.name, 
                                image: post.author.image, 
                            }
                        }
                    })
                }
            >
                <h3 className=" text-lg font-semibold dark:text-gray-100">{post.title}</h3>
                <p className="text-xs dark:text-gray-300">{slicedContent()}</p>
            </div>
            <div className="flex w-full justify-between dark:text-gray-100 items-center mt-1">
                <div className=" flex gap-2 text-xs items-center">
                    <Avatar
                        className='cursor-pointer font-semibold'
                        sx={{ bgcolor: theme==='dark' ? grey[900] : grey[800] }} 
                        src={post.author.image ? post.author.image : '../broken-img.png'} 
                        alt={post.author.name.toUpperCase()} 
                        style={{width: '25px', height: '25px', fontSize: '14px', border: theme==='dark'?'1px solid white':'1px solid black'}} 
                    />
                    <p>{post.author.name}</p>
                    <p className=" dark:text-gray-400 ml-1">{date}</p>
                </div>
                <PiBookmarksSimpleLight />
            </div>
        </div>
    </div>
  )
}

export default TopicCard