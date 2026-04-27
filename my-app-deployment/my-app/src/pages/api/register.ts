import type { NextApiRequest, NextApiResponse } from "next";
import { signUp } from "@/utils/db/servicefirebase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, fullname, password } = req.body;

  if (!email || !fullname || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Wrap callback in Promise to ensure proper async handling
  return new Promise((resolve) => {
    signUp({ email, fullname, password }, (result: { status: string; message: string }) => {
      if (result.status === "success") {
        res.status(200).json({ message: result.message });
      } else {
        res.status(400).json({ message: result.message });
      }
      resolve(undefined);
    });
  });
}
