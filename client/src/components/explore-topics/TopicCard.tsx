import React, { useState } from 'react';
import { topicType } from '../../pages/get-started/allTopics';
import { useNavigate } from 'react-router-dom';

interface CardType {
    main: topicType;
    sub: topicType[];
}

const TopicCard: React.FC<CardType> = ({ main, sub }) => {
    const [showAllSubtopics, setShowAllSubtopics] = useState(false);
    const navigate = useNavigate()

    const toggleShowAllSubtopics = () => {
        setShowAllSubtopics(!showAllSubtopics);
    };

    return (
        <div className='flex flex-col gap-3 w-[30%]'>
            <div className="text-lg font-semibold cursor-pointer border-b border-white text-gray-800 hover:border-gray-800 w-fit" onClick={() => navigate(`/topic/${main.id}`)}>
                {main.name}
            </div>
            <div className="flex flex-col gap-2 pl-6 w-full">
                {showAllSubtopics
                    ? sub.map((item: topicType, index: number) => (
                          <span className="w-fit text-sm text-gray-600 border-b border-white hover:border-gray-800 hover:text-black cursor-pointer" key={index}
                            onClick={() => navigate(`/topic/${item.id}`)}
                          >
                              {item.name}
                          </span>
                      ))
                    : sub.slice(0, 7).map((item: topicType, index: number) => (
                          <span className="w-fit text-sm text-gray-600 border-b border-white hover:border-gray-800 hover:text-black cursor-pointer" key={index}
                            onClick={() => navigate(`/topic/${item.id}`)}
                          >
                              {item.name}
                          </span>
                      ))}
                {sub.length > 7 && !showAllSubtopics && (
                    <button className=" w-fit text-sm text-gray-600 border-b-2 mt-2 border-gray-400 hover:text-black cursor-pointer" onClick={toggleShowAllSubtopics}>
                        More
                    </button>
                )}
                {sub.length > 7 && showAllSubtopics && (
                    <button className=" w-fit text-sm text-gray-600 border-b-2 mt-2 border-gray-400 hover:text-black cursor-pointer" onClick={toggleShowAllSubtopics}>
                        Less
                    </button>
                )}
            </div>
        </div>
    );
};

export default TopicCard;
