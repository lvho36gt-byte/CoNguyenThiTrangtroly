import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: "5mb" }));

// Initialize Gemini Client
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "English Spark",
    geminiEnabled: Boolean(ai),
    timestamp: new Date().toISOString(),
  });
});

// Endpoint: AI Speaking Partner (Sparky)
app.post("/api/gemini/speaking-partner", async (req, res) => {
  try {
    const { grade = 3, scenarioTitle, history = [], userMessage = "" } = req.body;

    if (!userMessage && history.length === 0) {
      return res.status(400).json({ error: "No input provided" });
    }

    if (ai) {
      const systemInstruction = `You are Sparky, an adorable, enthusiastic robot friend with headphones who loves helping Vietnamese primary school students (Grades 1 to 5) learn English.
Current Student Grade: Grade ${grade}.
Current Speaking Topic: ${scenarioTitle || "Friendly Chat"}.

Rules:
1. Always keep sentences short (5 to 10 words for Grade 1-3, up to 12 words for Grade 4-5).
2. Never criticize or judge. Always be warm, cheerful, and encouraging.
3. Never ask for personal information (address, phone number, real full name, family secrets).
4. Provide the response strictly in JSON format matching the schema:
{
  "botResponse": "short English sentence from Sparky",
  "vietnameseHint": "gentle Vietnamese translation/hint for student",
  "suggestedReplies": ["short phrase 1", "short phrase 2"],
  "praise": "Warm positive encouragement in Vietnamese"
}`;

      const conversationText = history
        .map((h: { sender: string; text: string }) => `${h.sender === "user" ? "Student" : "Sparky"}: ${h.text}`)
        .join("\n");

      const prompt = `Conversation history:
${conversationText}
Student just said: "${userMessage}"

Respond as Sparky according to the instructions.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({
        botResponse: parsed.botResponse || "Great job! What else do you like?",
        vietnameseHint: parsed.vietnameseHint || "Bạn thích gì nữa không nào?",
        suggestedReplies: parsed.suggestedReplies || ["I like apples.", "I like cats."],
        praise: parsed.praise || "Em nói rất tự tin và dễ thương!",
        source: "gemini",
      });
    }

    // High quality pedagogical fallback when API key is not yet set
    const fallbackResponses = getSpeakingFallback(grade, scenarioTitle, userMessage);
    return res.json({ ...fallbackResponses, source: "mock-pedagogy" });
  } catch (error: any) {
    console.error("Speaking partner error:", error);
    const fallback = getSpeakingFallback(req.body.grade || 3, req.body.scenarioTitle, req.body.userMessage);
    return res.json({ ...fallback, source: "mock-pedagogy-error-fallback" });
  }
});

// Endpoint: AI Teacher Studio Generator
app.post("/api/gemini/teacher-generate", async (req, res) => {
  try {
    const { grade = 3, topic = "Animals", materialType = "quiz", targetCount = 4, customPrompt = "" } = req.body;

    if (ai) {
      const systemInstruction = `You are an expert Primary English Curriculum Specialist designing materials for Vietnamese elementary school students (Grades 1-5).
Teacher: Cô Nguyễn Thị Trang (TH Khoái Châu 1).
Pedagogical Model: English Spark 5-step learning model.
Material Type Requested: ${materialType}.
Grade: ${grade}.
Topic: ${topic}.
Quantity: ${targetCount}.

Return pure JSON without markdown ticks:
If materialType is 'quiz':
{
  "title": "Quiz Title in Vietnamese & English",
  "items": [
    {
      "id": "q1",
      "question": "Question text in English",
      "vietnameseGuide": "Hướng dẫn ngắn tiếng Việt",
      "type": "single-choice",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Giải thích ngắn gọn cho học sinh tiểu học"
    }
  ]
}

If materialType is 'flashcard':
{
  "title": "Bộ thẻ từ vựng",
  "items": [
    {
      "word": "cat",
      "phonetic": "/kæt/",
      "meaning": "con mèo",
      "example": "I love my cute cat.",
      "category": "${topic}"
    }
  ]
}

If materialType is 'story':
{
  "title": "Story Title",
  "vietnameseTitle": "Tên truyện tiếng Việt",
  "grade": ${grade},
  "segments": [
    {
      "text": "English paragraph (1-2 sentences for primary kids).",
      "translation": "Bản dịch tiếng Việt tương ứng.",
      "promptQuestion": "Câu hỏi đọc hiểu ngắn"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `Create high quality ${materialType} for Grade ${grade} about "${topic}". Additional notes: ${customPrompt || "Suitable for Vietnamese primary curriculum"}.`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({ success: true, data: parsed, source: "gemini" });
    }

    // High quality curriculum fallback
    const fallbackData = getTeacherFallback(grade, topic, materialType, targetCount);
    return res.json({ success: true, data: fallbackData, source: "mock-curriculum" });
  } catch (error: any) {
    console.error("Teacher generate error:", error);
    const fallbackData = getTeacherFallback(req.body.grade || 3, req.body.topic || "General", req.body.materialType || "quiz", 4);
    return res.json({ success: true, data: fallbackData, source: "mock-curriculum-fallback" });
  }
});

// Endpoint: AI Student Project Feedback (Scaffolding, not doing the work)
app.post("/api/gemini/project-feedback", async (req, res) => {
  try {
    const { grade = 3, projectType = "poster", title = "", studentText = "", topic = "" } = req.body;

    if (ai && studentText) {
      const prompt = `A primary school student in Vietnam (Grade ${grade}) created a ${projectType} titled "${title}" about "${topic}".
Their English sentence/paragraph is: "${studentText}".

Provide warm, constructive pedagogical scaffolding feedback (strictly JSON, no markdown):
{
  "praise": "1-2 encouraging sentences in Vietnamese praising their effort and creative idea.",
  "vocabularySuggestion": "1 cool English word related to their topic with Vietnamese meaning.",
  "gentleUpgrade": "A gentle slight refinement of their sentence (keeping their original voice, fixing simple grammar).",
  "curiosityQuestion": "1 friendly English question to inspire them to speak or think more."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({ success: true, feedback: parsed, source: "gemini" });
    }

    return res.json({
      success: true,
      feedback: {
        praise: "Tuyệt vời lắm! Em đã rất tự tin diễn đạt ý tưởng của mình bằng tiếng Anh!",
        vocabularySuggestion: `Sparkling (/ˈspɑːr.klɪŋ/ - lấp lánh)`,
        gentleUpgrade: studentText ? studentText.trim().replace(/^i\b/g, "I") : "My lovely project.",
        curiosityQuestion: "What colors do you like most in your picture?",
      },
      source: "mock-pedagogy",
    });
  } catch (error: any) {
    console.error("Project feedback error:", error);
    return res.json({
      success: true,
      feedback: {
        praise: "Bài làm rất sáng tạo và đáng khen! Tiếp tục phát huy nhé!",
        vocabularySuggestion: "Wonderful (tuyệt vời)",
        gentleUpgrade: req.body.studentText || "Good job!",
        curiosityQuestion: "Can you tell me more about your picture?",
      },
      source: "fallback",
    });
  }
});

// Fallback logic for Speaking Corner
function getSpeakingFallback(grade: number, scenarioTitle: string = "", userMsg: string = "") {
  const normalized = (userMsg || "").toLowerCase();
  
  if (normalized.includes("hello") || normalized.includes("hi")) {
    return {
      botResponse: "Hello there! I am Sparky! What is your name?",
      vietnameseHint: "Chào bạn! Tớ là robot Sparky! Bạn tên là gì thế?",
      suggestedReplies: ["My name is An.", "Hello Sparky!"],
      praise: "Chào hỏi rất tự tin! Em hãy trả lời tên mình nhé!",
    };
  }

  if (normalized.includes("name is") || normalized.includes("i am") || normalized.includes("i'm")) {
    return {
      botResponse: "Nice to meet you! How old are you?",
      vietnameseHint: "Rất vui được làm quen với bạn! Bạn mấy tuổi rồi?",
      suggestedReplies: [`I am ${grade + 5} years old.`, "I am happy!"],
      praise: "Tuyệt vời! Em giới thiệu tên chuẩn rồi đó!",
    };
  }

  if (normalized.includes("years old") || normalized.includes("seven") || normalized.includes("eight") || normalized.includes("nine")) {
    return {
      botResponse: "Awesome! What is your favorite color?",
      vietnameseHint: "Tuyệt quá! Màu sắc yêu thích của bạn là màu gì?",
      suggestedReplies: ["I like blue.", "I like yellow and red."],
      praise: "Rất tốt! Em trả lời tuổi rất chính xác!",
    };
  }

  if (normalized.includes("color") || normalized.includes("blue") || normalized.includes("red") || normalized.includes("pink")) {
    return {
      botResponse: "Cool! I love colors too! Do you like cute animals?",
      vietnameseHint: "Tuyệt! Tớ cũng thích màu sắc lắm! Bạn có thích động vật dễ thương không?",
      suggestedReplies: ["Yes, I like cats.", "I like dogs and birds."],
      praise: "Em phát âm từ chỉ màu sắc rất tốt!",
    };
  }

  return {
    botResponse: "That sounds so fun! Can you say that one more time?",
    vietnameseHint: "Nghe thú vị quá! Em có thể nói lại một lần nữa cho Sparky nghe được không?",
    suggestedReplies: ["Yes, I can!", "I like English!"],
    praise: "Em đã rất cố gắng giao tiếp! Cứ tự tin tỏa sáng nhé!",
  };
}

// Fallback logic for Teacher Studio
function getTeacherFallback(grade: number, topic: string, materialType: string, count: number) {
  if (materialType === "flashcard") {
    return {
      title: `Bộ thẻ từ vựng Lớp ${grade} - Chủ đề ${topic}`,
      items: [
        { word: "pencil", phonetic: "/ˈpen.səl/", meaning: "bút chì", example: "I have a yellow pencil.", category: topic },
        { word: "eraser", phonetic: "/ɪˈreɪ.sər/", meaning: "cục tẩy", example: "Can I borrow your eraser?", category: topic },
        { word: "ruler", phonetic: "/ˈruː.lər/", meaning: "thước kẻ", example: "This ruler is thirty centimeters long.", category: topic },
        { word: "notebook", phonetic: "/ˈnəʊt.bʊk/", meaning: "quyển vở", example: "Open your notebook, please.", category: topic },
      ].slice(0, count),
    };
  }

  if (materialType === "story") {
    return {
      title: `The Friendly Adventure in ${topic}`,
      vietnameseTitle: `Chuyến phiêu lưu đáng yêu cùng ${topic}`,
      grade,
      segments: [
        {
          text: `One sunny morning, Sparky went to explore the world of ${topic.toLowerCase()}.`,
          translation: `Một buổi sáng đầy nắng, Sparky đi khám phá thế giới của ${topic.toLowerCase()}.`,
          promptQuestion: "Who went to explore in the morning?",
        },
        {
          text: "He met two happy friends who loved to sing in English together.",
          translation: "Bạn ấy gặp hai người bạn vui vẻ rất thích cùng nhau hát tiếng Anh.",
          promptQuestion: "What did the friends love to do?",
        },
        {
          text: "They smiled, waved their hands, and learned new wonderful words.",
          translation: "Các bạn mỉm cười, vẫy tay và cùng nhau học những từ vựng tuyệt vời.",
          promptQuestion: "How did they feel at the end?",
        },
      ],
    };
  }

  // default quiz
  return {
    title: `Phiếu bài tập Quiz Lớp ${grade} - ${topic}`,
    items: [
      {
        id: "q_demo_1",
        question: `Which word belongs to "${topic}"?`,
        vietnameseGuide: `Từ nào dưới đây thuộc chủ đề "${topic}"?`,
        type: "single-choice",
        options: ["Pencil", "Elephant", "Yellow", "Brother"],
        correctAnswer: "Pencil",
        explanation: "Pencil là bút chì, đồ dùng học tập quen thuộc của học sinh.",
      },
      {
        id: "q_demo_2",
        question: "How do you say 'con mèo' in English?",
        vietnameseGuide: "Từ 'con mèo' trong tiếng Anh là gì?",
        type: "single-choice",
        options: ["Cat", "Dog", "Bird", "Fish"],
        correctAnswer: "Cat",
        explanation: "'Cat' nghĩa là con mèo /kæt/.",
      },
      {
        id: "q_demo_3",
        question: "Look and choose: Is this a blue book?",
        vietnameseGuide: "Nhìn tranh và chọn: Đây có phải là quyển sách màu xanh không?",
        type: "single-choice",
        options: ["Yes, it is.", "No, it isn't.", "It is green.", "I don't know."],
        correctAnswer: "Yes, it is.",
        explanation: "Câu trả lời khẳng định ngắn: Yes, it is.",
      },
      {
        id: "q_demo_4",
        question: "Fill in the blank: 'I love my ______.' (gia đình)",
        vietnameseGuide: "Điền từ còn thiếu vào chỗ trống: 'I love my ______.' (gia đình)",
        type: "single-choice",
        options: ["family", "school", "friend", "teacher"],
        correctAnswer: "family",
        explanation: "'Family' nghĩa là gia đình.",
      },
    ].slice(0, count),
  };
}

// Development and Production server setups
async function startServer() {
  const isDev = process.env.NODE_ENV !== "production";

  if (isDev) {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[English Spark Server] Running at http://0.0.0.0:${PORT} (mode: ${isDev ? "dev" : "prod"})`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start English Spark server:", err);
});
