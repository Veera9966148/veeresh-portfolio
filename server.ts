import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoints go here FIRST
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient() {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY || "";
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        throw new Error("GEMINI_API_KEY is not defined");
      }
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return aiClient;
  }

  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      let replyText = "";
      try {
        const ai = getGeminiClient();
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: message,
          config: {
            systemInstruction: `You are the Virtual AI Assistant for Veeresh Kumar, an AI/ML Engineer and CS student.
Your goals and personality:
- Be highly professional, technical, helpful, and recruiter-friendly.
- Speak in the first-person (e.g., "I designed..." or "My skills are...") representing Veeresh.
- Speak with technical clarity, reflecting modern ML/AI startup vibes.
- Refer to your skills: Python, Machine Learning, Flask, Scikit-learn, Pandas, NumPy, JavaScript, HTML5, CSS3, SQL (MongoDB/SQLite), Git, GitHub, n8n workflow automation, Prompt Engineering, and REST APIs.
- Refer to your projects:
  1. AI Career Assistant Bot (driven by Gemini API, Telegram Bot integration, and n8n Automation with prompt engineering)
  2. Wind Turbine Energy Prediction (utilizing Random Forest models, deployed via Flask for real-time inference predictions)
  3. PDF Explainer Bot (natural language processing over PDFs via Flask and AI embeddings)
  4. Liver Cirrhosis Prediction System (Logistic Regression, Decision Trees, and detailed visual data analysis)
- Refer to your academic highlights and professional experience:
  - Computer Science undergraduate
  - Machine Learning Intern at Google India Education Program via SmartInternz
  - Machine Learning Intern at SmartInternz APSCHE Program
- Keep answers relatively concise and beautifully organized. Do not write extremely long paragraphs.`
          }
        });

        replyText = response.text || "I am sorry, I couldn't process that.";
      } catch (e: any) {
        console.warn("Gemini API error, using mock:", e.message);
        replyText = getMockResponse(message);
      }

      res.json({ text: replyText });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static fallback
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

function getMockResponse(userMsg: string): string {
  const msg = userMsg.toLowerCase();
  
  if (msg.includes("skill") || msg.includes("tech") || msg.includes("know") || msg.includes("languages")) {
    return "I specialize in Python and Machine Learning systems, using frameworks like **Scikit-learn, Pandas, NumPy, and Flask** for scalable backends. I've also mastered workflow orchestration with **n8n** and build sleek responsive interfaces with **React and custom Tailwind CSS**.";
  }
  if (msg.includes("project") || msg.includes("portfolio") || msg.includes("code") || msg.includes("work")) {
    return "I have completed multiple real-world projects recently:\n\n1. **AI Career Assistant Bot**: Deployed Gemini API and n8n workflows integrated with a Telegram bot.\n2. **Wind Turbine Energy Prediction**: Preprocessed sensor metrics and trained a Random Forest regressor with instant Flask prediction.\n3. **PDF Explainer Bot**: Flask application analyzing dense PDF texts using NLP algorithms.\n4. **Liver Cirrhosis Prediction**: Applied ML Classifiers for precise stage diagnosis on health metrics.\n\nTake a look around the Projects block to filter and analyze the metrics directly!";
  }
  if (msg.includes("intern") || msg.includes("experience") || msg.includes("job") || msg.includes("smartinternz")) {
    return "I have completed two substantial Machine Learning internships:\n\n- **Google India Education Program via SmartInternz**: Focused on modeling architectures and statistical classifications.\n- **SmartInternz APSCHE Program**: Built production models and trained predictors.\n\nThese roles honed my capacity to deploy statistical estimators in enterprise environments. I am eagerly seeking roles for internship/full-time AI Engineering vacancies!";
  }
  if (msg.includes("cert") || msg.includes("google developers") || msg.includes("achievement") || msg.includes("badge")) {
    return "My core verified credentials include:\n\n- **Google Developers Machine Learning Crash Course**\n- **SmartInternz AI/ML Internship Specialization**\n- **Kaggle Machine Learning Achievement Badge**\n- **MongoDB Database Fundamentals**\n\nYou can inspect these inside the Certifications section of my website.";
  }
  if (msg.includes("contact") || msg.includes("email") || msg.includes("github") || msg.includes("linkedin")) {
    return "You can reach me instantly at **veereshkumar7601@gmail.com**, see my code portfolios at [github.com/Veera9966148](https://github.com/Veera9966148), or connect professionally at [linkedin.com/in/veeresh-kumar-31646a34b](https://linkedin.com/in/veeresh-kumar-31646a34b).";
  }
  return "Hello! I am Veeresh Kumar's dedicated AI Portfolio Assistant. Feel free to ask me questions about my **Machine Learning projects**, my **Python specialization**, my **internship experience**, or how you can get in touch with me directly. How can I help you today?";
}

startServer();
