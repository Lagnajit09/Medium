import Button from './Button'
import { RxPencil2 } from 'react-icons/rx'
import { PiPlusCircleThin } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'

const NoPost = () => {
    const navigate = useNavigate()
  return (
    <div className=" m-auto md:ml-[15%] w-fit flex flex-col items-center gap-5 text-center">
          <p className=' text-gray-500'>Currently no posts available for the followed topics!</p>
          <Button 
            title='Be the first one to publish' 
            onClick={() => {navigate('/new-story', {
                state: {title: '', data: {}}
            })}}
            buttonStyles='bg-white border-2 border-gray-600 rounded-lg font-semibold text-sm text-gray-600'
            icon={<RxPencil2 style={{color: 'gray'}} />}
          />
          <Button 
            title='View all topics' 
            onClick={() => {navigate('/all-topics')}} 
            buttonStyles=' md:hidden bg-white border-2 border-gray-600 rounded-lg font-semibold text-sm text-gray-600'
            icon={<PiPlusCircleThin style={{color: 'gray'}} />}
          />
        </div>
  )
}

export default NoPost