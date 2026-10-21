/**
 * Gemini Service client:
 * Proxies calls to server-side endpoints:
 * - /api/gemini/speaking-partner
 * - /api/gemini/teacher-generate
 * - /api/gemini/project-feedback
 */

export interface SpeakingResponse {
  botResponse: string;
  vietnameseHint: string;
  suggestedReplies: string[];
  praise: string;
  source?: string;
}

export interface ProjectFeedbackResponse {
  praise: string;
  vocabularySuggestion: string;
  gentleUpgrade: string;
  curiosityQuestion: string;
}

export const geminiService = {
  // Call AI Speaking Partner
  async chatWithSparky(
    grade: number,
    scenarioTitle: string,
    history: { sender: string; text: string }[],
    userMessage: string
  ): Promise<SpeakingResponse> {
    try {
      const res = await fetch('/api/gemini/speaking-partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade, scenarioTitle, history, userMessage }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data;
    } catch (err) {
      console.warn('Using client-side fallback for speaking partner:', err);
      // Gentle fallback
      return {
        botResponse: `I heard you say "${userMessage || 'hello'}". That is wonderful! What is your favorite animal?`,
        vietnameseHint: 'Tớ vừa nghe bạn nói đó, tuyệt lắm! Bạn thích con vật nào nhất?',
        suggestedReplies: ['I like cats.', 'I like dogs and rabbits.'],
        praise: 'Em nói rất to và dũng cảm! Hãy tiếp tục nhé!',
        source: 'client-fallback',
      };
    }
  },

  // Call AI Teacher Material Generator
  async generateTeacherMaterial(
    grade: number,
    topic: string,
    materialType: 'quiz' | 'flashcard' | 'story' | 'worksheet',
    targetCount: number = 4,
    customPrompt: string = ''
  ): Promise<any> {
    try {
      const res = await fetch('/api/gemini/teacher-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade, topic, materialType, targetCount, customPrompt }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();
      return result.data;
    } catch (err) {
      console.warn('Using curriculum fallback for teacher generator:', err);
      if (materialType === 'quiz') {
        return {
          title: `Bộ câu hỏi ôn tập ${topic} - Lớp ${grade}`,
          items: [
            {
              id: 'q_fb_1',
              question: `Choose the correct word for ${topic}:`,
              vietnameseGuide: `Chọn từ đúng liên quan đến ${topic}:`,
              type: 'single-choice',
              options: ['Apple', 'Elephant', 'Book', 'Family'],
              correctAnswer: 'Book',
              explanation: 'Từ vựng thông dụng phù hợp trình độ học sinh.',
            },
          ],
        };
      }
      return {
        title: `Học liệu ${topic}`,
        items: [],
      };
    }
  },

  // Call AI Student Project Feedback
  async getProjectFeedback(
    grade: number,
    projectType: string,
    title: string,
    studentText: string,
    topic: string
  ): Promise<ProjectFeedbackResponse> {
    try {
      const res = await fetch('/api/gemini/project-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade, projectType, title, studentText, topic }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.feedback;
    } catch (err) {
      console.warn('Using client fallback for project feedback:', err);
      return {
        praise: 'Sản phẩm của em rất sáng tạo! Cô giáo và Sparky rất tự hào về em!',
        vocabularySuggestion: 'Creative (/kriˈeɪ.tɪv/ - sáng tạo)',
        gentleUpgrade: studentText ? studentText.trim() : 'My colorful project.',
        curiosityQuestion: 'What do you love most about your picture?',
      };
    }
  },
};
