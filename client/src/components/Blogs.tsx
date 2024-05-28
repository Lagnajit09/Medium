import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { blogsAtom, userTopicsAtom } from '../store/userAtom'
import { Skeleton } from '@mui/material';
import { PiBookmarksSimpleLight } from "react-icons/pi";
import { fetchHomeBlogs } from '../handlers/userHandlers';

const Blogs = () => {
  const userTopics = useRecoilValue(userTopicsAtom);
  const [blogs, setBlogs] = useRecoilState(blogsAtom);
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const fetchBlogs = async () => {
      try {
        const fetchedBlogs = await fetchHomeBlogs();
        setBlogs(fetchedBlogs);
        console.log(fetchedBlogs)
        setLoading(true)
      } catch (error) {
        setLoading(true)
      }
    }

    fetchBlogs()
  }, []);

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
    <div className='flex w-[70%]'>
      <div className=' w-full border-b-2 h-2 mt-16'>

      </div>
    </div>
  )
}

const BlogSkeleton = () => {
  return (
    <div className='flex w-[100%] mt-10 gap-5 justify-between border-b-2 border-gray-100 pb-8'>
      <div className=' flex flex-col w-[80%] gap-5'>
          <div className='flex items-baseline gap-3 w-full'>
            <Skeleton variant='circular' width={30} height={30} />
            <Skeleton variant='rectangular' className='rounded-lg w-[30%]' height={2} />
          </div>
          <div className=' flex flex-col gap-3 w-full items-start'>
            <Skeleton variant='rectangular' className='rounded-md w-full' height={15} />
            <Skeleton variant='rectangular' className='rounded-md w-full' height={70} />
          </div>
          <div className=' flex items-center justify-between w-full'>
            <Skeleton variant='rectangular' className='rounded-3xl w-[12%]' height={20} />
            <div className='flex gap-3'>
              <Skeleton variant='circular' className=' w-5 h-5 ' />
              <Skeleton variant='circular' className=' w-5 h-5 ' />
              <Skeleton variant='circular' className=' w-5 h-5 ' />
            </div>
          </div>
      </div>
      <Skeleton variant='rectangular' className=' rounded-md mt-7' width={120} height={120} />
    </div>
  )
}

export default Blogs