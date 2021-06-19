export default function handler(req, res) {
  if (req.method === "POST") {
    console.log(req.body);
  } else {
    res.status(405).json({
      error: "Method not allowed",
    });
  }
}
