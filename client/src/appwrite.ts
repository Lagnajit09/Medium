import { Client, Account, OAuthProvider, Models } from "appwrite";
import {CLIENT} from './config'

export const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("66519f08000b888ab363");

export const account = new Account(client);

export const googleAuth = async () => {
  try {
    account.createOAuth2Session(
      'google' as OAuthProvider,
      `${CLIENT}/home`,
      `${CLIENT}/fail`,
    );
  } catch (error) {
    console.error('Error during Google sign-in:', error);
  }
}

export const getUserData = async () => {
  try {
    const user = await account.get()
    return user;
  } catch (error) {
    console.error('Error while fetching user details:', error)
  }
}

export const isNewUser = (user: any) => {
  // Assuming a user is new if their registration date is recent and their email is verified
  const registrationDate = new Date(user.registration);
  const isNew = registrationDate.getTime() > (Date.now() - 1 * 60 * 60 * 1000); // Consider new if registered within the last 1 hour
  // const isEmailVerified = user.emailVerification;
  return isNew;
}

// Function to create session using email
export const createSessionWithEmail = async (email: string, password: string) => {
  try {
      // Create session using email and password
      const session = await account.createEmailPasswordSession(email, password);
      console.log('Session created successfully:', session);
      return session; // Return session data if needed
  } catch (error) {
      console.error('Error creating session:', error);
      throw error; // Rethrow error for handling at higher levels
  }
};

// Function to fetch session data for the current user
export const fetchUserSession = async () => {
  const sessionId = localStorage.getItem('sessionId')
  if(!sessionId) return { userSession: null, user: null };

  try {
    // Fetch all sessions
    const userSession = await account.getSession(sessionId);

    console.log(userSession);

    if(!userSession) return { userSession: null, user: null };

    // Get current user's ID
    const user = await account.get();

    if (user) {
      return { userSession, user }; // Return user session data if found
    } else {
      return { userSession: null, user: null };
    }
  } catch (error) {
    console.error('Error fetching user session:', error);
    throw error; // Rethrow error for handling at higher levels
  }
};

//function to delete session after log out
export const deleteSessionById = async () => {
  const sessionId = localStorage.getItem('sessionId')
  if(!sessionId) return;
  try {
      // Delete session by session ID
      await account.deleteSession(sessionId);
      console.log('Session deleted successfully');
      localStorage.removeItem('sessionId')
  } catch (error) {
      console.error('Error deleting session:', error);
      throw error; // Rethrow error for handling at higher levels
  }
};


// Signup handler
export const handleSignup = async (
  email: string,
  password: string,
  name: string
): Promise<Models.User<Models.Preferences> | undefined> => {
  try {
    await account.create('unique()', email, password, name);
    const user = await handleLogin(email, password);
    return user;
  } catch (error) {
    console.error(error);
    console.error('Failed to create user');
  }
};


// Login handler
export const handleLogin = async (
  email: string,
  password: string
): Promise<Models.User<Models.Preferences> | undefined> => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    localStorage.setItem('sessionId', session.$id);
    const user = await account.get();
    return user;
  } catch (error) {
    console.error(error);
    console.error('Failed to log in');
  }
};