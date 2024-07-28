import { NextApiRequest, NextApiResponse } from "next"; // Importing Next.js API types
import { db } from "../../../firebaseConfig"; // Importing Firestore database configuration
import { doc, deleteDoc } from "firebase/firestore"; // Importing Firestore functions

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Checking if the request method is DELETE
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Extracting the ID of the todo to be deleted from the request body
  const { id } = req.body;

  try {
    // Getting a reference to the todo document in Firestore
    const todoRef = doc(db, "todos", id);
    // Deleting the document from Firestore
    await deleteDoc(todoRef);

    // Returning a success message
    return res.status(200).json({ message: "Todo deleted" });
  } catch (error) {
    // Returning an error message if the document could not be deleted
    return res.status(500).json({ message: "Internal server error" });
  }
};
