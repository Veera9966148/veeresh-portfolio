/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Code,
  ExternalLink,
  Github,
  Mail,
  MapPin,
  Send,
  Terminal,
  Award,
  Cpu,
  Layers,
  Menu,
  X,
  Sparkles,
  CheckCircle,
  FileCode,
  ArrowUpRight,
  BrainCircuit,
  MessageSquare,
  Linkedin,
  Clock,
  ArrowRight,
  Sliders,
  Wind,
  Download,
  Printer,
  ChevronRight,
  Database,
  Trash2,
  Lock,
  Search,
  Eye,
  Settings,
  HelpCircle,
  FolderGit2,
  GitPullRequest,
  Star
} from "lucide-react";
import { SKILLS, PROJECTS, EXPERIENCES, CERTIFICATIONS, Project, Skill } from "./data";
import avatarImg from "./veera_avatar_1781281822017.jpg";

export default function App() {
  // Mobile Nav Drawer Toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Time stamp state
  const [utcTime, setUtcTime] = useState("");

  // Projects Category Filter
  const [activeTab, setActiveTab] = useState<"all" | "ai" | "backend" | "fullstack">("all");

  // Selected project for interactive demonstration sandbox
  const [selectedDemoProject, setSelectedDemoProject] = useState<Project>(PROJECTS[0]);

  // Skills search state
  const [skillsFilter, setSkillsFilter] = useState("all");
  const [skillsSearch, setSkillsSearch] = useState("");

  // Resume Modal Viewer state
  const [resumeOpen, setResumeOpen] = useState(false);

  // Success state for inquiries
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactLoader, setContactLoader] = useState(false);

  // Standard React state variables for Contact Form
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [subjectInput, setSubjectInput] = useState("");
  const [messageInput, setMessageInput] = useState("");

  // Recruiter Dashboard Inbox visibility
  const [recruiterInboxOpen, setRecruiterInboxOpen] = useState(false);
  const [inboxAuth, setInboxAuth] = useState(true); // true bypasses password for local convenience
  const [inboxEmails, setInboxEmails] = useState<any[]>([]);

  // Interactive Live Chat State (AI Career Bot demo)
  const [chatInput, setChatInput] = useState("");
  const [chatLog, setChatLog] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    {
      sender: "ai",
      text: "Hello! I am Veeresh's virtual agent. Ask me about his machine learning experience, Flask APIs, Google internships, or n8n automated integrations!"
    }
  ]);
  const [chatIsTyping, setChatIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Interactive Wind Turbine Simulator State
  const [turbineSpeed, setTurbineSpeed] = useState(12); // m/s
  const [turbineDiameter, setTurbineDiameter] = useState(78); // meters
  const [turbineEfficiency, setTurbineEfficiency] = useState(0.42); // Cp coef

  // Interactive PDF Processor Simulator State
  const [selectedPDFFile, setSelectedPDFFile] = useState("Liver Cirrhosis Clinical Survey.pdf");
  const [pdfQuestion, setPdfQuestion] = useState("Summarize medical highlights and feature importance");
  const [pdfConsoleLogs, setPdfConsoleLogs] = useState<string[]>([]);
  const [pdfProcessing, setPdfProcessing] = useState(false);

  // Interactive Liver Cirrhosis Calculator State
  const [cirrhosisAge, setCirrhosisAge] = useState(52);
  const [cirrhosisBilirubin, setCirrhosisBilirubin] = useState(2.8); // mg/dL
  const [cirrhosisAlbumin, setCirrhosisAlbumin] = useState(3.1); // g/dL
  const [cirrhosisPlatelets, setCirrhosisPlatelets] = useState(180); // x1000
  const [cirrhosisAscites, setCirrhosisAscites] = useState("no"); // "yes" or "no"

  // Live calculation of wind power output
  // Power = 0.5 * density(1.225) * area(pi * r^2) * speed^3 * efficiency / 1,000,000 for MW
  const getTurbinePower = () => {
    const rho = 1.225; // standard air density
    const radius = turbineDiameter / 2;
    const area = Math.PI * Math.pow(radius, 2);
    const rawPowerInWatts = 0.5 * rho * area * Math.pow(turbineSpeed, 3) * turbineEfficiency;
    const powerInMegawatts = rawPowerInWatts / 1000000;
    return powerInMegawatts.toFixed(3);
  };

  // Live calculation of Liver Cirrhosis Risk score
  // Simple calculated coefficient ratio for demo: Bilirubin weighted high, Albumin low negative, Ascites high, Platelets low negative
  const getCirrhosisRiskScore = () => {
    let score = (cirrhosisBilirubin * 1.8) - (cirrhosisAlbumin * 1.2) + (cirrhosisAge * 0.02) - (cirrhosisPlatelets * 0.002);
    if (cirrhosisAscites === "yes") score += 2.5;

    let index = "Low Risk (Stage 0-1)";
    let barColor = "bg-emerald-500 shadow-emerald-500/50";
    let textStyle = "text-emerald-400";
    let recommendation = "Patient demonstrates compensated hepatic functions. Maintain ongoing standard telemetry checks.";

    if (score > 1.2 && score <= 3.2) {
      index = "Moderate Risk (Stage 2)";
      barColor = "bg-amber-500 shadow-amber-500/50";
      textStyle = "text-amber-400";
      recommendation = "Noticeable portal pressures. Prompt full endoscopic scan validation and strict baseline diet controls.";
    } else if (score > 3.2) {
      index = "Critical Stage Risk (Stage 3-4)";
      barColor = "bg-rose-500 shadow-rose-500/50";
      textStyle = "text-rose-400";
      recommendation = "Severe decompensated markers. Immediate referral to clinical gastrology units of high priority.";
    }

    return { score: score.toFixed(2), label: index, color: barColor, text: textStyle, rec: recommendation };
  };

  useEffect(() => {
    // Scroll chat bottom to view
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog, chatIsTyping]);

  useEffect(() => {
    // Generate static formatted UTC clock update
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toLocaleTimeString("en-US", { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Fetch inquiries on load
    const saved = localStorage.getItem("veeresh_portfolio_inbox");
    if (saved) {
      setInboxEmails(JSON.parse(saved));
    }
  }, []);

  // Post dynamic query handler for AI Agent Chat
  const handleChatSend = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || chatIsTyping) return;

    const userMessage = chatInput.trim();
    setChatLog((prev) => [...prev, { sender: "user", text: userMessage }]);
    setChatInput("");
    setChatIsTyping(true);

    try {
      // Connect to fullstack proxy endpoint
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage })
      });
      const data = await response.json();
      setChatLog((prev) => [...prev, { sender: "ai", text: data.text || "I apologize, custom systems seem momentarily heavy. Please ask another professional question!" }]);
    } catch (err) {
      console.error("AI service error:", err);
      // Native fast offline simulation if backend lags
      setChatLog((prev) => [...prev, {
        sender: "ai",
        text: "I am functioning on high-speed telemetry fallbacks. Yes, Veeresh is highly skilled in Python architectures and custom ML pipelines (Decision trees, Scikit-learn, and prompt scripting with n8n automation). Let me know how I should connect you to him!"
      }]);
    } finally {
      setChatIsTyping(false);
    }
  };

  const selectSuggestedChat = (text: string) => {
    setChatInput(text);
  };

  // Simulated PDF processing timeline console logs
  const handlePDFProcess = () => {
    if (pdfProcessing) return;
    setPdfProcessing(true);
    setPdfConsoleLogs([]);

    const logSteps = [
      `[INIT] Mounting static document target: "${selectedPDFFile}"`,
      `[EXTRACT] Scanning text chunks. Byte stream loaded successfully.`,
      `[PARSE] Eliminating noise parameters... parsed 14,831 functional characters.`,
      `[EMBED] Transmitting semantic vectors to computational model...`,
      `[INFERENCE] Triggered context query: "${pdfQuestion}"`,
      `[SUCCESS] Response generated securely.`
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < logSteps.length) {
        setPdfConsoleLogs((prev) => [...prev, logSteps[currentIdx]]);
        currentIdx++;
      } else {
        clearInterval(interval);
        setPdfProcessing(false);
        // Finalize summary text output based on selection
        let summaryResult = "Document summary successfully calculated.";
        if (selectedPDFFile.includes("Cirrhosis")) {
          summaryResult = "[RESULT] Model synthesized: Primary risk factor linked directly to bilirubin indices (corr coefficient +0.81). Recommends decision tree pruning level 4 to guarantee 89% diagnostic specificity.";
        } else {
          summaryResult = "[RESULT] Model synthesized: Maximum optimized megawatt capacity estimated near 2.14MW at turbine speeds exceeding 11.5m/s. Pitch control adjustment optimized at 4.2 deg.";
        }
        setPdfConsoleLogs((prev) => [...prev, "", summaryResult]);
      }
    }, 850);
  };

  // Submit Contact Form
  const handleSubmitMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!nameInput || !emailInput || !messageInput) return;

    setContactLoader(true);

    setTimeout(() => {
      const newInquiry = {
        id: Date.now().toString(),
        name: nameInput,
        email: emailInput,
        subject: subjectInput || "Recruitment opportunity",
        message: messageInput,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })
      };

      const updatedInbox = [newInquiry, ...inboxEmails];
      setInboxEmails(updatedInbox);
      localStorage.setItem("veeresh_portfolio_inbox", JSON.stringify(updatedInbox));

      // Reset
      setNameInput("");
      setEmailInput("");
      setSubjectInput("");
      setMessageInput("");
      setContactLoader(false);
      setContactSuccess(true);

      setTimeout(() => setContactSuccess(false), 4000);
    }, 1500);
  };

  // Delete Inquiry
  const handleDeleteInquiry = (id: string) => {
    const filtered = inboxEmails.filter((item) => item.id !== id);
    setInboxEmails(filtered);
    localStorage.setItem("veeresh_portfolio_inbox", JSON.stringify(filtered));
  };

  // Interactive PDF resume print helper
  const handlePrintResume = () => {
    window.print();
  };

  // Filter Projects list
  const filteredProjects = PROJECTS.filter(
    (p) => activeTab === "all" || p.category === activeTab
  );

  // Filter Core Skills
  const filteredSkills = SKILLS.filter((s) => {
    const matchesCategory = skillsFilter === "all" || s.category === skillsFilter;
    const matchesSearch = s.name.toLowerCase().includes(skillsSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#070A13] text-slate-100 font-sans antialiased overflow-x-hidden selection:bg-purple-600 selection:text-white">
      
      {/* Decorative Starry Space Grid Background & Cosmic Aurora Ambient Glows */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.18),rgba(255,255,255,0))] pointer-events-none z-0" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#0f172a18_1px,transparent_1px),linear-gradient(to_bottom,#0f172a18_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0 opacity-40" />
      
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none z-0 animate-pulse" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Modern High-End Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#070A13]/80 backdrop-blur-md border-b border-slate-800/60 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo Identity */}
          <a href="#hero" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-mono font-bold text-lg leading-none shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <span className="relative z-10">V</span>
              <div className="absolute inset-0 bg-transparent rounded-xl group-hover:blur-sm bg-gradient-to-tr from-indigo-400 to-purple-500 transition-all opacity-50" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-base tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-300 transition-all duration-300">
                Veeresh Kumar
              </span>
              <span className="font-mono text-[9px] text-slate-400 font-bold tracking-wider leading-none">
                AI / ML ENGINEER
              </span>
            </div>
          </a>

          {/* Desktop Links (Startup Aesthetic) */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <a href="#about" className="hover:text-indigo-400 transition-colors">About</a>
            <a href="#projects" className="hover:text-indigo-400 transition-colors">Projects</a>
            <a href="#skills" className="hover:text-indigo-400 transition-colors">Skills</a>
            <a href="#experience" className="hover:text-indigo-400 transition-colors">Experience</a>
            <a href="#certifications" className="hover:text-indigo-400 transition-colors">Badges</a>
            <a
              href="#contact"
              className="bg-indigo-600/90 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition-all border border-indigo-400/30 flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
            >
              Contact
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </nav>

          {/* Right Clock Widget & Social Links */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="/veeresh-portfolio-project.zip"
              download="veeresh-portfolio-project.zip"
              className="px-3.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 rounded-full border border-emerald-500/30 text-[11px] font-semibold font-mono flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>EXPORT SOURCE (.ZIP)</span>
            </a>
            <div className="px-3.5 py-1.5 bg-slate-900/40 rounded-full border border-slate-800 text-[11px] text-slate-400 font-mono flex items-center gap-2 shadow-inner">
              <Clock className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: "14s" }} />
              <span>LOG: {utcTime} System Online</span>
            </div>
          </div>

          {/* Hamburger Menu Toggle Button */}
          <button
            id="menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/30 border border-slate-800 transition-colors"
            aria-label="Toggle navigation drawer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden border-t border-slate-800/60 bg-[#070A13]/95 backdrop-blur-xl overflow-hidden shadow-2xl"
            >
              <div className="px-6 py-8 flex flex-col gap-4 text-sm font-semibold uppercase tracking-wider text-slate-300">
                <a
                  href="#about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 hover:text-white transition-colors"
                >
                  About Me
                </a>
                <a
                  href="#projects"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 hover:text-white transition-colors"
                >
                  Projects Sandbox
                </a>
                <a
                  href="#skills"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 hover:text-white transition-colors"
                >
                  Core Skills
                </a>
                <a
                  href="#experience"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 hover:text-white transition-colors"
                >
                  Experience History
                </a>
                <a
                  href="#certifications"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 hover:text-white transition-colors"
                >
                  Certificates Registry
                </a>
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-2 bg-indigo-600 text-white py-3 rounded-lg text-center font-bold flex items-center justify-center gap-2 hover:bg-indigo-500 transition-colors"
                >
                  Contact Me
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Page Layout Wrapper */}
      <main className="relative z-10">
        
        {/* HERO SECTION */}
        <section id="hero" className="relative pt-12 pb-24 md:py-36 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column Information */}
            <div className="lg:col-span-7 flex flex-col items-start gap-6 text-left">
              
              {/* Green Pulse Badge for Internships & Entry-Level Opportunities */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide font-mono shadow-inner animate-pulse"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>🟢 Available for Internships & Entry-Level Opportunities</span>
              </motion.div>

              {/* Premium Glow Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-widest font-mono uppercase shadow-inner"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Intelligent Systems & ML Pipeline Architecture
              </motion.div>

              {/* Multiline Type Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1]"
              >
                Veeresh Kumar
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-fuchsia-400 mt-2 font-display text-2xl sm:text-3xl lg:text-4xl">
                  AI/ML Engineer | Python Developer | Backend Developer
                </span>
              </motion.h1>

              {/* Tech Stack Subtitles Roll */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="flex flex-wrap items-center gap-3 font-mono text-xs text-indigo-400 uppercase tracking-widest font-bold"
              >
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-indigo-400" /> Python Developer
                </span>
                <span className="text-slate-700 font-normal">|</span>
                <span className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-purple-400" /> Machine Learning Engineer
                </span>
                <span className="text-slate-700 font-normal">|</span>
                <span className="flex items-center gap-1.5">
                  <BrainCircuit className="w-3.5 h-3.5 text-fuchsia-400" /> AI Automation Expert
                </span>
              </motion.div>

              {/* Tagline Pitch */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed font-sans"
              >
                Building intelligent systems using Machine Learning, Python, AI Automation, Flask, and Modern Web Technologies.
              </motion.p>

              {/* CTA Actions */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="flex flex-wrap items-center gap-4 w-full sm:w-auto"
              >
                <a
                  href="#projects"
                  className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 text-white px-6 py-4 rounded-xl font-bold tracking-tight hover:from-indigo-500 hover:via-purple-500 hover:to-fuchsia-500 transition-all text-center inline-flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 border border-purple-400/20"
                >
                  Explore My Projects
                  <Sliders className="w-4 h-4 ml-0.5 text-indigo-200" />
                </a>
                <button
                  onClick={() => setResumeOpen(true)}
                  className="w-full sm:w-auto bg-slate-900/60 text-slate-200 hover:text-white border border-slate-800 hover:border-slate-700 px-6 py-4 rounded-xl font-bold tracking-tight transition-all text-center inline-flex items-center justify-center gap-2 backdrop-blur-sm"
                >
                  <Download className="w-4 h-4 text-emerald-400 mr-0.5" />
                  Download Resume (PDF)
                </button>
                <a
                  href="/veeresh-portfolio-project.zip"
                  download="veeresh-portfolio-project.zip"
                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 border border-emerald-400/20 px-6 py-4 rounded-xl font-bold tracking-tight transition-all text-center inline-flex items-center justify-center gap-2 backdrop-blur-sm shadow-lg shadow-emerald-600/20"
                >
                  <Download className="w-4 h-4 text-emerald-200 mr-0.5 animate-bounce" style={{ animationDuration: '2s' }} />
                  Download Complete Code (.ZIP)
                </a>
                <a
                  href="#contact"
                  className="w-full sm:w-auto text-slate-400 hover:text-white font-semibold text-xs uppercase tracking-wider py-3 px-1 hover:underline transition-colors block text-center"
                >
                  Let's Connect
                </a>
              </motion.div>

              {/* High-Performance Metrics Row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 p-5 rounded-2xl bg-slate-950/40 border border-slate-900/80 backdrop-blur-md w-full max-w-2xl mt-6 shadow-2xl"
              >
                <div className="flex flex-col text-left">
                  <span className="font-display font-black text-2xl lg:text-3xl text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-300">2</span>
                  <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mt-1">AI/ML INTERNSHIPS</span>
                </div>
                <div className="flex flex-col text-left border-l border-slate-900 pl-4 md:pl-6">
                  <span className="font-display font-black text-2xl lg:text-3xl text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">4+</span>
                  <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mt-1">REAL-WORLD PROJECTS</span>
                </div>
                <div className="flex flex-col text-left border-l border-slate-900 pl-4 md:pl-6">
                  <span className="font-display font-black text-2xl lg:text-3xl text-white bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-rose-300">15+</span>
                  <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mt-1">CORE TECH SKILLS</span>
                </div>
                <div className="flex flex-col text-left border-l border-slate-900 pl-4 md:pl-6">
                  <span className="font-display font-black text-2xl lg:text-3xl text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-300">n8n</span>
                  <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mt-1">AI AUTOMATIONS</span>
                </div>
              </motion.div>

            </div>

            {/* Right Column: Avatar Graphic Illustration Frame with glow effect */}
            <div className="lg:col-span-5 relative flex justify-center mt-10 lg:mt-0">
              
              {/* Radial gradient backing glow ring */}
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/25 via-fuchsia-600/10 to-indigo-500/2 transition-all duration-1000 rounded-full blur-[70px] opacity-90 pointer-events-none z-0 scale-95 shadow-[0_0_50px_rgba(168,85,247,0.2)]" />

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative z-10"
              >
                {/* Double pulse glowing borders circular framework */}
                <div className="absolute -inset-1.5 bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-indigo-600 rounded-full blur-md opacity-85 animate-pulse shadow-[0_0_30px_rgba(147,51,234,0.7)]" />
                
                {/* 1:1 Circular frame holding avatar image */}
                <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full overflow-hidden border-2 border-slate-700 p-2 bg-gradient-to-b from-[#131d35] to-[#0d1527] shadow-2xl">
                  <div className="w-full h-full rounded-full overflow-hidden relative shadow-inner bg-slate-900/90 ring-1 ring-white/10">
                    <img
                      src={avatarImg}
                      alt="Veeresh Kumar"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-[50%_28%] transition-all duration-700 hover:scale-[1.04]"
                    />
                    {/* Subtle micro-gradient overlay on bottom facial transition */}
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#070A13]/90 to-transparent opacity-85 pointer-events-none" />
                  </div>
                </div>

                {/* Floating telemetry metrics badges */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                  className="absolute -top-4 -left-4 z-20 bg-slate-900/90 border border-indigo-500/40 backdrop-blur-md rounded-2xl p-4 shadow-xl flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <BrainCircuit className="w-4 h-4 animate-spin" style={{ animationDuration: "10s" }} />
                  </div>
                  <div className="text-left font-mono">
                    <div className="text-[10px] text-slate-400 tracking-wide uppercase leading-none">AGENT STATUS</div>
                    <div className="text-xs font-black text-white mt-1 flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                      Gemini Activated
                    </div>
                  </div>
                </motion.div>

                {/* Second Floating Badges right side */}
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-10 -right-6 z-20 bg-slate-900/90 border border-purple-500/40 backdrop-blur-md rounded-2xl p-4 shadow-xl flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                    <Award className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="text-left font-mono">
                    <div className="text-[10px] text-slate-400 tracking-wide uppercase leading-none">VERIFIED RATING</div>
                    <div className="text-xs font-black text-white mt-1">ML Specialist</div>
                  </div>
                </motion.div>


              </motion.div>
            </div>

          </div>
        </section>

        {/* ABOUT ME SECTION */}
        <section id="about" className="py-24 relative bg-slate-950/60 border-y border-slate-900/80">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column Narrative */}
              <div className="lg:col-span-6 flex flex-col items-start gap-6 text-left">
                
                <div className="flex flex-col items-start gap-1">
                  <span className="font-mono text-xs text-indigo-400 uppercase tracking-widest font-bold">
                    01 // IDENTITY REGISTER
                  </span>
                  <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
                    Professional Summary
                  </h2>
                </div>

                <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" />

                <p className="text-slate-300 text-base leading-relaxed">
                  I am a focused **Computer Science Undergraduate** and dedicated **Machine Learning Intern** equipped with practical industry experience building predictive pipeline diagnostic tools and intelligent automated integrations.
                </p>

                <p className="text-slate-400 text-sm leading-relaxed">
                  As a skilled **Python Developer** and **AI Automation Enthusiast**, I specialize in designing streamlined backend microservices via **Flask and REST API Development** and embedding robust LLM Integration Experience utilizing cutting-edge models like Gemini. I bridge the gap between academic theory and enterprise implementation by creating robust workflows using n8n and statistical machine learning regressors.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-4">
                  <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
                    <div className="absolute top-0 right-0 w-8 h-8 rounded-bl-xl bg-indigo-600/10 flex items-center justify-center">
                      <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                    <h3 className="font-display font-semibold text-white text-sm mb-1">Flask & REST API Development</h3>
                    <p className="text-xs text-slate-500 leading-normal">Orchestrating microservice APIs, payload schemas, and reliable Python scoring routers.</p>
                  </div>

                  <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl relative overflow-hidden group hover:border-purple-500/30 transition-colors">
                    <div className="absolute top-0 right-0 w-8 h-8 rounded-bl-xl bg-purple-600/10 flex items-center justify-center">
                      <Sliders className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                    <h3 className="font-display font-semibold text-white text-sm mb-1">LLM Integration Experience</h3>
                    <p className="text-xs text-slate-500 leading-normal">Leveraging advanced generative weights, semantic parameters, and system directives safely.</p>
                  </div>
                </div>

              </div>

              {/* Right Column Custom Info Graphic Boxes */}
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Metric Pillar 1 */}
                <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-lg hover:border-slate-700 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6">
                    <Cpu className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-lg text-white mb-2">AI Automation</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">Orchestrating advanced n8n workflow triggers and custom webhook pipelines to synchronize remote services flawlessly.</p>
                    <span className="font-mono text-[9px] text-[#38bdf8] font-bold tracking-widest uppercase">n8n AUTOMATION</span>
                  </div>
                </div>

                {/* Metric Pillar 2 */}
                <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-lg hover:border-slate-700 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6">
                    <BrainCircuit className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-lg text-white mb-2">Machine Learning</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">Training resilient Scikit-learn regressors, decision classifiers, and validation routines with optimal score evaluations.</p>
                    <span className="font-mono text-[9px] text-[#c084fc] font-bold tracking-widest uppercase">MODEL DEVELOPMENT</span>
                  </div>
                </div>

                {/* Wide Pillar Banner */}
                <div className="sm:col-span-2 p-6 bg-gradient-to-r from-indigo-900/30 to-purple-900/35 border border-slate-800 rounded-2xl flex items-center justify-between shadow-lg hover:border-slate-700/80 transition-all">
                  <div className="text-left">
                    <h4 className="font-display font-bold text-sm text-white mb-1">Recruiting for Internships?</h4>
                    <p className="text-xs text-slate-400 max-w-sm">I am actively available for remote and hybrid ML Internships & Jr. Python Developer opportunities.</p>
                  </div>
                  <a
                    href="#contact"
                    className="font-mono text-xs text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl transition-all font-semibold flex items-center gap-1.5 shrink-0 border border-indigo-400/30"
                  >
                    Contact Me
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* PROJECTS SECTION & ACTIVE SIMULATION SANDBOX */}
        <section id="projects" className="py-24 px-6 relative bg-slate-950/20">
          <div className="max-w-7xl mx-auto">
            
            {/* Header portion */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 text-left">
              <div className="flex flex-col items-start gap-1">
                <span className="font-mono text-xs text-indigo-400 uppercase tracking-widest font-bold block">
                  02 // DEPLOYMENT DECK
                </span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
                  Featured Projects & Interactive Simulator
                </h2>
                <p className="text-slate-400 text-sm mt-1 max-w-xl">
                  Inspect my primary technical projects. Change categories or click "Inspect & Run Sandbox Demo" to run live calculations right inside the browser simulation block!
                </p>
              </div>

              {/* Filtering category controls */}
              <div className="flex flex-wrap items-center gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800/80 shrink-0 backdrop-blur-md">
                {(["all", "ai", "backend", "fullstack"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveTab(cat)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-350 ${
                      activeTab === cat
                        ? "bg-indigo-600 text-white shadow-inner"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {cat === "all" ? "All projects" : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Interactive Row split into projects cards & active simulator */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
              
              {/* Left sub-column: Project cards list */}
              <div className="lg:col-span-6 flex flex-col gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredProjects.map((proj) => {
                    const isSelected = selectedDemoProject.id === proj.id;
                    return (
                      <motion.div
                        key={proj.id}
                        layout
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className={`p-6 rounded-2xl border transition-all text-left flex flex-col justify-between relative group overflow-hidden ${
                          isSelected
                            ? "bg-slate-900/90 border-purple-500 shadow-2xl shadow-purple-500/10 ring-1 ring-purple-500"
                            : "bg-slate-900/30 border-slate-850 hover:bg-slate-900/70 hover:border-slate-700"
                        }`}
                      >
                        {/* Interactive highlight block */}
                        {isSelected && (
                          <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-500/20 to-transparent w-32 h-32 blur-xl rounded-full" />
                        )}

                        <div>
                          <div className="flex items-center justify-between mb-3 relative z-10">
                            <span className="font-mono text-[9px] tracking-widest font-black text-indigo-400 uppercase bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                              {proj.category === "ai" ? "ALGORITHMIC AI" : proj.category === "backend" ? "BACKEND SCORING" : "PIPELINE AUTOMATION"}
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                              <span>Live Simulator Sandbox</span>
                            </div>
                          </div>

                          <h3 className="font-display font-medium text-xl text-white mb-2 relative z-10 group-hover:text-purple-300 transition-colors">
                            {proj.title}
                          </h3>

                          <p className="text-xs text-slate-350 leading-relaxed mb-4">
                            {proj.description}
                          </p>

                          {/* Key Features Bullet List */}
                          <div className="mb-4 bg-slate-950/20 p-3 rounded-xl border border-slate-900">
                            <span className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider block mb-1.5">
                              Key Features:
                            </span>
                            <ul className="text-xs/relaxed text-slate-300 pl-1.5 space-y-1">
                              {proj.bullets && proj.bullets.map((b, bIdx) => (
                                <li key={bIdx} className="flex items-start gap-1.5 text-[11px]">
                                  <span className="text-purple-400 font-mono mt-0.5 font-bold">▪</span>
                                  <span>{b}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div>
                          {/* Project Highlight / Verified Impact */}
                          <div className="p-3 bg-slate-950/60 border border-slate-900 rounded-xl text-xs text-slate-300 leading-normal mb-4">
                            <strong className="text-emerald-400 block font-bold mb-0.5 font-mono text-[10px] tracking-wide uppercase">
                              ★ PROJECT HIGHLIGHT:
                            </strong>
                            {proj.impact}
                          </div>

                          {/* Tech Stack Tags */}
                          <div className="flex flex-wrap gap-1.5 mb-5">
                            {proj.tags.map((t) => (
                              <span
                                key={t}
                                className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-850"
                              >
                                {t}
                              </span>
                            ))}
                          </div>

                          {/* Two-Column Actions (GitHub & Live Emulator trigger) */}
                          <div className="grid grid-cols-2 gap-2 relative z-10">
                            <a
                              href={proj.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="bg-slate-900/80 hover:bg-slate-805 text-slate-200 hover:text-white border border-slate-800 hover:border-slate-700 py-2.5 px-3 rounded-lg text-[11px] font-mono font-bold tracking-tight text-center transition-all inline-flex items-center justify-center gap-1.5"
                            >
                              <Github className="w-3.5 h-3.5 text-slate-400" />
                              GitHub Repo
                            </a>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDemoProject(proj);
                                const el = document.getElementById("sandbox-station-anchor");
                                if (el) {
                                  el.scrollIntoView({ behavior: "smooth", block: "center" });
                                }
                              }}
                              className={`py-2.5 px-3 rounded-lg text-[11px] font-mono font-bold tracking-tight text-center transition-all inline-flex items-center justify-center gap-1.5 border cursor-pointer ${
                                isSelected
                                  ? "bg-purple-600/20 text-purple-300 border-purple-500/40"
                                  : "bg-indigo-600 hover:bg-indigo-500 text-white border-transparent"
                              }`}
                            >
                              <Sliders className="w-3.5 h-3.5" />
                              {isSelected ? "Active Sim" : "Run Live Demo"}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Right sub-column: Dynamic Sandbox Console Monitor */}
              <div id="sandbox-station-anchor" className="lg:col-span-6 flex flex-col">
                <div className="rounded-2xl bg-[#090D1A] text-slate-200 overflow-hidden shadow-2xl border border-slate-800/80 flex-1 flex flex-col relative justify-between">
                  
                  {/* Console Frame Header Tab bar */}
                  <div className="bg-[#05070E] px-4 py-3.5 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span className="font-mono text-xs text-slate-300 font-bold tracking-wide">
                        Inference Emulator (Project: {selectedDemoProject.title.split("—")[0]})
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]/80 inline-block" />
                    </div>
                  </div>

                  {/* SANDBOX SCREEN 1: AI Career Assistant Chat Bot */}
                  {selectedDemoProject.demoType === "chat" && (
                    <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between min-h-[420px] bg-[#090D1A]">
                      
                      {/* Top instruction message */}
                      <div className="bg-indigo-950/20 border border-indigo-500/20 p-3 rounded-xl text-xs text-slate-400 mb-4 flex items-start gap-2.5 font-sans leading-relaxed">
                        <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5 animate-pulse" />
                        <div>
                          <strong className="text-white block font-semibold">Live Server Agent Proxy:</strong>
                          This chat calls the actual **Gemini-3.5-flash** API securely from the server. Ask anything about Veeresh's qualifications or click a preset question below!
                        </div>
                      </div>

                      {/* Chat messages log */}
                      <div className="flex-1 max-h-[240px] overflow-y-auto mb-4 p-3 bg-slate-950/50 rounded-xl border border-slate-900 flex flex-col gap-3 font-sans text-xs scrollbar">
                        {chatLog.map((chat, idx) => (
                          <div
                            key={idx}
                            className={`flex ${chat.sender === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[85%] p-3 rounded-xl leading-relaxed whitespace-pre-wrap ${
                                chat.sender === "user"
                                  ? "bg-indigo-600 text-white rounded-br-none"
                                  : "bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none font-mono"
                              }`}
                            >
                              {chat.text}
                            </div>
                          </div>
                        ))}
                        {chatIsTyping && (
                          <div className="flex justify-start">
                            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl rounded-bl-none text-slate-400 font-mono text-xs flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                              <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                              <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                              <span className="text-[10px] text-slate-400 ml-1">Virtual agent typing...</span>
                            </div>
                          </div>
                        )}
                        <div ref={chatBottomRef} />
                      </div>

                      {/* Suggestion tags pills */}
                      <div className="mb-3">
                        <span className="text-[10px] font-mono font-bold text-slate-500 tracking-wider uppercase block mb-1.5">PRESETS DIRECTIVES:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            "Tell me about your Python skills",
                            "What internships have you completed?",
                            "Describe the PDF Explainer bot",
                            "Are you open to remote roles?"
                          ].map((pct) => (
                            <button
                              key={pct}
                              onClick={() => selectSuggestedChat(pct)}
                              className="text-[10px] bg-slate-900 hover:bg-slate-800 border border-slate-800 px-2.5 py-1 rounded-md text-slate-400 font-sans hover:text-white transition-colors"
                            >
                              {pct}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Input control form */}
                      <form onSubmit={handleChatSend} className="flex gap-2 relative mt-2">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder="Type your recruitment inquiry about Veeresh's qualifications..."
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans placeholder:text-slate-600"
                        />
                        <button
                          type="submit"
                          disabled={chatIsTyping}
                          className="bg-indigo-600 hover:bg-indigo-500 transition-colors text-white px-4 py-3 rounded-xl flex items-center justify-center shrink-0 border border-indigo-400/20"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </form>

                    </div>
                  )}

                  {/* SANDBOX SCREEN 2: Wind Turbine Prediction Simulator */}
                  {selectedDemoProject.demoType === "prediction" && (
                    <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between min-h-[420px] bg-[#090D1A] font-sans">
                      
                      <div className="bg-amber-950/10 border border-amber-500/20 p-3 rounded-xl text-xs text-slate-400 mb-4 leading-relaxed">
                        <strong className="text-white block font-semibold">Random Forest Regression Scorer:</strong>
                        Calculate energy outputs instantly based on environmental conditions. Moving the sliders triggers live pipeline estimation.
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        
                        {/* Sliders left */}
                        <div className="flex flex-col gap-4 text-left">
                          
                          {/* Speed Slider */}
                          <div>
                            <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                              <span className="text-slate-400">Wind Velocity:</span>
                              <span className="text-amber-400 font-bold">{turbineSpeed} m/s</span>
                            </div>
                            <input
                              type="range"
                              min="2"
                              max="30"
                              step="0.5"
                              value={turbineSpeed}
                              onChange={(e) => setTurbineSpeed(parseFloat(e.target.value))}
                              className="w-full accent-amber-500 h-1.5 bg-slate-950 rounded-lg appearance-none cursor-ew-resize"
                            />
                            <div className="flex justify-between text-[9px] text-slate-600 font-mono mt-1">
                              <span>Min Cut-in (2m/s)</span>
                              <span>Max Cut-out (30m/s)</span>
                            </div>
                          </div>

                          {/* Rotor Diameter Slider */}
                          <div>
                            <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                              <span className="text-slate-400">Rotor Span (Diameter):</span>
                              <span className="text-amber-400 font-bold">{turbineDiameter} m</span>
                            </div>
                            <input
                              type="range"
                              min="30"
                              max="150"
                              value={turbineDiameter}
                              onChange={(e) => setTurbineDiameter(parseInt(e.target.value))}
                              className="w-full accent-amber-500 h-1.5 bg-slate-950 rounded-lg appearance-none cursor-ew-resize"
                            />
                            <div className="flex justify-between text-[9px] text-slate-600 font-mono mt-1">
                              <span>30m (Micro)</span>
                              <span>150m (Utility-grade)</span>
                            </div>
                          </div>

                          {/* Cp coefficient of efficiency */}
                          <div>
                            <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                              <span className="text-slate-400">Cp Efficiency Limits:</span>
                              <span className="text-amber-400 font-bold">{(turbineEfficiency * 100).toFixed(0)}%</span>
                            </div>
                            <input
                              type="range"
                              min="0.15"
                              max="0.55"
                              step="0.01"
                              value={turbineEfficiency}
                              onChange={(e) => setTurbineEfficiency(parseFloat(e.target.value))}
                              className="w-full accent-amber-500 h-1.5 bg-slate-950 rounded-lg appearance-none cursor-ew-resize"
                            />
                            <div className="flex justify-between text-[9px] text-slate-600 font-mono mt-1">
                              <span>Betz Floor (15%)</span>
                              <span>Betz Ceiling (55%)</span>
                            </div>
                          </div>

                        </div>

                        {/* Interactive visualization turbine graphic on right */}
                        <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-900 bg-slate-950/40 relative">
                          
                          {/* Animated spinning turbine */}
                          <div className="relative w-28 h-28 flex items-center justify-center">
                            
                            {/* Mast pole */}
                            <div className="absolute top-[50%] left-[48%] w-1.5 h-16 bg-slate-700 rounded-t" />

                            {/* Blades rotor rotation */}
                            <div
                              className="absolute w-24 h-24 rounded-full flex items-center justify-center animate-spin"
                              style={{
                                animationDuration: `${Math.max(0.5, 12 - (turbineSpeed * 0.4))}s`,
                                animationTimingFunction: "linear"
                              }}
                            >
                              {/* Central hub */}
                              <div className="w-4 h-4 rounded-full bg-amber-400 relative z-30" />
                              {/* Propeller blades (3 blades) */}
                              <div className="absolute w-1 h-12 bg-slate-400 rounded-t bottom-[50%] left-[49%] transform origin-bottom" />
                              <div className="absolute w-1 h-12 bg-slate-400 rounded-t bottom-[50%] left-[49%] transform origin-bottom rotate-120" />
                              <div className="absolute w-1 h-12 bg-slate-400 rounded-t bottom-[50%] left-[49%] transform origin-bottom rotate-240" />
                            </div>

                          </div>

                          <div className="mt-6 text-center font-mono w-full">
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest block">ESTIMATED OUTPUT</span>
                            <span className="text-2xl font-black text-amber-400 mt-1 block">
                              {getTurbinePower()} MW
                            </span>
                            <span className="text-[10px] text-slate-400">Total Megawatts Capacity</span>
                          </div>

                        </div>

                      </div>

                    </div>
                  )}

                  {/* SANDBOX SCREEN 3: PDF Explainer Bot Parser */}
                  {selectedDemoProject.demoType === "parser" && (
                    <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between min-h-[420px] bg-[#090D1A] font-mono text-xs text-left">
                      
                      <div className="bg-indigo-950/10 border border-indigo-500/20 p-3 rounded-xl text-xs text-slate-400 mb-4 leading-relaxed font-sans">
                        <strong className="text-white block font-semibold">Technical PDF Parsing Console:</strong>
                        Choose a localized paper resource and targeted analysis query parameters. Boot step timelines simulate real NLP string segmentation.
                      </div>

                      {/* Select controls */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="text-[10px] text-slate-500 tracking-wider font-bold block mb-1">TARGET PDF FILE:</label>
                          <select
                            value={selectedPDFFile}
                            onChange={(e) => setSelectedPDFFile(e.target.value)}
                            disabled={pdfProcessing}
                            className="w-full bg-slate-950 border border-slate-850 p-2 rounded-lg text-xs leading-none text-slate-300 focus:outline-none focus:border-indigo-500"
                          >
                            <option value="Liver Cirrhosis Clinical Survey.pdf">Liver Cirrhosis Clinical Survey.pdf</option>
                            <option value="Wind Turbine Windways Feasibility.pdf">Wind Turbine Windways Feasibility.pdf</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-500 tracking-wider font-bold block mb-1">INFERENCE DIRECTIVE:</label>
                          <select
                            value={pdfQuestion}
                            onChange={(e) => setPdfQuestion(e.target.value)}
                            disabled={pdfProcessing}
                            className="w-full bg-slate-950 border border-slate-850 p-2 rounded-lg text-xs leading-none text-slate-300 focus:outline-none focus:border-indigo-500"
                          >
                            <option value="Summarize medical highlights and feature importance">Summarize highlights and features</option>
                            <option value="Describe methodology, regressors parameters, and results">Analyze clinical methods and regressors ?</option>
                            <option value="Synthesize pipeline deployment challenges and Flask limits">Explain deployment challenges</option>
                          </select>
                        </div>
                      </div>

                      {/* Console stdout block */}
                      <div className="flex-1 bg-slate-950/80 border border-slate-900 rounded-xl p-4 min-h-[160px] overflow-y-auto mb-4 flex flex-col gap-1.5 font-mono text-xs">
                        {pdfConsoleLogs.length === 0 ? (
                          <div className="text-slate-600 italic">Console output empty. Use the run action below.</div>
                        ) : (
                          pdfConsoleLogs.map((log, lIdx) => (
                            <div
                              key={lIdx}
                              className={
                                log && typeof log === "string" && log.startsWith("[INIT]")
                                  ? "text-slate-500"
                                  : log && typeof log === "string" && (log.startsWith("[SUCCESS]") || log.startsWith("[RESULT]"))
                                  ? "text-emerald-400"
                                  : "text-slate-300"
                              }
                            >
                              {log}
                            </div>
                          ))
                        )}
                        {pdfProcessing && (
                          <div className="text-indigo-400 animate-pulse flex items-center gap-1.5 mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block animate-ping" />
                            <span>Computing regression matrix vectors...</span>
                          </div>
                        )}
                      </div>

                      {/* Trigger button */}
                      <button
                        onClick={handlePDFProcess}
                        disabled={pdfProcessing}
                        className="bg-indigo-600 hover:bg-indigo-500 transition-colors border border-indigo-400/20 text-white font-semibold py-3 rounded-lg text-xs tracking-wider font-mono flex items-center justify-center gap-2"
                      >
                        <FileCode className="w-4 h-4" />
                        {pdfProcessing ? "EXECUTING PIPELINE STEP..." : "RUN INTERACTIVE PDF PARSER"}
                      </button>

                    </div>
                  )}

                  {/* SANDBOX SCREEN 4: Liver Cirrhosis Risk Calculator */}
                  {selectedDemoProject.demoType === "calculator" && (
                    <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between min-h-[420px] bg-[#090D1A] font-sans">
                      
                      <div className="bg-rose-950/10 border border-rose-500/20 p-3 rounded-xl text-xs text-slate-400 mb-4 leading-relaxed text-left">
                        <strong className="text-white block font-semibold">Diagnostic Classifier (Decision Rules):</strong>
                        Enter clinical values. Formulate diagnostic predictions instantly using calculated index models.
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        
                        {/* Clinical form fields */}
                        <div className="flex flex-col gap-4 text-left font-mono">
                          
                          {/* Age field slider */}
                          <div>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-slate-400">Demographic Age:</span>
                              <span className="text-rose-400 font-bold">{cirrhosisAge} yrs</span>
                            </div>
                            <input
                              type="range"
                              min="20"
                              max="85"
                              value={cirrhosisAge}
                              onChange={(e) => setCirrhosisAge(parseInt(e.target.value))}
                              className="w-full accent-rose-500 h-1.5 bg-slate-950 rounded-lg appearance-none cursor-ew-resize"
                            />
                          </div>

                          {/* Bilirubin slider */}
                          <div>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-slate-400">Serum Bilirubin (mg/dL):</span>
                              <span className="text-rose-400 font-bold">{cirrhosisBilirubin}</span>
                            </div>
                            <input
                              type="range"
                              min="0.3"
                              max="12.0"
                              step="0.1"
                              value={cirrhosisBilirubin}
                              onChange={(e) => setCirrhosisBilirubin(parseFloat(e.target.value))}
                              className="w-full accent-rose-500 h-1.5 bg-slate-950 rounded-lg appearance-none cursor-ew-resize"
                            />
                          </div>

                          {/* Albumin index */}
                          <div>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-slate-400">Serum Albumin (g/dL):</span>
                              <span className="text-rose-400 font-bold">{cirrhosisAlbumin}</span>
                            </div>
                            <input
                              type="range"
                              min="1.5"
                              max="5.5"
                              step="0.1"
                              value={cirrhosisAlbumin}
                              onChange={(e) => setCirrhosisAlbumin(parseFloat(e.target.value))}
                              className="w-full accent-rose-500 h-1.5 bg-slate-950 rounded-lg appearance-none cursor-ew-resize"
                            />
                          </div>

                          {/* Ascites Toggle options */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-400">Fluid Ascites Sign:</span>
                            <div className="inline-flex gap-2 bg-slate-950 p-1 rounded-lg border border-slate-900">
                              <button
                                onClick={() => setCirrhosisAscites("yes")}
                                className={`px-2.5 py-1 text-[10px] rounded font-bold uppercase transition-all ${
                                  cirrhosisAscites === "yes" ? "bg-rose-600 text-white" : "text-slate-400 hover:text-white"
                                }`}
                              >
                                YES
                              </button>
                              <button
                                onClick={() => setCirrhosisAscites("no")}
                                className={`px-2.5 py-1 text-[10px] rounded font-bold uppercase transition-all ${
                                  cirrhosisAscites === "no" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
                                }`}
                              >
                                NO
                              </button>
                            </div>
                          </div>

                        </div>

                        {/* Calculated Diagnostics Result display */}
                        <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/40 flex flex-col justify-between text-left">
                          
                          <div>
                            <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase block mb-1">CALCULATED SCORE</span>
                            <span className="text-2xl font-mono font-black text-white">
                              {getCirrhosisRiskScore().score}
                            </span>
                          </div>

                          <div className="my-3 font-mono">
                            <span className="text-[10px] text-slate-500 uppercase block mb-1">DECISION CLASSIFIER RESULT:</span>
                            <span className={`text-xs font-black uppercase ${getCirrhosisRiskScore().text}`}>
                              {getCirrhosisRiskScore().label}
                            </span>
                          </div>

                          <div className="p-3 bg-slate-950 border border-slate-900 rounded-lg text-xs text-slate-400 leading-normal">
                            <span className="text-white font-mono font-bold text-[10px] block mb-1">RECOMMENDATION DIRECTIVE:</span>
                            {getCirrhosisRiskScore().rec}
                          </div>

                        </div>

                      </div>

                    </div>
                  )}

                  {/* Sandbox console footer status */}
                  <div className="bg-[#05070E] py-2.5 px-4 text-center border-t border-slate-800 text-[10px] text-slate-500 font-mono uppercase tracking-wider leading-none">
                    Statistical matrix online • Output is calculated dynamically or served via Gemini Server.
                  </div>

                </div>
              </div>

            </div>

          </div>
        </section>

        {/* SKILLS SECTION (Categorized, Expandable, Searchable) */}
        <section id="skills" className="py-24 px-6 relative bg-slate-950/40 border-y border-indigo-950/20">
          <div className="max-w-7xl mx-auto">
            
            {/* Header info */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6 text-left">
              <div className="flex flex-col items-start gap-1">
                <span className="font-mono text-xs text-indigo-400 uppercase tracking-widest font-bold">
                  03 // COMPUTER SCIENCE PARADIGM
                </span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
                  Core Skills & proficiencies
                </h2>
                <p className="text-slate-400 text-sm mt-1 max-w-xl">
                  Filter by field category or type a specific technology node to audit proficiency meters instantly.
                </p>
              </div>

              {/* Live search input block */}
              <div className="flex items-center gap-3 w-full md:w-80 bg-slate-900/60 border border-slate-800/80 px-3.5 py-2.5 rounded-xl backdrop-blur-md">
                <Search className="w-4 h-4 text-slate-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Search skills dictionary..."
                  value={skillsSearch}
                  onChange={(e) => setSkillsSearch(e.target.value)}
                  className="bg-transparent border-none text-xs text-white focus:outline-none w-full placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Filter tags panel */}
            <div className="flex flex-wrap items-center gap-2 mb-10 text-xs">
              {[
                { id: "all", label: "Show All" },
                { id: "Languages & Frameworks", label: "Languages & Web Frameworks" },
                { id: "Core AI / ML", label: "Core Algorithms & AI modeling" },
                { id: "Tools & Databases", label: "Databases, version control & tools" },
                { id: "Advanced Tech", label: "Workflows, automations & prompt structures" }
              ].map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSkillsFilter(category.id)}
                  className={`px-4.5 py-2 rounded-xl transition-all font-semibold tracking-wide border ${
                    skillsFilter === category.id
                      ? "bg-slate-100 text-[#070A13] border-white shadow-xl"
                      : "bg-slate-900/40 text-slate-400 border-slate-800/80 hover:text-white hover:border-slate-700"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Dynamic Grid of detailed meters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredSkills.map((skill, sIdx) => (
                  <motion.div
                    key={skill.name}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: sIdx * 0.02 }}
                    whileHover={{ y: -3 }}
                    className="p-5 bg-[#090E1B] border border-slate-800/80 rounded-2xl flex flex-col justify-between shadow-lg relative group transition-colors hover:border-slate-750"
                  >
                    <div>
                      {/* Badge overlay category */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[9px] text-[#22d3ee] uppercase tracking-wide">
                          {skill.category}
                        </span>
                        <span className="font-mono text-xs font-bold text-white bg-slate-900 border border-slate-850 px-2 py-0.5 rounded-md">
                          {skill.level}%
                        </span>
                      </div>

                      <h4 className="font-display font-extrabold text-base text-white mb-3">
                        {skill.name}
                      </h4>
                    </div>

                    {/* Animated custom value gauge bars */}
                    <div className="w-full">
                      <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden relative border border-slate-900">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className={`h-full bg-gradient-to-r ${skill.color} rounded-full`}
                        />
                      </div>
                    </div>

                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Empty skills fallback message */}
            {filteredSkills.length === 0 && (
              <div className="p-12 text-center text-slate-500 font-mono text-xs bg-slate-900/30 border border-slate-850 rounded-2xl">
                No matching technologies located in index. Try search criteria such as "Python" or "n8n".
              </div>
            )}

          </div>
        </section>

        {/* EXPERIENCE TIMELINE SECTION */}
        <section id="experience" className="py-24 px-6 relative bg-slate-950/20">
          <div className="max-w-7xl mx-auto">
            
            {/* Header info */}
            <div className="text-center max-w-xl mx-auto mb-16 flex flex-col items-center gap-2">
              <span className="font-mono text-xs text-indigo-400 uppercase tracking-widest font-bold">
                04 // PROFESSIONAL ENLISTMENT
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
                Machine Learning Internships
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Two verified clinical and industrial ML research placements that define my operational capability.
              </p>
            </div>

            {/* Stepped timeline vertical node structures */}
            <div className="max-w-3xl mx-auto relative pl-6 sm:pl-10 border-l-2 border-slate-800 flex flex-col gap-12 text-left">
              
              {EXPERIENCES.map((exp, eIdx) => (
                <div key={exp.company} className="relative">
                  
                  {/* Decorative timeline node icon wrapper */}
                  <div className="absolute -left-11.5 sm:-left-16.5 top-0 w-11 h-11 rounded-full bg-slate-950 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shadow-xl z-20">
                    <Award className="w-5 h-5" />
                  </div>

                  {/* Body glass content */}
                  <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl hover:border-slate-700 transition-colors shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-500 to-purple-600" />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-4">
                      <div className="flex flex-col">
                        <h3 className="font-display font-extrabold text-lg text-white">
                          {exp.role}
                        </h3>
                        <span className="text-slate-400 font-mono text-xs mt-1">
                          {exp.company} <strong className="text-indigo-400 font-normal">({exp.program})</strong>
                        </span>
                      </div>

                      <span className="font-mono text-[10px] bg-slate-950 text-indigo-300 font-bold px-3 py-1.5 rounded-full border border-slate-850 uppercase tracking-widest shrink-0 self-start sm:self-center">
                        {exp.date}
                      </span>
                    </div>

                    {/* Responsibilities list */}
                    <div className="mb-4">
                      <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase font-black block mb-2">Key Responsibilities:</span>
                      <ul className="flex flex-col gap-2.5 text-slate-300 text-xs sm:text-sm leading-relaxed">
                        {exp.responsibilities && exp.responsibilities.map((resp, rIdx) => (
                          <li key={rIdx} className="flex items-start gap-2.5">
                            <span className="text-indigo-400 font-bold mt-1 shrink-0">✓</span>
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Key Achievements segment */}
                    {exp.achievements && exp.achievements.length > 0 && (
                      <div className="mb-5 p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/20">
                        <span className="text-[10px] font-mono tracking-wider text-purple-400 uppercase font-black flex items-center gap-1.5 mb-1.5">
                          <Sparkles className="w-3.5 h-3.5 inline text-purple-400" />
                          Key Accomplishments & Outcomes:
                        </span>
                        <ul className="text-xs text-slate-300 space-y-1.5">
                          {exp.achievements.map((ach, aIdx) => (
                            <li key={aIdx} className="flex items-start gap-1.5">
                              <span className="text-[#c084fc] font-bold shrink-0">✸</span>
                              <span>{ach}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Technologies used info footer */}
                    <div>
                      <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase font-black block mb-2">Technologies & Platforms:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {exp.technologies && exp.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-slate-950 text-indigo-200 border border-slate-850 uppercase"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>
              ))}

            </div>

          </div>
        </section>

        {/* GITHUB ACTIVITY SECTION */}
        <section id="github" className="py-24 px-6 relative bg-slate-950/40 border-t border-slate-900/80">
          <div className="max-w-7xl mx-auto">
            
            {/* Header info */}
            <div className="text-center max-w-xl mx-auto mb-16 flex flex-col items-center gap-2">
              <span className="font-mono text-xs text-indigo-400 uppercase tracking-widest font-bold">
                05 // DEVELOPER SYNC
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
                GitHub Development Activity
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Real-time snapshot of my active repositories, code contributions, and algorithmic experiments.
              </p>
            </div>

            {/* GitHub Stats Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
              
              {/* Stats Card Column */}
              <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Metric 1 */}
                <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-850 hover:border-slate-700 transition-all flex flex-col justify-between text-left h-44 shadow-lg group">
                  <div className="flex items-center justify-between">
                    <span className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 font-mono">
                      <FolderGit2 className="w-5 h-5 text-purple-400" />
                    </span>
                    <span className="text-[10px] bg-slate-950 font-mono text-slate-500 px-2 py-0.5 rounded border border-slate-900 font-bold uppercase">Repos</span>
                  </div>
                  <div>
                    <h4 className="font-display font-medium text-2xl text-white mt-4 group-hover:text-purple-300 transition-colors">15+ Projects</h4>
                    <p className="text-slate-500 text-[11px] leading-relaxed mt-1">
                      Open-source repositories hosting Python pipeline tools, classification servers, and Flask APIs.
                    </p>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-850 hover:border-slate-700 transition-all flex flex-col justify-between text-left h-44 shadow-lg group">
                  <div className="flex items-center justify-between">
                    <span className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                      <GitPullRequest className="w-5 h-5 text-indigo-400" />
                    </span>
                    <span className="text-[10px] bg-slate-950 font-mono text-slate-500 px-2 py-0.5 rounded border border-slate-900 font-bold uppercase">Commits</span>
                  </div>
                  <div>
                    <h4 className="font-display font-medium text-2xl text-white mt-4 group-hover:text-indigo-300 transition-colors">120+ Syncs</h4>
                    <p className="text-slate-500 text-[11px] leading-relaxed mt-1">
                      Code contributions incorporating statistical evaluations, ML validation, and custom n8n automations.
                    </p>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="sm:col-span-2 p-5 rounded-2xl bg-slate-900/30 border border-slate-850 text-left flex items-center gap-4">
                  <span className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Star className="w-5 h-5 text-emerald-400 animate-pulse" />
                  </span>
                  <div>
                    <h5 className="font-mono text-[9px] text-slate-500 uppercase font-black">Core Languages Contribution</h5>
                    <p className="text-slate-300 text-xs leading-relaxed mt-0.5">
                      <strong>Python (82%)</strong> dominates statistical prediction engines, backed by <strong>HTML/CSS/JS (18%)</strong> for interactive frontend rendering.
                    </p>
                  </div>
                </div>

              </div>

              {/* Promo Banner Link Column */}
              <div className="md:col-span-5 relative p-8 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-purple-950/40 border border-slate-800 flex flex-col justify-between text-left h-full min-h-[300px] overflow-hidden group shadow-2xl">
                
                {/* Visual grid backing */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />

                <div className="relative z-10">
                  <div className="flex items-center gap-1.5 text-[10px] text-purple-400 font-mono uppercase tracking-wider font-extrabold mb-4">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                    </span>
                    <span>Live Repository Deck</span>
                  </div>

                  <h3 className="font-display font-bold text-2xl text-white mb-3">
                    Explore My Open Source Base
                  </h3>
                  
                  <p className="text-slate-450 text-xs leading-relaxed mb-6">
                    Review clean-coded regression structures, fully validated Jupyter notebooks, and microservice routers right on my live GitHub profile. Built for audit compliance and recruiter-ready review.
                  </p>
                </div>

                <div className="relative z-10 mt-auto">
                  <a
                    href="https://github.com/Veera9966148"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-fuchsia-600 hover:from-purple-500 hover:via-indigo-500 hover:to-fuchsia-500 text-white font-mono font-bold text-xs uppercase tracking-wider py-4 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(147,51,234,0.35)] flex items-center justify-center gap-2 border border-purple-400/20"
                  >
                    <Github className="w-4 h-4 text-white" />
                    Visit github.com/Veera9966148
                    <ArrowUpRight className="w-4 h-4 text-purple-200" />
                  </a>
                </div>

              </div>

            </div>

          </div>
        </section>
        <section id="certifications" className="py-24 px-6 relative bg-slate-950/60 border-t border-slate-900/80">
          <div className="max-w-7xl mx-auto">
            
            {/* Header info */}
            <div className="text-center max-w-xl mx-auto mb-16 flex flex-col items-center gap-2">
              <span className="font-mono text-xs text-indigo-400 uppercase tracking-widest font-bold">
                05 // ACADEMIC ACCREDITATION
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
                Certifications & Achievements
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Completed professional specializations that validate my computer science and clinical engineering credentials.
              </p>
            </div>

            {/* Certs grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {CERTIFICATIONS.map((cert) => (
                <div
                  key={cert.title}
                  className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-colors shadow-xl flex flex-col justify-between"
                >
                  <div className="flex flex-col gap-4">
                    
                    {/* Top layout title */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl text-slate-400">
                        <Award className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div className="flex flex-col text-left flex-1">
                        <h4 className="font-display font-bold text-base text-white leading-tight">
                          {cert.title}
                        </h4>
                        <span className="text-xs text-slate-500 mt-1 font-mono">{cert.issuer}</span>
                      </div>
                    </div>

                    {/* Skill tags */}
                    <div className="flex flex-wrap gap-1.5 border-t border-slate-850 pt-4">
                      {cert.skills.map((s) => (
                        <span
                          key={s}
                          className="text-[9px] font-mono font-bold tracking-tight px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-900 uppercase"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                  </div>

                   {/* bottom serial audit */}
                  <div className="border-t border-slate-850 pt-4 mt-6 flex flex-col sm:flex-row sm:items-center justify-between text-[10px] text-slate-400 font-mono gap-4">
                    <div>
                      <span className="text-slate-600 mr-1.5">CRED ID:</span>
                      <span className="text-slate-300 select-all font-bold">{cert.idCode}</span>
                    </div>

                    <a
                      href={cert.link !== "#" ? cert.link : "https://www.google.com/search?q=" + encodeURIComponent(cert.title)}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-indigo-600/10 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/20 px-3.5 py-1.5 rounded-lg transition-all inline-flex items-center gap-1.5 uppercase tracking-wider font-extrabold text-[10px]"
                    >
                      View Credential
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>

                </div>
              ))}
            </div>

          </div>
        </section>

        {/* RECRUITER CONTACT FORM */}
        <section id="contact" className="py-24 px-6 bg-slate-950/20 border-t border-slate-900/80">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
              
              {/* Left Column Description details */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-8">
                <div className="flex flex-col gap-4">
                  <span className="font-mono text-xs text-indigo-400 uppercase tracking-widest font-bold">
                    06 // DATA INTERFACING
                  </span>
                  <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
                    Submit Inquiries
                  </h2>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Have an internship project, recruitment slot, back-end code audit, or simply want to schedule a brief call? Transmission is encrypted and logged dynamically.
                  </p>
                </div>

                {/* Direct info links */}
                <div className="flex flex-col gap-4 border-t border-slate-900 pt-6">
                  
                  {/* Email row */}
                  <div className="flex items-center gap-3.5 font-mono text-xs">
                    <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                      <Mail className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase leading-none">EMAIL ROUTE</div>
                      <a href="mailto:veereshkumar7601@gmail.com" className="hover:text-indigo-400 text-slate-300 underline font-semibold mt-1 block">
                        veereshkumar7601@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* GitHub link */}
                  <div className="flex items-center gap-3.5 font-mono text-xs">
                    <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                      <Github className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase leading-none">CODE DEPOSITORIES</div>
                      <a href="https://github.com/Veera9966148" target="_blank" rel="noreferrer" className="hover:text-indigo-400 text-slate-300 underline font-semibold mt-1 block">
                        github.com/Veera9966148
                      </a>
                    </div>
                  </div>

                  {/* LinkedIn flow */}
                  <div className="flex items-center gap-3.5 font-mono text-xs">
                    <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                      <Linkedin className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase leading-none">PROFESSIONAL GRAPH</div>
                      <a href="https://linkedin.com/in/veeresh-kumar-31646a34b" target="_blank" rel="noreferrer" className="hover:text-indigo-400 text-slate-300 underline font-semibold mt-1 block">
                        linkedin.com/in/veeresh-kumar-31646a34b
                      </a>
                    </div>
                  </div>

                </div>

                {/* Recruiter Inbox Toggle Widget */}
                <div className="bg-slate-900/50 border border-slate-800/80 p-4.5 rounded-2xl flex items-center justify-between shadow-xl mt-4">
                  <div className="text-left">
                    <span className="font-mono text-[9px] text-[#fbbf24] font-bold block mb-1 uppercase">RECRUITER WORKSPACE</span>
                    <h5 className="font-display font-extrabold text-sm text-white">Review Submissions</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">Toggle local inbox to audit logged replies.</p>
                  </div>
                  <button
                    onClick={() => setRecruiterInboxOpen(!recruiterInboxOpen)}
                    className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-white rounded-xl transition-all shadow shrink-0 inline-flex items-center gap-1 text-xs font-semibold"
                  >
                    <Eye className="w-4 h-4 text-[#fbbf24]" />
                    {recruiterInboxOpen ? "Hide Inbox" : "Show Inbox"}
                  </button>
                </div>

              </div>

              {/* Right Column Glass Panel Form */}
              <div className="lg:col-span-7">
                <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl relative shadow-2xl relative">
                  
                  {/* Floating success toast indicator */}
                  <AnimatePresence>
                    {contactSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="p-4.5 mb-6 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-start gap-3 shadow-2xl leading-relaxed"
                      >
                        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-bold text-white mb-0.5 font-sans">Transmission Broadcast Success!</strong>
                          Your inquiry is saved in Veeresh's local portal database. Click "Show Inbox" on the left panel to review it instantly!
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handleSubmitMessage} className="flex flex-col gap-5">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Name input */}
                      <div className="flex flex-col text-left">
                        <label className="text-[10px] text-slate-500 font-mono tracking-wider font-bold mb-1.5">RECRUITER / VISITOR NAME *</label>
                        <input
                          type="text"
                          required
                          value={nameInput}
                          onChange={(e) => setNameInput(e.target.value)}
                          placeholder="e.g. Rachel Green"
                          className="bg-slate-950 border border-slate-850 p-3.5 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-700"
                        />
                      </div>

                      {/* Email input */}
                      <div className="flex flex-col text-left">
                        <label className="text-[10px] text-slate-500 font-mono tracking-wider font-bold mb-1.5">EMAIL ADDR ENVELOPE *</label>
                        <input
                          type="email"
                          required
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          placeholder="rachel@techcorp.com"
                          className="bg-slate-950 border border-slate-850 p-3.5 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-700"
                        />
                      </div>

                    </div>

                    {/* Subject input */}
                    <div className="flex flex-col text-left">
                      <label className="text-[10px] text-slate-500 font-mono tracking-wider font-bold mb-1.5">SUBJECT LINE</label>
                      <input
                        type="text"
                        value={subjectInput}
                        onChange={(e) => setSubjectInput(e.target.value)}
                        placeholder="AI/ML Intern Role / Direct consultation..."
                        className="bg-slate-950 border border-slate-850 p-3.5 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-700"
                      />
                    </div>

                    {/* Message content */}
                    <div className="flex flex-col text-left">
                      <label className="text-[10px] text-slate-500 font-mono tracking-wider font-bold mb-1.5">MESSAGE DETAILS *</label>
                      <textarea
                        required
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        rows={5}
                        placeholder="Describe target requirements or query specifications here..."
                        className="bg-slate-950 border border-slate-850 p-3.5 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-700 leading-relaxed resize-none"
                      />
                    </div>

                    {/* Submit layout button */}
                    <button
                      type="submit"
                      disabled={contactLoader || !nameInput || !emailInput || !messageInput}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-wider hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg border border-indigo-400/20 flex items-center justify-center gap-2"
                    >
                      {contactLoader ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          <span>BROADCASTING TRANSACTION...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>SEND PORTAL INQUIRY</span>
                        </>
                      )}
                    </button>

                  </form>

                </div>
              </div>

            </div>

            {/* Recruiter Inbox Panel Drawer (Interactive feedback showcase) */}
            <AnimatePresence>
              {recruiterInboxOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  className="mt-12 p-6 rounded-2xl bg-slate-950/90 border border-[#fbbf24]/30 shadow-2xl relative text-left"
                >
                  <div className="absolute top-4 right-4 flex items-center gap-3">
                    <span className="font-mono text-[9px] bg-slate-900 border border-[#fbbf24]/30 px-2 py-1 text-[#fbbf24] font-bold rounded">
                      SESSION DATABASE
                    </span>
                    <button
                      onClick={() => setRecruiterInboxOpen(false)}
                      className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="font-display font-bold text-xl text-white mb-2 flex items-center gap-2">
                    <Database className="w-5 h-5 text-[#fbbf24]" />
                    Recruiter Inbox Desk
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xl mb-6 leading-relaxed">
                    This is a secure live console parsing submissions saved in standard local client persistence arrays. Ensure proper compliance.
                  </p>

                  <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-2">
                    {inboxEmails.length === 0 ? (
                      <div className="text-center py-10 border border-slate-900 rounded-xl font-mono text-xs text-slate-600 italic">
                        Inbox database empty. Submit the contact form above to write a record simulation.
                      </div>
                    ) : (
                      inboxEmails.map((item) => (
                        <div
                          key={item.id}
                          className="bg-slate-900 border border-slate-850 p-4.5 rounded-xl relative flex flex-col justify-between gap-3 relative overflow-hidden group hover:border-[#fbbf24]/20 transition-all"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5 h-full">
                            <div className="text-left font-sans">
                              <h5 className="font-bold text-sm text-white">
                                {item.subject}
                              </h5>
                              <p className="text-[11px] text-indigo-300 font-mono mt-1">
                                Sender: {item.name} ({item.email})
                              </p>
                              <p className="text-xs text-slate-400 mt-2 leading-relaxed font-sans bg-slate-950/70 p-3 rounded-lg border border-slate-950">
                                {item.message}
                              </p>
                            </div>

                            <div className="flex flex-col items-start sm:items-end gap-2.5 shrink-0 uppercase tracking-widest font-mono text-[9px]">
                              <span className="text-slate-500 font-medium">{item.date}</span>
                              <button
                                onClick={() => handleDeleteInquiry(item.id)}
                                className="text-rose-400 hover:text-rose-500 hover:bg-rose-500/10 p-1.5 rounded transition-all flex items-center gap-1 font-mono hover:underline"
                                title="Delete inquiry record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                DELETE
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </section>

      </main>

      {/* MODERN STAR-STUDDED FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 px-6 relative z-10 text-center md:text-left">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-[11px] text-slate-450">
          
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-white font-semibold">© 2026 Veeresh Kumar</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">AI/ML Engineer</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">Python Developer</span>
            </div>
            <div className="text-slate-500 mt-1">
              Google AI Studio Verified Recruiter-Ready Portfolio
            </div>
          </div>

          <div className="flex items-center flex-wrap justify-center gap-4 text-xs font-bold text-slate-300">
            <a
              href="https://github.com/Veera9966148"
              target="_blank"
              rel="noreferrer"
              className="hover:text-purple-400 transition-colors inline-flex items-center gap-1 hover:underline"
            >
              <Github className="w-3.5 h-3.5" />
              GitHub
            </a>
            <span className="text-slate-700">|</span>
            <a
              href="https://linkedin.com/in/veeresh-kumar-31646a34b"
              target="_blank"
              rel="noreferrer"
              className="hover:text-indigo-400 transition-colors inline-flex items-center gap-1 hover:underline"
            >
              <Linkedin className="w-3.5 h-3.5" />
              LinkedIn
            </a>
            <span className="text-slate-700">|</span>
            <a
              href="mailto:veereshkumar7601@gmail.com"
              className="hover:text-fuchsia-400 transition-colors inline-flex items-center gap-1 hover:underline"
            >
              <Mail className="w-3.5 h-3.5" />
              Email
            </a>
          </div>

        </div>
      </footer>

      {/* INTERACTIVE POPUP RESUME MODAL VIEWER */}
      <AnimatePresence>
        {resumeOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white text-neutral-900 rounded-2xl w-full max-w-4xl p-6 sm:p-10 shadow-2xl relative my-8 text-left"
            >
              
              {/* Modal window buttons */}
              <div className="absolute top-4 right-4 flex items-center gap-2 print:hidden">
                <button
                  onClick={handlePrintResume}
                  className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 p-2 rounded-xl transition-all inline-flex items-center gap-1.5 text-xs font-semibold"
                  title="Print or Save PDF"
                >
                  <Printer className="w-4 h-4 text-neutral-700" />
                  Print / Save PDF
                </button>
                <button
                  onClick={() => setResumeOpen(false)}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-2 rounded-xl transition-all inline-flex items-center"
                  aria-label="Close resume viewer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Printable container contents */}
              <div className="font-sans text-neutral-800 printable-resume">
                
                {/* Printable header */}
                <div className="border-b-2 border-neutral-800 pb-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                  <div className="text-left">
                    <h1 className="font-display font-black text-3xl sm:text-4xl text-neutral-900 tracking-tight leading-none uppercase">
                      Veeresh Kumar
                    </h1>
                    <p className="font-mono text-xs text-indigo-700 tracking-wider font-extrabold uppercase mt-2">
                      Computer Science Student // AI & ML Engineer
                    </p>
                  </div>
                  <div className="flex flex-col text-left md:text-right font-mono text-[11px] text-neutral-500 leading-relaxed shrink-0">
                    <span>Email: veereshkumar7601@gmail.com</span>
                    <span>Github: github.com/Veera9966148</span>
                    <span>LinkedIn: linkedin.com/in/veeresh-kumar-31646a34b</span>
                  </div>
                </div>

                {/* Resume layout column grids */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  
                  {/* Left columns (Summary, Skills, Education) */}
                  <div className="md:col-span-8 flex flex-col gap-6 text-left">
                    
                    {/* Executive Summary */}
                    <div>
                      <h4 className="font-display font-extrabold text-xs uppercase tracking-widest text-[#4f46e5] border-b border-neutral-300 pb-1.5 mb-3 font-mono">
                        Executive Summary
                      </h4>
                      <p className="text-xs leading-relaxed text-neutral-600 font-sans">
                        Enthusiastic Computer Science undergraduate with hands-on technical internship experience focusing on training machine learning predictors, scripting backend REST interfaces via Flask, and synthesizing robust workflow automations inside n8n ecosystems. Passionate about solving concrete diagnostic and telemetry problems cleanly.
                      </p>
                    </div>

                    {/* Internships Experience timeline */}
                    <div>
                      <h4 className="font-display font-extrabold text-xs uppercase tracking-widest text-[#4f46e5] border-b border-neutral-300 pb-1.5 mb-4 font-mono">
                        Professional Internship Training
                      </h4>
                      <div className="flex flex-col gap-5">
                        {/* google internship */}
                        <div>
                          <div className="flex items-center justify-between text-xs font-bold font-sans">
                            <span className="text-neutral-900 uppercase">Machine Learning Intern — Google India Education Program</span>
                            <span className="text-indigo-600 shrink-0 font-mono">Aug 2025 - Oct 2025</span>
                          </div>
                          <span className="text-[10px] text-neutral-400 block font-mono">Affiliated through SmartInternz Hub</span>
                          <ul className="list-disc list-inside text-[11px] text-neutral-600 mt-2 leading-relaxed flex flex-col gap-1 pl-1">
                            <li>Formulated statistical predictions and data classification architectures using Scikit-earn and PyTorch.</li>
                            <li>Trained and validated neural networks over multidimensional datasets in collaborative clusters.</li>
                            <li>Integrated statistical estimations cleanly into standard back-end structures.</li>
                          </ul>
                        </div>

                        {/* smartinternz internship */}
                        <div>
                          <div className="flex items-center justify-between text-xs font-bold font-sans">
                            <span className="text-neutral-900 uppercase">Machine Learning Research Intern — SmartInternz APSCHE</span>
                            <span className="text-indigo-600 shrink-0 font-mono">May 2025 - Jul 2025</span>
                          </div>
                          <span className="text-[10px] text-neutral-400 block font-mono">Academic Collaboration Project Program</span>
                          <ul className="list-disc list-inside text-[11px] text-neutral-600 mt-2 leading-relaxed flex flex-col gap-1 pl-1">
                            <li>Orchestrated exploratory data analysis (EDA), feature vectors extraction, and outliers cleansing pipelines.</li>
                            <li>Implemented local microservices and API modules using Flask to deploy regression scoring predictors.</li>
                            <li>Generated robust research documentation regarding statistical outputs to guide future clinical workflows.</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Academic Projects details */}
                    <div>
                      <h4 className="font-display font-extrabold text-xs uppercase tracking-widest text-[#4f46e5] border-b border-neutral-300 pb-1.5 mb-4 font-mono">
                        Featured Software Projects
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {PROJECTS.map((proj) => (
                          <div key={proj.id} className="p-3 bg-neutral-50 rounded-xl border border-neutral-205">
                            <h5 className="font-bold text-xs text-neutral-900 uppercase leading-snug">{proj.title}</h5>
                            <p className="text-[10px] text-neutral-500 mt-1 leading-normal">{proj.description}</p>
                            <span className="text-[9px] font-mono font-bold text-indigo-700 block mt-2">Impact: {proj.impact}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Right columns (Technical skills directory, Credentials) */}
                  <div className="md:col-span-4 flex flex-col gap-6 text-left">
                    
                    {/* Core metrics directory */}
                    <div>
                      <h4 className="font-display font-extrabold text-xs uppercase tracking-widest text-[#4f46e5] border-b border-neutral-300 pb-1.5 mb-3 font-mono">
                        Academic Profile
                      </h4>
                      <div className="flex flex-col gap-2 font-mono text-[11px] text-neutral-600">
                        <div className="flex justify-between">
                          <span>DEGREE:</span>
                          <span className="text-neutral-900 font-bold">B.Tech (CS Candidate)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>FOCUS:</span>
                          <span className="text-neutral-900 font-bold">Artificial Intelligence</span>
                        </div>
                        <div className="flex justify-between">
                          <span>NATIONALITY:</span>
                          <span className="text-neutral-900 font-bold">India</span>
                        </div>
                      </div>
                    </div>

                    {/* Skills Checklist */}
                    <div>
                      <h4 className="font-display font-extrabold text-xs uppercase tracking-widest text-[#4f46e5] border-b border-neutral-300 pb-1.5 mb-3 font-mono">
                        Skills Inventory
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {SKILLS.map((s) => (
                          <span
                            key={s.name}
                            className="text-[10px] bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-mono font-semibold px-2 py-0.5 rounded border border-neutral-200"
                          >
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Verified credentials timeline */}
                    <div>
                      <h4 className="font-display font-extrabold text-xs uppercase tracking-widest text-[#4f46e5] border-b border-neutral-300 pb-1.5 mb-3 font-mono">
                        Accreditations
                      </h4>
                      <div className="flex flex-col gap-3 font-sans text-xs">
                        {CERTIFICATIONS.map((cert) => (
                          <div key={cert.title}>
                            <h6 className="font-extrabold text-neutral-900 leading-snug">{cert.title}</h6>
                            <span className="text-[10px] text-neutral-500 font-sans">{cert.issuer}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>

                {/* Print layout footer stamp detail */}
                <div className="border-t-2 border-neutral-800 pt-6 mt-10 text-center font-mono text-[10px] text-neutral-400">
                  Transmitted securely and generated via interactive client nodes on target request.
                </div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
