import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth"; // Importing Firebase authentication functions
import { auth, db } from "./firebaseConfig"; // Importing Firebase authentication and Firestore configuration
import { doc, setDoc, Timestamp } from "firebase/firestore"; // Importing Firestore functions

// Creating a context for authentication
const AuthContext = createContext<any>(null);

// AuthProvider component to provide authentication context to its children
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null); // State to store the current user

  // useEffect hook to handle authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  // Function to register a new user with email and password
  const register = async (email: string, password: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    // Storing additional user information in Firestore
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      createdAt: Timestamp.fromDate(new Date()),
    });
  };

  // Function to log in a user with email and password
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // Function to log out the current user
  const logout = () => {
    signOut(auth);
  };

  // Providing user, register, login, and logout functions through context
  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the authentication context
export const useAuth = () => {
  return useContext(AuthContext);
};
