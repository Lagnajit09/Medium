import React, { useMemo, useState } from 'react'
import ReactSearchBox from "react-search-box";
import { IoSearchOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const SearchBar = ({data}: any) => {

    const navigate = useNavigate()

    console.log(data)

    const topics = useMemo(() => {
        return data.map((item: any) => {return {key: item.id, value: item.name}})
    }, [data])

  return (
    <div className=' w-[40vw] absolute z-10 top-56'>
        <ReactSearchBox
            placeholder="Search topics"
            leftIcon={<IoSearchOutline/>}
            data={topics}
            callback={(record: any) => console.log(record)}
            onSelect={(record: any) => navigate(`/topic/${record.item.key}`)}
            inputBackgroundColor={'#f9f9f9'}
            inputBorderColor={'#f9f9f9'}
            dropDownHoverColor={'lightgray'}
        />
    </div>
  )
}

export default SearchBar