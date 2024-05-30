import Logo from "../assets/logo.svg"
import { useRecoilState, useRecoilValue } from 'recoil'
import { authUserAtom } from '../store/authAtom'
import { Avatar, CircularProgress } from '@mui/material'
import { grey } from '@mui/material/colors'
import Button from './Button'
import { LuShare } from "react-icons/lu";
import { editorInstanceAtom, userBlogsAtom } from "../store/userAtom"
import { useState } from "react"
import { saveUserBlog, updateUserBlog } from "../handlers/userHandlers"
import { useNavigate } from "react-router-dom";

interface EditorBarProps {
    update: boolean;
    id: number;
}


const EditorBar = ({update, id}: EditorBarProps) => {
    const authUser = useRecoilValue(authUserAtom);
    const editorAtom = useRecoilValue(editorInstanceAtom)
    const [loading, setLoading] = useState(false)
    const [userBlogs, setUserBlogs] = useRecoilState(userBlogsAtom)
    const [buttonTitle, setButtonTitle] = useState(update?'Saved':'Save');
    const navigate = useNavigate()

    const handlePublish = async () => {}

    const handleSave = async () => {
        setLoading(true)
        try {
            const data = await editorAtom();

            if(!data?.title && data?.data?.blocks.length===0) throw Error;

            const savedPost = await saveUserBlog(data);
            setUserBlogs((prev):any => [...prev, savedPost])
            
            setButtonTitle('Saved');
            navigate(`/blog/${savedPost.id}/edit`, {
                state: savedPost
            });
        } catch (error) {
            console.log('Error while saving blog!')
        } finally{
            setLoading(false)
        }
    }

    const handleUpdate = async () => {
        setLoading(true)
        try {
            const data = await editorAtom();

            const updatedPost = await updateUserBlog(data, id, 70000);

            // Clone the array to avoid mutating state directly
            let updatedBlogs:any = [...userBlogs];
            const postIndex = updatedBlogs.findIndex((blog:any) => blog.id === id);
            
            if (postIndex === -1) {
              throw new Error('Blog not found');
            }
            
            // Remove the old post from the cloned array
            updatedBlogs.splice(postIndex, 1);
            
            // Add the updated post to the cloned array
            updatedBlogs = [...updatedBlogs, updatedPost];
            
            // Update the state with the modified array
            setUserBlogs(updatedBlogs);
            
            setButtonTitle('Saved');
            navigate(`/blog/${updatedPost.id}/edit`, {
                state: updatedPost
            });
        } catch (error) {
            console.log(error)
            console.log('Error while saving blog!')
        } finally{
            setLoading(false)
        }
    }

  return (
    <div className=' w-[70%] mx-auto p-3 flex justify-between items-center relative'>
        <div className=' flex gap-4 items-center'>
            <img src={Logo} alt='logo.svg' className=' w-12 h-12' />
            <p className=' text-gray-700'>{(authUser as { name: string }).name}</p>
        </div>
        <div className=' flex gap-6 items-center'>
            <Button title='Publish' onClick={handlePublish} buttonStyles=' bg-green-600 text-white border-2 border-green-600 rounded-full text-sm cursor-pointer' />

            {loading ?
                <CircularProgress /> 
                : 
                <Button id="saveBlogButton" title={buttonTitle} onClick={!update? handleSave : handleUpdate} buttonStyles=' bg-white text-gray-600 border-2 border-gray-600 rounded-full text-sm cursor-pointer' />
            }

            <LuShare className=' w-5 h-5 cursor-pointer' />

            <Avatar
                className='cursor-pointer font-semibold'
                sx={{ bgcolor: grey[900] }}
                alt={(authUser as { email: string }).email?.toUpperCase()}
                src="/broken-image.jpg"
            />
        </div>
        
    </div>
  )
}

export default EditorBar