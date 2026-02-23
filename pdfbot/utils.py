from pypdf import PdfReader
import tiktoken


def read_pdf(path: str) -> str:
    reader = PdfReader(path)
    text = ""

    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"

    if not text.strip():
        raise ValueError("No text extracted from PDF")

    return text


def chunk_text(text: str, chunk_size: int = 500, overlap: int = 100):
    encoding = tiktoken.get_encoding("cl100k_base")

    tokens = encoding.encode(text)

    chunks = []
    step = chunk_size - overlap

    for i in range(0, len(tokens), step):
        chunk_tokens = tokens[i:i + chunk_size]
        chunk_text = encoding.decode(chunk_tokens)
        chunks.append(chunk_text)

    return chunks