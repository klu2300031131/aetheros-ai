import asyncio
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import random

app = FastAPI(title="AetherOS AI Engine", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

class DelayPredictionResponse(BaseModel):
    carrier_id: str
    delay_probability: float
    confidence_score: float
    primary_driver: str
    mitigation_suggestion: str

@app.get("/api/predict/delay", response_model=DelayPredictionResponse)
async def predict_delay(carrier_id: str = Query(..., description="ID of the carrier to evaluate")):
    # Simulated ML model inference based on port indices
    drivers = [
        "Atlantic storm headwinds slowing knots speed",
        "Rotterdam Terminal labor contract dispute",
        "Singapore harbor vessel stack queuing",
        "Shanghai Customs clearance logs mismatch"
    ]
    suggestions = [
        "Reroute via Antwerp terminal corridor (+14h travel, saves 42h port queue)",
        "Leverage inter-modal rail networks through Central Europe",
        "Disperse stock allocation to Dallas safety buffers",
        "Retrain custom billing logs mapping to clear security locks"
    ]

    return DelayPredictionResponse(
        carrier_id=carrier_id,
        delay_probability=round(random.uniform(0.1, 0.95), 2),
        confidence_score=round(random.uniform(0.85, 0.99), 2),
        primary_driver=random.choice(drivers),
        mitigation_suggestion=random.choice(suggestions)
    )

@app.post("/api/chat/stream")
async def chat_stream(req: ChatRequest):
    async def generator():
        response_text = f"AetherOS AI Hub acknowledges query: '{req.message}'. Accessing LangGraph agent mesh... "
        for word in response_text.split(" "):
            yield f"data: {word} \n\n"
            await asyncio.sleep(0.1)

        # Agent thinking simulated steps
        yield "data: [Executive Agent] Querying Carbon Agent... \n\n"
        await asyncio.sleep(0.5)
        yield "data: [Carbon Agent] Analyzing routing footprint. Target CO2 impact is offset by credits. \n\n"
        await asyncio.sleep(0.5)
        yield "data: Rerouting verified. Command dispatched. \n\n"

    return StreamingResponse(generator(), media_type="text/event-stream")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
