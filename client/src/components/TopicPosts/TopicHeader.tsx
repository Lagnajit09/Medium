import Button from "../Button"

interface PropsType {
    topic?: {
        id?: number,
        name?: string
    },
    totalPosts?: number,
    userCount?: number
}

const TopicHeader = ({topic, userCount, totalPosts}: PropsType) => {

    const followTopic = async () => {}

  return (
    <div className=" py-10 mx-auto flex flex-col items-center text-center dark:text-gray-100 gap-5">
        <h2 className=" text-5xl font-semibold ">{topic?.name}</h2>
        <div className=" flex gap-5 dark:text-gray-300 text-sm">
            <p>Topic</p>
            {userCount &&<p>{`${userCount < 2 ? userCount + ' follower' : userCount + ' followers'}`}</p>}
            {totalPosts &&<p>{`${totalPosts < 2 ? totalPosts + ' post' : totalPosts + ' posts'}`}</p>}
        </div>
        <Button 
            title="Follow"
            onClick={followTopic}
            buttonStyles="font-medium text-sm rounded-full bg-gray-900 py-3 px-5 text-gray-100 mt-3"
        />
    </div>
  )
}

export default TopicHeader