# 🚀 Production RAG API

A production-ready **Retrieval-Augmented Generation (RAG) API** built with FastAPI, ChromaDB, and Groq LLM.

This system allows you to:

- Upload PDF documents
- Process them into searchable chunks
- Ask questions about their content
- Receive streaming LLM responses in real time

---

## ✨ Features

- 📄 PDF Upload & Processing (automatic text extraction)
- 🔍 Semantic Search using Sentence Transformers (`all-MiniLM-L6-v2`)
- 💾 Persistent Vector Storage with ChromaDB
- 🤖 LLM Integration via Groq (`llama-3.3-70b-versatile`)
- ⚡ Streaming Responses
- 📋 Document Management (List / Delete)
- 🎯 Document-specific queries
- 📝 File + Console Logging
- 🔒 CORS enabled (frontend-ready)

---

## 🏗️ Architecture

```
Client
   │
   ▼
FastAPI Backend
   │
   ├── ChromaDB (Vector Store)
   │
   └── Groq LLM (Streaming)
```

---

## 📦 Prerequisites

- Python 3.8+
- Groq API Key (Get from https://console.groq.com)

---

## ⚙️ Installation

### 1️⃣ Clone the repository

```bash
git clone <your-repo-url>
cd production-rag-api
```

### 2️⃣ Create virtual environment

```bash
python -m venv venv
```

Activate:

- Mac/Linux:
```bash
source venv/bin/activate
```

- Windows:
```bash
venv\Scripts\activate
```

### 3️⃣ Install dependencies

```bash
pip install -r requirements.txt
```

### 4️⃣ Set Environment Variables

Create `.env` file:

```bash
API_KEY=your_groq_api_key_here
MODEL_NAME=llama-3.3-70b-versatile
```

---

## ▶️ Run the Application

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API will be available at:

```
http://localhost:8000
```

---

## 📚 API Documentation

- Swagger UI → `http://localhost:8000/docs`
- ReDoc → `http://localhost:8000/redoc`

---

## 🔌 API Endpoints

### 1️⃣ Upload PDF

**POST** `/upload`

Content-Type: `multipart/form-data`

```
file: <pdf_file>
```

Response:
```json
{
  "message": "Document uploaded successfully",
  "document_id": "uuid-string",
  "filename": "example.pdf"
}
```

---

### 2️⃣ Ask Question

**POST** `/ask`

```json
{
  "question": "What is the document about?",
  "document_id": "uuid-from-upload"
}
```

Response: Streaming `text/plain`

---

### 3️⃣ List Documents

**GET** `/documents`

```json
{
  "documents": [
    {
      "document_id": "uuid-string",
      "filename": "example.pdf"
    }
  ]
}
```

---

### 4️⃣ Delete Document

**DELETE** `/delete/{document_id}`

```json
{
  "message": "Document deleted successfully."
}
```

---

### 5️⃣ Health Check

**GET** `/health`

```json
{
  "status": "healthy"
}
```

---

## 🔧 Configuration

Edit `config.py` to modify:

- `CHUNK_SIZE` (default: 800)
- `CHUNK_OVERLAP` (default: 150)
- `TOP_K` (default: 3)
- `MAX_CONTEXT_CHARS` (default: 4000)
- `COLLECTION_NAME`
- `PERSIST_DIR` (default: ./chroma_storage)

---

## 📁 Project Structure

```
production-rag-api/
├── main.py
├── schemas.py
├── services.py
├── config.py
├── logger_config.py
├── utils.py
├── .env
├── requirements.txt
├── uploads/
├── chroma_storage/
└── rag_app.log
```

---

## 📝 Logging

Logs are written to:

- Console
- `rag_app.log`

Format example:

```
2024-01-01 12:00:00 | INFO | rag_app | Service initialized successfully
```

---

## ⚡ Performance Considerations

- Batch embedding generation
- Token-aware chunking using `tiktoken`
- Streaming LLM responses
- Persistent Chroma vector storage

---

## 🔐 Security Notes

⚠️ For production:

- Restrict CORS origins
- Keep API key in environment variables only
- Add authentication layer if public

---

## 🧪 Development & Testing

Run tests:

```bash
pytest tests/
```

---

## 🛠️ Troubleshooting

**Issue:** API_KEY not found  
→ Ensure `.env` file exists and is valid

**Issue:** ChromaDB persistence errors  
→ Check write permissions for `./chroma_storage`

**Issue:** PDF extraction fails  
→ Ensure PDF contains selectable text (not scanned images)

---

## 📄 License

MIT License

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push branch
5. Open Pull Request

---

## 📬 Support

- Open GitHub issue
- Check `rag_app.log`
- Review API documentation