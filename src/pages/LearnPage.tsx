import React, { useState } from 'react';
import { GradeLevel, UserProfile } from '../types';
import { audioService } from '../services/audioService';
import {
  BookOpen,
  Mic,
  MessageSquare,
  BookMarked,
  Award,
  Palette,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface LearnPageProps {
  currentUser: UserProfile;
  language: 'vi' | 'en';
  navigate: (route: string) => void;
}

export const LearnPage: React.FC<LearnPageProps> = ({ currentUser, language, navigate }) => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(currentUser.grade || 3);

  const gradeUnits = [
    {
      unit: 1,
      title: 'Hello & Welcome to English Spark',
      topic: 'Greeting & Alphabet',
      vocabCount: 10,
      steps: [
        { name: 'Khởi động Phonics /æ/ /b/ /k/', route: '/phonics', done: true },
        { name: 'Thẻ từ vựng Alphabet & Numbers', route: '/vocabulary', done: true },
        { name: 'Luyện nói: "What is your name?"', route: '/speaking', done: true },
        { name: 'Đọc truyện: "The Clever Monkey"', route: '/stories', done: true },
        { name: 'Làm bài Quiz thử thách', route: '/quiz', done: true },
        { name: 'Tạo sản phẩm: Thẻ giới thiệu bản thân', route: '/projects', done: false },
      ],
    },
    {
      unit: 2,
      title: 'My Colorful World & Animals',
      topic: 'Colors & Animals',
      vocabCount: 12,
      steps: [
        { name: 'Khởi động Phonics /d/ /e/ /f/', route: '/phonics', done: true },
        { name: 'Thẻ từ vựng Colors & Pets', route: '/vocabulary', done: true },
        { name: 'Luyện nói: "My Favorite Pet"', route: '/speaking', done: false },
        { name: 'Đọc truyện: "Magical English Garden"', route: '/stories', done: false },
        { name: 'Làm bài Quiz Colors & Animals', route: '/quiz', done: false },
        { name: 'Tạo Poster: My Cute Pet Poster', route: '/projects', done: false },
      ],
    },
    {
      unit: 3,
      title: 'At School & In My Classroom',
      topic: 'School Things',
      vocabCount: 14,
      steps: [
        { name: 'Khởi động Phonics âm ghép /ch/ /sh/ /th/', route: '/phonics', done: false },
        { name: 'Thẻ từ vựng Schoolbag, Pencil, Ruler', route: '/vocabulary', done: false },
        { name: 'Luyện nói nhiệm vụ cặp "At School"', route: '/speaking', done: false },
        { name: 'Đọc truyện: "The Little Star Who Wanted to Sing"', route: '/stories', done: false },
        { name: 'Quiz tổng kết Unit 3', route: '/quiz', done: false },
        { name: 'Tạo thẻ truyện mini comic', route: '/projects', done: false },
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-2 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md">
            Lộ trình học tập phân hóa
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">Khung chương trình Tiểu học (Lớp 1–5)</h1>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
            Mỗi bài học được thiết kế trọn vẹn theo 5 bước sư phạm của English Spark: Khởi động – Học từ – Luyện nói – Đọc truyện – Sáng tạo sản phẩm.
          </p>
        </div>
        <div className="absolute right-4 bottom-2 text-7xl opacity-20 pointer-events-none">
          🗺️
        </div>
      </div>

      {/* Grade Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {([1, 2, 3, 4, 5] as GradeLevel[]).map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => {
              audioService.playClickSound();
              setSelectedGrade(g);
            }}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all shrink-0 cursor-pointer ${
              selectedGrade === g
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Chương trình Lớp {g}
          </button>
        ))}
      </div>

      {/* Units List */}
      <div className="space-y-6">
        {gradeUnits.map((u) => (
          <div
            key={u.unit}
            className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-100 shadow-sm space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                  Unit {u.unit} • Lớp {selectedGrade}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{u.title}</h3>
                <p className="text-xs text-slate-500">Chủ đề: {u.topic} • {u.vocabCount} từ trọng tâm</p>
              </div>

              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-center">
                Mô hình 5 bước hoàn chỉnh
              </span>
            </div>

            {/* Steps inside this Unit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {u.steps.map((st, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    audioService.playClickSound();
                    navigate(st.route);
                  }}
                  className="p-4 rounded-2xl border-2 border-slate-100 hover:border-blue-300 hover:bg-blue-50/40 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                        st.done
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                        {st.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-medium">Bấm để học</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
