from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

app = FastAPI(title="Sentiment Analysis API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextInput(BaseModel):
    text: str

class SentimentResponse(BaseModel):
    text: str
    sentiment: str

@app.get("/")
async def root():
    return {"message": "Sentiment Analysis API is running"}

@app.post("/analyze", response_model=SentimentResponse)
async def analyze_sentiment(input_data: TextInput):
    """
    Endpoint that takes text input and returns a random sentiment
    from positive, negative, or neutral
    """
    sentiments = ["positive", "negative", "neutral"]
    random_sentiment = random.choice(sentiments)
    
    return SentimentResponse(
        text=input_data.text,
        sentiment=random_sentiment
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)