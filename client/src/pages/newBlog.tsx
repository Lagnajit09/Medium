import React from 'react'
import EditorBar from '../components/EditorBar'
import Editor from '../components/Editor'
import { saveUserBlog } from '../handlers/userHandlers'

const NewBlog = () => {

    const handleSaveBlog = async () => {
        
    }
    
  return (
    <div className='w-screen h-screen absolute z-50 top-0 bg-white overflow-x-hidden'>
        <EditorBar />
        <Editor handleSave={handleSaveBlog} />
    </div>
  )
}

export default NewBlog