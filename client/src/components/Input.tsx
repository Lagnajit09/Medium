import React, { ChangeEventHandler, HTMLInputTypeAttribute } from 'react'

interface inputType  {
    type: HTMLInputTypeAttribute;
    placeholder: string;
    value: string | number;
    onChange: ChangeEventHandler<HTMLInputElement>;
    inputStyles?: string | '';
    errorMsg?: string;
}

const Input = ({type, placeholder, value, onChange, inputStyles, errorMsg}: inputType) => {
  return (
    <div className='flex flex-col items-start w-full px-5'>
    <input type={type} placeholder={placeholder} value={value} onChange={onChange} className={` border-2 px-3 py-2 rounded-md outline-none bg-inherit font-normal text-base ${inputStyles}`} />
    <span className=' font-light text-sm text-red-500'>{errorMsg}</span>
    </div>
    
  )
}

export default Input