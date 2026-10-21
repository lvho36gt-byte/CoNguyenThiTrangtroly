import React from 'react';
import { UserProfile } from '../types';
import { MascotSparky } from '../components/MascotSparky';
import { FiveStepModel } from '../components/FiveStepModel';
import { audioService } from '../services/audioService';
import {
  Sparkles,
  ArrowRight,
  Mic,
  BookOpen,
  MessageSquare,
  BookMarked,
  Award,
  Palette,
  Star,
  Flame,
  CheckCircle2,
  GraduationCap,
  Users,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface HomePageProps {
  navigate: (route: string) => void;
  currentUser: UserProfile;
  language: 'vi' | 'en';
}

export const HomePage: React.FC<HomePageProps> = ({ navigate, currentUser, language }) => {
  const activities = [
    {
      id: 'phonics',
      titleVi: 'AI Phonics – Luyện phát âm',
      titleEn: 'AI Phonics & Pronunciation',
      descVi: 'Nghe phát âm chuẩn bản ngữ, luyện nói cùng microphone, nhận dạng lời nói và gợi ý phản hồi tức thì.',
      descEn: 'Listen to native audio, speak into the mic, view speech feedback with encouraging hints.',
      icon: Mic,
      color: 'from-amber-400 to-orange-500',
      tagVi: 'Bước 1 & 2',
      tagEn: 'Step 1 & 2',
      stars: '+3 ⭐',
      route: '/phonics',
    },
    {
      id: 'vocab',
      titleVi: 'Vocabulary Adventure',
      titleEn: 'Vocabulary Adventure',
      descVi: 'Khám phá thẻ từ vựng 3D lật hai mặt, minigame ghép tranh, điền từ, nghe - chọn với 6 chủ đề gần gũi.',
      descEn: '3D interactive flip cards, matching games, fill-in blanks across 6 familiar primary topics.',
      icon: BookOpen,
      color: 'from-emerald-400 to-teal-600',
      tagVi: 'Bước 2',
      tagEn: 'Step 2',
      stars: '+4 ⭐',
      route: '/vocabulary',
    },
    {
      id: 'speaking',
      titleVi: 'Speaking Corner – Góc giao tiếp',
      titleEn: 'Speaking Corner & Role-play',
      descVi: 'Trò chuyện cùng Sparky kiên nhẫn, luyện theo cặp (Pair Work) và đóng vai nhóm theo Thẻ Nhiệm Vụ.',
      descEn: 'Converse with patient AI Sparky and practice task-based pair work dialogues.',
      icon: MessageSquare,
      color: 'from-sky-400 to-blue-600',
      tagVi: 'Bước 3',
      tagEn: 'Step 3',
      stars: '+5 ⭐',
      route: '/speaking',
    },
    {
      id: 'stories',
      titleVi: 'Story Time – Đọc truyện tương tác',
      titleEn: 'Story Time Library',
      descVi: 'Nghe, đọc lặp lại, gợi ý dịch nghĩa từng đoạn, trả lời câu hỏi đọc hiểu và tự sáng tạo kết thúc truyện.',
      descEn: 'Listen, repeat, get translation hints, solve comprehension quizzes, and craft alternative story endings.',
      icon: BookMarked,
      color: 'from-indigo-400 to-purple-600',
      tagVi: 'Bước 2 & 4',
      tagEn: 'Step 2 & 4',
      stars: '+5 ⭐',
      route: '/stories',
    },
    {
      id: 'quiz',
      titleVi: 'English Quiz – Đấu trường vui',
      titleEn: 'English Quiz Arena',
      descVi: 'Trắc nghiệm sinh động, đúng/sai, ghép cặp, nghe chọn. Tự tính điểm thực tế và xem lại câu sai.',
      descEn: 'Exciting single-choice, true/false, matching, and listening challenges with instant explanations.',
      icon: Award,
      color: 'from-rose-400 to-pink-600',
      tagVi: 'Bước 5',
      tagEn: 'Step 5',
      stars: '+5 ⭐',
      route: '/quiz',
    },
    {
      id: 'projects',
      titleVi: 'My Project & Reflection',
      titleEn: 'My Project & Reflection',
      descVi: 'Tự vẽ tranh, làm poster, thẻ truyện mini comic có chú thích tiếng Anh. AI gợi mở từ vựng và câu.',
      descEn: 'Create authentic student posters, comics, drawings with scaffolded AI vocabulary assistance.',
      icon: Palette,
      color: 'from-violet-400 to-fuchsia-600',
      tagVi: 'Bước 4 & 5',
      tagEn: 'Step 4 & 5',
      stars: '+10 ⭐',
      route: '/projects',
    },
  ];

  const handleStepJump = (_step: number, route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen pb-16 space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-600 via-indigo-600 to-slate-900 text-white pt-12 pb-20 px-4 sm:px-6">
        {/* Soft background decor */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-bold text-amber-300">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Dự án AI Giáo dục Tiểu học 2026 – TH Khoái Châu 1</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              ENGLISH SPARK
              <span className="block text-xl sm:text-2xl lg:text-3xl font-extrabold text-sky-200 mt-2 font-['Quicksand']">
                AI Đồng Hành Cùng Học Sinh Tiểu Học
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-200 max-w-2xl leading-relaxed">
              {language === 'vi'
                ? 'Tăng hứng thú học tập – Phát triển giao tiếp tiếng Anh – Mỗi học sinh đều được tỏa sáng. Mô hình sư phạm 5 bước giúp trẻ tự tin phát âm, làm chủ từ vựng và tự hào tạo ra sản phẩm của chính mình!'
                : 'Ignite curiosity – Boost English communication – Every student shines. A 5-step pedagogical model empowering children to speak confidently and create authentic artifacts!'}
            </p>

            {/* Quick credentials pill */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs sm:text-sm text-slate-300 pt-1">
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-xl">
                <GraduationCap className="w-4 h-4 text-sky-300" />
                <span>GV: <strong>Nguyễn Thị Trang</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-xl">
                <Users className="w-4 h-4 text-amber-300" />
                <span>Đối tượng: <strong>Học sinh Lớp 1 – 5</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>AI an toàn, không làm thay</span>
              </div>
            </div>

            {/* Hero Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  audioService.playSuccessSound();
                  navigate('/learn');
                }}
                className="px-6 py-3.5 rounded-2xl font-black text-slate-900 bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-500 shadow-lg shadow-amber-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 text-sm sm:text-base cursor-pointer"
              >
                <span>{language === 'vi' ? 'Bắt đầu học ngay' : 'Start Learning'}</span>
                <ArrowRight className="w-5 h-5 text-slate-900" />
              </button>

              <button
                type="button"
                onClick={() => {
                  audioService.playClickSound();
                  navigate('/teacher');
                }}
                className="px-5 py-3.5 rounded-2xl font-bold text-white bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-md transition-all flex items-center gap-2 text-sm sm:text-base cursor-pointer"
              >
                <GraduationCap className="w-5 h-5 text-sky-300" />
                <span>{language === 'vi' ? 'Dành cho giáo viên' : 'Teacher Studio'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  audioService.playClickSound();
                  navigate('/about');
                }}
                className="px-4 py-3.5 rounded-2xl font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-colors text-sm cursor-pointer"
              >
                {language === 'vi' ? 'Xem minh chứng' : 'View Evidence'}
              </button>
            </div>
          </div>

          {/* Right Robot Showcase */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative p-6 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl flex flex-col items-center">
              <MascotSparky
                size="lg"
                interactive={true}
                speechBubble={
                  language === 'vi'
                    ? `Chào ${currentUser.name || 'bạn nhỏ'}! Cùng Sparky luyện phát âm và tích sao nhé!`
                    : `Hi friend! Let's practice English and shine with Sparky!`
                }
                subtext={language === 'vi' ? 'Nhấn vào Sparky để nghe chào bạn!' : 'Click Sparky to listen!'}
              />

              {/* Personal Quick Stats */}
              <div className="w-full mt-6 grid grid-cols-3 gap-2 bg-slate-900/40 rounded-2xl p-3 border border-white/10 text-center">
                <div>
                  <p className="text-[11px] text-slate-300 font-medium">Khối đang học</p>
                  <p className="text-base font-black text-amber-300">Lớp {currentUser.grade}</p>
                </div>
                <div className="border-x border-white/10">
                  <p className="text-[11px] text-slate-300 font-medium">Ngôi sao</p>
                  <p className="text-base font-black text-yellow-400 flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400" />
                    {currentUser.stars || 0}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-300 font-medium">Chuỗi ngày</p>
                  <p className="text-base font-black text-rose-400 flex items-center justify-center gap-1">
                    <Flame className="w-4 h-4 fill-rose-500" />
                    {currentUser.streakDays || 1}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12 -mt-10 relative z-20">
        {/* 5-Step Model Interactive Diagram */}
        <FiveStepModel onSelectStep={handleStepJump} language={language} />

        {/* 6 Learning Modules Cards */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                {language === 'vi' ? 'Không gian trải nghiệm toàn diện' : 'Core Learning Spaces'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                {language === 'vi' ? '6 Hoạt động học tập tương tác' : '6 Interactive Learning Modules'}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/learn')}
              className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1"
            >
              <span>{language === 'vi' ? 'Xem toàn bộ lộ trình' : 'View Curriculum Map'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((act) => {
              const Icon = act.icon;
              return (
                <div
                  key={act.id}
                  onClick={() => {
                    audioService.playClickSound();
                    navigate(act.route);
                  }}
                  className="bg-white rounded-3xl p-6 border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md bg-gradient-to-br ${act.color} group-hover:scale-110 transition-transform`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {language === 'vi' ? act.tagVi : act.tagEn}
                        </span>
                        <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          {act.stars}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {language === 'vi' ? act.titleVi : act.titleEn}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                      {language === 'vi' ? act.descVi : act.descEn}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700">
                    <span>{language === 'vi' ? 'Trải nghiệm ngay' : 'Start Activity'}</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Teacher Studio & Evidence Callout Banner */}
        <section className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
                {language === 'vi' ? 'Dành cho Thầy Cô & Ban Giám khảo' : 'For Teachers & Judges'}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                AI Teacher Studio – Soạn học liệu phân hóa trong 30 giây
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                {language === 'vi'
                  ? 'Ứng dụng Gemini 3.8 Flash hỗ trợ giáo viên xây dựng bộ Flashcard, Quiz phân hóa, câu chuyện tương tác và phiếu học tập in ấn A4 chỉ với vài thao tác. Giáo viên luôn xem trước, kiểm duyệt và lưu trước khi giao bài.'
                  : 'Empowering primary teachers to auto-generate personalized quizzes, stories, and printable worksheets with Gemini AI.'}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/teacher')}
                  className="px-5 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Mở AI Teacher Studio</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/teacher/reports')}
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>Xem báo cáo thực tế Lớp 3A1</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/about')}
                  className="px-4 py-3 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white font-semibold text-sm transition-colors cursor-pointer"
                >
                  Xem 6 trụ cột minh chứng dự án
                </button>
              </div>
            </div>

            {/* Teacher Profile Card */}
            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-rose-400 p-1 shadow-lg mb-3">
                <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-3xl">
                  👩‍🏫
                </div>
              </div>
              <h4 className="font-bold text-lg text-white">Cô giáo Nguyễn Thị Trang</h4>
              <p className="text-xs text-sky-200 mt-0.5">Giáo viên Tiếng Anh</p>
              <p className="text-xs text-slate-300 mt-1">Trường Tiểu học Khoái Châu 1</p>
              <div className="mt-4 pt-4 border-t border-white/10 text-xs text-slate-400 italic">
                "Sứ mệnh của English Spark là trao quyền cho mỗi học sinh tiểu học được cất tiếng nói tiếng Anh đầy tự tin."
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
