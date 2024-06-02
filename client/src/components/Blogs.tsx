import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { blogsAtom } from '../store/userAtom'
import { Skeleton } from '@mui/material';
import { fetchHomeBlogs } from '../handlers/userHandlers';
import { BlogSkeleton } from './BlogSkeleton';
import TopicBar from './TopicBar';
import BlogOverview from './BlogOverview';

const Blogs = () => {
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
    <div className='w-full p-5 min-h-[82vh]'>
      <TopicBar />
      {
        blogs.map((blog:any, index:number) => {
          return (
            <BlogOverview
              key={index}
              title={blog.title}
              content={blog.content}
              author={blog.author.name}
              topic={blog.topic.name}
              createdAt={blog.createdAt}
              id={{topic: blog.topicId, author: blog.authorId}}
            />)
        })
      }
    </div>
  )
}

export default Blogs