import React, { useEffect, useState } from 'react'
import { userTopicsAtom } from '../store/userAtom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { fetchRecommendedTopics } from '../handlers/userHandlers';
import { useNavigate } from 'react-router-dom';
import { Recommended } from './Recommended';
import Button from './Button';
import { IoCloseOutline } from 'react-icons/io5';

const HomeRight = () => {

    const userTopics = useRecoilValue(userTopicsAtom)
    const [recommended, setRecommended] = useState([1,2,3,4,5,6,7])
    const [loading, setLoading] = useState(true)
    const [showFAQ, setShowFAQ] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchRecommendations = async () => {
        try {
            const rTopics = await fetchRecommendedTopics();
            setRecommended(rTopics)
            setLoading(false)
        } catch (error) {
            setLoading(true)  
        } 
        }

        fetchRecommendations()

    }, [userTopics])

    useEffect(() => {
        const handleScroll = () => {
            const parentDiv = document.getElementById('recommended-topics');
            const scrollPosition = window.scrollY;
            const viewportHeight = window.innerHeight;

            if(!parentDiv) return;

            if (scrollPosition >= viewportHeight * 0.08) {
                parentDiv.style.top = '0';
            } else {
                parentDiv.style.top = '';
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    if(!recommended) return;

  return (
    <div id='recommended-topics' className='flex flex-col w-[22%] border-l-2 px-5 fixed right-32 h-[100vh] dark:border-gray-900'>
        {/* RECOMMENDED */}
        <div className='mt-10'>
            <p className=' font-semibold text-base text-gray-700 dark:text-gray-300'>Recommended Topics</p>
            <div className=' flex flex-wrap items-center justify-start mt-3'>
                {!loading && recommended.map((rt, index) => <Recommended topic={rt} key={index} loading={loading} />)}
            </div>
            <div className=' flex gap-2 items-center text-sm mt-5 ml-2 cursor-pointer hover:text-gray-800 w-32 text-green-700 dark:text-green-500'
                onClick={() => navigate('/all-topics')}
            >
                <p>See more topics</p>
            </div>
        </div>
        {/* FAQ AND WRITING */}
        {showFAQ && <div className='flex p-4 bg-blue-200 rounded-sm mt-8 justify-between'>
            <div className=" w-[85%] flex flex-col gap-3">
                <h4 className=' text-sm font-semibold text-black'>Writing on Medium</h4>
                <div className='text-sm text-gray-900 flex flex-col gap-2'>
                    <p className=' cursor-pointer hover:text-black'>New writer FAQ</p>
                    <p className=' cursor-pointer hover:text-black'>Expert writing advice</p>
                    <p className=' cursor-pointer hover:text-black'>Grow your redearship</p>
                </div>

                <Button 
                    title='Start Writing' 
                    onClick={() => navigate('/new-story', {
                        state: {title: '', data: {}}
                    })}
                    buttonStyles=' w-[50%] py-2 bg-gray-800 text-white text-xs rounded-full font-normal mt-2'   
                />
            </div>
            <div className=' h-[14%] mx-auto text-xl cursor-pointer' onClick={() => setShowFAQ(false)}>
                <IoCloseOutline />
            </div>
        </div>}
    </div>
  )
}


export default HomeRight