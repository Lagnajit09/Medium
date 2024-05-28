import React from 'react'
import EditorBar from '../components/EditorBar'
import Editor from '../components/Editor'

const NewBlog = () => {
  return (
    <div className='w-screen h-screen absolute z-50 top-0 bg-white overflow-x-hidden'>
        <EditorBar />
        <Editor />
    </div>
  )
}

export default NewBlog