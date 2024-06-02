import { useEffect, useState } from "react"
import Loading from "../components/Loading";
import { fetchAllTopicsAndSubtopics } from "../handlers/userHandlers";
import TopBar from "../components/explore-topics/TopBar";
import SearchBar from "../components/explore-topics/SearchBar";
import Topics from "../components/explore-topics/Topics";

const getRandomSubtopics = (topics: any) => {
  const subtopics = topics.flatMap((topic: any) => topic.subtopics);
  const shuffled = subtopics.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 10);
};

const AllTopics = () => {

  const [allTopics, setAllTopics] = useState([]);
  const [randomSubtopics, setRandomSubtopics] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getAllTopics = async () => {
      setLoading(true)
      try {
        const data = await fetchAllTopicsAndSubtopics();
        console.log(data);
        if(!data.length) throw new Error('Failed to fetch topics!')
        setAllTopics(data);
        const subtopics = getRandomSubtopics(data);
        console.log(subtopics)
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
      <div>
        <h1>Explore Topics</h1>
        <SearchBar />
      </div>
      <Topics />
    </div>
  )
}

export default AllTopics