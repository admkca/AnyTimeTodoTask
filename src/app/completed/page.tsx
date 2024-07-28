"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth"; // Importing authentication context
import { getTodos, updateTodo, deleteTodo } from "../../firestore"; // Importing Firestore functions
import Head from "next/head"; // Importing Head component to set page title
import { Button, Card, Container, Form, ListGroup } from "react-bootstrap"; // Importing React Bootstrap components
import { Timestamp } from "firebase/firestore"; // Importing Firestore timestamp

const Completed = () => {
  const { user } = useAuth(); // Getting user from authentication context
  const [todos, setTodos] = useState<any[]>([]); // State to store todos
  const [filter, setFilter] = useState<string>(""); // State to store filter text

  // useEffect hook to fetch completed todos when user or filter changes
  useEffect(() => {
    if (user) {
      fetchCompletedTodos();
    }
  }, [user, filter]);

  // Function to fetch completed todos from Firestore
  const fetchCompletedTodos = async () => {
    if (user) {
      const data = await getTodos(user.uid, true); // Fetching completed todos
      console.log("Fetched todos:", data); // Log fetched todos
      if (filter) {
        setTodos(
          data.filter((todo) => {
            const category = todo.category || "Genel";
            console.log("Todo category:", category); // Log each todo category
            return category === filter;
          })
        );
      } else {
        setTodos(data);
      }
    }
  };

  // Function to mark a todo as incomplete
  const handleIncomplete = async (id: string) => {
    await updateTodo(id, false); // Marking as incomplete
    fetchCompletedTodos(); // Fetching updated todo list
  };

  // Function to delete a todo
  const handleDelete = async (id: string) => {
    await deleteTodo(id); // Deleting the todo
    fetchCompletedTodos(); // Fetching updated todo list
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
        <title>Completed Todos</title>
      </Head>
      <h2 className='text-center mb-4'>Completed Todos</h2>
      <Card
        className='mx-auto mb-4'
        style={{ maxWidth: "800px", maxHeight: "600px", overflowY: "scroll" }}
      >
        <Card.Body>
          <Form className='mb-4'>
            <Form.Group controlId='filter'>
              <Form.Control
                type='text'
                placeholder='Filter by category'
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </Form.Group>
          </Form>
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
                      variant='warning'
                      size='sm'
                      className='me-2'
                      onClick={() => handleIncomplete(todo.id)}
                    >
                      Undo
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
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Completed;
