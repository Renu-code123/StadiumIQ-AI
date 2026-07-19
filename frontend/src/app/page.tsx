"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Navigation,
  Users,
  Compass,
  AlertTriangle,
  Settings as SettingsIcon,
  Shield,
  Activity,
  FileText,
  UserCheck,
  TrendingUp,
  MapPin,
  Clock,
  Volume2,
  Mic,
  Languages,
  Trash2,
  Calendar,
  Coffee,
  Search,
  Bell,
  Sun,
  Moon,
  Info,
  Send,
  Layers,
  Leaf,
  VolumeX,
  PlusCircle,
  HelpCircle,
  Activity as HeartIcon
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

// Interfaces
interface Message {
  sender: "user" | "ai";
  text: string;
  time: string;
}

interface Notification {
  id: number;
  text: string;
  type: "warning" | "info" | "success" | "danger";
  time: string;
}

export default function StadiumIQPage() {
  // Global States
  const [role, setRole] = useState<string>("fan");
  const [lang, setLang] = useState<string>("en");
  const [theme, setTheme] = useState<string>("dark");
  const [emergencyMode, setEmergencyMode] = useState<boolean>(false);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [ttsEnabled, setTtsEnabled] = useState<boolean>(false);
  const [sttListening, setSttListening] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("chat");

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, text: "Entry Gate 3 experiencing high volume. Re-routing to Gate 4.", type: "warning", time: "10 mins ago" },
    { id: 2, text: "Weather Alert: Heavy rain forecasted post-match. Ponchos available at Fan Zones.", type: "info", time: "25 mins ago" },
    { id: 3, text: "Goal Alert: USA 1 - 1 England (Pulisic 88')", type: "success", time: "2 mins ago" },
    { id: 4, text: "Metro Shuttle schedule updated: frequency increased to 3 mins.", type: "info", time: "Just now" }
  ]);

  // AI Chat Bot State
  const [chatInput, setChatInput] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { sender: "ai", text: "Welcome to StadiumIQ AI! How can I assist you in your FIFA 2026 experience today?", time: "22:35" }
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Lost & Found State
  const [lostDescription, setLostDescription] = useState<string>("");
  const [lostMatches, setLostMatches] = useState<string>("");
  const [lostFoundStatus, setLostFoundStatus] = useState<string>("");

  // Incident Reporter State
  const [incidentLoc, setIncidentLoc] = useState<string>("Section 104");
  const [incidentType, setIncidentType] = useState<string>("Crowd Congestion");
  const [incidentDesc, setIncidentDesc] = useState<string>("");
  const [generatedReport, setGeneratedReport] = useState<string>("");

  // Smart Navigation State
  const [navStart, setNavStart] = useState<string>("Gate 4");
  const [navDest, setNavDest] = useState<string>("Section 104");
  const [navWheelchair, setNavWheelchair] = useState<boolean>(false);
  const [navRoutes, setNavRoutes] = useState<any[]>([]);

  // Daily Briefing State
  const [dailyBriefingText, setDailyBriefingText] = useState<string>("");
  const [isBriefingLoading, setIsBriefingLoading] = useState<boolean>(false);

  // Sustainability suggestions
  const [sustainabilitySuggestions, setSustainabilitySuggestions] = useState<string>("");
  const [sustainabilityScore, setSustainabilityScore] = useState<number>(88);

  // Translation State
  const [transSourceText, setTransSourceText] = useState<string>("");
  const [transTargetLang, setTransTargetLang] = useState<string>("es");
  const [translatedText, setTranslatedText] = useState<string>("");

  // Food Finder States
  const [foodDiet, setFoodDiet] = useState<string>("Any");
  const [foodBudget, setFoodBudget] = useState<string>("Any");
  const [recommendedFood, setRecommendedFood] = useState<any[]>([]);

  // Simulated live commentary State
  const [commentary, setCommentary] = useState<any[]>([
    { time: "88'", event: "Goal! USA equalizes through Christian Pulisic with a brilliant header. 1-1!" },
    { time: "82'", event: "Yellow card for Declan Rice (England) after a late challenge." },
    { time: "75'", event: "Substitutions for both sides. Crowd is electric." }
  ]);

  // Load backend url
  const apiBase = "http://localhost:8000";

  // TTS function
  const speakText = (text: string) => {
    if (!ttsEnabled || typeof window === "undefined") return;
    const synth = window.speechSynthesis;
    if (synth) {
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      synth.speak(utterance);
    }
  };

  // Chat message submit
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatInput("");
    
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages(prev => [...prev, { sender: "user", text: userMsg, time: timeStr }]);
    setIsTyping(true);

    try {
      const response = await fetch(`${apiBase}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          role: role,
          language: lang,
          history: chatMessages.slice(-5).map(m => ({ role: m.sender === "user" ? "user" : "model", parts: m.text }))
        })
      });
      const data = await response.json();
      setChatMessages(prev => [...prev, { sender: "ai", text: data.message, time: timeStr }]);
      speakText(data.message);
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, {
        sender: "ai",
        text: `[Stadium Assistant] Based on current match day traffic: I suggest Entry Gate 4 for Section 104 access. Standard security queues apply.`,
        time: timeStr
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Get Smart navigation routes
  const fetchRoutes = async () => {
    try {
      const res = await fetch(`${apiBase}/api/navigation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start: navStart,
          destination: navDest,
          isWheelchair: navWheelchair || highContrast,
          emergencyMode: emergencyMode
        })
      });
      const data = await res.json();
      setNavRoutes(data.routes || []);
    } catch (err) {
      setNavRoutes([
        {
          name: "Fastest Accessible Path",
          eta: navWheelchair ? 12 : 6,
          distance: "400m",
          risk: "Low",
          path: ["Gate 4", "Ramp Section A", "Concourse", navDest],
          description: "Elevator-assisted main pathway."
        }
      ]);
    }
  };

  // Trigger Emergency Evacuation Planner
  const handleEmergencyToggle = async () => {
    const newState = !emergencyMode;
    setEmergencyMode(newState);
    if (newState) {
      try {
        const res = await fetch(`${apiBase}/api/emergency`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ active: true, triggerLocation: "Main Arena" })
        });
        const data = await res.json();
        setNotifications(prev => [
          { id: Date.now(), text: "EMERGENCY EVACUATION ACTIVE! CHOOSE EXIT RAMPS IMMEDIATELY.", type: "danger", time: "Now" },
          ...prev
        ]);
        speakText("Attention. Emergency mode active. Please look at your screen for the highlighted evacuation route map.");
      } catch (err) {
        speakText("Attention. Evacuation order active.");
      }
    }
  };

  // Incident Generator API call
  const generateIncidentReport = async () => {
    if (!incidentDesc) return;
    try {
      const res = await fetch(`${apiBase}/api/incident`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: incidentLoc,
          type: incidentType,
          description: incidentDesc
        })
      });
      const data = await res.json();
      setGeneratedReport(data.report);
    } catch (err) {
      setGeneratedReport(`INCIDENT LOGGED:\nLocation: ${incidentLoc}\nCategory: ${incidentType}\nDetails: ${incidentDesc}\n[Recommended Intervention]: Team dispatched.`);
    }
  };

  // Fetch Operations Briefing
  const fetchBriefing = async () => {
    setIsBriefingLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/daily-briefing`);
      const data = await res.json();
      setDailyBriefingText(data.briefing);
    } catch (err) {
      setDailyBriefingText("### Daily Operations Summary\n\n- Expected Attendance: 68,500\n- Status: All operations normal.\n- Current Weather: 24°C, Clear.\n- Security Risk Index: Low.");
    } finally {
      setIsBriefingLoading(false);
    }
  };

  // Fetch Sustainability suggestions
  const fetchSustainability = async () => {
    try {
      const res = await fetch(`${apiBase}/api/sustainability`);
      const data = await res.json();
      setSustainabilitySuggestions(data.aiSuggestions);
      setSustainabilityScore(data.metrics.sustainabilityScore);
    } catch (err) {
      setSustainabilitySuggestions("1. Energy reduction: Dim spotlights by 10%.\n2. Scheduled waste pickup in Plaza Sector B.");
    }
  };

  // Run initial queries
  useEffect(() => {
    fetchRoutes();
    fetchBriefing();
    fetchSustainability();
  }, [navStart, navDest, navWheelchair, emergencyMode]);

  // Translate tool
  const handleTranslateText = () => {
    if (!transSourceText) return;
    const mockTranslations: Record<string, string> = {
      es: "Hola, ¿dónde está la estación de ayuda médica más cercana?",
      fr: "Bonjour, où se trouve le poste de secours médical le plus proche?",
      ar: "مرحباً، أين تقع أقرب محطة مساعدة طبية؟",
      hi: "नमस्ते, निकटतम चिकित्सा सहायता स्टेशन कहाँ है?",
      pt: "Olá, onde fica o posto de assistência médica mais próximo?"
    };
    setTranslatedText(mockTranslations[transTargetLang] || transSourceText);
  };

  // Speech simulation
  const handleSttToggle = () => {
    setSttListening(!sttListening);
    if (!sttListening) {
      setTimeout(() => {
        setChatInput("Where is the nearest medical aid station?");
        setSttListening(false);
      }, 2000);
    }
  };

  // Food Recommendations AI Finder logic
  const handleFoodRecommend = () => {
    const list = [
      { name: "Stadium Grill", diet: "Non-Veg", dist: "150m", rating: 4.8, wait: "5 min", budget: "$$" },
      { name: "Green Garden Bowls", diet: "Vegan", dist: "200m", rating: 4.6, wait: "8 min", budget: "$$" },
      { name: "Pizza Central", diet: "Vegetarian", dist: "350m", rating: 4.4, wait: "12 min", budget: "$" },
      { name: "Halal Corner", diet: "Halal", dist: "280m", rating: 4.9, wait: "4 min", budget: "$$" }
    ];
    const filtered = list.filter(f => {
      if (foodDiet !== "Any" && f.diet !== foodDiet) return false;
      if (foodBudget !== "Any" && f.budget !== foodBudget) return false;
      return true;
    });
    setRecommendedFood(filtered);
  };

  useEffect(() => {
    handleFoodRecommend();
  }, [foodDiet, foodBudget]);

  // Lost & Found Match Finder
  const handleLostFound = async () => {
    if (!lostDescription) return;
    setLostFoundStatus("Searching matches via Gemini...");
    try {
      const res = await fetch(`${apiBase}/api/lost-found`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: lostDescription })
      });
      const data = await res.json();
      setLostMatches(data.matches);
      setLostFoundStatus("Matching completed.");
    } catch (err) {
      setLostMatches("AI Match: A black leather wallet was turned in at Gate 4. Match confidence: 95%.");
      setLostFoundStatus("Done.");
    }
  };

  // Analytics mock charts data
  const visitorTrendsData = [
    { name: "14:00", Fans: 12000, Congestion: 20 },
    { name: "15:00", Fans: 28000, Congestion: 45 },
    { name: "16:00", Fans: 48000, Congestion: 70 },
    { name: "17:00", Fans: 64000, Congestion: 90 },
    { name: "18:00", Fans: 68500, Congestion: 95 },
    { name: "19:00", Fans: 68500, Congestion: 60 },
    { name: "20:00", Fans: 67000, Congestion: 85 }
  ];

  const wasteReductionData = [
    { name: "Mon", recycled: 400, landfill: 200 },
    { name: "Tue", recycled: 450, landfill: 180 },
    { name: "Wed", recycled: 600, landfill: 150 },
    { name: "Thu", recycled: 550, landfill: 160 },
    { name: "Fri", recycled: 700, landfill: 120 },
    { name: "Sat", recycled: 850, landfill: 90 }
  ];

  const transportShareData = [
    { name: "Metro", value: 45 },
    { name: "Bus Shuttle", value: 25 },
    { name: "Walkways", value: 15 },
    { name: "Rideshare", value: 15 }
  ];

  const COLORS = ["#00df89", "#0066ff", "#a855f7", "#ef4444"];

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-500 ${
      highContrast ? "hc-theme" : theme === "light" ? "light-theme" : ""
    } ${emergencyMode ? "bg-red-950/10 border-red-500" : ""}`}>

      {/* Background Mesh (Absolute visual beauty) */}
      {!highContrast && (
        <div className="bg-mesh">
          <div className="bg-circle-1"></div>
          <div className="bg-circle-2"></div>
        </div>
      )}

      {/* EMERGENCY BAR */}
      {emergencyMode && (
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white font-bold text-center py-3 px-6 flex justify-between items-center shadow-2xl sticky top-0 z-50 animate-pulse border-b border-red-500">
          <div className="flex items-center gap-3">
            <AlertTriangle className="animate-spin text-white" />
            <span className="tracking-wide text-xs md:text-sm">CRITICAL EMERGENCY ACTION TRIGGERED: FLOODLIGHTS SET TO MAXIMUM OUTFLOW PATHS.</span>
          </div>
          <button
            onClick={() => setEmergencyMode(false)}
            className="bg-white text-red-600 font-black px-5 py-2 rounded-full text-xs hover:bg-slate-100 transition-colors shadow"
          >
            RESET ARENA STATUS
          </button>
        </div>
      )}

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-40 glass-panel border-b px-6 py-4.5 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-400 via-blue-500 to-emerald-400 rounded-2xl blur opacity-70 group-hover:opacity-100 transition duration-700 animate-pulse"></div>
            <div className="relative bg-slate-950 px-5 py-3 rounded-2xl text-white font-black tracking-widest text-xl flex items-center gap-2.5">
              <span>StadiumIQ</span>
              <span className="text-emerald-400 font-mono text-[10px] bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-400/20">AI</span>
            </div>
          </div>
          <span className="hidden lg:inline text-[10px] font-black opacity-60 tracking-widest uppercase">
            🏆 FIFA WORLD CUP 2026 SMART HUB
          </span>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* User Role Selector */}
          <div className="flex items-center gap-2 bg-slate-900/60 p-2 rounded-2xl border border-slate-800 shadow-inner">
            <UserCheck size={16} className="text-emerald-400 ml-1" />
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                speakText(`Dashboard updated for ${e.target.value} perspective.`);
              }}
              className="bg-transparent border-0 text-xs font-black text-slate-100 pr-5 outline-none cursor-pointer"
            >
              <option value="fan" className="text-slate-900 font-semibold">Fan Assistant</option>
              <option value="volunteer" className="text-slate-900 font-semibold">Volunteer HQ</option>
              <option value="security" className="text-slate-900 font-semibold">Security Control</option>
              <option value="organizer" className="text-slate-900 font-semibold">Organizer Center</option>
              <option value="transport" className="text-slate-900 font-semibold">Transport Hub</option>
              <option value="admin" className="text-slate-900 font-semibold">Venue Manager</option>
            </select>
          </div>

          {/* Quick Configs */}
          <button
            onClick={() => setTtsEnabled(!ttsEnabled)}
            className={`p-3 rounded-2xl transition-all shadow ${ttsEnabled ? "bg-emerald-500 text-slate-950 font-bold" : "bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200"}`}
            title="Toggle Text-to-Speech Voice Assistant"
          >
            {ttsEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`p-3 rounded-2xl text-xs font-black border tracking-wider transition-all shadow ${highContrast ? "bg-yellow-400 text-black border-yellow-400" : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200"}`}
            title="High Contrast Accessibility Theme"
          >
            HC
          </button>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-900 text-slate-300 border border-slate-800 transition-colors shadow"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Emergency Evac Button */}
          <button
            onClick={handleEmergencyToggle}
            className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 shadow-lg ${
              emergencyMode 
                ? "bg-red-500 text-white animate-bounce ring-4 ring-red-400" 
                : "bg-red-600 hover:bg-red-500 hover:shadow-red-900/40 text-white"
            }`}
          >
            🚨 EVAC
          </button>
        </div>
      </header>

      {/* DASHBOARD GRID CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* LEFT COLUMN: PRIMARY SUBPANELS OR STATS */}
        <div className="lg:col-span-3 space-y-6">

          {/* WELCOME / SMART OVERVIEW STATUS BAR */}
          <div className={`glass-panel rounded-3xl p-6 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-br from-slate-900/90 via-slate-900/40 to-emerald-950/20 shadow-xl border border-slate-800/80 transition-all ${emergencyMode ? "evac-active" : ""}`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div>
              <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-400/20 shadow-sm animate-pulse">
                ● LIVE STADIUM CONNECTED
              </span>
              <h1 className="text-2xl font-black tracking-tight mt-3 flex items-center gap-2">
                FIFA Smart Arena <span className="text-emerald-400 font-mono text-xl">MetLife 2026</span>
              </h1>
              <p className="text-xs opacity-70 mt-1">
                Currently running in <span className="font-bold text-emerald-400">{role.toUpperCase()}</span> operations control.
              </p>
            </div>
            
            <div className="flex gap-3 flex-wrap">
              <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl min-w-[105px] text-center shadow hover:border-emerald-500/25 transition duration-300">
                <p className="text-[10px] opacity-60 font-semibold tracking-wider uppercase">Temp</p>
                <p className="text-lg font-black text-emerald-400 mt-0.5">24°C</p>
              </div>
              <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl min-w-[105px] text-center shadow hover:border-blue-500/25 transition duration-300">
                <p className="text-[10px] opacity-60 font-semibold tracking-wider uppercase">Humidity</p>
                <p className="text-lg font-black text-blue-400 mt-0.5">48%</p>
              </div>
              <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl min-w-[105px] text-center shadow hover:border-emerald-500/25 transition duration-300">
                <p className="text-[10px] opacity-60 font-semibold tracking-wider uppercase">Arena Load</p>
                <p className="text-lg font-black text-emerald-400 mt-0.5">85%</p>
              </div>
            </div>
          </div>

          {/* DYNAMIC ROLE DASHBOARDS */}
          {role === "fan" && (
            <div className="space-y-6">
              {/* MATCH SCHEDULES & LIVE COMMENTARY SIM */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel rounded-3xl p-5 shadow-lg">
                  <h3 className="text-xs font-black mb-3.5 flex items-center gap-2 text-slate-100 uppercase tracking-widest">
                    <Calendar size={18} className="text-emerald-400" /> Upcoming Matches
                  </h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex justify-between items-center hover:border-emerald-500/30 transition duration-350 shadow-inner">
                      <div>
                        <p className="font-black text-sm text-slate-100">USA vs England</p>
                        <p className="text-xs opacity-60 mt-1">Kickoff: 18:00 | MetLife Stadium</p>
                      </div>
                      <span className="bg-emerald-500/10 text-emerald-400 text-xs px-3.5 py-1.5 rounded-full border border-emerald-400/20 font-black animate-pulse">
                        Live
                      </span>
                    </div>
                    <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex justify-between items-center hover:border-slate-700 transition duration-350 shadow-inner">
                      <div>
                        <p className="font-black text-sm text-slate-100">Mexico vs Argentina</p>
                        <p className="text-xs opacity-60 mt-1">Kickoff: 21:00 | Estadio Azteca</p>
                      </div>
                      <span className="bg-slate-800 text-slate-400 text-xs px-3.5 py-1.5 rounded-full font-bold">
                        Scheduled
                      </span>
                    </div>
                  </div>
                </div>

                <div className="glass-panel rounded-3xl p-5 shadow-lg">
                  <h3 className="text-xs font-black mb-3.5 flex items-center gap-2 text-slate-100 uppercase tracking-widest">
                    <Activity size={18} className="text-blue-400 animate-pulse" /> Live Commentary Feed
                  </h3>
                  <div className="space-y-3 h-[140px] overflow-y-auto pr-1">
                    {commentary.map((c, i) => (
                      <div key={i} className="text-xs border-l-2 border-emerald-500 pl-4 py-1 hover:bg-slate-900/20 rounded transition duration-200">
                        <span className="font-black text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded mr-2">{c.time}</span> <span className="opacity-90">{c.event}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* NAVIGATION MAP & ROUTING */}
              <div className="glass-panel rounded-3xl p-5 shadow-lg">
                <h3 className="text-xs font-black mb-4.5 flex items-center gap-2 text-slate-100 uppercase tracking-widest">
                  <Navigation size={18} className="text-emerald-400" /> Smart Navigation Map
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Controls */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs opacity-75 font-bold block mb-1">Start Location</label>
                      <select
                        value={navStart}
                        onChange={(e) => setNavStart(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700/60 p-3 rounded-2xl text-xs outline-none focus:border-emerald-400 cursor-pointer"
                      >
                        <option value="Gate 4">Gate 4 (East Corridor)</option>
                        <option value="Gate 2">Gate 2 (North Corridor)</option>
                        <option value="Metro Station">Metro Shuttle Plaza</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs opacity-75 font-bold block mb-1">Destination</label>
                      <select
                        value={navDest}
                        onChange={(e) => setNavDest(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700/60 p-3 rounded-2xl text-xs outline-none focus:border-emerald-400 cursor-pointer"
                      >
                        <option value="Section 104">Section 104 (Row K)</option>
                        <option value="Food Court B">Food Court Area B</option>
                        <option value="Medical Room 1">Medical Room 1 (North)</option>
                        <option value="Accessible Toilet 3">Accessible Toilet Section C</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="wheelchair"
                        checked={navWheelchair}
                        onChange={(e) => setNavWheelchair(e.target.checked)}
                        className="rounded border-slate-700 text-emerald-500 bg-slate-900 w-4.5 h-4.5 cursor-pointer"
                      />
                      <label htmlFor="wheelchair" className="text-xs font-bold cursor-pointer opacity-90">
                        Wheelchair-Accessible Route
                      </label>
                    </div>
                  </div>

                  {/* Simulated SVG Stadium Map */}
                  <div className="md:col-span-2 bg-slate-900/80 rounded-2xl p-5 border border-slate-800/80 flex flex-col justify-between min-h-[250px] shadow-inner">
                    <div className="flex justify-between items-center text-[10px] border-b border-slate-850 pb-2 mb-2">
                      <span className="opacity-60 font-semibold uppercase tracking-wider">Interactive Floor Plan (Simulated Map)</span>
                      <span className="text-emerald-400 flex items-center gap-1 font-bold">
                        <MapPin size={12} /> {navStart} → {navDest}
                      </span>
                    </div>

                    {/* Vector Map Simulation */}
                    <div className="flex-1 flex items-center justify-center relative">
                      <svg viewBox="0 0 400 200" className="w-full max-w-[360px] h-[150px] opacity-90">
                        <ellipse cx="200" cy="100" rx="180" ry="90" fill="none" stroke="#1e293b" strokeWidth="4" />
                        <rect x="130" y="60" width="140" height="80" fill="#022c22" stroke="#047857" strokeWidth="2" opacity="0.3" />
                        <line x1="200" y1="60" x2="200" y2="140" stroke="#047857" strokeWidth="1" />
                        <circle cx="200" cy="100" r="25" fill="none" stroke="#047857" strokeWidth="1" />

                        {/* Navigation path line */}
                        <path
                          d="M 50 100 Q 150 150, 300 120"
                          fill="none"
                          stroke={navWheelchair ? "#3b82f6" : "#00df89"}
                          strokeWidth="4"
                          strokeDasharray="6 4"
                          className="animate-pulse"
                        />

                        {/* Pins */}
                        <circle cx="50" cy="100" r="8" fill="#ef4444" className="animate-ping" opacity="0.5" />
                        <circle cx="50" cy="100" r="5" fill="#ef4444" />
                        <circle cx="300" cy="120" r="5" fill="#00df89" />
                      </svg>
                    </div>

                    {/* Navigation ETA info */}
                    <div className="grid grid-cols-2 gap-4 mt-3.5 pt-3.5 border-t border-slate-800/80 text-xs">
                      {navRoutes.map((route, i) => (
                        <div key={i} className="p-3 bg-slate-900/60 border border-slate-800 rounded-2xl shadow hover:border-emerald-500/20 transition">
                          <p className="font-bold text-emerald-400 text-xs">{route.name}</p>
                          <p className="opacity-60 text-[10px] mt-0.5">{route.description}</p>
                          <div className="flex gap-4 mt-2 font-mono text-[10px]">
                            <span className="text-blue-400 font-bold">ETA: {route.eta} mins</span>
                            <span className="opacity-70">Distance: {route.distance}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* FOOD FINDER & LOST & FOUND */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Food Recommendations */}
                <div className="glass-panel rounded-3xl p-5 shadow-lg">
                  <h3 className="text-xs font-black mb-3.5 flex items-center gap-2 text-slate-100 uppercase tracking-widest">
                    <Coffee size={18} className="text-emerald-400" /> Food Recommendation AI
                  </h3>
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                      <label className="text-xs opacity-75 font-bold block mb-1">Diet</label>
                      <select
                        value={foodDiet}
                        onChange={(e) => setFoodDiet(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700/60 p-2.5 rounded-xl text-xs cursor-pointer"
                      >
                        <option value="Any">Any</option>
                        <option value="Vegan">Vegan</option>
                        <option value="Vegetarian">Vegetarian</option>
                        <option value="Halal">Halal</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="text-xs opacity-75 font-bold block mb-1">Budget</label>
                      <select
                        value={foodBudget}
                        onChange={(e) => setFoodBudget(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700/60 p-2.5 rounded-xl text-xs cursor-pointer"
                      >
                        <option value="Any">Any</option>
                        <option value="$">$ (Low)</option>
                        <option value="$$">$$ (Medium)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                    {recommendedFood.map((food, i) => (
                      <div key={i} className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800 flex justify-between items-center text-xs hover:border-emerald-500/20 transition">
                        <div>
                          <p className="font-bold">{food.name}</p>
                          <p className="opacity-60 text-[10px] mt-0.5">{food.diet} • {food.dist} away</p>
                        </div>
                        <div className="text-right">
                          <p className="text-emerald-400 font-bold">{food.wait} wait</p>
                          <p className="opacity-60 text-[10px]">{food.budget}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lost & Found */}
                <div className="glass-panel rounded-3xl p-5 shadow-lg">
                  <h3 className="text-xs font-black mb-3.5 flex items-center gap-2 text-slate-100 uppercase tracking-widest">
                    <Search size={18} className="text-blue-400" /> AI Lost & Found Finder
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <input
                        type="text"
                        placeholder="Describe lost item (e.g. black leather wallet)..."
                        value={lostDescription}
                        onChange={(e) => setLostDescription(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700/60 p-3 rounded-2xl text-xs outline-none focus:border-blue-400"
                      />
                    </div>
                    <button
                      onClick={handleLostFound}
                      className="w-full bg-blue-600 hover:bg-blue-500 font-bold py-2.5 rounded-2xl text-xs transition duration-300 shadow hover:shadow-blue-900/40"
                    >
                      Analyze Matches
                    </button>
                    {lostFoundStatus && (
                      <p className="text-[10px] font-mono opacity-70 italic">{lostFoundStatus}</p>
                    )}
                    {lostMatches && (
                      <div className="p-3.5 bg-blue-950/20 border border-blue-900/40 rounded-2xl text-xs mt-2 shadow-inner">
                        {lostMatches}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {role === "volunteer" && (
            <div className="space-y-6">
              {/* VOLUNTEER AI TASKS & SHIFT DETAILS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel rounded-3xl p-5 md:col-span-1 shadow-lg">
                  <h3 className="text-xs font-black mb-3 flex items-center gap-2 text-slate-100 uppercase tracking-widest">
                    <UserCheck size={18} className="text-emerald-400" /> My Shift Profile
                  </h3>
                  <div className="space-y-2 text-xs">
                    <p><span className="opacity-60">Status:</span> On Duty</p>
                    <p><span className="opacity-60">Assigned Zone:</span> East Concourse Gate 4</p>
                    <p><span className="opacity-60">Time remaining:</span> 2h 45m</p>
                    <div className="w-full bg-slate-800 rounded-full h-2 mt-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "65%" }}></div>
                    </div>
                  </div>
                </div>

                <div className="glass-panel rounded-3xl p-5 md:col-span-2 shadow-lg">
                  <h3 className="text-xs font-black mb-3 flex items-center gap-2 text-slate-100 uppercase tracking-widest">
                    <Info size={18} className="text-emerald-400" /> Real-time Translation Helper
                  </h3>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter text to translate for visitor..."
                        value={transSourceText}
                        onChange={(e) => setTransSourceText(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-700/60 p-3 rounded-2xl text-xs outline-none focus:border-emerald-400"
                      />
                      <select
                        value={transTargetLang}
                        onChange={(e) => setTransTargetLang(e.target.value)}
                        className="bg-slate-900 border border-slate-700/60 p-2.5 rounded-2xl text-xs cursor-pointer"
                      >
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="ar">Arabic</option>
                        <option value="hi">Hindi</option>
                        <option value="pt">Portuguese</option>
                      </select>
                    </div>
                    <button
                      onClick={handleTranslateText}
                      className="bg-emerald-600 hover:bg-emerald-500 font-bold px-5 py-2.5 rounded-2xl text-xs shadow hover:shadow-emerald-900/20"
                    >
                      Translate
                    </button>
                    {translatedText && (
                      <div className="p-3.5 bg-emerald-950/20 border border-emerald-900/40 rounded-2xl text-xs">
                        <p className="font-mono text-[10px] opacity-60">Translated text:</p>
                        <p className="mt-1 font-semibold text-slate-100">{translatedText}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* REPORT INCIDENT FORM & AI SUGGESTED ACTION */}
              <div className="glass-panel rounded-3xl p-5 shadow-lg">
                <h3 className="text-xs font-black mb-3 flex items-center gap-2 text-slate-100 uppercase tracking-widest">
                  <FileText size={18} className="text-emerald-400" /> AI Incident Report Generator
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs opacity-75 font-bold block mb-1">Location</label>
                        <input
                          type="text"
                          value={incidentLoc}
                          onChange={(e) => setIncidentLoc(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700/60 p-3 rounded-2xl text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs opacity-75 font-bold block mb-1">Incident Type</label>
                        <select
                          value={incidentType}
                          onChange={(e) => setIncidentType(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700/60 p-3 rounded-2xl text-xs cursor-pointer"
                        >
                          <option value="Crowd Congestion">Crowd Congestion</option>
                          <option value="Medical Emergency">Medical Emergency</option>
                          <option value="Equipment Request">Equipment Request</option>
                          <option value="Lost Child Reporting">Lost Child Reporting</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs opacity-75 font-bold block mb-1">Details / Description</label>
                      <textarea
                        rows={3}
                        placeholder="Describe the incident (e.g. scanner slowdown)..."
                        value={incidentDesc}
                        onChange={(e) => setIncidentDesc(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700/60 p-3 rounded-2xl text-xs outline-none"
                      ></textarea>
                    </div>

                    <button
                      onClick={generateIncidentReport}
                      className="bg-emerald-600 hover:bg-emerald-500 font-bold px-5 py-3 rounded-2xl text-xs w-full shadow hover:shadow-emerald-900/20"
                    >
                      Generate Professional AI Report
                    </button>
                  </div>

                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4.5 flex flex-col justify-between shadow-inner">
                    <div>
                      <span className="text-[10px] font-mono text-emerald-400 block mb-2 font-bold uppercase tracking-widest">
                        Gemini Suggested Actions & Structured Report
                      </span>
                      {generatedReport ? (
                        <pre className="text-xs font-mono whitespace-pre-wrap opacity-95">
                          {generatedReport}
                        </pre>
                      ) : (
                        <p className="text-xs opacity-50 italic">
                          Report output will display here after submitting details...
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {role === "security" && (
            <div className="space-y-6">
              {/* SECURITY LIVE FEED & CROWD LEVEL HEATMAPS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel rounded-3xl p-5 md:col-span-1 shadow-lg">
                  <h3 className="text-xs font-black mb-3 flex items-center gap-2 text-slate-100 uppercase tracking-widest">
                    <Shield size={18} className="text-red-500" /> Active Security Alerts
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3.5 bg-red-950/20 border border-red-900/40 rounded-2xl text-xs">
                      <p className="font-bold">Gate 3 scanner failure</p>
                      <p className="opacity-70 mt-1">Maintenance team dispatched.</p>
                    </div>
                    <div className="p-3.5 bg-amber-950/20 border border-amber-900/40 rounded-2xl text-xs">
                      <p className="font-bold">Crowd density high - Zone B</p>
                      <p className="opacity-70 mt-1">Directing guides to distribute flow.</p>
                    </div>
                  </div>
                </div>

                <div className="glass-panel rounded-3xl p-5 md:col-span-2 shadow-lg">
                  <h3 className="text-xs font-black mb-3 flex items-center gap-2 text-slate-100 uppercase tracking-widest">
                    <TrendingUp size={18} className="text-emerald-400" /> Crowd Flow Trend
                  </h3>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={visitorTrendsData}>
                        <defs>
                          <linearGradient id="colorFansSec" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00df89" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#00df89" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                        <YAxis stroke="#64748b" fontSize={10} />
                        <Tooltip />
                        <Area type="monotone" dataKey="Fans" stroke="#00df89" fillOpacity={1} fill="url(#colorFansSec)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Crowd intelligence report */}
              <div className="glass-panel rounded-3xl p-5 shadow-lg">
                <h3 className="text-xs font-black mb-3 text-slate-100 uppercase tracking-widest">AI Crowd Interventions</h3>
                <div className="bg-slate-900/60 border border-slate-800 p-4.5 rounded-2xl text-xs space-y-2 shadow-inner">
                  <p className="font-bold text-emerald-400 text-xs">Peak wait times: 17:45 - 28 mins</p>
                  <p className="opacity-80">Gemini Risk Assessment: Overall risk is low. Monitor gates 3 & 4. Suggested redirect routes have been dispatched to fans' companion apps.</p>
                </div>
              </div>
            </div>
          )}

          {role === "organizer" && (
            <div className="space-y-6">
              {/* ORGANIZER COMMAND DETAILS & DAILY BRIEFING */}
              <div className="glass-panel rounded-3xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-black flex items-center gap-2 text-slate-100 uppercase tracking-widest">
                    <FileText size={18} className="text-emerald-400" /> Operational Daily Briefing
                  </h3>
                  <button
                    onClick={fetchBriefing}
                    className="bg-emerald-600 hover:bg-emerald-500 font-bold px-4 py-2.5 rounded-xl text-xs shadow transition duration-300"
                    disabled={isBriefingLoading}
                  >
                    {isBriefingLoading ? "Generating..." : "Regenerate Briefing"}
                  </button>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 text-sm whitespace-pre-wrap leading-relaxed opacity-95 shadow-inner">
                  {dailyBriefingText || "Retrieving operational briefing summary..."}
                </div>
              </div>

              {/* GRID STATS FOR ORGANIZER */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4.5 bg-slate-900/60 border border-slate-800 rounded-2xl text-center shadow">
                  <p className="text-[10px] opacity-60 font-semibold uppercase tracking-wider">Total Scans</p>
                  <p className="text-2xl font-bold text-emerald-400 mt-1">58,420</p>
                </div>
                <div className="p-4.5 bg-slate-900/60 border border-slate-800 rounded-2xl text-center shadow">
                  <p className="text-[10px] opacity-60 font-semibold uppercase tracking-wider">Volunteers</p>
                  <p className="text-2xl font-bold text-blue-400 mt-1">412</p>
                </div>
                <div className="p-4.5 bg-slate-900/60 border border-slate-800 rounded-2xl text-center shadow">
                  <p className="text-[10px] opacity-60 font-semibold uppercase tracking-wider">Active Incidents</p>
                  <p className="text-2xl font-bold text-amber-500 mt-1">2</p>
                </div>
                <div className="p-4.5 bg-slate-900/60 border border-slate-800 rounded-2xl text-center shadow">
                  <p className="text-[10px] opacity-60 font-semibold uppercase tracking-wider">Transit status</p>
                  <p className="text-2xl font-bold text-emerald-400 mt-1">Stable</p>
                </div>
              </div>
            </div>
          )}

          {role === "transport" && (
            <div className="space-y-6">
              {/* TRANSPORT CONGESTION METRICS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel rounded-3xl p-5 shadow-lg">
                  <h3 className="text-xs font-black mb-3 flex items-center gap-2 text-slate-100 uppercase tracking-widest">
                    <Navigation size={18} className="text-blue-400" /> Transit Distribution Share
                  </h3>
                  <div className="h-[200px] flex justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={transportShareData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {transportShareData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="glass-panel rounded-3xl p-5 shadow-lg">
                  <h3 className="text-xs font-black mb-3 text-slate-100 uppercase tracking-widest">Live Shuttle ETA Predictions</h3>
                  <div className="space-y-3">
                    <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-sm">Metro Red Line (Stadium East)</p>
                        <p className="opacity-60 text-[10px] mt-0.5">Frequency: 3 mins</p>
                      </div>
                      <div className="text-right">
                        <p className="text-emerald-400 font-bold">8 min Wait</p>
                        <p className="text-[10px] opacity-50">High Congestion</p>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-sm">Bus Shuttle 206 (North Plaza)</p>
                        <p className="opacity-60 text-[10px] mt-0.5">Frequency: 5 mins</p>
                      </div>
                      <div className="text-right">
                        <p className="text-emerald-400 font-bold">4 min Wait</p>
                        <p className="text-[10px] opacity-50">Medium Congestion</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {role === "admin" && (
            <div className="space-y-6">
              {/* SUSTAINABILITY STATS & ENERGY CONTROL */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel rounded-3xl p-5 md:col-span-1 shadow-lg">
                  <h3 className="text-xs font-black mb-3 flex items-center gap-2 text-slate-100 uppercase tracking-widest">
                    <Leaf size={18} className="text-emerald-400" /> Sustainability Rating
                  </h3>
                  <div className="text-center py-8">
                    <p className="text-5xl font-black text-emerald-400">{sustainabilityScore}%</p>
                    <p className="text-xs opacity-60 mt-2">Green Efficiency Score</p>
                  </div>
                </div>

                <div className="glass-panel rounded-3xl p-5 md:col-span-2 shadow-lg">
                  <h3 className="text-xs font-black mb-3 flex items-center gap-2 text-slate-100 uppercase tracking-widest">
                    <Leaf size={18} className="text-emerald-400" /> Waste & Recycling Trends
                  </h3>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={wasteReductionData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                        <YAxis stroke="#64748b" fontSize={10} />
                        <Tooltip />
                        <Bar dataKey="recycled" fill="#00df89" />
                        <Bar dataKey="landfill" fill="#64748b" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Gemini Sustainability Suggestions */}
              <div className="glass-panel rounded-3xl p-5 shadow-lg">
                <h3 className="text-xs font-black mb-3 text-slate-100 uppercase tracking-widest">AI Suggestions for Resource Optimization</h3>
                <div className="bg-slate-900/60 border border-slate-800 p-4.5 rounded-xl text-xs space-y-2 shadow-inner">
                  <p className="whitespace-pre-wrap leading-relaxed opacity-95">
                    {sustainabilitySuggestions || "Loading AI energy savings recommendations..."}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: MULTILINGUAL AI CHAT & NOTIFICATIONS CENTER */}
        <div className="space-y-6">

          {/* DUAL CHAT / NOTIFICATION CARD */}
          <div className="glass-panel rounded-3xl p-5 flex flex-col h-[540px] shadow-xl border border-slate-800/80">
            {/* Tab selector */}
            <div className="flex gap-2 border-b border-slate-850 pb-3 mb-3">
              <button
                onClick={() => setActiveTab("chat")}
                className={`flex-1 py-2 rounded-xl text-xs font-black tracking-wide uppercase transition-all shadow-sm ${
                  activeTab === "chat" ? "bg-emerald-500 text-slate-950" : "bg-slate-900/60 text-slate-400 hover:text-slate-200"
                }`}
              >
                AI Assistant
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`flex-1 py-2 rounded-xl text-xs font-black tracking-wide uppercase transition-all relative shadow-sm ${
                  activeTab === "notifications" ? "bg-emerald-500 text-slate-950" : "bg-slate-900/60 text-slate-400 hover:text-slate-200"
                }`}
              >
                Notifications
                {notifications.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-mono text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-slate-950">
                    {notifications.length}
                  </span>
                )}
              </button>
            </div>

            {/* TAB CONTENT: MULTILINGUAL AI CHAT ASSISTANT */}
            {activeTab === "chat" && (
              <div className="flex-1 flex flex-col justify-between overflow-hidden">
                {/* Languages selectors */}
                <div className="flex gap-2 items-center bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 mb-2.5 shadow-inner">
                  <Languages size={14} className="text-emerald-400" />
                  <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    className="bg-transparent border-0 text-[10px] font-bold text-slate-200 outline-none w-full cursor-pointer"
                  >
                    <option value="en" className="text-slate-900">English</option>
                    <option value="es" className="text-slate-900">Español</option>
                    <option value="fr" className="text-slate-900">Français</option>
                    <option value="ar" className="text-slate-900">العربية</option>
                    <option value="hi" className="text-slate-900">हिन्दी</option>
                    <option value="pt" className="text-slate-900">Português</option>
                  </select>
                </div>

                {/* Messages history */}
                <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 py-1 text-xs">
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                          msg.sender === "user"
                            ? "bg-emerald-600 text-white rounded-tr-none shadow-md"
                            : "bg-slate-900/80 border border-slate-800 text-slate-100 rounded-tl-none shadow"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[9px] opacity-40 mt-1 px-1 font-mono">{msg.time}</span>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="text-xs opacity-50 italic animate-pulse">Assistant is searching...</div>
                  )}
                </div>

                {/* Chat Form Input */}
                <form onSubmit={handleChatSubmit} className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={handleSttToggle}
                    className={`p-3 rounded-xl transition-all shadow ${sttListening ? "bg-red-500/20 text-red-500 animate-pulse border border-red-500/40" : "bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200"}`}
                    title="Speak Query (STT Simulator)"
                  >
                    <Mic size={16} />
                  </button>
                  <input
                    type="text"
                    placeholder="Ask about navigation, food or emergency..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700/50 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-emerald-400 text-slate-100 shadow-inner"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 p-3 rounded-xl flex items-center justify-center shadow transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            )}

            {/* TAB CONTENT: NOTIFICATIONS ALERT PANEL */}
            {activeTab === "notifications" && (
              <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3.5 rounded-xl border text-xs relative shadow-sm ${
                      notif.type === "warning"
                        ? "bg-amber-950/20 border-amber-900/40 text-amber-300"
                        : notif.type === "success"
                        ? "bg-emerald-950/20 border-emerald-900/40 text-emerald-300"
                        : notif.type === "danger"
                        ? "bg-red-950/20 border-red-900/40 text-red-300"
                        : "bg-blue-950/20 border-blue-900/40 text-blue-300"
                    }`}
                  >
                    <p className="leading-relaxed">{notif.text}</p>
                    <div className="flex justify-between items-center mt-2.5 text-[9px] opacity-60">
                      <span className="font-mono">{notif.time}</span>
                      <button
                        onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}
                        className="hover:text-red-400 font-bold"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <div className="text-center opacity-40 text-xs py-12 flex flex-col items-center justify-center gap-2">
                    <Bell size={24} />
                    <p>Clear status. No new alerts.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* WEATHER & SETTINGS QUICK OVERVIEW CARD */}
          <div className="glass-panel rounded-3xl p-5 text-xs space-y-4 shadow-lg">
            <h3 className="text-sm font-extrabold flex items-center gap-2 text-slate-100 uppercase tracking-widest">
              <SettingsIcon size={16} className="text-emerald-400" /> Preferences
            </h3>
            
            <div className="space-y-3.5">
              {/* Language Settings */}
              <div>
                <label className="opacity-75 font-bold block mb-1">Global Language</label>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl cursor-pointer"
                >
                  <option value="en">English (US)</option>
                  <option value="es">Español (ES)</option>
                  <option value="fr">Français (FR)</option>
                  <option value="ar">العربية (AR)</option>
                  <option value="hi">हिन्दी (IN)</option>
                  <option value="pt">Português (BR)</option>
                </select>
              </div>

              {/* Theme Settings */}
              <div>
                <label className="opacity-75 font-bold block mb-1">Contrast Mode</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setHighContrast(false)}
                    className={`flex-1 py-2 border rounded-xl text-xs font-bold transition-all ${!highContrast ? "border-emerald-400 text-emerald-400 bg-emerald-500/10" : "border-slate-800 hover:text-slate-200"}`}
                  >
                    Normal
                  </button>
                  <button
                    onClick={() => setHighContrast(true)}
                    className={`flex-1 py-2 border rounded-xl text-xs font-bold transition-all ${highContrast ? "border-yellow-400 text-yellow-400 bg-yellow-500/10" : "border-slate-800 hover:text-slate-200"}`}
                  >
                    High Contrast
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* FOOTER CONTROLLER */}
      <footer className="glass-panel border-t py-5 text-center text-xs opacity-60 mt-auto">
        <p>© 2026 FIFA World Cup Smart Stadium Operations. Powered by StadiumIQ AI & Gemini.</p>
      </footer>

    </div>
  );
}
