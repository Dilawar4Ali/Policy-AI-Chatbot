require("dotenv").config();

const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const OpenAI = require("openai");
const { getEmbeddings, cosineSimilarity } = require("./embeddings.js");

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

let documents = []; // in-memory vector store

// Upload policy document
app.post("/upload", async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).send("No file uploaded");
  }

  const file = req.files.file;
  let text = "";

  if (file.mimetype === "application/pdf") {
    const data = await pdfParse(file.data);
    text = data.text;
  } else {
    text = file.data.toString("utf-8");
  }

  const chunks = text.match(/(.|[\r\n]){1,500}/g) || [];
  documents = [];

  for (const chunk of chunks) {
    const embedding = await getEmbeddings(chunk);
    documents.push({ text: chunk, embedding });
  }

  res.json({ message: "File processed successfully", chunks: documents.length });
});

// Ask a question
app.post("/ask", async (req, res) => {
  const { question } = req.body;
  const qEmbedding = await getEmbeddings(question);

  // Find most relevant chunk
  const ranked = documents
    .map(doc => ({
      ...doc,
      score: cosineSimilarity(qEmbedding, doc.embedding),
    }))
    .sort((a, b) => b.score - a.score);

  const context = ranked.slice(0, 3).map(r => r.text).join("\n\n");

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a helpful assistant answering based only on given policies." },
      { role: "user", content: `Context:\n${context}\n\nQuestion: ${question}` }
    ]
  });

  res.json({ answer: completion.choices[0].message.content });
});

app.listen(5000, () => console.log("Backend running on http://localhost:5000"));
