import EditorBar from '../components/EditorBar'
import Editor from '../components/Editor'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react';

const NewBlog = () => {

  const {id} = useParams();

  useEffect(() => {

  }, [id])
    
  return (
    <div className='w-screen h-screen absolute z-50 top-0 bg-white overflow-x-hidden'>
        <EditorBar update={false} id={0} />
        <Editor data={{blocks: []}} fetchedTitle='' />
    </div>
  )
}

export default NewBlog