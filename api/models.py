from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class TranscriptionRequest(BaseModel):
    url: str

class TranscriptionResponse(BaseModel):
    text: str
    confidence: float
    words: List[Dict[str, Any]]
    speakers: Optional[List[Dict[str, Any]]]
    chapters: Optional[List[Dict[str, Any]]]
    entities: Optional[List[Dict[str, Any]]]
    highlights: Optional[Dict[str, Any]]
    status: str

class UploadResponse(BaseModel):
    upload_url: str

class HealthResponse(BaseModel):
    status: str