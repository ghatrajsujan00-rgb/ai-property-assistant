from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI(title="AI Property Assistant API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sample property data for first demo
properties = [
    {
        "id": 1,
        "title": "2 Bedroom Apartment in Parramatta",
        "location": "Parramatta",
        "type": "Apartment",
        "bedrooms": 2,
        "price_per_week": 650,
        "status": "Available"
    },
    {
        "id": 2,
        "title": "3 Bedroom House in Blacktown",
        "location": "Blacktown",
        "type": "House",
        "bedrooms": 3,
        "price_per_week": 750,
        "status": "Available"
    },
    {
        "id": 3,
        "title": "1 Bedroom Unit in Sydney CBD",
        "location": "Sydney CBD",
        "type": "Unit",
        "bedrooms": 1,
        "price_per_week": 800,
        "status": "Available"
    }
]

bookings = []


class Booking(BaseModel):
    name: str
    email: str
    property_id: int
    preferred_date: str
    preferred_time: str


class ChatRequest(BaseModel):
    question: str


@app.get("/")
def home():
    return {
        "message": "AI Property Assistant backend is running"
    }


@app.get("/properties")
def get_properties():
    return properties


@app.get("/properties/search")
def search_properties(location: str = "", max_price: int = 9999):
    results = []

    for property_item in properties:
        location_match = location.lower() in property_item["location"].lower()
        price_match = property_item["price_per_week"] <= max_price

        if location_match and price_match:
            results.append(property_item)

    return {
        "results": results
    }


@app.post("/bookings")
def create_booking(booking: Booking):
    booking_id = len(bookings) + 1

    new_booking = {
        "booking_id": booking_id,
        "name": booking.name,
        "email": booking.email,
        "property_id": booking.property_id,
        "preferred_date": booking.preferred_date,
        "preferred_time": booking.preferred_time,
        "status": "Confirmed"
    }

    bookings.append(new_booking)

    return {
        "message": "Inspection booking created successfully",
        "booking": new_booking
    }


@app.get("/bookings/{booking_id}")
def get_booking(booking_id: int):
    for booking in bookings:
        if booking["booking_id"] == booking_id:
            return booking

    return {
        "message": "Booking not found"
    }


@app.post("/chat")
def chat_with_ai(request: ChatRequest):
    # This is a mock response for the first demo.
    # Later, this part can be connected to Amazon Bedrock Knowledge Bases for RAG.
    return {
        "question": request.question,
        "answer": "This is a demo AI response. In the final system, this answer will come from Amazon Bedrock Knowledge Bases using RAG."
    }