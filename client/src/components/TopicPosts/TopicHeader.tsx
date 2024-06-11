import { useRecoilState } from "recoil"
import { updateUserTopics } from "../../handlers/userHandlers"
import { userTopicsAtom } from "../../store/userAtom"
import Button from "../Button"
import { useMemo } from "react"
import { topicType } from "../../pages/topicPosts"

interface PropsType {
    topic: {
        id: number,
        name: string,
        mainTopicId: number
    },
    totalPosts: number,
    userCount: number,
}

const TopicHeader = ({topic, userCount, totalPosts}: PropsType) => {
    const [userTopics, setUserTopics] = useRecoilState(userTopicsAtom)

    const followed = useMemo(() => {
        return userTopics.some((item: any) => item.id === topic.id)
    }, [topic, userTopics])


    const updateTopic = async () => {
        try {
            let updatedTopics:topicType[] = userTopics;
            if(followed) {
                updatedTopics = updatedTopics.filter((item:topicType) => item.id !== topic.id);
            } else {
                updatedTopics = [...updatedTopics, topic]
            }
            const updatedTopicIDs = updatedTopics.map((item:topicType) => item.id)
            await updateUserTopics(updatedTopicIDs)
            setUserTopics(updatedTopics)
        } catch (error) {
            console.error('Failed to update user topics!')
        }
    }

  return (
    <div className=" py-10 mx-auto flex flex-col items-center text-center dark:text-gray-100 gap-5">
        <h2 className=" text-5xl font-semibold ">{topic?.name}</h2>
        <div className=" flex gap-5 dark:text-gray-300 text-sm">
            <p>Topic</p>
            {<p>{`${userCount < 2 ? userCount + ' follower' : userCount + ' followers'}`}</p>}
            {<p>{`${totalPosts < 2 ? totalPosts + ' post' : totalPosts + ' posts'}`}</p>}
        </div>
        <Button 
            title={`${followed ? 'Followed': 'Follow'}`}
            onClick={updateTopic}
            buttonStyles="font-medium text-sm rounded-full bg-gray-900 py-3 px-5 text-gray-100 mt-3"
        />
    </div>
  )
}

export default TopicHeader