import { createSessionWithEmail, deleteSessionById } from "./appwrite";
import { SERVER } from "./config";

export const storeUserData = async (user: any, setAuthUser: Function) => {
    try {
        const response = await fetch(`${SERVER}/api/v1/user/signup`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({email: user.email, password: user.password || '', name: user.name}),
        });
        
        if(response.status === 405) {
            console.log("Email already exists!");
            return;
        }

        const data = await response.json();

        console.log(data)

        setAuthUser(data.user);
        localStorage.setItem('medium-token', data.jwt);
        localStorage.setItem('medium-userId', data.user.id);

    } catch (error) {
        console.error('Error while signing up!')
    }
}

export const logInUser = async (user: any, setAuthUser: Function) => {
    try {
        const response = await fetch(`${SERVER}/api/v1/user/signin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email: user.email, password: user.password || ''}),
        })
        if(response.status === 405) {
            console.log("User not found!");
            return;
        }

        const data = await response.json();

        console.log(data)

        setAuthUser(data.user);
        localStorage.setItem('medium-token', data.jwt);
        localStorage.setItem('medium-userId', data.user.id);

    } catch (error) {
        console.error('Error while signing in!')
    }
  }

export const logOutHandler = (setAuthUser:Function, setAuthenticated: Function) => {
    localStorage.removeItem('medium-token');
    localStorage.removeItem('medium-userId');
    setAuthUser({});
    setAuthenticated(false)
    deleteSessionById();
} 