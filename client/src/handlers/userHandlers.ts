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


//method to fetch blogs for home page
export const fetchHomeBlogs = async () => {

    try {
        const response = await fetch(`${SERVER}/api/v1/blog/post/followed-posts`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })

        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Failed to fetch blogs!')
    }
}


//method to save user blog
export const saveUserBlog = async (postData: any) => {
    try {
        const response = await fetch(`${SERVER}/api/v1/blog/post/save`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`
            },
            body: JSON.stringify({title:postData.title, content:JSON.stringify(postData)}),
        })

        if(response.status === 410) return Error;

        const data = await response.json();
        console.log(data)
        return data;
    } catch (error) {
        console.error('Failed to save data!')
    }
}


//method to save user blog
export const updateUserBlog = async (postData: any, id: number, topic: number) => {
    try {
        const response = await fetch(`${SERVER}/api/v1/blog/post`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`
            },
            body: JSON.stringify({
                title:postData.title, 
                content:JSON.stringify(postData), 
                userId, 
                id, 
                topic 
            }),
        })

        if(response.status === 410) return Error;

        const data = await response.json();
        console.log(data)
        return data;
    } catch (error) {
        console.error('Failed to save data!')
    }
}


//fetch a blog by id
export const fetchBlogByID = async (id:number) => {
    try {
        const response = await fetch(`${SERVER}/api/v1/blog/post/${id}`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })

        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Failed to fetch blogs!')
    }
} 