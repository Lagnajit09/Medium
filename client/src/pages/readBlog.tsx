import Editor from '../components/Editor'
import { useLocation } from 'react-router-dom'

const ReadBlog = () => {

  const {state} = useLocation();

  console.log(state)
    
  return (
    <div className='min-h-[82vh] bg-white overflow-x-hidden'>
        <Editor data={state.content} fetchedTitle={state.title} read={true} />
    </div>
  )
}

export default ReadBlog