import { MdExplore } from "react-icons/md";
import { useNavigate } from "react-router-dom";

interface TopBarType {
    topics: Array<{
        id: number,
        name: string
    }>;
}

const TopBar = ({topics}:TopBarType) => {

    const navigate = useNavigate()

  return (
    <div className='relative dark:bg-gray-800'>
      <div className='flex gap-5 overflow-x-scroll scrollbar-hide pr-16'>
        <div className="flex gap-2 items-center text-gray-800 px-4 py-2 bg-gray-100 rounded-full border-2 border-gray-800">
          <MdExplore style={{ width: '18px', height: '18px' }} />
          <p className="text-sm">Explore</p>
        </div>
        {topics.map((item, index) => (
          <div className="whitespace-nowrap text-gray-800 px-4 py-2 bg-gray-100 rounded-full text-sm hover:text-black cursor-pointer dark:bg-gray-600 dark:text-gray-200" key={index}
            onClick={()=>navigate(`/topic/${item.id}`, {
              state: item
            })}
          >
            {item.name}
          </div>
        ))}
      </div>
      <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white to-transparent pointer-events-none dark:from-gray-800 dark:to-transparent"></div>
    </div>
  )
}

export default TopBar