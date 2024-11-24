import requests
import time
from fastapi import HTTPException
from ..config import settings

class AssemblyAIService:
    def __init__(self):
        self.headers = {
            "authorization": settings.API_KEY
        }
    
    async def upload_file(self, file_content: bytes) -> str:
        try:
            response = requests.post(
                f"{settings.BASE_URL}/upload",
                headers=self.headers,
                data=file_content
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=500, detail="Upload to AssemblyAI failed")
                
            return response.json()["upload_url"]
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    async def transcribe_audio(self, audio_url: str) -> dict:
        try:
            transcript_input = {
                "audio_url": audio_url,
                "speaker_labels": True,
                "auto_chapters": True,
                "entity_detection": True,
                "auto_highlights": True
            }

            transcript_response = requests.post(
                f"{settings.BASE_URL}/transcript",
                json=transcript_input,
                headers=self.headers
            )

            if transcript_response.status_code != 200:
                raise HTTPException(status_code=500, detail="Transcription request failed")

            transcript_id = transcript_response.json()["id"]
            return await self._poll_transcription(transcript_id)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    async def _poll_transcription(self, transcript_id: str) -> dict:
        polling_endpoint = f"{settings.BASE_URL}/transcript/{transcript_id}"
        
        while True:
            try:
                polling_response = requests.get(polling_endpoint, headers=self.headers)
                transcript_result = polling_response.json()

                if transcript_result["status"] == "completed":
                    return {
                        "text": transcript_result["text"],
                        "confidence": transcript_result["confidence"],
                        "words": transcript_result["words"],
                        "speakers": transcript_result.get("speaker_labels"),
                        "chapters": transcript_result.get("chapters"),
                        "entities": transcript_result.get("entities"),
                        "highlights": transcript_result.get("auto_highlights_result"),
                        "status": "completed"
                    }
                elif transcript_result["status"] == "error":
                    raise HTTPException(status_code=500, detail="Transcription failed")
                
                time.sleep(3)
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))