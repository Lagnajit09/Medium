import { useState } from 'react';
import logo from '../../assets/logo.svg'
import { HiMiniPencilSquare } from "react-icons/hi2";
import Button from '../../components/Button';
import { updateProfile } from '../../handlers/userHandlers';
import { useNavigate } from 'react-router-dom';

const UpdateProfile = () => {
    const [bio, setBio] = useState('');
    const navigate = useNavigate()

    const [imageSrc, setImageSrc] = useState('');

    const handleImageChange = (e: any) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event:any) => {
            setImageSrc(event.target.result);
        };

        reader.readAsDataURL(file);
    };

  return (
    <div className='flex-col w-[30%] mx-auto justify-center items-center'>
        <div className=" flex gap-2 w-fit mx-auto items-center mt-14">
            <img src={logo} alt="" width={35} height={35} />
            <h2>Prism</h2>
        </div>
        <div className="w-full h-[30vh] flex justify-center mt-20 relative">
            {imageSrc ? (
            <div className='flex flex-col justify-between items-end'>
                <img src={imageSrc} alt="Selected Image" className="w-52 h-52 rounded-full" />
                <HiMiniPencilSquare style={{cursor: 'pointer'}} onClick={() => setImageSrc('')} />
            </div>
                
            ) : (
                <label htmlFor="profile-img" className="w-52 h-52 p-20 absolute top-0 bg-gray-200 rounded-full text-xs whitespace-nowrap flex justify-center items-center cursor-pointer text-gray-700">
                    Upload an image
                    <input id="profile-img" type="file" placeholder="Upload an image" className="hidden" onChange={handleImageChange} />
                </label>
            )}
        </div>
        
        <div className=" mt-5">
            <textarea 
                placeholder='Bio' 
                className=' border border-gray-500 rounded-md resize-none w-full h-24 p-3 scrollbar-hide'
                onChange={(e) => setBio(e.target.value)}
            >
                {bio}
            </textarea>
        </div>
        <div className=" flex justify-evenly mt-10">
            <Button 
                title='Start'
                buttonStyles=' w-[25%] py-2 text-white border-2 border-black rounded-full font-semibold text-sm' 
                onClick={
                    () => {
                        updateProfile(); 
                        navigate('/get-started/topics')
                    }} 
            />
            <Button 
                title='Skip' 
                buttonStyles=' w-[25%] py-2 text-black bg-white border-2 border-black rounded-full font-semibold text-sm' 
                onClick={() => navigate('/get-started/topics')} />
        </div>
    </div>
  )
}

export default UpdateProfile