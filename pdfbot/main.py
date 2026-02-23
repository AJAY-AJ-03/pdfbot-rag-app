from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import QuestionRequest, QuestionResponse,UploadResponse, DocumentListResponse
from app.services import initialize_services, ingest_document,list_documents,answer_question_stream, delete_document
from logger_config import setup_logger
from fastapi import UploadFile, File
import shutil
import os
from fastapi.responses import StreamingResponse
import uvicorn


logger = setup_logger()

app = FastAPI(
    title="Production RAG API",
    version="1.0.0"
)

# Enable CORS (if frontend exists)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload", response_model=UploadResponse)
def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF allowed")

    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)

    file_path = os.path.join(upload_dir, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    document_id = ingest_document(file_path, file.filename)

    return UploadResponse(
        message="Document uploaded successfully",
        document_id=document_id,
        filename=file.filename
    )

@app.on_event("startup")
def startup_event():
    try:
        initialize_services()
    except Exception:
        logger.exception("Startup initialization failed.")
        raise


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/ask")
async def ask(payload: QuestionRequest):
    try:
        async def generate():
            try:
                async for chunk in answer_question_stream(
                    question=payload.question,
                    document_id=payload.document_id
                ):
                    if chunk:  # Only yield non-empty chunks
                        yield chunk
            except Exception as e:
                logger.exception("Error in stream generation")
                yield f"\n\n[Error: {str(e)}]"

        return StreamingResponse(
            generate(), 
            media_type="text/plain",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Content-Type-Options": "nosniff",
            }
        )

    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception:
        logger.exception("Unhandled error during question answering.")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@app.get("/documents", response_model=DocumentListResponse)
def get_documents():
    try:
        docs = list_documents()
        return DocumentListResponse(documents=docs)
    except Exception:
        logger.exception("Failed to list documents.")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
from fastapi import Path

@app.delete("/delete/{document_id}")
def delete_document_api(document_id: str = Path(..., min_length=1)):
    try:
        delete_document(document_id)
        return {"message": f"Document {document_id} deleted successfully."}
    except Exception:
        logger.exception("Failed to delete document.")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
# At the very bottom of main.py


if __name__ == "__main__":
    # Render provides the port via the environment variable $PORT
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)