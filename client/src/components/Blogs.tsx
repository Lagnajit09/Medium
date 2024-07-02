import { useRecoilValue } from 'recoil'
import { blogsAtom } from '../store/userAtom'
import TopicBar from './TopicBar';
import BlogOverview from './BlogOverview';
import NoPost from './NoPost';

const Blogs = () => {
  const blogs = useRecoilValue(blogsAtom);

  return (
    <div className='w-full p-5'>
      <TopicBar />

      {blogs.length ? (
        blogs.map((blog:any, index:number) => {
          return (
            <BlogOverview
              key={index}
              title={blog.title}
              content={blog.content}
              author={blog.author.name}
              authorImg={blog.author.image}
              topic={blog.topic.name}
              createdAt={blog.createdAt}
              id={{topic: blog.topicId, author: blog.authorId, blog:blog.id}}
            />)
        })
      ) : (
        <NoPost />
      )
      }
    </div>
  )
}

export default Blogs