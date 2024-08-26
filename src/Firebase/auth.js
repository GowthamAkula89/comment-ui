import { auth } from "./firebase";  
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup} from "firebase/auth";  

export const doCreateUserWithEmailAndPassword = async (email, password) => {  
  return createUserWithEmailAndPassword(auth, email, password);  
};  

export const doSignInWithEmailAndPassword = (email, password) => {  
  return signInWithEmailAndPassword(auth, email, password);  
};  

export const doSignInWithGoogle = async () => {  
  const provider = new GoogleAuthProvider();  
  try {
    const result = await signInWithPopup(auth, provider);  
    return result;
  } catch (error) {
    console.error("Error during Google sign-in", error);
    throw error; 
  }
};

export const doSignOut = () => {  
    return auth.signOut();  
};