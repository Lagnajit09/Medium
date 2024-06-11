import { useEffect, useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import { fetchTopicPosts } from "../handlers/userHandlers"
import TopicHeader from "../components/TopicPosts/TopicHeader"
import Loading from "../components/Loading";
import TopicBody from "../components/TopicPosts/TopicPosts";

export interface postType {
  id: number,
  title: string,
  content: string,
  published: boolean,
  createdAt: string,
  authorId: string,
  topicId: number,
  author: {
    id: string,
    name: string,
    email:  string,
    password:  string,
    bio:  string,
    image:  string
  }
}

interface TopicsType {
  topic: {
    id: number;
    name: string;
    userCount: number;
  },
  posts: Array<postType>
}

const TopicPosts = () => {
  const {id} = useParams()
  const [topicData, setTopicData] = useState<TopicsType>()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {

    const getTopicPosts = async () => {
      if(!id) return;
      setLoading(true)
      try {
        const data = await fetchTopicPosts(id)
        console.log(data)
        setTopicData(data[0])
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    getTopicPosts()
  }, [])

  if(loading) return <Loading />

  return (
    <div className=" w-full min-h-[82.5vh] dark:bg-gray-800">
      <TopicHeader topic={topicData?.topic} userCount={topicData?.topic.userCount} totalPosts={topicData?.posts.length} />
      <TopicBody posts={topicData?.posts} />
    </div>
  )
}

export default TopicPosts