import { NextApiRequest, NextApiResponse } from "next"; // Importing Next.js API types
import { db } from "../../../firebaseConfig"; // Importing Firestore database configuration
import { addDoc, collection } from "firebase/firestore"; // Importing Firestore functions

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Checking if the request method is POST
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Extracting userId and content from the request body
  const { userId, content } = req.body;

  try {
    // Adding a new document to the "todos" collection in Firestore
    const docRef = await addDoc(collection(db, "todos"), {
      userId,
      content,
      completed: false,
      createdAt: new Date(),
    });

    // Returning the ID of the newly created document
    return res.status(201).json({ id: docRef.id });
  } catch (error) {
    // Returning an error message if the document could not be added
    return res.status(500).json({ message: "Internal server error" });
  }
};
