from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    API_KEY: str = "add3e12d2ea34be18cd45eecd7644fa4"
    BASE_URL: str = "https://api.assemblyai.com/v2"
    
    class Config:
        env_file = ".env"

settings = Settings()