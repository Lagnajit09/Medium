import { SERVER } from "../config";
const jwt = localStorage.getItem('medium-token');
const userId = localStorage.getItem('medium-userId');

//method to fetch all topics
export const fetchAllTopics = async () => {
    try {
        const response = await fetch(`${SERVER}/api/v1/blog/alltopics`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })

        const data = await response.json();

        if(response.status === 404) {
            console.error('No topics available!')
            return {}
        }

        return data;
    } catch (error) {
        console.error('Failed to fetch topics!')
    }
}


//method to fetch user followed topics
export const fetchUserTopics = async () => {

    try {
        const response = await fetch(`${SERVER}/api/v1/user/${userId}/topics`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })

        const data = await response.json();

        if(response.status === 404) {
            console.error('User not found!')
            return {}
        }

        return data;
    } catch (error) {
        console.error('Failed to fetch user topics topics!')
    }
}


//method to update user followed topics
export const updateUserTopics = async (userTopics:any) => {
    try {
        const response = await fetch(`${SERVER}/api/v1/user/user-topics/${userId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`
            },
            body: JSON.stringify({userTopics}),
        })

        const data = await response.json();
        console.log(data)
        return data;
    } catch (error) {
        console.error('Failed to fetch user topics topics!')
    }
}


//method to fetch recommended topics
export const fetchRecommendedTopics = async () => {

    try {
        const response = await fetch(`${SERVER}/api/v1/blog/${userId}/recommended-topics`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })

        const data = await response.json();

        if(response.status === 404) {
            console.error('User not found!')
            return {}
        }

        return data;
    } catch (error) {
        console.error('Failed to fetch recommended topics!')
    }
}