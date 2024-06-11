import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { fetchAllTopics, publishUserBlog } from '../handlers/userHandlers';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { authUserAtom } from '../store/authAtom';
import Select from 'react-dropdown-select';
import  Button  from '../components/Button';
import { IoCloseOutline } from "react-icons/io5";
import { CircularProgress } from '@mui/material'
import { blogsAtom } from '../store/userAtom';
import { useTheme } from '../ThemeContext';
import './styles.css'

interface TopicType {
    id: number;
    value: number;
    label: number;
}

function stripHtmlTags(text:string) {
    const div = document.createElement('div');
    div.innerHTML = text;
    return div.textContent || div.innerText || '';
}

const PublishBlog = () => {
    const [options, setOptios] = useState([])
    const [selectedTopic, setSelectedTopic] = useState<TopicType[]>()
    const [loading, setLoading] = useState(false)
    const authUser = useRecoilValue(authUserAtom)
    const setBlogs = useSetRecoilState(blogsAtom);
    const {state} = useLocation();
    const navigate = useNavigate()
    const {theme} = useTheme()
    console.log(state);

    useEffect(() => {
        const fetchTopics = async () => {
            const data = await fetchAllTopics();

            const filteredData = data.map((item:any, index: number) => {
                return {value: index, label: item.name, id: item.id}
            })
            setOptios(filteredData);
        }

        fetchTopics()
    }, [state])

    const images = useMemo(() => {
        return state.data.blocks.filter((item:any) => item.type === 'image')
    }, [state])

    const content = useMemo(() => {
        return state.data.blocks
            .filter((item: any) => item.type === 'paragraph')
            .map((item: any) => stripHtmlTags(item.data.text))
            .join(' ');
    }, [state]);

    const slicedTitle = () => {
        return state.title.length > 50 ?  state.title.slice(0,45) + '...' : state.title;
    }

    const slicedContent = () => {
        return content.length > 90 ?  content.slice(0,90) + '...' : content;
    }

    const handlePublish = async () => {
        setLoading(true)
        try {
            if(!selectedTopic) throw Error('Select a topic!')
            const data = await publishUserBlog(state.title, state.data, selectedTopic[0].id);
            console.log(data);
            if(!data || data.error) throw Error('Failed to publish');
            setBlogs((prev:any) => [data, ...prev])
            navigate('/home');
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

  return (
    <div className="w-full dark:bg-gray-800">
    <div className='flex w-[95%] md:w-[65%] h-screen items-center mx-auto '>
        <div className='flex flex-col w-[50%] gap-3 h-auto my-auto'>
            <h3 className=' font-bold text-lg text-gray-700 dark:text-gray-200'>Story Preview</h3>
            {
                images.length > 0 ? 
                    <img src={images[0].data.file.url} alt='' width={400} height={200} className=' object-contain w-[80%] h-48 bg-gray-500' />
                :
                    <div className=' w-[80%] bg-gray-100 px-8 py-20 text-center text-gray-400 text-sm dark:bg-gray-600 rounded-md'>Include a high-quality image in your story to make it more inviting to readers.</div>
            }
            <h2 className=' text-lg mt-2 border-b w-[85%] text-gray-700 dark:text-gray-200'>{slicedTitle()}</h2>
            <p className=' mt-2 border-b text-gray-600 w-[85%] text-base dark:text-gray-200'>{slicedContent()}</p>
        </div>
        <div className='flex w-[50%] h-full'>
            <div className=' flex-col h-auto my-auto gap-3 w-[90%]'>
                <div className=" flex gap-2">
                    <p className=' dark:text-gray-300'>Publishing to: </p>
                    <h2 className=' font-bold text-lg text-gray-600 dark:text-gray-200'>{(authUser as any).user.name}</h2>
                </div>
                <p className=' text-sm font-normal text-gray-700 mt-2 dark:text-gray-300'>Add a topic so readers know what your story is about</p>

                <Select 
                    options={options}
                    values={[]}
                    className='select-container'
                    style={{ color: theme === 'dark' ? 'lightgray' : 'gray' }}
                    addPlaceholder=''
                    searchBy='label'
                    labelField='label'
                    onChange={(value) => setSelectedTopic(value)}
                />

                {loading ?
                    <CircularProgress style={{marginTop: '10px'}} /> 
                : 
                    <Button title='Publish Now' onClick={handlePublish} buttonStyles=' bg-green-600 my-5 text-white border-2 border-green-600 rounded-full text-sm cursor-pointer hover:bg-white hover:text-green-600' id="publishBtn"  />
                }
            </div>
            <div className=' w-[7%] h-[5%] mx-auto text-4xl mt-32 mr-5 cursor-pointer' onClick={() => navigate('/new-story', {
                state: state
            })}><IoCloseOutline className='dark:text-gray-200' /></div>
        </div>
    </div>
    </div>
  )
}

export default PublishBlog