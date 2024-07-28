"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { Inter } from "next/font/google"; // Importing Google fonts
import Link from "next/link"; // Importing Next.js Link component
import { useAuth, AuthProvider } from "../auth"; // Importing authentication context
import { useRouter } from "next/navigation"; // Importing Next.js router
import { Navbar, Nav, Container } from "react-bootstrap"; // Importing React Bootstrap components
import { useEffect, useState } from "react"; // Importing React hooks
import { db } from "../firebaseConfig"; // Importing Firestore database
import { doc, getDoc } from "firebase/firestore"; // Importing Firestore functions

const inter = Inter({ subsets: ["latin"] }); // Setting up Google font

const CustomNavbar = () => {
  const { user, logout } = useAuth(); // Getting user and logout function from authentication context
  const router = useRouter(); // Using Next.js router
  const [userName, setUserName] = useState<string>(""); // State for storing user name
  const [userEmoji, setUserEmoji] = useState<string>("🙂"); // Default emoji as "🙂"

  // Fetching user profile from Firestore using useEffect hook
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const profileRef = doc(db, "users", user.uid);
        const profileDoc = await getDoc(profileRef);
        if (profileDoc.exists()) {
          const profileData = profileDoc.data();
          setUserName(profileData.name);
          setUserEmoji(profileData.emoji || "🙂");
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  // Function to handle user logout
  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <Navbar bg='dark' variant='dark' expand='lg'>
      <Container>
        <Navbar.Brand href='/'>Todo App</Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='mx-auto'>
            <Nav.Link href='/' className='custom-nav-link'>
              Incomplete
            </Nav.Link>
            <Nav.Link href='/completed' className='custom-nav-link'>
              Completed
            </Nav.Link>
          </Nav>
          <Nav>
            {user ? (
              <>
                <Nav.Link href='/profile' className='custom-nav-link'>
                  <span>{userEmoji}</span> <span>{userName}</span>
                </Nav.Link>
                <Nav.Link onClick={handleLogout} className='custom-nav-link'>
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link href='/login' className='custom-nav-link'>
                  Login
                </Nav.Link>
                <Nav.Link href='/register' className='custom-nav-link'>
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <html lang='en'>
        <head>
          <title>Todo App</title>
          <link rel='icon' href='/favicon.ico' /> {/* Setting up favicon */}
          <meta
            name='description'
            content='Todo application with Next.js and Firebase'
          />
        </head>
        <body className={inter.className}>
          <CustomNavbar />
          {children}
        </body>
      </html>
    </AuthProvider>
  );
}
