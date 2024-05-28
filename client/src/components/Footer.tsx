import React from 'react'

const items = ['Help', 'Status', 'About', 'Careers', 'Press', 'Blog', 'Privacy', 'Terms', 'Text to Speech', 'Teams']

const Footer = () => {
  return (
    <div className='flex items-center gap-5 justify-center font-normal text-sm border-t-[2px] py-5 bg-white absolute z-10 w-full'>
        {items.map((item, index) => {
            return <span className=' text-gray-500 hover:text-black cursor-pointer' key={index}>{item}</span>
        })}
    </div>
  )
}

export default Footer