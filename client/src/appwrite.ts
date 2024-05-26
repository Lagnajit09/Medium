import { Client, Account, OAuthProvider } from "appwrite";
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
  const isNew = registrationDate.getTime() > (Date.now() - 12 * 60 * 60 * 1000); // Consider new if registered within the last 12 hours
  const isEmailVerified = user.emailVerification;
  return isNew && isEmailVerified;
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
    try {
        // Fetch all sessions
        const allSessions = await account.listSessions();

        console.log(allSessions)

        // Get current user's ID
        const user = await account.get();
        const userId = user.$id;

        console.log(user)

        // Filter sessions to get only the session associated with the current user
        const userSession = allSessions.sessions.find(session => session.userId === userId);

        console.log('User Session:', userSession);
        return {userSession, user}; // Return user session data if found
    } catch (error) {
        console.error('Error fetching user session:', error);
        throw error; // Rethrow error for handling at higher levels
    }
};

//function to delete session after log out
export const deleteSessionById = async (sessionId: string) => {
  try {
      // Delete session by session ID
      await account.deleteSession(sessionId);
      console.log('Session deleted successfully');
  } catch (error) {
      console.error('Error deleting session:', error);
      throw error; // Rethrow error for handling at higher levels
  }
};