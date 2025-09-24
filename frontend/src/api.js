const API_URL = "http://localhost:5000";

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);
  await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  });
}

export async function askQuestion(question) {
  const res = await fetch(`${API_URL}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  return res.json();
}
