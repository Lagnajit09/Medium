import loading from '../assets/loading.svg'

const Loading = () => {
  return (
    <div className='flex h-screen w-screen items-start justify-center overflow-hidden absolute top-0 left-0 z-50 bg-white dark:bg-gray-700'>
        <iframe src={loading} frameBorder="0" className=" pl-[13%] m-auto object-contain" allowFullScreen></iframe>
    </div>
  )
}

export default Loading