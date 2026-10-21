import { UserProfile, GradeLevel, UserRole, StudentProject, TeacherMaterialDraft, StudentRecord } from '../types';
import { sampleStudents, sampleProjects } from '../data/sampleData';

const STORAGE_KEYS = {
  CURRENT_USER: 'english_spark_user',
  LANGUAGE: 'english_spark_language',
  STUDENT_RECORDS: 'english_spark_student_records',
  STUDENT_PROJECTS: 'english_spark_projects',
  TEACHER_DRAFTS: 'english_spark_teacher_drafts',
  COMPLETED_QUIZZES: 'english_spark_completed_quizzes',
  VOCAB_PROGRESS: 'english_spark_vocab_progress',
};

export const DEFAULT_STUDENT_USER: UserProfile = {
  id: 'stu_1',
  name: 'Nguyễn Bảo An',
  alias: 'Bảo An (3A1)',
  role: 'student',
  grade: 3,
  className: 'Lớp 3A1',
  avatar: '👦',
  stars: 48,
  streakDays: 5,
  badges: ['Brave Speaker', 'Vocabulary Explorer', 'Phonics Star'],
  recentScores: [
    { quizTitle: 'Colors & Animals Arena', score: 10, maxScore: 10, date: '2026-10-19' },
    { quizTitle: 'School Things Quiz', score: 9, maxScore: 10, date: '2026-10-18' },
  ],
};

export const DEFAULT_TEACHER_USER: UserProfile = {
  id: 'tch_trang',
  name: 'Cô giáo Nguyễn Thị Trang',
  alias: 'Cô Trang - TH Khoái Châu 1',
  role: 'teacher',
  grade: 3,
  className: 'Tổ Ngoại ngữ - TH Khoái Châu 1',
  avatar: '👩‍🏫',
  stars: 120,
  streakDays: 30,
  badges: ['Master Teacher', 'AI Innovator 2026', 'Inspiring Mentor'],
  recentScores: [],
};

export const DEFAULT_GUEST_USER: UserProfile = {
  id: 'guest_visitor',
  name: 'Khách tham quan & Giám khảo',
  alias: 'Khách trải nghiệm',
  role: 'guest',
  grade: 3,
  className: 'Dùng thử tự do',
  avatar: '🌟',
  stars: 20,
  streakDays: 1,
  badges: ['Honored Guest'],
  recentScores: [],
};

class StorageService {
  // Current user state
  public getCurrentUser(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (data) {
        return JSON.parse(data);
      }
    } catch {}
    return DEFAULT_STUDENT_USER;
  }

  public setCurrentUser(user: UserProfile) {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } catch {}
  }

  // Update grade for current user
  public updateGrade(grade: GradeLevel): UserProfile {
    const user = this.getCurrentUser();
    user.grade = grade;
    this.setCurrentUser(user);
    return user;
  }

  // Add stars to current student
  public addStars(count: number): number {
    const user = this.getCurrentUser();
    user.stars = (user.stars || 0) + count;
    this.setCurrentUser(user);
    return user.stars;
  }

  // Student Projects
  public getProjects(): StudentProject[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDENT_PROJECTS);
      if (data) {
        return JSON.parse(data);
      }
    } catch {}
    return sampleProjects;
  }

  public saveProject(project: StudentProject): StudentProject[] {
    const list = this.getProjects();
    const existingIndex = list.findIndex((p) => p.id === project.id);
    if (existingIndex >= 0) {
      list[existingIndex] = project;
    } else {
      list.unshift(project);
    }
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENT_PROJECTS, JSON.stringify(list));
    } catch {}
    return list;
  }

  // Teacher Drafts
  public getTeacherDrafts(): TeacherMaterialDraft[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TEACHER_DRAFTS);
      if (data) {
        return JSON.parse(data);
      }
    } catch {}
    return [
      {
        id: 'draft_1',
        title: 'Phiếu ôn tập chủ đề Animals Lớp 3',
        grade: 3,
        topic: 'Animals',
        materialType: 'quiz',
        status: 'assigned',
        assignedClass: '3A1',
        createdAt: '2026-10-18',
        items: [
          { question: 'What animal gives milk?', options: ['Cow', 'Dog', 'Cat'], correctAnswer: 'Cow' },
        ],
      },
    ];
  }

  public saveTeacherDraft(draft: TeacherMaterialDraft): TeacherMaterialDraft[] {
    const list = this.getTeacherDrafts();
    const idx = list.findIndex((d) => d.id === draft.id);
    if (idx >= 0) {
      list[idx] = draft;
    } else {
      list.unshift(draft);
    }
    try {
      localStorage.setItem(STORAGE_KEYS.TEACHER_DRAFTS, JSON.stringify(list));
    } catch {}
    return list;
  }

  // Student Records (Class Management)
  public getStudentRecords(): StudentRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDENT_RECORDS);
      if (data) {
        return JSON.parse(data);
      }
    } catch {}
    return sampleStudents;
  }

  public updateStudentRecord(record: StudentRecord): StudentRecord[] {
    const list = this.getStudentRecords();
    const idx = list.findIndex((r) => r.id === record.id);
    if (idx >= 0) {
      list[idx] = record;
    } else {
      list.push(record);
    }
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENT_RECORDS, JSON.stringify(list));
    } catch {}
    return list;
  }

  // Record Quiz Completion
  public recordQuizResult(quizTitle: string, score: number, maxScore: number) {
    const user = this.getCurrentUser();
    if (!user.recentScores) user.recentScores = [];
    user.recentScores.unshift({
      quizTitle,
      score,
      maxScore,
      date: new Date().toLocaleDateString('vi-VN'),
    });
    // Cap at 10 items
    user.recentScores = user.recentScores.slice(0, 10);
    this.addStars(Math.max(1, Math.round((score / maxScore) * 5)));
    this.setCurrentUser(user);
  }

  // Reset demo data to default
  public resetToDefaults() {
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      localStorage.removeItem(STORAGE_KEYS.STUDENT_PROJECTS);
      localStorage.removeItem(STORAGE_KEYS.TEACHER_DRAFTS);
      localStorage.removeItem(STORAGE_KEYS.STUDENT_RECORDS);
    } catch {}
  }
}

export const storageService = new StorageService();
