import EditorBar from '../components/EditorBar'
import Editor from '../components/Editor'
import { useLocation, useParams } from 'react-router-dom'
import { useEffect, useMemo } from 'react';

const NewBlog = () => {
  const {state} = useLocation();
    
  if(!state) return;
  return (
    <div className='w-screen h-screen bg-white overflow-x-hidden dark:bg-gray-800'>
        <EditorBar update={false} id={0} />
        <Editor data={state.data} fetchedTitle={state.title} read={false} />
    </div>
  )
}

export default NewBlog 