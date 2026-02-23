from pydantic import BaseModel, Field
from typing import List

class QuestionRequest(BaseModel):
    question: str = Field(..., min_length=1)
    document_id: str = Field(..., min_length=1)


class QuestionResponse(BaseModel):
    answer: str
    
class UploadResponse(BaseModel):
    message: str
    document_id: str
    filename: str
    
class DocumentInfo(BaseModel):
    document_id: str
    filename: str


class DocumentListResponse(BaseModel):
    documents: List[DocumentInfo]