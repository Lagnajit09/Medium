import React, { useEffect, useMemo, useState } from 'react'
import Logo from '../../assets/logo.svg'
import DarkLogo from "../../assets/logo-dark.svg"
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { PiPlus } from "react-icons/pi";
import { PiCheck } from "react-icons/pi";
import { fetchAllTopics, updateUserTopics } from '../../handlers/userHandlers';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { loadingAtom } from '../../store/loader';
import Loading from '../../components/Loading';
import { userTopicsAtom } from '../../store/userAtom'
import { authUserAtom } from '../../store/authAtom';
import { createSessiomWithSecretandID } from '../../appwrite';
import { useTheme } from '../../ThemeContext';

const Topic = (props: {item:{id:number, name: string, mainTopicId: number}, key:number, selected: any, setSelected: Function}) => {

    const [clicked, setClicked] = useState(false);

    if(props.item.id===70000) return

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
        return clicked ? 'border-green-600 text-green-700 dark:border-white dark:text-white dark:bg-gray-600' : 'border-grey-100 text-black dark:bg-gray-800';
    }, [clicked])

    return (
        <div className={`flex gap-2 items-center border-2 rounded-full px-4 py-2 mx-2 my-1 bg-gray-100 cursor-pointer ${styles}  dark:text-gray-100 dark:border-gray-600`} onClick={() => {setClicked(!clicked)} }  >
            <p>{props.item.name}</p> 
            {clicked? <PiCheck /> : <PiPlus />}
        </div>
    )
}

const SelectTopic = () => {
    const authUser = useRecoilValue(authUserAtom)
    const [allTopics, setAllTopics] = useState([]);
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useRecoilState(loadingAtom)
    const navigate = useNavigate();
    const setUserTopics = useSetRecoilState(userTopicsAtom)
    const {theme} = useTheme()

    const buttonStyle = useMemo(() => {
        return selected.length < 5 ? 'bg-gray-100 text-gray-400' : 'bg-black text-white cursor-pointer dark:bg-gray-200 dark:text-black'
    }, [selected])

    const updateTopic = async () => {
        setLoading(true)

        try {
            await updateUserTopics(selected);
            setUserTopics((prev) => [...prev, ...selected]);
            setAllTopics([])
            navigate('/home')
        } catch (error) {
            console.error('Failed to update user topics!')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const getAllTopics = async () => {

            try {
                const fetchedAllTopics = await fetchAllTopics();
                if(!fetchedAllTopics) throw Error;

                setAllTopics(fetchedAllTopics)

            } catch (error) {
                console.log(error)
                console.log("Error while fetching topics!")
            }

        }
        getAllTopics()
    }, [authUser,localStorage])

    if(!allTopics) return;

    if(loading) return <Loading />

  return (
    <div className=' flex items-start flex-col w-full min-h-full absolute top-0 bg-white p-5 z-50 dark:bg-gray-800'>
        <div className='mx-auto flex items-center flex-col max-w-[50vw]'>
            <div className="flex gap-2 items-center">
                <img className='w-18 h-14' src={theme==='dark'?DarkLogo:Logo} alt='' />
                <h1 className='font-bold text-3xl dark:text-gray-200'>Medium</h1>
            </div>

            <div className=' flex flex-col items-center my-16'>
                <h1 className=' font-semibold text-2xl dark:text-gray-300'>What are you interested in?</h1>
                <p className='my-3 dark:text-gray-300'>Choose five or more.</p>
            </div>

            <div className=' flex flex-wrap items-center justify-center mb-32'>
                {allTopics.map((item:{id:number, name: string, mainTopicId: number}, index:number) => {
                    return <Topic item={item} key={index} selected={selected} setSelected={setSelected} />
                })}
            </div>
        </div>
        <div className=' fixed bottom-0 left-0 z-1 bg-white p-5 w-full flex dark:bg-gray-900'>
            <button className={` mx-auto rounded-3xl px-20 py-2 ${buttonStyle} dark:bg-gray-700 dark:text-gray-200`} disabled={selected.length < 5 ? true : false} onClick={updateTopic}>Continue</button>
        </div>
    </div>
  )
}

export default SelectTopic