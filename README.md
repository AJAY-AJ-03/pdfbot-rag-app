# 📚 Resume RAG Chatbot  
Production-Ready Retrieval-Augmented Generation (RAG) Application using FastAPI, ChromaDB, and Groq LLM

---

## 🚀 Project Overview

This project is a production-style Retrieval-Augmented Generation (RAG) system that allows users to upload a PDF (e.g., resume or document) and ask questions about its content.

The system:
- Extracts text from PDF
- Performs token-aware chunking
- Generates embeddings
- Stores vectors in ChromaDB
- Retrieves relevant context
- Streams answers using Groq LLM

This project demonstrates real-world backend architecture for AI-powered document Q&A systems.

---

## 🏗 Architecture Flow

PDF → Text Extraction → Token Chunking → Embeddings → ChromaDB  
→ Similarity Search → Context Building → Groq LLM → Streaming Response

---

## 🛠 Tech Stack

### Backend
- FastAPI
- ChromaDB (Vector Database)
- Sentence Transformers (`all-MiniLM-L6-v2`)
- Groq LLM API
- Tiktoken (Token-aware chunking)
- PyPDF
- Python Logging

### Frontend
- React
- Axios
- Markdown Rendering

---

## ✨ Key Features

- Token-aware chunking using tiktoken
- Persistent vector storage with ChromaDB
- Streaming LLM responses
- Context size control
- Structured logging (console + file)
- Clean layered backend architecture
- Environment-based configuration

---

## 📂 Project Structure


project-root/
│
├── backend/
│ ├── main.py
│ ├── services.py
│ ├── schemas.py
│ ├── config.py
│ ├── logger_config.py
│ ├── utils.py
│ └── requirements.txt
│
├── frontend/
│
└── README.md


---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository


git clone <your-repo-url>
cd project-root/backend


### 2️⃣ Install Dependencies


pip install -r requirements.txt


### 3️⃣ Create `.env` File


API_KEY=your_groq_api_key
MODEL_NAME=llama-3.3-70b-versatile


### 4️⃣ Run Backend


uvicorn main:app --reload


Backend runs at:

http://127.0.0.1:8000


---

## 🔐 Environment Variables

| Variable | Description |
|----------|------------|
| API_KEY | Groq API Key |
| MODEL_NAME | LLM Model Name |
| LOG_LEVEL (optional) | Logging level |

---

## 📊 How Retrieval Works

- Document is tokenized using `cl100k_base` encoding
- Text is split into overlapping chunks
- Each chunk is embedded using Sentence Transformers
- Vectors stored in ChromaDB (persistent storage)
- Top-K relevant chunks retrieved per query
- Context limited by MAX_CONTEXT_CHARS
- Response streamed from Groq LLM

---

## 🧠 Why This Project Matters

This project demonstrates:

- Real-world RAG architecture
- Token-aware context management
- Efficient vector search
- LLM streaming implementation
- Clean backend design for AI applications

It reflects production-ready AI system development practices.

---

## 📌 Future Improvements

- Docker deployment
- Authentication layer
- Rate limiting
- Cloud deployment
- Multi-document support

---

## 👨‍💻 Author

Ajay Rathnam  
Backend Developer | AI Application Developer

---