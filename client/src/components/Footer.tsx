
const items = ['Help', 'Status', 'About', 'Press', 'Blog', 'Privacy', 'Terms']

const Footer = () => {
  return (
    <div className='flex items-center gap-5 justify-center font-normal text-sm border-t-[2px] py-7 md:py-5 bg-white absolute z-10 w-full dark:bg-gray-800 dark:border-gray-900 text-center flex-wrap'>
        {items.map((item, index) => {
            return <span className=' whitespace-nowrap text-gray-500 hover:text-black cursor-pointer dark:text-gray-400' key={index}>{item}</span>
        })}
    </div>
  )
}

export default Footer