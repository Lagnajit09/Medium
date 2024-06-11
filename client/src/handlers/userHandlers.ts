import { SERVER } from "../config";


//method to fetch all topics
export const fetchAllTopics = async () => {
    const jwt = localStorage.getItem('medium-token');

    try {
        const response = await fetch(`${SERVER}/api/v1/blog/alltopics`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })

        const data = await response.json();

        if(response.status === 404) {
            console.error('No topics available!')
            return []
        }

        return data;
    } catch (error) {
        console.error('Failed to fetch topics!')
    }
}


//method to fetch all topics and their subtopics
export const fetchAllTopicsAndSubtopics = async () => {
    const jwt = localStorage.getItem('medium-token');

    try {
        const response = await fetch(`${SERVER}/api/v1/blog/topics`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })

        const data = await response.json();
        console.log(data)

        return data;
    } catch (error) {
        console.error('Failed to fetch topics!')
    }
}



//method to fetch user followed topics
export const fetchUserTopics = async () => {
    const jwt = localStorage.getItem('medium-token');
    const userId = localStorage.getItem('medium-userId');

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
    const jwt = localStorage.getItem('medium-token');
    const userId = localStorage.getItem('medium-userId');
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
    const jwt = localStorage.getItem('medium-token');
    const userId = localStorage.getItem('medium-userId');
    try {
        const response = await fetch(`${SERVER}/api/v1/blog/${userId}/recommended-topics`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })

        const data = await response.json();

        if(response.status === 405) {
            console.error('User not found!')
            return {}
        }
        console.log(data)
        return data;
    } catch (error) {
        console.error('Failed to fetch recommended topics!')
    }
}


//method to fetch blogs for home page
export const fetchHomeBlogs = async () => {
    const jwt = localStorage.getItem('medium-token');
    try {
        const response = await fetch(`${SERVER}/api/v1/blog/post/followed-posts`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })

        const data = await response.json();
        console.log(data)

        return data;
    } catch (error) {
        console.error('Failed to fetch blogs!')
    }
}


//method to save user blog
export const saveUserBlog = async (postData: any) => {
    const jwt = localStorage.getItem('medium-token');
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
export const publishUserBlog = async (title: string, content: any, topic: any) => {
    const jwt = localStorage.getItem('medium-token');
    try {
        const response = await fetch(`${SERVER}/api/v1/blog/post/publish`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`
            },
            body: JSON.stringify({title, content:JSON.stringify(content), topic}),
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
    const jwt = localStorage.getItem('medium-token');
    const userId = localStorage.getItem('medium-userId');
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
    const jwt = localStorage.getItem('medium-token');
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


//fetch posts of a topic
export const fetchTopicPosts = async (id:string) => {
    const jwt = localStorage.getItem('medium-token');
    try {
        const response = await fetch(`${SERVER}/api/v1/blog/topics/${id}`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })

        const data = await response.json();

        console.log(data)

        return data;
    } catch (error) {
        console.error('Failed to fetch blogs!')
    }
} 


//To update user's details
export const updateProfileDB = async (image: string, bio: string) => {
    try {
        const jwt = localStorage.getItem('medium-token');
        const userId = localStorage.getItem('medium-userId');
        try {
            const response = await fetch(`${SERVER}/api/v1/user/update`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${jwt}`
                },
                body: JSON.stringify({userId, image, bio})
            })


            if(response.status===401) throw new Error('Unauthorized access');
            if(response.status===404) throw new Error('User not found');
    
            const data = await response.json();

            console.log(data);
    
            return data;
        } catch (error) {
            console.error('Failed to fetch blogs!')
        }
    } catch (error) {
        console.log(error)
    }
}
