import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { blogsAtom, userTopicsAtom } from '../store/userAtom'
import { Skeleton } from '@mui/material';
import { PiBookmarksSimpleLight } from "react-icons/pi";
import { fetchHomeBlogs } from '../handlers/userHandlers';
import { BlogSkeleton } from './BlogSkeleton';
import { PiPlusCircleThin } from "react-icons/pi";

const Blogs = () => {
  const userTopics = useRecoilValue(userTopicsAtom);
  const [blogs, setBlogs] = useRecoilState(blogsAtom);
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const fetchBlogs = async () => {
      try {
        const fetchedBlogs = await fetchHomeBlogs();
        setBlogs(fetchedBlogs);
        setLoading(false)
      } catch (error) {
        setLoading(true)
      }
    }

    fetchBlogs()
  }, []);

  console.log(blogs)
  console.log(userTopics)

  if(loading) {
  return(       
  <div className=' w-[70%] mt-16 pl-20 mb-10'>
    <Skeleton variant='rectangular' className=' rounded-3xl w-full h-1' height={5} />
    <BlogSkeleton />
    <BlogSkeleton />
    <BlogSkeleton />
  </div>)
  }


  return (
<div className='w-full p-5'>
  <div className='w-[70%] flex gap-5 overflow-scroll scrollbar-hide border-b border-gray-300'>
    <div className=' text-black w-12 h-12 p-2 pr-0'><PiPlusCircleThin style={{width:'25px', height: '25px', cursor: 'pointer'}} /></div>
    {userTopics.map((topic:any, index:number) => 
      <div key={index} className='whitespace-nowrap p-2 text-gray-500 text-sm cursor-pointer hover:text-gray-800'>
        {topic.name}
      </div>
    )}
  </div>
</div>
  )
}

export default Blogs