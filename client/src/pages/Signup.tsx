import  { useEffect, useRef, useState } from 'react';
import Input from '../components/Input.js';
import Button from '../components/Button.js';
import { storeUserData } from '../handlers/authHandlers.ts';
import { authUserAtom } from '../store/authAtom.ts';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { loadingAtom } from '../store/loader.ts';
import Loading from '../components/Loading.tsx';
import { useNavigate } from 'react-router-dom';


interface signupPropsTypes {
  setShowSignUp: Function;
  setShowSignIn: Function;
  setAuthenticated?: Function;
}

const Signup = ({setShowSignUp, setShowSignIn}: signupPropsTypes) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setAuthUser = useSetRecoilState(authUserAtom);
  const [loading, setLoading] = useRecoilState(loadingAtom);
  const navigate = useNavigate()

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
      const user = await storeUserData(email, password, username);
      if(!user) throw Error;
      setAuthUser(user);
      navigate('/get-started/topics')
    } catch (error) {
      console.error("Error while signing up.")
    } finally {
      setLoading(false)
    }

  };

  if(loading) return <Loading />

  return (
    <div className="flex flex-col items-center p-5 h-screen w-screen absolute z-20 backdrop-blur-sm">
      <form className="flex flex-col gap-5 items-center justify-center border-2 border-gray-900 p-5 pb-10 rounded-md w-[80vw] md:w-[50vw] lg:w-[25vw] bg-gray-800 shadow-md my-auto bg-opacity-95" ref={formRef}>
        <h1 className="font-bold text-3xl text-white">Welcome back.</h1>

        <Input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          inputStyles="mt-5 w-full text-white" 
        />

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
          title="Sign Up" 
          type="submit" 
          onClick={(e)=>signupHandler(e)} 
          buttonStyles="mt-3 w-[40%] border-2 bg-white border-white text-black rounded-md" 
        />

        
        <span className=' text-sm font-light text-gray-200'>Already have an account? <span className=' text-base font-bold text-white cursor-pointer' onClick={() => {setShowSignIn(true); setShowSignUp(false)}}>Log In.</span></span>

        {/* <span className="text-base font-thin text-gray-400">Or</span> */}
      </form>
    </div>
  );
};

export default Signup;
