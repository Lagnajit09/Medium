import { useEffect, useState } from "react"
import Loading from "../../components/Loading";
import { fetchAllTopicsAndSubtopics } from "../../handlers/userHandlers";
import TopBar from "../../components/explore-topics/TopBar";
import SearchBar from "../../components/explore-topics/SearchBar";
import Topics from "../../components/explore-topics/Topics";

const getRandomSubtopics = (topics: any) => {
  const shuffled = topics.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 10);
};

interface MainTopic {
  id: number;
  name: string;
}

export interface topicType {
  id: number;
  name: string;
  mainTopicId?: number;
}

interface Topic {
  mainTopic: MainTopic;
  subtopics: topicType[];
}

interface FlattenedSubtopic extends topicType {
  mainTopicId: number;
}

const flattenArray = (topics: Topic[]): (MainTopic | FlattenedSubtopic)[] => {
  const flattenedArray: (MainTopic | FlattenedSubtopic)[] = topics.reduce((acc: (MainTopic | FlattenedSubtopic)[], topic) => {
      acc.push(topic.mainTopic);
      topic.subtopics.forEach((subtopic: topicType) => {
          acc.push({ ...subtopic, mainTopicId: topic.mainTopic.id });
      });
      return acc;
  }, []);
  return flattenedArray;
};

const AllTopics = () => {

  const [allTopics, setAllTopics] = useState([]);
  const [randomSubtopics, setRandomSubtopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState<(MainTopic | FlattenedSubtopic)[]>([])

  useEffect(() => {
    const getAllTopics = async () => {
      setLoading(true)
      try {
        const data = await fetchAllTopicsAndSubtopics();
        if(!data.length) throw new Error('Failed to fetch topics!')
        setAllTopics(data);
        const flattenedTopics = flattenArray(data);
        setSearchData(flattenedTopics)
        const subtopics = getRandomSubtopics(flattenedTopics);
        setRandomSubtopics(subtopics);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false)
      }
    }

    getAllTopics()
  }, [])

  if(loading) return <Loading />;

  return (
    <div className="flex flex-col w-[75%] min-h-[80vh] mt-5 mx-auto gap-5">
      <TopBar topics={randomSubtopics} />
      <div className=" flex flex-col w-full gap-5 mt-5 pb-28 items-center justify-center border-b">
        <h1 className=" text-4xl font-bold text-gray-800">Explore Topics</h1>
        <SearchBar data={searchData} />
      </div>
      <Topics topics={allTopics} />
    </div>
  )
}

export default AllTopics