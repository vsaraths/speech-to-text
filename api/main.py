from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import transcription, health

app = FastAPI(title="VoiceScribe API", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(transcription.router, tags=["Transcription"])
app.include_router(health.router, tags=["Health"])