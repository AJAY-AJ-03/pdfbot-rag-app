import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("API_KEY")

if not API_KEY:
    raise ValueError("API_KEY not found in environment variables")

# PDF_PATH = "resume.pdf"
COLLECTION_NAME = "my_docs"
PERSIST_DIR = "./chroma_storage"

CHUNK_SIZE = 800
CHUNK_OVERLAP = 150
TOP_K = 3
MAX_CONTEXT_CHARS = 4000
MODEL_NAME = os.getenv("MODEL_NAME")