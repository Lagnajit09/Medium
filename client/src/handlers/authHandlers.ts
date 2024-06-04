import { handleSignup } from "../appwrite";
import { SERVER } from "../config";

export const storeUserData = async (email: string, password: string, name: string) => {
    try {
        const response = await fetch(`${SERVER}/api/v1/user/signup`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({email: email, password: password, name: name}),
        });
        
        if(response.status === 405) {
            console.log("Email already exists!");
            return;
        }

        const data = await response.json();
        await handleSignup(data.user.id, email, password, name)

        localStorage.setItem('medium-token', data.jwt);
        localStorage.setItem('medium-userId', data.user.id);
        localStorage.setItem('theme', 'dark')

        return data;

    } catch (error) {
        console.error('Error while signing up!')
    }
}

export const logInUser = async (email:string, password:string) => {
    try {
        const response = await fetch(`${SERVER}/api/v1/user/signin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email: email, password: password}),
        })
        if(response.status === 405) {
            console.log("User not found!");
            return;
        }

        const data = await response.json();

        console.log(data)
        localStorage.setItem('medium-userId', data.user.id)
        localStorage.setItem('medium-token', data.jwt)
        localStorage.setItem('theme', 'dark')
        return data;

    } catch (error) {
        console.error('Error while signing in!')
    }
  }

export const logOutHandler = (setAuthUser:Function) => {
    localStorage.removeItem('medium-token');
    localStorage.removeItem('medium-userId');
    setAuthUser({});
} 


export const getUserById = async (userId: string) => {
    try {
        const response = await fetch(`${SERVER}/api/v1/user/${userId}`);

        if(response.status === 404) throw Error;

        const data = await response.json();
        console.log(data)
        return data;

    } catch (error) {
        console.error("User doesn't exist!")
        return {}
    }
}