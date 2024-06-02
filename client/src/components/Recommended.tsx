import { Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface recommendedType {
    topic: any;
    key: number;
    loading: boolean;
}

export const Recommended = ({topic, loading}: recommendedType) => {
    const navigate = useNavigate()
    return (
        <>
            {loading ? 
                <div className=' mx-2 my-1'>
                    <Skeleton variant="rectangular" width={80} height={30} className=' rounded-3xl' />
                </div> 
                : 
                <div className=' mx-2 my-1 rounded-full px-4 py-2 flex items-center bg-gray-100 text-black cursor-pointer'
                    onClick={() => navigate(`/topic/${topic.id}`)}
                >
                    {topic.name}
                </div>
            }
        </>
        
    )
}