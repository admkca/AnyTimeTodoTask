"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth"; // Importing authentication context
import { db } from "../../firebaseConfig"; // Importing Firestore configuration
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Importing Firestore functions
import { useRouter } from "next/navigation"; // Importing Next.js router for navigation
import Head from "next/head"; // Importing Head component to set page title
import dynamic from "next/dynamic"; // Importing dynamic for dynamic imports
import { Button, Card, Container, Form } from "react-bootstrap"; // Importing React Bootstrap components

// Dynamically import the Emoji picker
const DynamicEmojiPicker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
});

const Profile = () => {
  const { user, logout } = useAuth(); // Getting user and logout function from authentication context
  const [profile, setProfile] = useState<any>({});
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [emoji, setEmoji] = useState<string>("🙂"); // Default emoji
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const router = useRouter();

  // useEffect hook to fetch profile data when user is loaded
  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  // Function to fetch user profile data from Firestore
  const fetchProfile = async () => {
    if (user) {
      try {
        const profileRef = doc(db, "users", user.uid);
        const profileDoc = await getDoc(profileRef);
        if (profileDoc.exists()) {
          const profileData = profileDoc.data();
          setProfile(profileData);
          setName(profileData.name);
          setEmail(profileData.email);
          setEmoji(profileData.emoji || "🙂"); // Load emoji, default to "🙂"
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to fetch profile data. Please try again.");
      }
    }
  };

  // Function to handle profile update
  const handleUpdate = async () => {
    if (!name || !email) {
      setError("All fields are required.");
      return;
    }
    try {
      if (user) {
        const profileRef = doc(db, "users", user.uid);
        await updateDoc(profileRef, { name, email, emoji });
        setSuccess("Profile updated successfully.");
        setError("");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
      setSuccess("");
    }
  };

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      setError("Failed to log out. Please try again.");
    }
  };

  // Function to handle emoji selection
  const handleEmojiSelect = (emojiObject: any) => {
    setEmoji(emojiObject.emoji);
    setShowEmojiPicker(false); // Close emoji picker after selection
  };

  // Function to handle name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  // Function to handle email change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // If user is not authenticated, prompt them to log in
  if (!user) {
    return (
      <Container className='mt-5'>
        <Head>
          <title>Login</title>
        </Head>
        <h2 className='text-center'>You need to log in</h2>
      </Container>
    );
  }

  // Main component return
  return (
    <Container className='mt-5'>
      <Head>
        <title>Profile</title>
      </Head>
      <div className='text-center'>
        {/* Display selected emoji as profile picture */}
        <div style={{ fontSize: "4rem" }}>{emoji}</div>
      </div>
      <Card className='mt-3 mx-auto' style={{ maxWidth: "500px" }}>
        <Card.Body>
          <h2 className='text-center mb-4'>Profile</h2>
          {error && <div className='alert alert-danger'>{error}</div>}
          {success && <div className='alert alert-success'>{success}</div>}
          <Form>
            {/* Name field */}
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                value={name}
                onChange={handleNameChange}
              />
            </Form.Group>
            {/* Email field */}
            <Form.Group controlId='email' className='mt-3'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                value={email}
                onChange={handleEmailChange}
              />
            </Form.Group>
            {/* Emoji select button */}
            <Button
              variant='secondary'
              className='mt-3'
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              Select Emoji
            </Button>
            {showEmojiPicker && (
              <div className='mt-3'>
                <DynamicEmojiPicker onEmojiClick={handleEmojiSelect} />
              </div>
            )}
            {/* Update profile button */}
            <Button
              variant='primary'
              className='mt-3 w-100'
              onClick={handleUpdate}
            >
              Update
            </Button>
            {/* Logout button */}
            <Button
              variant='danger'
              className='mt-3 w-100'
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;
