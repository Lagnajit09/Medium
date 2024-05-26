import loading from '../assets/loading.svg'

const Loading = () => {
  return (
    <div className='flex h-screen w-screen items-start justify-center'>
        <iframe src={loading} frameBorder="0" className=" pl-[13%] m-auto object-contain" allowFullScreen></iframe>
    </div>
  )
}

export default Loading