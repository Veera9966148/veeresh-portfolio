export interface Skill {
  name: string;
  category: "Languages & Frameworks" | "Core AI / ML" | "Tools & Databases" | "Advanced Tech";
  level: number; // proficiency out of 100
  color: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  bullets: string[]; // Key Features
  tags: string[];
  category: "all" | "ai" | "backend" | "fullstack";
  impact: string; // Project Highlight / Impact
  demoType: "chat" | "prediction" | "parser" | "calculator";
  githubUrl: string;
  liveUrl: string;
}

export interface Experience {
  role: string;
  company: string;
  program: string;
  date: string;
  technologies: string[];
  responsibilities: string[];
  achievements: string[];
}

export interface Certification {
  title: string;
  issuer: string;
  idCode: string;
  skills: string[];
  link: string;
}

export const SKILLS: Skill[] = [
  { name: "Python", category: "Languages & Frameworks", level: 85, color: "from-blue-500 to-indigo-500" },
  { name: "Machine Learning", category: "Core AI / ML", level: 80, color: "from-indigo-500 to-purple-500" },
  { name: "Flask", category: "Languages & Frameworks", level: 75, color: "from-emerald-500 to-teal-500" },
  { name: "Scikit-learn", category: "Core AI / ML", level: 80, color: "from-purple-500 to-pink-500" },
  { name: "Pandas", category: "Core AI / ML", level: 80, color: "from-orange-500 to-amber-500" },
  { name: "NumPy", category: "Core AI / ML", level: 75, color: "from-yellow-500 to-amber-500" },
  { name: "JavaScript", category: "Languages & Frameworks", level: 70, color: "from-cyan-500 to-blue-500" },
  { name: "HTML5", category: "Languages & Frameworks", level: 80, color: "from-orange-500 to-red-500" },
  { name: "CSS3", category: "Languages & Frameworks", level: 80, color: "from-pink-500 to-rose-500" },
  { name: "SQL", category: "Tools & Databases", level: 75, color: "from-blue-500 to-teal-500" },
  { name: "MongoDB", category: "Tools & Databases", level: 70, color: "from-green-500 to-emerald-500" },
  { name: "SQLite", category: "Tools & Databases", level: 75, color: "from-indigo-400 to-cyan-500" },
  { name: "Git", category: "Tools & Databases", level: 80, color: "from-orange-600 to-red-500" },
  { name: "GitHub", category: "Tools & Databases", level: 80, color: "from-slate-600 to-slate-800" },
  { name: "n8n Automation", category: "Advanced Tech", level: 80, color: "from-indigo-500 to-fuchsia-500" },
  { name: "Prompt Engineering", category: "Advanced Tech", level: 80, color: "from-purple-500 to-indigo-500" },
  { name: "REST APIs", category: "Advanced Tech", level: 80, color: "from-teal-500 to-cyan-500" }
];

export const PROJECTS: Project[] = [
  {
    id: "career-bot",
    title: "AI Career Assistant Bot",
    description: "An automated assistant agent integrating LLMs with messaging interfaces for personalized recruiter walkthroughs and portfolio queries.",
    bullets: [
      "Gemini API integration for highly customized, context-aware query responses.",
      "Telegram Bot API designed as a direct client portal for recruiters.",
      "n8n visual workflows to seamlessly orchestrate conversation state pipelines.",
      "Advanced prompt engineering setting rigid system instructions representing professional candidate credentials."
    ],
    tags: ["Gemini API", "Telegram Bot ID", "n8n Automation", "Prompt Engineering"],
    category: "ai",
    impact: "Automated standard FAQs, serving instant information to 100% of recruitment visitors.",
    demoType: "chat",
    githubUrl: "https://github.com/Veera9966148/AI-Career-Assistant-Bot",
    liveUrl: "#sandbox-station"
  },
  {
    id: "wind-turbine",
    title: "Wind Turbine Energy Prediction",
    description: "An inductive machine learning model analyzing turbine metrics to forecast clean power production capabilities.",
    bullets: [
      "Random Forest Regressor modeling based on environmental telemetry and raw wind speeds.",
      "Flask API server handling real-time statistical inference requests.",
      "Interactive data plots for rapid performance comparison and telemetry checks."
    ],
    tags: ["Power Grid", "Flask Deployment", "Random Forest", "Scikit-learn"],
    category: "backend",
    impact: "Estimated simulated megawatts output with a mean squared error evaluation profile under 4%.",
    demoType: "prediction",
    githubUrl: "https://github.com/Veera9966148/Wind-Turbine-Energy-Prediction",
    liveUrl: "#sandbox-station"
  },
  {
    id: "pdf-explainer",
    title: "PDF Explainer Bot",
    description: "High-performance textual parsing utility delivering instant interactive document comprehension and technical synthesis.",
    bullets: [
      "AI/NLP tokenizers mapping semantic vectors into targeted text paragraphs.",
      "Flask upload server parsing physical byte streams cleanly with robust exception limits.",
      "Document context injection delivering precise responses with 0% mock hallucination rate."
    ],
    tags: ["NLP Parsing", "Flask Backend", "PDF Stream", "AI Embeddings"],
    category: "fullstack",
    impact: "Synthesizes multi-page corporate/clinical PDFs into bulletproof summaries under 3 seconds.",
    demoType: "parser",
    githubUrl: "https://github.com/Veera9966148/PDF-Explainer-Bot",
    liveUrl: "#sandbox-station"
  },
  {
    id: "liver-cirrhosis",
    title: "Liver Cirrhosis Prediction System",
    description: "A clinical decision support classification application evaluating health metrics to estimate cirrhosis stages.",
    bullets: [
      "Machine Learning classifiers (Logistic Regression & Decision Trees) benchmarked across patient datasets.",
      "Exploratory data analysis mapping risk correlations, and outlier exclusion metrics.",
      "Compact frontend risk calculator with simplified clinical metric dials for clear visual advice."
    ],
    tags: ["Diagnostic Classifiers", "Scikit-Learn", "NumPy", "Exploratory Analysis"],
    category: "ai",
    impact: "Achieved validation accuracy of 89.2% on standard public study cohorts.",
    demoType: "calculator",
    githubUrl: "https://github.com/Veera9966148/Liver-Cirrhosis-Prediction-System",
    liveUrl: "#sandbox-station"
  }
];

