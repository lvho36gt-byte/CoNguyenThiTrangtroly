export type GradeLevel = 1 | 2 | 3 | 4 | 5;

export type UserRole = 'student' | 'teacher' | 'admin' | 'guest';

export interface UserProfile {
  id: string;
  name: string;
  alias: string;
  role: UserRole;
  grade: GradeLevel;
  className: string;
  avatar: string;
  stars: number;
  streakDays: number;
  badges: string[];
  recentScores: { quizTitle: string; score: number; maxScore: number; date: string }[];
}

export interface PhonicsItem {
  id: string;
  letter: string;
  soundIpa: string;
  word: string;
  phonetic: string;
  vietnameseMeaning: string;
  exampleSentence: string;
  category: 'Alphabet' | 'Vowels' | 'Consonants' | 'Blends';
  grade: GradeLevel;
  chant: string;
}

export interface VocabularyItem {
  id: string;
  word: string;
  phonetic: string;
  meaning: string;
  category: 'Alphabet' | 'Numbers' | 'Colors' | 'Animals' | 'School' | 'Family';
  grade: GradeLevel;
  example: string;
  hint: string;
  imageEmoji: string;
  mastered?: boolean;
  needsReview?: boolean;
}

export interface TaskCard {
  roleA: string;
  roleB: string;
  taskGoal: string;
  suggestedDialogue: { speaker: string; text: string; vi: string }[];
}

export interface SpeakingScenario {
  id: string;
  title: string;
  vietnameseTitle: string;
  gradeRange: '1-2' | '3-4' | '5';
  topic: string;
  description: string;
  starterMessage: string;
  starterVi: string;
  taskCard: TaskCard;
  targetVocab: string[];
}

export interface StorySegment {
  id: number;
  text: string;
  translation: string;
  imageEmoji: string;
  audioPrompt: string;
  question?: {
    q: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface StoryEndingChoice {
  id: string;
  title: string;
  text: string;
  moral: string;
}

export interface Story {
  id: string;
  title: string;
  vietnameseTitle: string;
  grade: GradeLevel;
  level: 'Dễ' | 'Vừa' | 'Nâng cao';
  readTime: string;
  coverEmoji: string;
  summary: string;
  segments: StorySegment[];
  alternativeEndings: StoryEndingChoice[];
}

export type QuestionType = 'single-choice' | 'true-false' | 'matching' | 'listen-choose' | 'fill-blank';

export interface QuizQuestion {
  id: string;
  question: string;
  vietnameseGuide: string;
  grade: GradeLevel;
  topic: string;
  type: QuestionType;
  options: string[];
  correctAnswer: string;
  explanation: string;
  audioPrompt?: string;
}

export interface StudentProject {
  id: string;
  studentId: string;
  studentName: string;
  studentGrade: GradeLevel;
  title: string;
  projectType: 'poster' | 'story-card' | 'comic' | 'dialogue' | 'video-intro';
  topic: string;
  studentText: string;
  vietnameseDescription: string;
  themeColor: string;
  imageUri?: string;
  aiFeedback?: {
    praise: string;
    vocabularySuggestion: string;
    gentleUpgrade: string;
    curiosityQuestion: string;
  };
  teacherApproved: boolean;
  teacherComment?: string;
  selfReflection: {
    listened: boolean;
    spoken: boolean;
    read: boolean;
    written: boolean;
  };
  createdAt: string;
}

export interface StudentRecord {
  id: string;
  studentCode: string;
  aliasName: string;
  grade: GradeLevel;
  className: string;
  quizzesCompleted: number;
  accuracyRate: number;
  practiceCount: number;
  topicsMastered: string[];
  needsPractice: string[];
  teacherNotes: string;
  lastActive: string;
  recentScore: number;
}

export interface TeacherMaterialDraft {
  id: string;
  title: string;
  grade: GradeLevel;
  topic: string;
  materialType: 'quiz' | 'flashcard' | 'story' | 'worksheet';
  items: any[];
  status: 'draft' | 'reviewed' | 'assigned';
  assignedClass: string;
  createdAt: string;
}
