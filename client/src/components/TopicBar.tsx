import { useRecoilValue } from 'recoil';
import { userTopicsAtom } from '../store/userAtom';
import { PiPlusCircleThin } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeContext';

const TopicBar = () => {
    const userTopics = useRecoilValue(userTopicsAtom);
    const navigate = useNavigate()
    const {theme} = useTheme()

  return (
    <div className='w-[95%] md:w-[70%] flex gap-2 md:gap-5 overflow-scroll scrollbar-hide border-b border-gray-300 mb-10 dark:border-gray-950'>
    <div className=' text-black w-12 h-12 p-2 pr-0'><PiPlusCircleThin style={{width:'25px', height: '25px', cursor: 'pointer', color: theme==='dark' ? 'white' : 'black'}}
      onClick={() => navigate('/all-topics')}
    /></div>
    {userTopics.map((topic:any, index:number) => 
      <div key={index} className='whitespace-nowrap p-2 text-gray-500 text-sm cursor-pointer hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100'
        onClick={() => navigate(`/topic/${topic.id}`)}
      >
        {topic.name}
      </div>
    )}
  </div>
  )
}

export default TopicBar