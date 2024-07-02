import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { fetchTopicPosts, fetchUserTopics } from "../handlers/userHandlers"
import TopicHeader from "../components/TopicPosts/TopicHeader"
import Loading from "../components/Loading";
import TopicBody from "../components/TopicPosts/TopicPosts";
import { useSetRecoilState } from "recoil";
import { userTopicsAtom } from "../store/userAtom";

export interface userType {
    id: string,
    name: string,
    email:  string,
    password:  string,
    bio:  string,
    image:  string
}

export interface postType {
  id: number,
  title: string,
  content: string,
  published: boolean,
  createdAt: string,
  authorId: string,
  topicId: number,
  author: userType
}

export interface topicType {
  id: number;
  name: string;
  mainTopicId: number;
}

interface TopicsType {
  topic: topicType
  posts: Array<postType>
  users: Array<userType>
  userCount: number;

}

const TopicPosts = () => {
  const {id} = useParams()
  const [topicData, setTopicData] = useState<TopicsType>({
    topic: {
      id: 0,
      name: '',
      mainTopicId: -1
    },
    posts: [],
    users: [],
    userCount: 0
  })
  const [loading, setLoading] = useState<boolean>(false)
  const setUserTopics = useSetRecoilState(userTopicsAtom)

  useEffect(() => {

    const getTopicPosts = async () => {
      if(!id) return;
      setLoading(true)
      try {
        const data = await fetchTopicPosts(id)
        const followedTopics = await fetchUserTopics()
        setUserTopics(followedTopics)
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
      <TopicHeader topic={topicData.topic} userCount={topicData?.userCount || 0} totalPosts={topicData?.posts.length || 0} />
      <TopicBody posts={topicData?.posts} />
    </div>
  )
}

export default TopicPosts