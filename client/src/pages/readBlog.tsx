import { useEffect, useMemo, useState } from 'react';
import BlogAuthorDetail from '../components/BlogAuthorDetail';
import Editor from '../components/Editor'
import { useLocation, useParams } from 'react-router-dom'
import { fetchBlogByID } from '../handlers/userHandlers';
import Loading from '../components/Loading';

const ReadBlog = () => {

  const {state} = useLocation();
  const [loading, setLoading] = useState(state?false:true)
  const {id} = useParams()
  const [data, setData] = useState(state)

  useEffect(()=>{
    const getBlog = async () => {
      if(!state) {
        setLoading(true)
        try {
          const result = await fetchBlogByID(Number(id));
          setData(result)
        } catch (error) {
          console.log(error)
        } finally {
          setLoading(false)
        }
      }
    }

    getBlog()
  },[state])

  if(loading) return <Loading />

  const blogContent = () => {
    return data.content.blocks
        .filter((item: any) => item.type === 'paragraph')
        .map((item: any) => item.data.text)
        .join(' ');
  }
    
  return (
    <div className='min-h-[82.5vh] bg-white overflow-x-hidden dark:bg-gray-800'>
        <BlogAuthorDetail data={data.author} createdAt={data.createdAt} len={blogContent().length + data.title.length} />
        <Editor data={data.content} fetchedTitle={data.title} read={true} />
    </div>
  )
}

export default ReadBlog