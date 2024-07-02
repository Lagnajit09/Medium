import { postType } from "../../pages/topicPosts"
import NoPost from "../NoPost"
import TopicCard from "./TopicCard"

interface PropsType {
    posts?: Array<postType>
}

const TopicBody = ({posts}:PropsType) => {

  return (
    <div className=" w-[98%] md:w-[90%] mx-auto flex flex-wrap gap-5">

        {posts?.length ? (
          posts?.map((post, index) => (
             <TopicCard post={post} key={index} />
        ))
        ) : (
          <div className=" w-[80%] md:w-[43%] m-auto">
            <NoPost />
          </div>
        )
        }
    </div>
  )
}

export default TopicBody