"use client";

import React, { useState } from "react";
import { useAuth } from "../../auth"; // Importing authentication context
import { useRouter } from "next/navigation"; // Importing Next.js router
import Head from "next/head"; // Importing Head component to set page title
import { Button, Card, Container, Form } from "react-bootstrap"; // Importing React Bootstrap components

const Login = () => {
  const { login } = useAuth(); // Getting login function from authentication context
  const router = useRouter(); // Using Next.js router
  const [email, setEmail] = useState<string>(""); // State to store email
  const [password, setPassword] = useState<string>(""); // State to store password
  const [error, setError] = useState<string>(""); // State to store error message

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(email, password); // Logging in the user
      router.push("/"); // Redirecting to the home page
    } catch (error) {
      setError("Failed to login. Please check your credentials and try again.");
    }
  };

  return (
    <Container className='d-flex align-items-center justify-content-center min-vh-100'>
      <Head>
        <title>Login</title>
      </Head>
      <Card className='w-100' style={{ maxWidth: "400px" }}>
        <Card.Body>
          <h2 className='text-center mb-4'>Login</h2>
          {error && <div className='alert alert-danger'>{error}</div>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId='email'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId='password' className='mt-3'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant='primary' type='submit' className='mt-3 w-100'>
              Login
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
