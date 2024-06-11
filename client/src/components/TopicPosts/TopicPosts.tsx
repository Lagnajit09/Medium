import { postType } from "../../pages/topicPosts"
import TopicCard from "./TopicCard"

interface PropsType {
    posts?: Array<postType>
}

const TopicBody = ({posts}:PropsType) => {
  return (
    <div className=" w-[98%] md:w-[90%] mx-auto flex flex-wrap gap-5">
        {posts?.map((post, index) => (
             <TopicCard post={post} key={index} />
        ))}
    </div>
  )
}

export default TopicBody