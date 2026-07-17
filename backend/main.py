import os
import random
import datetime
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, Body, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

# Load env variables
load_dotenv()

app = FastAPI(title="StadiumIQ AI Backend", version="1.0.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    model = None

# Fallback helper for Gemini simulation
def get_gemini_response(prompt: str, fallback_type: str = "general") -> str:
    if model:
        try:
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"Gemini API Error, falling back: {e}")
    
    # Mocking Gemini Responses
    if fallback_type == "chat":
        return (
            f"StadiumIQ AI Assistant response to your query. [Demo Mode - AI Simulator]\n\n"
            f"Based on your request, I recommend utilizing Entry Gate 4 (East Corridor) as it currently has the lowest crowd density (approx. 15% capacity). "
            f"If you require wheelchair-accessible routes, please follow the blue-marked accessibility lane toward Elevators Section B. "
            f"For food nearby, we suggest 'Stadium Grill' at Section 102 (5-minute walk, low wait times)."
        )
    elif fallback_type == "incident":
        return (
            "--- INCIDENT REPORT SUMMARY ---\n"
            "Date/Time: 2026-07-17 22:35 UTC\n"
            "Classification: MEDIUM PRIORITY - Crowd Congestion at Entry Gate 3\n"
            "Description: Minor bottleneck detected due to ticket scanner slowdown.\n"
            "Suggested Response: Deploy 2 additional volunteer guides from Zone 2 to redirect fans to Gate 4. Inform transport hub to slow bus release rate by 3 minutes."
        )
    elif fallback_type == "briefing":
        return (
            "## FIFA World Cup 2026 Daily Operations Briefing - July 17, 2026\n\n"
            "### Operational Summary\n"
            "The stadium is at green status. Today's match: **USA vs England** kicks off at 18:00 Local Time.\n\n"
            "### Highlights\n"
            "- **Expected Attendance**: 68,500 (100% capacity)\n"
            "- **Weather**: Clear, 24°C (75°F). Perfect conditions.\n"
            "- **Risk Assessment**: Low risk overall. Moderate transit congestion expected near North Station between 16:30 and 17:30.\n"
            "- **Staffing Recommendation**: Deploy peak security personnel to Gates 2 & 3 between 15:30 and 17:00."
        )
    elif fallback_type == "crowd":
        return (
            "### AI Crowd Intelligence Analysis\n"
            "- **Current Trend**: Inflow is rising at 8% per minute. Peak occupancy expected at 17:45.\n"
            "- **Risk Recommendation**: High density detected in Food Court Area C. Redirect fans via notifications to West Concourse stalls."
        )
    elif fallback_type == "sustainability":
        return (
            "### Sustainability Optimization suggestions\n"
            "1. **HVAC Control**: Reduce cooling in empty VIP lounges by 2°C until 16:00.\n"
            "2. **Waste Management**: Schedule immediate pickup for Bin Cluster 4 (Recyclables near North Gate).\n"
            "3. **Lighting**: Dim exterior security path spotlights until sunset."
        )
    elif fallback_type == "lost_found":
        return (
            "### AI Lost & Found Match Results\n"
            "- **Match Found!** A black leather wallet containing a driver's license was turned in at Customer Service Desk 2 at 21:40 (Match Rating: 94%).\n"
            "- **Alternate Match**: Brown cardholder found at Section 104 (Match Rating: 65%)."
        )
    
    return "This is a simulated AI response tailored for StadiumIQ AI."

# Models
class ChatRequest(BaseModel):
    message: str
    role: str
    language: str
    history: Optional[List[Dict[str, str]]] = []

class NavigationRequest(BaseModel):
    start: str
    destination: str
    isWheelchair: bool = False
    emergencyMode: bool = False

class IncidentRequest(BaseModel):
    location: str
    type: str
    description: str

class LostFoundRequest(BaseModel):
    description: str
    imageName: Optional[str] = None

class EmergencyModeRequest(BaseModel):
    active: bool
    triggerLocation: str

# API Routes
@app.get("/")
def read_root():
    return {"status": "StadiumIQ AI API is running", "time": datetime.datetime.now()}

@app.post("/api/chat")
def chat_assistant(req: ChatRequest):
    prompt = (
        f"You are the StadiumIQ AI Smart Assistant for the FIFA World Cup 2026.\n"
        f"User Role: {req.role}\n"
        f"Language requested: {req.language}\n"
        f"Conversation History: {req.history}\n"
        f"User Message: {req.message}\n"
        f"Answer clearly and concisely, tailored to the user's role."
    )
    response_text = get_gemini_response(prompt, "chat")
    return {"message": response_text}

