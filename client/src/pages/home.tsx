import { useEffect } from 'react'
import { fetchUserSession, getUserData, handleLogin, isNewUser } from '../appwrite'
import { useRecoilState, useSetRecoilState } from 'recoil';
import { authUserAtom } from '../store/authAtom';
import { logInUser, storeUserData } from '../handlers/authHandlers';
import { fetchAllTopics, fetchUserTopics } from '../handlers/userHandlers';
import { userTopicsAtom } from '../store/userAtom';
import { useNavigate } from 'react-router-dom';

const home = () => {
    const [authUser, setAuthUser] = useRecoilState(authUserAtom);
    const [userTopics, setUserTopics] = useRecoilState(userTopicsAtom)
    const navigate = useNavigate()

    console.log(authUser)

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUserData();
            const isNew = isNewUser(user);

            if(isNew) {
                await storeUserData(user, setAuthUser)
            }
        }
        fetchUser()
        fetchUserSession()
        if(authUser) logInUser(authUser, setAuthUser)
    }, []);

    //useEffect to fetch user's topics
    useEffect(() => {

      const checkUserTopics = async () => {
        const userFetchedTopics = await fetchUserTopics();

        if(userFetchedTopics.length < 5) {
          const allTopics = await fetchAllTopics();
          return navigate('/topics', {
            state: allTopics
          })
        }

        setUserTopics(userFetchedTopics)
      }
      checkUserTopics()
      
    }, [])


  return (
    <div className='min-h-[80vh]'>home</div>
  )
}

export default home