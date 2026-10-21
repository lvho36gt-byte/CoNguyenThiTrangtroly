import React from 'react';
import { UserProfile } from '../types';
import { audioService } from '../services/audioService';
import { MascotSparky } from '../components/MascotSparky';
import {
  Star,
  Flame,
  Award,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  RotateCcw,
  Sparkles,
  Calendar,
  Volume2,
} from 'lucide-react';

interface ProgressPageProps {
  currentUser: UserProfile;
  language: 'vi' | 'en';
  navigate: (route: string) => void;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({ currentUser, language, navigate }) => {
  const allBadges = [
    { id: 'brave', name: 'Brave Speaker', icon: '🎤', desc: 'Dũng cảm luyện nói 10 câu tiếng Anh cùng Sparky', unlocked: true },
    { id: 'vocab', name: 'Vocabulary Explorer', icon: '🧭', desc: 'Khám phá hơn 20 từ vựng và minigames', unlocked: true },
    { id: 'phonics', name: 'Phonics Master', icon: '🔤', desc: 'Luyện chuẩn các âm nguyên âm và phụ âm cơ bản', unlocked: true },
    { id: 'creator', name: 'Story Creator', icon: '🎨', desc: 'Sáng tạo ít nhất 1 sản phẩm poster hoặc truyện tranh', unlocked: true },
    { id: 'streak', name: '5-Day Streak', icon: '🔥', desc: 'Kiên trì học tiếng Anh 5 ngày liên tiếp', unlocked: (currentUser.streakDays || 1) >= 5 },
    { id: 'star100', name: 'Centurion Spark', icon: '🌟', desc: 'Đạt mốc 100 Ngôi sao English Star', unlocked: (currentUser.stars || 0) >= 100 },
  ];

  const topicMastery = [
    { topic: 'Colors (Màu sắc)', percent: 95, color: 'bg-rose-500' },
    { topic: 'Animals (Động vật)', percent: 90, color: 'bg-amber-500' },
    { topic: 'School (Trường lớp)', percent: 85, color: 'bg-emerald-500' },
    { topic: 'Numbers (Số đếm)', percent: 80, color: 'bg-sky-500' },
    { topic: 'Family (Gia đình)', percent: 75, color: 'bg-indigo-500' },
    { topic: 'Blends / Phonics ghép', percent: 68, color: 'bg-purple-500' },
  ];

  const wordsToReview = [
    { word: 'Elephant', phonetic: '/ˈel.ɪ.fənt/', vi: 'con voi', tip: 'Nhấn trọng âm ở âm tiết đầu /el/' },
    { word: 'Ruler', phonetic: '/ˈruː.lər/', vi: 'cây thước kẻ', tip: 'Âm /uː/ kéo dài nhẹ' },
    { word: 'Brother', phonetic: '/ˈbrʌð.ər/', vi: 'anh/em trai', tip: 'Chú ý âm /ð/ rung lưỡi giữa hai hàm răng' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-2 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md">
            Mô hình Bước 5: Bảng thành tích cá nhân
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">Tiến độ của em – English Journey</h1>
          <p className="text-amber-100 text-sm sm:text-base leading-relaxed">
            Mỗi ngôi sao đạt được là một bước trưởng thành tự tin. Hãy cùng nhìn lại hành trình rực rỡ của em nhé!
          </p>
        </div>
        <div className="absolute right-4 bottom-2 text-7xl opacity-20 pointer-events-none">
          ⭐
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* User Card */}
        <div className="md:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-100 shadow-md flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 to-rose-400 p-1.5 shadow-lg shrink-0">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-5xl">
              {currentUser.avatar || '👦'}
            </div>
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-black text-slate-900">{currentUser.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                {currentUser.className || `Lớp ${currentUser.grade}`}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Học sinh Trường Tiểu học Khoái Châu 1 • Đang tích cực luyện tập cùng Sparky
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center">
              <div className="bg-amber-50 p-2.5 rounded-2xl border border-amber-200">
                <span className="text-[11px] font-bold text-amber-900 uppercase">Ngôi sao</span>
                <p className="text-xl font-black text-amber-600 flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400" />
                  {currentUser.stars || 0}
                </p>
              </div>

              <div className="bg-rose-50 p-2.5 rounded-2xl border border-rose-200">
                <span className="text-[11px] font-bold text-rose-900 uppercase">Chuỗi ngày</span>
                <p className="text-xl font-black text-rose-600 flex items-center justify-center gap-1">
                  <Flame className="w-4 h-4 fill-rose-500" />
                  {currentUser.streakDays || 1}
                </p>
              </div>

              <div className="bg-purple-50 p-2.5 rounded-2xl border border-purple-200">
                <span className="text-[11px] font-bold text-purple-900 uppercase">Huy hiệu</span>
                <p className="text-xl font-black text-purple-600">
                  {allBadges.filter((b) => b.unlocked).length} / {allBadges.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mascot cheer */}
        <div className="md:col-span-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-6 border-2 border-indigo-100 shadow-sm flex flex-col items-center text-center">
          <MascotSparky
            size="md"
            speechBubble="Em đã rất chăm chỉ và tiến bộ từng ngày!"
            subtext="Nhấn để nghe lời khen từ Sparky"
          />
          <button
            type="button"
            onClick={() => navigate('/learn')}
            className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            Tiếp tục bài học hôm nay →
          </button>
        </div>
      </div>

      {/* Badges Arena */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900">Huy hiệu đạt được</h3>
            <p className="text-xs text-slate-500">
              Ghi nhận những cột mốc dũng cảm và kiên trì trong học tập
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {allBadges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border-2 text-center space-y-2 transition-all ${
                b.unlocked
                  ? 'bg-amber-50/50 border-amber-300 shadow-sm'
                  : 'bg-slate-50 border-slate-200 opacity-40 grayscale'
              }`}
            >
              <div className="text-3xl">{b.icon}</div>
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">{b.name}</h4>
              <p className="text-[11px] text-slate-500 line-clamp-2">{b.desc}</p>
              {b.unlocked && (
                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  Đã mở khóa
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Topic Mastery & Words to Review */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Topic Mastery Progress Bars */}
        <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-1.5">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Mức độ làm chủ theo chủ đề
            </h3>
            <span className="text-xs text-slate-400 font-semibold">Tự động cập nhật</span>
          </div>

          <div className="space-y-4">
            {topicMastery.map((tm, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>{tm.topic}</span>
                  <span>{tm.percent}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${tm.color}`}
                    style={{ width: `${tm.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Words to Review */}
        <div className="md:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-1.5">
              <RotateCcw className="w-5 h-5 text-amber-600" />
              Từ vựng cần củng cố
            </h3>
            <span className="text-xs text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full font-bold">
              3 từ
            </span>
          </div>

          <div className="space-y-3">
            {wordsToReview.map((w, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">{w.word}</h4>
                  <button
                    type="button"
                    onClick={() => audioService.speak(w.word)}
                    className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    Nghe mẫu
                  </button>
                </div>
                <p className="text-slate-500 font-mono">
                  {w.phonetic} • {w.vi}
                </p>
                <p className="text-amber-800 font-medium">💡 Gợi ý: {w.tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Scores History */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-100 shadow-sm space-y-4">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-1.5">
          <Calendar className="w-5 h-5 text-indigo-600" />
          Nhật ký làm bài gần đây
        </h3>

        {currentUser.recentScores && currentUser.recentScores.length > 0 ? (
          <div className="space-y-2">
            {currentUser.recentScores.map((rec, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs sm:text-sm"
              >
                <div>
                  <h4 className="font-bold text-slate-900">{rec.quizTitle}</h4>
                  <p className="text-xs text-slate-400">{rec.date}</p>
                </div>
                <div className="text-right">
                  <span className="font-black text-emerald-600 text-base">
                    {rec.score} / {rec.maxScore}
                  </span>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">
                    Điểm thực tế
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">
            Chưa có bài quiz nào được ghi nhận. Em hãy vào mục Quiz để thử sức nhé!
          </p>
        )}
      </div>
    </div>
  );
};
