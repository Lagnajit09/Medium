import React, { useEffect, useMemo, useState } from 'react'
import logo from '../assets/logo.svg'
import { useLocation, useNavigate } from 'react-router-dom'
import { PiPlus } from "react-icons/pi";
import { PiCheck } from "react-icons/pi";
import { updateUserTopics } from '../handlers/userHandlers';
import { useRecoilState } from 'recoil';
import { loadingAtom } from '../store/loader';
import Loading from '../components/Loading';

const Topic = (props: {item:{id:number, name: string, mainTopicId: number}, key:number, selected: any, setSelected: Function}) => {

    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        if(clicked) {
            props.setSelected((prev: any) => [...prev, props.item.id])
        } else {
            let topics = props.selected;
            topics = topics.filter((topic:number) => topic !== props.item.id);
            props.setSelected(topics)
        }
    }, [clicked])

    const styles = useMemo(() => {
        return clicked ? 'border-green-600 text-green-700' : 'border-grey-100 text-black';
    }, [clicked])

    return (
        <div className={`flex gap-2 items-center border-2 rounded-3xl px-4 py-2 mx-2 my-1 bg-gray-100 cursor-pointer ${styles}`} onClick={() => {setClicked(!clicked)} }  >
            <p>{props.item.name}</p> 
            {clicked? <PiCheck /> : <PiPlus />}
        </div>
    )
}

const SelectTopic = () => {
    const {state} = useLocation();
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useRecoilState(loadingAtom)
    const navigate = useNavigate()

    const buttonStyle = useMemo(() => {
        return selected.length < 5 ? 'bg-gray-100 text-gray-400' : 'bg-black text-white cursor-pointer'
    }, [selected])

    const updateTopic = async () => {
        setLoading(true)

        try {
            await updateUserTopics(selected);
            navigate('/home')
        } catch (error) {
            console.error('Failed to update user topics!')
        } finally {
            setLoading(false)
        }
    }

    if(loading) return <Loading />

  return (
    <div className=' flex items-start flex-col w-full h-screen absolute top-0 bg-white p-5'>
        <div className='mx-auto flex items-center flex-col max-w-[50vw]'>
            <div className="flex gap-2 items-center">
                <img className='w-18 h-14' src={logo} alt='' />
                <h1 className='font-bold text-3xl'>Medium</h1>
            </div>

            <div className=' flex flex-col items-center my-16'>
                <h1 className=' font-semibold text-2xl'>What are you interested in?</h1>
                <p className='my-3'>Choose five or more.</p>
            </div>

            <div className=' flex flex-wrap items-center justify-center'>
                {state.map((item:{id:number, name: string, mainTopicId: number}, index:number) => {
                    return <Topic item={item} key={index} selected={selected} setSelected={setSelected} />
                })}
            </div>
        </div>
        <div className=' fixed bottom-0 z-1 bg-white p-5 w-full flex'>
            <button className={` mx-auto rounded-3xl px-20 py-2 ${buttonStyle}`} disabled={selected.length < 5 ? true : false} onClick={updateTopic}>Continue</button>
        </div>
    </div>
  )
}

export default SelectTopic