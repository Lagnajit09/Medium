import EditorBar from '../components/EditorBar'
import Editor from '../components/Editor'
import { useLocation } from 'react-router-dom'

const EditBlog = () => {

  const {state} = useLocation();
    
  return (
    <div className='w-screen h-screen absolute z-50 top-0 bg-white overflow-x-hidden'>
        <EditorBar update={true} id={state.id} />
        <Editor data={state.content.data} fetchedTitle={state.title} />
    </div>
  )
}

export default EditBlog