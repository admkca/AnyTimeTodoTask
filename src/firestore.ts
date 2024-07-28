import { db } from "./firebaseConfig"; // Importing Firestore database configuration
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
} from "firebase/firestore"; // Importing Firestore functions

// Function to get todos from Firestore based on userId and completion status
export const getTodos = async (userId: string, completed: boolean) => {
  try {
    const todosRef = collection(db, "todos"); // Reference to the "todos" collection
    const q = query(
      todosRef,
      where("userId", "==", userId),
      where("completed", "==", completed),
      orderBy("createdAt", "desc") // Ordering by creation date in descending order
    ); // Query to get todos for a specific user and completion status
    const querySnapshot = await getDocs(q); // Executing the query
    const todos = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        category: data.category || "Genel", // Default category value
        createdAt: data.createdAt ? data.createdAt.toDate() : new Date(), // Convert Firestore timestamp to JS Date
      };
    });
    return todos;
  } catch (error) {
    console.error("Error getting todos:", error); // Log error if any
    throw error; // Re-throw the error to be handled by the calling function
  }
};

// Function to add a new todo to Firestore
export const addTodo = async (
  userId: string,
  content: string,
  category: string
) => {
  try {
    const newTodo = {
      userId,
      content,
      completed: false,
      createdAt: new Date(),
      category: category || "Genel", // Default category value
    };
    await addDoc(collection(db, "todos"), newTodo); // Adding new todo to the "todos" collection
  } catch (error) {
    console.error("Error adding todo:", error); // Log error if any
    throw error; // Re-throw the error to be handled by the calling function
  }
};

// Function to update the completion status of a todo in Firestore
export const updateTodo = async (id: string, completed: boolean) => {
  try {
    const todoRef = doc(db, "todos", id); // Reference to the specific todo document
    await updateDoc(todoRef, { completed }); // Updating the todo document
  } catch (error) {
    console.error("Error updating todo:", error); // Log error if any
    throw error; // Re-throw the error to be handled by the calling function
  }
};

// Function to delete a todo from Firestore
export const deleteTodo = async (id: string) => {
  try {
    const todoRef = doc(db, "todos", id); // Reference to the specific todo document
    await deleteDoc(todoRef); // Deleting the todo document
  } catch (error) {
    console.error("Error deleting todo:", error); // Log error if any
    throw error; // Re-throw the error to be handled by the calling function
  }
};
