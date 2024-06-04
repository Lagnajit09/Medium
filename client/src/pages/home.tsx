import { useEffect } from 'react'
import { useRecoilValue, useSetRecoilState, } from 'recoil';
import { authUserAtom } from '../store/authAtom';
import { fetchAllTopics, fetchUserTopics } from '../handlers/userHandlers';
import { userTopicsAtom } from '../store/userAtom';
import { useNavigate } from 'react-router-dom';
import Blogs from '../components/Blogs';
import HomeRight from '../components/HomeRight';

const home = () => {
    const authUser = useRecoilValue(authUserAtom);
    const setUserTopics = useSetRecoilState(userTopicsAtom)
    const navigate = useNavigate()

    // useEffect(() => {
    //     const fetchUser = async () => {
    //         const user = await getUserData();

    //         if(!user) return;
    //         const isNew = isNewUser(user);

    //         if(isNew) {
    //             await storeUserData(user.email, '', user.name, setAuthUser)
    //         }
    //     }
    //     fetchUser()
    // }, [authUser]);

    //useEffect to fetch user's topics
    useEffect(() => {

      const checkUserTopics = async () => {
        const userFetchedTopics = await fetchUserTopics();

        if(userFetchedTopics.length < 5) {
          const allTopics = await fetchAllTopics();
          return navigate('/get-started/topics', {
            state: allTopics
          })
        }

        setUserTopics(userFetchedTopics)
      }
      checkUserTopics()
      
    }, [authUser])

    if(!localStorage.getItem('medium-userId')) return;


  return (
    <div className="w-full bg-white dark:bg-gray-800">

      <div className='min-h-[82.5vh] flex w-[80%] mx-auto'>
      <Blogs/>
      <HomeRight/>
      </div>
    </div>

  )
}

export default home