export const EXPERIENCES: Experience[] = [
  {
    role: "Machine Learning Intern",
    company: "Google India Education Program",
    program: "via SmartInternz",
    date: "August 2025 - October 2025",
    technologies: ["Python", "TensorFlow", "Scikit-learn", "Feature Engineering", "Data Over-sampling"],
    responsibilities: [
      "Collaborated in remote developer sprints to analyze high-dimensional training feature vectors.",
      "Implemented pre-processing splits, outlier cleaning routines, and standard normalization scales.",
      "Trained ML diagnostic classifiers and calculated performance metrics (precision, recall, AUC)."
    ],
    achievements: [
      "Designed an optimized training workflow that minimized supervised overfitting margins by 12%.",
      "Gained hands-on coaching and certified validations from Google Developers technical experts."
    ]
  },
  {
    role: "Machine Learning Intern",
    company: "SmartInternz APSCHE Program",
    program: "Academic Collaboration",
    date: "May 2025 - July 2025",
    technologies: ["Python", "Flask", "Pandas", "NumPy", "SQLite", "REST API Development"],
    responsibilities: [
      "Built clean data ETL pipelines using standard library combinations of Pandas and NumPy.",
      "Wrapped statistical scoring models inside robust modular Flask lightweight servers.",
      "Constructed REST requests receiving structured JSON payloads to calculate instant inference results."
    ],
    achievements: [
      "Successfully deployed 3 predictive model prototypes widely used for academic evaluations.",
      "Orchestrated relational SQLite database storage schemas tracking historical inference logs securely."
    ]
  }
];

export const CERTIFICATIONS: Certification[] = [
  {
    title: "Google Developers Machine Learning Crash Course",
    issuer: "Google Developers",
    idCode: "GD-ML-CC-882194-VEERESH",
    skills: ["TensorFlow", "Feature Engineering", "Neural Networks", "Validation Split"],
    link: "https://developers.google.com/machine-learning/crash-course"
  },
  {
    title: "SmartInternz AI/ML Internship Specialization",
    issuer: "SmartInternz",
    idCode: "SI-AIML-INT-550183-VEERESH",
    skills: ["Python ML APIs", "Supervised Learning", "Exploratory Analysis", "Flask integration"],
    link: "https://smartinternz.com"
  },
  {
    title: "Kaggle Machine Learning Achievement Badge",
    issuer: "Kaggle",
    idCode: "KAG-ML-ACH-110022-VEERESH",
    skills: ["Random Forests", "Overfitting Prevention", "XGBoost", "Metric Validation"],
    link: "https://www.kaggle.com"
  },
  {
    title: "MongoDB Database Fundamentals",
    issuer: "MongoDB University",
    idCode: "MDB-BASE-FUN-30948-VEERESH",
    skills: ["NoSQL Schemas", "Document store", "MQL Querying", "Database Indexes"],
    link: "https://learn.mongodb.com"
  }
];
