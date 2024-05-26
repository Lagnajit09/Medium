import  { useEffect, useRef, useState } from 'react';
import Input from '../components/Input.js';
import Button from '../components/Button.js';
import { FaGoogle } from 'react-icons/fa';
import { googleAuth } from '../appwrite.js';
import { logInUser } from '../authHandlers.js';
import { useSetRecoilState } from 'recoil';
import { authUserAtom } from '../store/authAtom.js';

interface signinPropsTypes {
  setShowSignIn: Function;
  setShowSignUp: Function;
}

const Signin = ({setShowSignIn, setShowSignUp}: signinPropsTypes) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setAuthUser = useSetRecoilState(authUserAtom)

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

  const signinHandler = () => {
    // Handle sign in
    logInUser({email, password}, setAuthUser)
  };

  return (
    <div className="flex flex-col items-center p-5 h-[80vh] w-screen bg-white bg-opacity-95 absolute z-10 ">
      <form className="flex flex-col gap-5 items-center border-2 p-5 pb-10 rounded-md w-[25vw] bg-white shadow-md" ref={formRef}>
        <h1 className="font-bold text-3xl">Welcome back.</h1>

        <Input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          inputStyles="w-full " 
        />

        <Input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          inputStyles="w-full" 
        />

        <Button 
          title="Sign In" 
          type="submit" 
          onClick={signinHandler} 
          buttonStyles="mt-3 w-[40%] border-2 border-black text-white" 
        />

        <span className=' text-sm font-light text-gray-500'>Don't have an account? <span className=' text-base font-bold  text-black cursor-pointer' onClick={() => {setShowSignIn(false); setShowSignUp(true)}}>Create One.</span></span>

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

export default Signin;
