import { Skeleton } from "@mui/material"

export const BlogSkeleton = () => {
    return (
      <div className='flex w-[100%] mt-10 gap-5 justify-between border-b-2 border-gray-100 pb-8'>
        <div className=' flex flex-col w-[80%] gap-5'>
            <div className='flex items-baseline gap-3 w-full'>
              <Skeleton variant='circular' width={30} height={30} />
              <Skeleton variant='rectangular' className='rounded-lg w-[30%]' height={2} />
            </div>
            <div className=' flex flex-col gap-3 w-full items-start'>
              <Skeleton variant='rectangular' className='rounded-md w-full' height={15} />
              <Skeleton variant='rectangular' className='rounded-md w-full' height={70} />
            </div>
            <div className=' flex items-center justify-between w-full'>
              <Skeleton variant='rectangular' className='rounded-3xl w-[12%]' height={20} />
              <div className='flex gap-3'>
                <Skeleton variant='circular' className=' w-5 h-5 ' />
                <Skeleton variant='circular' className=' w-5 h-5 ' />
                <Skeleton variant='circular' className=' w-5 h-5 ' />
              </div>
            </div>
        </div>
        <Skeleton variant='rectangular' className=' rounded-md mt-7' width={120} height={120} />
      </div>
    )
  }