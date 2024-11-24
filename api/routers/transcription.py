from fastapi import APIRouter, File, UploadFile, HTTPException
from ..services.assemblyai import AssemblyAIService
from ..models import TranscriptionRequest, TranscriptionResponse, UploadResponse

router = APIRouter()
assemblyai_service = AssemblyAIService()

@router.post("/upload", response_model=UploadResponse)
async def upload_file(file: UploadFile = File(...)):
    if not file.content_type.startswith('audio/'):
        raise HTTPException(status_code=400, detail="File must be an audio file")
    
    file_content = await file.read()
    upload_url = await assemblyai_service.upload_file(file_content)
    return {"upload_url": upload_url}

@router.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe_audio(audio_url: TranscriptionRequest):
    result = await assemblyai_service.transcribe_audio(audio_url.url)
    return result