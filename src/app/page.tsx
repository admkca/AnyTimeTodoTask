"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../auth"; // Importing authentication context
import { addTodo, getTodos, updateTodo, deleteTodo } from "../firestore"; // Importing Firestore functions
import Head from "next/head"; // Importing Head component to set page title
import {
  Button,
  Card,
  Container,
  Form,
  ListGroup,
  Row,
  Col,
} from "react-bootstrap"; // Importing React Bootstrap components
import { Timestamp } from "firebase/firestore"; // Importing Firestore timestamp
import Link from "next/link"; // Importing Link component for navigation

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

  // If user is not authenticated, show a message with information cards
  if (!user) {
    return (
      <Container className='mt-5'>
        <Head>
          <title>Login</title>
        </Head>
        <h1 className='text-center'>Todo List </h1>
        <Row className='mt-4'>
          <Col md={4}>
            <Card className='text-center customCard'>
              <Card.Body>
                <Card.Title>Add Todo</Card.Title>
                <Card.Text>
                  Add new tasks and delete your todos manage your to-do list.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className='text-center customCard'>
              <Card.Body>
                <Card.Title>Completed Todos</Card.Title>
                <Card.Text>
                  View your completed tasks and track your achievements.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className='text-center customCard'>
              <Card.Body>
                <Card.Title>Profile</Card.Title>
                <Card.Text>
                  Manage your personal information and update your profile. Try
                  out great emojis.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className='text-center mt-4 d-flex justify-content-center'>
          <Link href='/login'>
            <Button className='me-3' variant='primary'>
              Login Now
            </Button>
          </Link>
          <Link href='/register'>
            <Button variant='danger'>Try it Now!</Button>
          </Link>
        </div>
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
      <Card
        className='mx-auto mb-4'
        style={{
          maxWidth: "700px",
          borderRadius: "10px",
          border: "1px solid #e0e0e0",
        }}
      >
        <Card.Body style={{ padding: "30px" }}>
          <Form onSubmit={handleAddTodo}>
            <Form.Group controlId='content'>
              <Form.Label>Content</Form.Label>
              <Form.Control
                type='text'
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                style={{
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  padding: "10px",
                }}
              />
            </Form.Group>
            <Form.Group controlId='category' className='mt-3'>
              <Form.Label>Category</Form.Label>
              <Form.Control
                type='text'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  padding: "10px",
                }}
              />
            </Form.Group>
            <Button
              variant='primary'
              type='submit'
              className='mt-3 w-100'
              style={{ borderRadius: "5px" }}
            >
              Add
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <h2 className='text-center mb-4'>Incomplete Todos</h2>
      <ListGroup>
        {todos.map((todo) => (
          <Card key={todo.id} className='mb-3' style={{ borderRadius: "10px" }}>
            <Card.Body
              style={{
                border: "1px solid #e0e0e0",
                borderRadius: "10px",
                padding: "15px",
              }}
            >
              <Row className='d-flex justify-content-between align-items-center'>
                <Col xs={12} md={3}>
                  <div>
                    <div>
                      <strong>Todo:</strong>
                    </div>
                    <div>{todo.content}</div>
                  </div>
                </Col>
                <Col xs={12} md={2}>
                  <div>
                    <div>
                      <strong>Category:</strong>
                    </div>
                    <div>{todo.category || "General"}</div>
                  </div>
                </Col>
                <Col xs={12} md={3}>
                  <div>
                    <div>
                      <strong>Date:</strong>
                    </div>
                    <div>{formatDate(todo.createdAt).split(",")[0]}</div>
                  </div>
                  <div>
                    <div>
                      <strong>Time:</strong>
                    </div>
                    <div>{formatDate(todo.createdAt).split(",")[1]}</div>
                  </div>
                </Col>
                <Col
                  xs={12}
                  md={4}
                  className='d-flex justify-content-md-end mt-3 mt-md-0'
                >
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
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))}
      </ListGroup>
    </Container>
  );
};

export default Home;
