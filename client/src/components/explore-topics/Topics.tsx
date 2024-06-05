import { useMemo } from "react";
import { topicType } from "../../pages/allTopics";
import TopicCard from "./TopicCard";

interface TopicsType {
    topics: Array<{
        mainTopic: topicType
        subtopics: Array<topicType>
    }>;
}
const Topics = ({topics}: TopicsType) => {
    console.log(topics)

    const sortedTopics = useMemo(() => {
        const data = topics.sort((a,b) => a.mainTopic.id - b.mainTopic.id);
        return data.slice(0,topics.length-1)
    }, [topics])
    console.log(sortedTopics)
  return (
    <div className=" flex flex-wrap gap-12 pl-5 mt-10 mb-20">
        {
            sortedTopics.map((item:any, index: number) => (
                 <TopicCard main={item.mainTopic} sub={item.subtopics} key={index} />
            ))
        }
    </div>
  )
}

export default Topics