import { useEffect } from 'react'
import { fetchUserSession, getUserData, isNewUser } from '../appwrite'
import { useSetRecoilState } from 'recoil';
import { authUserAtom } from '../store/authAtom';
import { storeUserData } from '../authHandlers';

const home = () => {

    const setAuthUser = useSetRecoilState(authUserAtom);

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUserData();

            const isNew = await isNewUser(user);

            if(isNew) {
                await storeUserData(user, setAuthUser)
            }
        }
        fetchUser()
        fetchUserSession()
    }, []);


  return (
    <div className='min-h-[80vh]'>home</div>
  )
}

export default home