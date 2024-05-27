import React, { useEffect, useState } from 'react'
import { userTopicsAtom } from '../store/userAtom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { fetchRecommendedTopics } from '../handlers/userHandlers';
import { Skeleton } from '@mui/material';

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

  return (
    <div className='flex w-[30%] border-l-2 px-5'>
        <div className='mt-10'>
            <p className=' font-semibold text-base text-gray-700'>Recommended Topics</p>
            <div className=' flex flex-wrap items-center justify-start mt-5'>
                {recommended.map((rt, index) => <Recommended topic={rt} key={index} loading={loading} />)}
            </div>
        </div>
    </div>
  )
}

const Recommended = ({topic, key, loading}: recommendedType) => {
    return (
        <>
            {loading ? 
                <div className=' mx-2 my-1'>
                    <Skeleton variant="rectangular" width={80} height={30} className=' rounded-3xl' />
                </div> 
                : 
                <div className=' mx-2 my-1 rounded-full px-4 py-2 flex items-center bg-gray-100 text-gray-700 cursor-pointer'>
                    {topic.name}
                </div>
            }
        </>
        
    )
}

export default HomeRight