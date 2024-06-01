import React, { useEffect, useState } from 'react'
import { userTopicsAtom } from '../store/userAtom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { fetchRecommendedTopics } from '../handlers/userHandlers';
import { Skeleton } from '@mui/material';
import { HiArrowRight } from "react-icons/hi2";

interface recommendedType {
    topic: any;
    key: number;
    loading: boolean;
}

const HomeRight = () => {

    const userTopics = useRecoilValue(userTopicsAtom)
    const [recommended, setRecommended] = useState([1,2,3,4,5,6,7])
    const [loading, setLoading] = useState(true)

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

    if(!recommended) setLoading(true);

  return (
    <div id='recommended-topics' className='flex w-[22%] border-l-2 px-5 fixed right-32 h-[100vh]'>
        <div className='mt-10'>
            <p className=' font-semibold text-base text-gray-700'>Recommended Topics</p>
            <div className=' flex flex-wrap items-center justify-start mt-3'>
                {!loading && recommended.map((rt, index) => <Recommended topic={rt} key={index} loading={loading} />)}
            </div>
            <div className=' flex gap-2 items-center text-sm mt-5 ml-2 cursor-pointer hover:border-b-2 w-[40%]'>
                <p>See all topics</p>
                <HiArrowRight />
            </div>
        </div>
    </div>
  )
}

const Recommended = ({topic, loading}: recommendedType) => {
    return (
        <>
            {loading ? 
                <div className=' mx-2 my-1'>
                    <Skeleton variant="rectangular" width={80} height={30} className=' rounded-3xl' />
                </div> 
                : 
                <div className=' mx-2 my-1 rounded-full px-4 py-2 flex items-center bg-gray-100 text-black cursor-pointer'>
                    {topic.name}
                </div>
            }
        </>
        
    )
}

export default HomeRight