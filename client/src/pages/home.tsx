import { useEffect } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil';
import { authUserAtom } from '../store/authAtom';
import { fetchAllTopics, fetchHomeBlogs, fetchUserTopics } from '../handlers/userHandlers';
import { blogsAtom, userTopicsAtom } from '../store/userAtom';
import { useNavigate } from 'react-router-dom';
import Blogs from '../components/Blogs';
import HomeRight from '../components/HomeRight';

const home = () => {
    const [authUser, setAuthUser] = useRecoilState(authUserAtom);
    const setBlogs = useSetRecoilState(blogsAtom);
    const [userTopics, setUserTopics] = useRecoilState(userTopicsAtom)
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


    useEffect(() => {

      const fetchBlogs = async () => {
        const fetchedBlogs = await fetchHomeBlogs();
        console.log(fetchedBlogs)
        setBlogs(fetchedBlogs)
      }
      fetchBlogs()
      
    }, [authUser])

    if(!localStorage.getItem('medium-userId')) return;


  return (
    <div className='min-h-[80vh] flex w-[80%] mx-auto'>
      <Blogs/>
      <HomeRight/>
    </div>
  )
}

export default home