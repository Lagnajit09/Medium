import  { useEffect, useRef, useState } from 'react';
import {  googleAuth, handleSignup } from "../appwrite.ts"
import Input from '../components/Input.js';
import Button from '../components/Button.js';
import { FaGoogle } from 'react-icons/fa';
import { storeUserData } from '../handlers/authHandlers.ts';
import { authUserAtom } from '../store/authAtom.ts';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { loadingAtom } from '../store/loader.ts';
import Loading from '../components/Loading.tsx';

interface signupPropsTypes {
  setShowSignUp: Function;
  setShowSignIn: Function;
  setAuthenticated: Function;
}

const Signup = ({setShowSignUp, setShowSignIn, setAuthenticated}: signupPropsTypes) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setAuthUser = useSetRecoilState(authUserAtom);
  const [loading, setLoading] = useRecoilState(loadingAtom)

  const formRef = useRef<HTMLFormElement | null>(null);


  const handleClickOutside = (event: MouseEvent) => {
    if (formRef.current && !formRef.current.contains(event.target as Node)) {
      setShowSignUp(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const signupHandler = async (event:any) => {
    setLoading(true);
    try {
      event.preventDefault();
      const user = await handleSignup(email, password, username);
      await storeUserData(user, setAuthUser);
      setAuthenticated(true);
    } catch (error) {
      console.error("Error while signing up.")
    } finally {
      setLoading(false)
    }

  };

  if(loading) return <Loading />

  return (
    <div className="flex flex-col items-center p-5 h-[80vh] w-screen bg-white bg-opacity-95 absolute z-10">
      <form className="flex flex-col gap-5 items-center border-2 p-5 pb-10 rounded-md w-[25vw] bg-white shadow-md" ref={formRef}>
        <h1 className="font-bold text-3xl">Join Medium.</h1>

        <Input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          inputStyles="mt-5 w-full" 
        />

        <Input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          inputStyles="w-full" 
        />

        <Input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          inputStyles="w-full" 
        />

        <Button 
          title="Sign Up" 
          type="submit" 
          onClick={(e)=>signupHandler(e)} 
          buttonStyles="mt-3 w-[40%] border-2 border-black text-white" 
        />

        
        <span className=' text-sm font-light text-gray-500'>Already have an account? <span className=' text-base font-bold text-black cursor-pointer' onClick={() => {setShowSignIn(true); setShowSignUp(false)}}>Log In.</span></span>

        <span className="text-base font-thin text-gray-400">Or</span>

        <Button 
          title="Continue with Google" 
          type="button" 
          onClick={googleAuth} 
          buttonStyles="bg-white text-black border-2 border-black" 
          icon={<FaGoogle />} 
        />
      </form>
    </div>
  );
};

export default Signup;
