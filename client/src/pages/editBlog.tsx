import EditorBar from '../components/EditorBar'
import Editor from '../components/Editor'
import { useLocation } from 'react-router-dom'

const EditBlog = () => {

  const {state} = useLocation();
    
  return (
    <div className='w-screen h-screen bg-white overflow-x-hidden'>
        <EditorBar update={true} id={state.id} />
        <Editor data={state.content.data} fetchedTitle={state.title} read={false} />
    </div>
  )
}

export default EditBlog