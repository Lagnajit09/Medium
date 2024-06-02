import { useRecoilValue } from 'recoil';
import { userTopicsAtom } from '../store/userAtom';
import { PiPlusCircleThin } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';

const TopicBar = () => {
    const userTopics = useRecoilValue(userTopicsAtom);
    const navigate = useNavigate()

  return (
    <div className='w-[70%] flex gap-5 overflow-scroll scrollbar-hide border-b border-gray-300 mb-10'>
    <div className=' text-black w-12 h-12 p-2 pr-0'><PiPlusCircleThin style={{width:'25px', height: '25px', cursor: 'pointer'}}
      onClick={() => navigate('/all-topics')}
    /></div>
    {userTopics.map((topic:any, index:number) => 
      <div key={index} className='whitespace-nowrap p-2 text-gray-500 text-sm cursor-pointer hover:text-gray-800'
        onClick={() => navigate(`/topic/${topic.id}`)}
      >
        {topic.name}
      </div>
    )}
  </div>
  )
}

export default TopicBar