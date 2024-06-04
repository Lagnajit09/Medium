import  { useEffect, useRef, useState } from 'react';
import Input from '../components/Input.js';
import Button from '../components/Button.js';
import { FaGoogle } from 'react-icons/fa';
import { googleAuth, handleLogin } from '../appwrite.js';
import { logInUser } from '../handlers/authHandlers.js';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { authUserAtom } from '../store/authAtom.js';
import Loading from '../components/Loading.js';
import { loadingAtom } from '../store/loader.js';
import { useNavigate } from 'react-router-dom';

interface signinPropsTypes {
  setShowSignIn: Function;
  setShowSignUp: Function;
  setAuthenticated?: Function;
}

const Signin = ({setShowSignIn, setShowSignUp}: signinPropsTypes) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setAuthUser = useSetRecoilState(authUserAtom)
  const [loading, setLoading] = useRecoilState(loadingAtom);
  const navigate = useNavigate()

  const formRef = useRef<HTMLFormElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (formRef.current && !formRef.current.contains(event.target as Node)) {
      setShowSignIn(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const signinHandler = async (event: any) => {
    setLoading(true)
    // Handle sign in
    try {
      event.preventDefault()
      // const user = await handleLogin(email, password);
      const user = await logInUser(email, password);
      setAuthUser(user);
      navigate('/home')
    } catch (error) {
      console.error("Error while signing in.")
    } finally {
      setLoading(false)
    }
  };

  if(loading) return <Loading />

  return (
    <div className="flex flex-col items-center p-5 h-screen w-screen absolute z-20 backdrop-blur-sm">
      <form className="flex flex-col gap-5 items-center justify-center border-2 border-gray-900 p-5 pb-10 rounded-md w-[25vw] bg-gray-800 shadow-md my-auto bg-opacity-95" ref={formRef}>
        <h1 className="font-bold text-3xl text-white">Welcome back.</h1>

        <Input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          inputStyles="w-full text-white" 
        />

        <Input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          inputStyles="w-full text-white" 
        />

        <Button 
          title="Sign In" 
          type="submit" 
          onClick={signinHandler} 
          buttonStyles="mt-3 w-[40%] border-2 bg-white border-white text-black rounded-md" 
        />

        <span className=' text-sm font-light text-gray-200'>Don't have an account? <span className=' text-base font-bold  text-white cursor-pointer' onClick={() => {setShowSignIn(false); setShowSignUp(true)}}>Create One.</span></span>

        {/* <span className="text-base font-thin text-gray-400">Or</span> */}

        {/* <Button 
          title="Continue with Google" 
          type="button" 
          onClick={googleAuth} 
          buttonStyles="bg-white text-black border-2 border-black rounded-md" 
          icon={<FaGoogle />} 
        /> */}
      </form>
    </div>
  );
};

export default Signin;
