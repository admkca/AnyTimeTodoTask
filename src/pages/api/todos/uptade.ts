import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id, completed } = req.body;

  try {
    const todoRef = doc(db, "todos", id);
    await updateDoc(todoRef, { completed });

    return res.status(200).json({ message: "Todo updated" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
