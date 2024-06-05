import { useState } from 'react';
import Logo from '../../assets/logo.svg'
import DarkLogo from "../../assets/logo-dark.svg"
import { HiMiniPencilSquare } from "react-icons/hi2";
import Button from '../../components/Button';
import { updateProfileDB } from '../../handlers/userHandlers';
import { useNavigate } from 'react-router-dom';
import { storage } from '../../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useSetRecoilState } from 'recoil';
import { authUserAtom } from '../../store/authAtom';
import { useTheme } from '../../ThemeContext';

const UpdateProfile = () => {
    const setAuthUser = useSetRecoilState(authUserAtom)
    const [bio, setBio] = useState('');
    const navigate = useNavigate()
    const [imageSrc, setImageSrc] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const {theme} = useTheme()

    const handleImageChange = (e: any) => {
        const file = e.target.files[0];
        setFile(file)
        const reader = new FileReader();

        reader.onload = (event:any) => {
            setImageSrc(event.target.result);
        };

        reader.readAsDataURL(file);
    };

    const updateProfile = async () => {
        if (!file) return;

        const storageRef = ref(storage, `images/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                // Progress handler (optional)
                console.log(snapshot)
            },
            (error) => {
                console.error('Upload failed', error);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                const updatedUser = await updateProfileDB(downloadURL, bio)
                console.log(updatedUser);
                if(!updatedUser) throw new Error;
                setAuthUser({user: updatedUser})
                navigate('/get-started/topics');
            }
        );
    };

  return (
    <div className="w-full h-screen overflow-hidden dark:bg-gray-800">
    <div className='flex-col w-[30%] mx-auto justify-center items-center'>
        <div className=" flex gap-2 w-fit mx-auto items-center mt-14">
            <img src={theme==='dark'?DarkLogo:Logo} alt="" width={35} height={35} />
            <h2 className=' dark:text-gray-200'>Medium</h2>
        </div>
        <div className="w-full h-[30vh] flex justify-center mt-20 relative">
            {imageSrc ? (
            <div className='flex flex-col justify-between items-end'>
                <img src={imageSrc} alt="Selected Image" className="w-52 h-52 rounded-full" />
                <HiMiniPencilSquare style={{cursor: 'pointer', color:theme==='dark'?'white':'black'}} onClick={() => setImageSrc('')} />
            </div>
                
            ) : (
                <label htmlFor="profile-img" className="w-52 h-52 p-20 absolute top-0 bg-gray-200 rounded-full text-xs whitespace-nowrap flex justify-center items-center cursor-pointer text-gray-700 dark:bg-gray-600 dark:text-gray-300">
                    Upload an image
                    <input id="profile-img" type="file" placeholder="Upload an image" className="hidden" onChange={handleImageChange} />
                </label>
            )}
        </div>
        
        <div className=" mt-5">
            <textarea 
                placeholder='Bio' 
                className=' border border-gray-500 rounded-md resize-none w-full h-24 p-3 scrollbar-hide dark:bg-gray-700 dark:text-gray-300'
                onChange={(e) => setBio(e.target.value)}
            >
                {bio}
            </textarea>
        </div>
        <div className=" flex justify-evenly mt-10">
            <Button 
                title='Start'
                buttonStyles=' w-[25%] py-2 text-white border-2 border-black rounded-full font-semibold text-sm dark:bg-gray-900 dark:text-gray-100' 
                onClick={
                    () => {
                        updateProfile(); 
                    }} 
            />
            <Button 
                title='Skip' 
                buttonStyles=' w-[25%] py-2 text-black bg-white border-2 border-black rounded-full font-semibold text-sm dark:bg-gray-300 dark:text-gray-800' 
                onClick={() => navigate('/get-started/topics')} />
        </div>
    </div>
    </div>
  )
}

export default UpdateProfile