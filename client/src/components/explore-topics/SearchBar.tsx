import  { useMemo } from 'react'
import ReactSearchBox from "react-search-box";
import { IoSearchOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../ThemeContext';

interface SearchBarType {
    data: Array<{
        id: number,
        name: string
        mainTopicId?:number;
    }>;
}

const SearchBar = ({data}: SearchBarType) => {
    const {theme} = useTheme()
    const navigate = useNavigate()

    const topics = useMemo(() => {
        return data.map((item: any) => {return {key: item.id, value: item.name}})
    }, [data])

  return (
    <div className=' w-[80vw] md:w-[40vw] absolute z-10 top-56'>
        <ReactSearchBox
            placeholder="Search topics"
            leftIcon={<IoSearchOutline/>}
            data={topics}
            callback={(record: any) => console.log(record)}
            onSelect={(record: any) => navigate(`/topic/${record.item.key}`, {
                state: {
                    id: record.item.key,
                    name: record.item.value
                }
            })}
            inputBackgroundColor={`${theme==='dark' ? 'rgb(55 65 81 / 1)' : 'rgb(243 244 246 / 1)'}`}
            inputBorderColor={`${theme==='dark' ? 'rgb(17 24 39 / 1)' : 'rgb(243 244 246 / 1)'}`}
            dropDownHoverColor={'lightgray'}
        />
    </div>
  )
}

export default SearchBar