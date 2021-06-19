import { db } from "utils/firebase-admin";

export default function test(req, res) {
  db.collection("test2").add({ lol: "chala" });
  res.status(200).json({
    error: "Method not allowed",
  });
}