@app.post("/api/navigation")
def get_navigation(req: NavigationRequest):
    # Simulated mapping routes
    routes = [
        {
            "name": "Fastest Route",
            "eta": 7 if not req.isWheelchair else 10,
            "distance": "450m",
            "risk": "Low",
            "path": ["Gate 4", "Concourse A", "Section 104", req.destination],
            "description": "Direct route via Main Concourse A."
        },
        {
            "name": "Safest Route (Low Crowd)",
            "eta": 11 if not req.isWheelchair else 13,
            "distance": "620m",
            "risk": "Minimal",
            "path": ["Gate 4", "Outer Plaza", "Ramp B", "Elevator East", req.destination],
            "description": "Scenic detour avoiding the main food court congestion."
        }
    ]
    if req.isWheelchair:
        routes[0]["name"] = "Wheelchair-Accessible Fast Route"
        routes[0]["path"] = ["Gate 4", "Ramp A", "Elevator West", req.destination]
    
    if req.emergencyMode:
        return {
            "routes": [{
                "name": "EMERGENCY EVACUATION ROUTE",
                "eta": 3,
                "distance": "200m",
                "risk": "Immediate Attention Required",
                "path": [req.start, "Fire Exit East", "Plaza Safe Zone"],
                "description": "Follow flashing green exit paths immediately."
            }]
        }
        
    return {"routes": routes}

@app.get("/api/crowd-intelligence")
def crowd_intelligence():
    # Simulate real-time crowd metrics
    zones = [
        {"name": "Zone A (Entry Gates 1-3)", "density": 82, "waitTime": 18, "status": "Critical"},
        {"name": "Zone B (Food Court North)", "density": 65, "waitTime": 12, "status": "Moderate"},
        {"name": "Zone C (South Concourse)", "density": 34, "waitTime": 4, "status": "Good"},
        {"name": "Zone D (VIP Lounge)", "density": 45, "waitTime": 2, "status": "Good"}
    ]
    prompt = f"Analyze this crowd state and suggest interventions: {zones}"
    ai_analysis = get_gemini_response(prompt, "crowd")
    
    return {
        "zones": zones,
        "overallDensity": 56,
        "totalAttendance": 58420,
        "aiAnalysis": ai_analysis
    }

@app.post("/api/transport")
def transport_assistant(params: Dict[str, Any] = Body(...)):
    # Simulate live transport hubs
    hubs = [
        {"type": "Metro", "line": "Red Line (Stadium East)", "waitMin": 8, "congestion": "High", "eta": 15},
        {"type": "Bus", "line": "Shuttle 206 (North Plaza)", "waitMin": 4, "congestion": "Medium", "eta": 20},
        {"type": "Taxi/RideShare", "line": "Uber/Lyft Hub West", "waitMin": 15, "congestion": "Critical", "eta": 25},
        {"type": "Walking Path", "line": "Pedestrian Green Route", "waitMin": 0, "congestion": "Low", "eta": 35}
    ]
    return {"hubs": hubs}

@app.post("/api/incident")
def create_incident(req: IncidentRequest):
    prompt = (
        f"Generate a professional incident report for World Cup Stadium Security.\n"
        f"Location: {req.location}\n"
        f"Type: {req.type}\n"
        f"Description: {req.description}"
    )
    report = get_gemini_response(prompt, "incident")
    return {"report": report, "priority": "High" if "emergency" in req.description.lower() or "fire" in req.description.lower() else "Medium"}

@app.get("/api/daily-briefing")
def daily_briefing():
    prompt = "Generate a daily briefing for stadium operations coordinator for FIFA World Cup 2026 today."
    briefing = get_gemini_response(prompt, "briefing")
    return {"briefing": briefing}

@app.get("/api/sustainability")
def sustainability():
    metrics = {
        "wasteCollectedKg": 4120,
        "waterConsumptionLiters": 124000,
        "electricityKwh": 8450,
        "carbonEmissionsKg": 3200,
        "sustainabilityScore": 88
    }
    prompt = f"Analyze these sustainability metrics and suggest how to improve: {metrics}"
    ai_suggestions = get_gemini_response(prompt, "sustainability")
    return {
        "metrics": metrics,
        "aiSuggestions": ai_suggestions
    }

@app.post("/api/lost-found")
def lost_found(req: LostFoundRequest):
    prompt = f"Find matches for lost item described as: {req.description}"
    matches = get_gemini_response(prompt, "lost_found")
    return {"matches": matches}

@app.post("/api/emergency")
def emergency_trigger(req: EmergencyModeRequest):
    return {
        "activated": req.active,
        "evacuationPlan": (
            f"ALERT: EVACUATION ORDER ACTIVATED FOR {req.triggerLocation.upper()}.\n\n"
            f"1. Nearest Exits: East Gates 4 and 5.\n"
            f"2. Evacuation Routes: Exit Gate 4 leads to Metro Plaza Safe Zone. Exit Gate 5 leads to Parking Lot B Safe Zone.\n"
            f"3. Accessiblity: Wheelchair ramps at Gate 4 are clear. Elevators in Sector B are reserved for rescue operations."
        ),
        "notificationSentCount": 14205
    }

@app.get("/api/match-info")
def match_info():
    # Return matches and timeline
    return {
        "upcoming": [
            {"teams": "USA vs England", "time": "18:00", "venue": "MetLife Stadium", "status": "Live"},
            {"teams": "Mexico vs Argentina", "time": "21:00", "venue": "Estadio Azteca", "status": "Scheduled"}
        ],
        "liveCommentary": [
            {"time": "88'", "event": "Goal! USA equalizes through Christian Pulisic with a brilliant header. 1-1!"},
            {"time": "82'", "event": "Yellow card for Declan Rice (England) after a late challenge."},
            {"time": "75'", "event": "Substitutions for both sides. Crowd is electric."}
        ]
    }
