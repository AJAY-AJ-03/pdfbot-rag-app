# 📚 RAG Chatbot – Multi-Document AI Document Q&A System

Production-grade Retrieval-Augmented Generation (RAG) application built using FastAPI, ChromaDB, Groq LLM, and React.

---

## 🚀 Project Overview

This is a production-style Retrieval-Augmented Generation (RAG) system that allows users to upload a PDF (resume, documentation, etc.) and ask contextual questions about its content.

The system:

- Extracts text from PDF
- Performs token-aware chunking
- Generates embeddings
- Stores vectors in ChromaDB
- Retrieves semantically relevant context
- Streams responses using Groq LLM
- Displays responses in a real-time React UI

This project demonstrates real-world AI backend architecture with proper frontend–backend integration.

---


<img width="1918" height="1030" alt="Screenshot 2026-02-23 162627" src="https://github.com/user-attachments/assets/11210c69-b91c-41ec-b4e6-534157df54c6" />

<img width="1919" height="1019" alt="Screenshot 2026-02-23 162718" src="https://github.com/user-attachments/assets/03bc9cba-7d89-45eb-911e-4170f9a3b52e" />

<img width="1919" height="1025" alt="Screenshot 2026-02-23 162747" src="https://github.com/user-attachments/assets/8bd9cd8f-c754-4f2b-9622-0952e6c16d24" />

<img width="1918" height="1024" alt="Screenshot 2026-02-23 162832" src="https://github.com/user-attachments/assets/d7e60063-9968-4264-9276-1ce6578cdc1d" />

<img width="1918" height="1026" alt="Screenshot 2026-02-23 162923" src="https://github.com/user-attachments/assets/9b0ad219-30c4-4452-8233-eb273f8d891e" />

<img width="1919" height="1031" alt="Screenshot 2026-02-23 163045" src="https://github.com/user-attachments/assets/ee8266a9-7c43-4b82-b52a-bf9fd2fe66e6" />

<img width="1919" height="1028" alt="Screenshot 2026-02-23 163121" src="https://github.com/user-attachments/assets/b3084526-c3ae-43cc-868c-fbcaafd87672" />

<img width="1917" height="1028" alt="Screenshot 2026-02-23 163139" src="https://github.com/user-attachments/assets/1c2c1f6c-faf8-44b3-98f5-ed5f6cc851c6" />

<img width="1919" height="1031" alt="Screenshot 2026-02-23 163312" src="https://github.com/user-attachments/assets/ce58ae89-8717-4900-9692-d34648275633" />

<img width="1919" height="1029" alt="Screenshot 2026-02-23 163626" src="https://github.com/user-attachments/assets/5f8a5013-ddc4-4037-aea1-37918cf0b667" />

<img width="1919" height="1027" alt="Screenshot 2026-02-23 163749" src="https://github.com/user-attachments/assets/ec2369d4-2530-4fc6-bdb7-909ea92ea4c0" />

## 🏗 Architecture Flow

PDF  
→ Text Extraction  
→ Token Chunking  
→ Embeddings  
→ ChromaDB  
→ Similarity Search  
→ Context Construction  
→ Groq LLM  
→ Streaming Response  
→ React UI  

---

## 🛠 Tech Stack

### 🔹 Backend (`pdfbot/`)
- FastAPI
- ChromaDB (Persistent Vector Database)
- Sentence Transformers (`all-MiniLM-L6-v2`)
- Groq LLM API
- Tiktoken (Token-aware chunking)
- PyPDF
- Python Logging
- Environment-based configuration

### 🔹 Frontend (`pdf-chat-ui/`)
- React
- Axios
- Markdown Rendering
- Streaming response handling
- Vite

---

## 📂 Project Structure

```
project-root/
│
├── pdfbot/                 # Backend (FastAPI)
│   ├── main.py
│   ├── services.py
│   ├── schemas.py
│   ├── config.py
│   ├── logger_config.py
│   ├── utils.py
│   └── requirements.txt
│
├── pdf-chat-ui/            # Frontend (React)
│   ├── src/
│   ├── .env
│   └── package.json
│
└── README.md
```

---

# ⚙️ Backend Setup (FastAPI – `pdfbot`)

### 1️⃣ Clone Repository

```bash
git clone <your-repo-url>
cd project-root/pdfbot
```

### 2️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

### 3️⃣ Create `.env` File (Inside `pdfbot`)

```
API_KEY=your_groq_api_key
MODEL_NAME=llama-3.3-70b-versatile
```

### 4️⃣ Run Backend

```bash
uvicorn main:app --reload
```

Backend runs at:

```
http://127.0.0.1:8000
```

---

# 💻 Frontend Setup (React – `pdf-chat-ui`)

### 1️⃣ Navigate to Frontend Directory

```bash
cd ../pdf-chat-ui
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Create `.env` File (Inside `pdf-chat-ui`)

```
VITE_API_BASE_URL=http://127.0.0.1:8000
```

This environment variable is used to connect the frontend to the FastAPI backend.

### 4️⃣ Run Frontend

```bash
npm run dev
```

Frontend typically runs at:

```
http://localhost:5173
```

---

# ✨ Key Features

- Token-aware chunking using `cl100k_base`
- Overlapping chunk strategy for semantic continuity
- Persistent vector storage with ChromaDB
- Top-K similarity retrieval
- Context size control to prevent token overflow
- Streaming LLM responses
- Structured logging (console + file)
- Clean layered backend architecture
- Environment-based configuration
- Interactive React UI with real-time streaming output

---

# 📊 Retrieval Pipeline Details

1. PDF text extracted using PyPDF  
2. Tokenized using `tiktoken`  
3. Split into overlapping chunks  
4. Embedded using Sentence Transformers  
5. Stored in persistent ChromaDB  
6. Top-K similar chunks retrieved per query  
7. Context constrained by MAX_CONTEXT_CHARS  
8. Response streamed from Groq LLM  
9. Rendered live in frontend UI  

---

# 🔐 Environment Variables

### Backend (`pdfbot/.env`)

| Variable | Description |
|----------|------------|
| API_KEY | Groq API Key |
| MODEL_NAME | LLM model name |

### Frontend (`pdf-chat-ui/.env`)

| Variable | Description |
|----------|------------|
| VITE_API_BASE_URL | Backend API Base URL |

---

# 🧠 Why This Project Matters

This project demonstrates:

- Real-world RAG architecture
- Token-aware context engineering
- Efficient semantic vector search
- LLM streaming implementation
- Production-style backend structuring
- Full stack AI application development

It reflects practical AI system engineering beyond basic chatbot demos.

---

# 📌 Future Improvements

- Dockerized deployment
- Authentication & RBAC
- Rate limiting
- Multi-document session management
- Cloud deployment
- Monitoring & analytics

---

# 👨‍💻 Author

**Ajay Rathnam**  
Python Full Stack Developer | AI Application Developer  
React • FastAPI • Django • RAG Systems • Vector Search • LLM Integration
