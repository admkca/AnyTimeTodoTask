"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../auth"; // Importing authentication context
import { addTodo, getTodos, updateTodo, deleteTodo } from "../firestore"; // Importing Firestore functions
import Head from "next/head"; // Importing Head component to set page title
import { Button, Card, Container, Form, ListGroup } from "react-bootstrap"; // Importing React Bootstrap components
import { Timestamp } from "firebase/firestore"; // Importing Firestore timestamp

const Home = () => {
  const { user } = useAuth(); // Getting user from authentication context
  const [todos, setTodos] = useState<any[]>([]); // State to store todos
  const [content, setContent] = useState<string>(""); // State to store new todo content
  const [category, setCategory] = useState<string>(""); // State to store new todo category

  // useEffect hook to fetch todos when user changes
  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user]);

  // Function to fetch todos from Firestore
  const fetchTodos = async () => {
    if (user) {
      const data = await getTodos(user.uid, false); // Fetching incomplete todos
      setTodos(data);
    }
  };

  // Function to handle adding a new todo
  const handleAddTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user && content.trim()) {
      await addTodo(user.uid, content, category);
      setContent("");
      setCategory("");
      fetchTodos(); // Fetching updated todo list
    }
  };

  // Function to handle marking a todo as complete
  const handleComplete = async (id: string) => {
    await updateTodo(id, true); // Marking as completed
    fetchTodos(); // Fetching updated todo list
  };

  // Function to handle deleting a todo
  const handleDelete = async (id: string) => {
    await deleteTodo(id);
    fetchTodos(); // Fetching updated todo list
  };

  // Function to format Firestore timestamp to a readable date
  const formatDate = (timestamp: any) => {
    if (timestamp instanceof Timestamp) {
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleString();
    } else if (timestamp && timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleString();
    } else if (timestamp instanceof Date) {
      return timestamp.toLocaleString();
    }
    return "Invalid date";
  };

  // If user is not authenticated, show a message
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
        <title>Todo App</title>
      </Head>
      <h2 className='text-center mb-4'>Add Todo</h2>
      <Card className='mx-auto mb-4' style={{ maxWidth: "500px" }}>
        <Card.Body>
          <Form onSubmit={handleAddTodo}>
            <Form.Group controlId='content'>
              <Form.Label>Content</Form.Label>
              <Form.Control
                type='text'
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId='category' className='mt-3'>
              <Form.Label>Category</Form.Label>
              <Form.Control
                type='text'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </Form.Group>
            <Button variant='primary' type='submit' className='mt-3 w-100'>
              Add
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <h2 className='text-center mb-4'>Incomplete Todos</h2>
      <ListGroup>
        {todos.map((todo) => (
          <Card key={todo.id} className='mb-3'>
            <Card.Body className='d-flex justify-content-between align-items-center'>
              <div>
                <strong>{todo.content}</strong> -{" "}
                <small>{todo.category || "General"}</small> -{" "}
                <em>{formatDate(todo.createdAt)}</em>
              </div>
              <div>
                <Button
                  variant='success'
                  size='sm'
                  className='me-2'
                  onClick={() => handleComplete(todo.id)}
                >
                  Complete
                </Button>
                <Button
                  variant='danger'
                  size='sm'
                  onClick={() => handleDelete(todo.id)}
                >
                  Delete
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))}
      </ListGroup>
    </Container>
  );
};

export default Home;
