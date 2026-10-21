import React, { useState } from 'react';
import { MascotSparky } from './MascotSparky';
import { Flame, BookOpen, MessageSquare, Palette, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { audioService } from '../services/audioService';

interface FiveStepModelProps {
  onSelectStep: (stepNumber: number, route: string) => void;
  language?: 'vi' | 'en';
}

export const FiveStepModel: React.FC<FiveStepModelProps> = ({ onSelectStep, language = 'vi' }) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      num: 1,
      titleVi: '1. Khởi động hứng thú',
      titleEn: '1. Warm-up & Spark Interest',
      icon: Flame,
      color: 'from-amber-400 to-orange-500',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
      descVi: 'Khởi động bài học bằng Chant ngữ âm, minigame đố vui, bài hát vui nhộn kích hoạt sự tò mò và hứng khởi tự nhiên của trẻ.',
      descEn: 'Warm-up with cheerful phonics chants, interactive minigames, and songs to ignite curiosity and active learning mindset.',
      route: '/phonics',
      actionVi: 'Khám phá AI Phonics & Chant',
      actionEn: 'Explore AI Phonics & Chants',
      sampleVi: 'Chant: "/æ/ - /æ/ - Apple on the tree!"',
      sampleEn: 'Chant: "/æ/ - /æ/ - Apple on the tree!"',
    },
    {
      num: 2,
      titleVi: '2. Học từ theo ngữ cảnh',
      titleEn: '2. Contextual Vocabulary',
      icon: BookOpen,
      color: 'from-emerald-400 to-teal-500',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      descVi: 'Học từ vựng qua tranh ảnh 3D lật 2 mặt, câu ví dụ thực tế và âm thanh bản ngữ chuẩn xác. Tránh học vẹt dịch từ đơn lẻ.',
      descEn: 'Acquire words through 3D flip cards, contextual real-life sentences, and authentic native audio pronunciation.',
      route: '/vocabulary',
      actionVi: 'Vào Vocabulary Adventure',
      actionEn: 'Enter Vocabulary Adventure',
      sampleVi: 'Flashcard "Pencil" kèm ví dụ: "I draw with a yellow pencil."',
      sampleEn: 'Flashcard "Pencil" with context: "I draw with a yellow pencil."',
    },
    {
      num: 3,
      titleVi: '3. Luyện nói theo nhiệm vụ',
      titleEn: '3. Task-Based Speaking',
      icon: MessageSquare,
      color: 'from-sky-400 to-blue-600',
      badgeBg: 'bg-sky-100 text-sky-800 border-sky-300',
      descVi: 'Hội thoại tương tác với robot Sparky kiên nhẫn và luyện nói theo cặp (Pair Work) thông qua các Thẻ Nhiệm Vụ sinh động.',
      descEn: 'Interactive speaking practice with patient AI Sparky and classroom pair-work using engaging task cards.',
      route: '/speaking',
      actionVi: 'Luyện nói tại Speaking Corner',
      actionEn: 'Practice in Speaking Corner',
      sampleVi: 'Tình huống "At School": Cùng bạn hỏi đáp về 3 đồ dùng học tập.',
      sampleEn: 'Scenario "At School": Ask and answer about 3 classroom objects.',
    },
    {
      num: 4,
      titleVi: '4. Sáng tạo sản phẩm học sinh',
      titleEn: '4. Student Creative Output',
      icon: Palette,
      color: 'from-purple-400 to-indigo-600',
      badgeBg: 'bg-purple-100 text-purple-800 border-purple-300',
      descVi: 'Học sinh vận dụng tiếng Anh làm poster, thẻ truyện mini comic, vẽ tranh chú thích hoặc đoạn văn ngắn của chính mình.',
      descEn: 'Students create authentic artifacts: posters, mini comic cards, illustrated drawings, and captioned projects.',
      route: '/projects',
      actionVi: 'Tạo sản phẩm tại My Project',
      actionEn: 'Create Project at My Project',
      sampleVi: 'Tự vẽ và viết: "This is my cute cat Mimi. She likes warm milk."',
      sampleEn: 'Draw and write: "This is my cute cat Mimi. She likes warm milk."',
    },
    {
      num: 5,
      titleVi: '5. Phản hồi cá nhân hóa',
      titleEn: '5. Personalized Formative Feedback',
      icon: Sparkles,
      color: 'from-rose-400 to-pink-600',
      badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
      descVi: 'Hệ thống và AI đưa ra gợi ý giàn giáo (scaffolding), vinh danh ngôi sao English Star và bảng tự đánh giá "Today I can...".',
      descEn: 'Scaffolded constructive suggestions, star milestones, and "Today I can..." self-assessment rubric.',
      route: '/my-progress',
      actionVi: 'Xem bảng thành tích cá nhân',
      actionEn: 'View Learning Milestones',
      sampleVi: 'Mục tiêu: Today I can speak 3 new words clearly!',
      sampleEn: 'Goal: Today I can speak 3 new words clearly!',
    },
  ];

  const currentStepData = steps.find((s) => s.num === activeStep) || steps[0];

  const handleStepClick = (stepNum: number) => {
    setActiveStep(stepNum);
    audioService.playClickSound();
  };

  const handleGoToActivity = () => {
    audioService.playSuccessSound();
    onSelectStep(currentStepData.num, currentStepData.route);
  };

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-100 shadow-xl relative overflow-hidden">
      {/* Background soft glow decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-amber-100/50 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 relative z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          {language === 'vi' ? 'Quy trình sư phạm chuẩn EdTech' : 'Pedagogical Framework'}
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {language === 'vi' ? 'Mô hình học tập 5 bước English Spark' : 'English Spark 5-Step Learning Framework'}
        </h2>
        <p className="text-slate-600 text-sm sm:text-base mt-2">
          {language === 'vi'
            ? 'Thiết kế lấy học sinh làm trung tâm: Khởi động hứng khởi – Khám phá ngữ cảnh – Thực hành giao tiếp – Sáng tạo sản phẩm – Đánh giá tiến bộ.'
            : 'Student-centered design: Warm up – Contextualize – Practice – Create – Reflect.'}
        </p>
      </div>

      {/* Main Diagram Area with Sparky at Center on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        {/* Step Buttons List (Mobile / Desktop) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {steps.map((st) => {
            const Icon = st.icon;
            const isSelected = activeStep === st.num;
            return (
              <button
                key={st.num}
                type="button"
                onClick={() => handleStepClick(st.num)}
                className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between group cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-500 shadow-md transform translate-x-1'
                    : 'bg-slate-50/80 hover:bg-slate-100/90 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm font-bold bg-gradient-to-br ${st.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-slate-900">
                      {language === 'vi' ? st.titleVi : st.titleEn}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {language === 'vi' ? st.descVi : st.descEn}
                    </p>
                  </div>
                </div>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform ${
                    isSelected ? 'bg-blue-600 text-white' : 'text-slate-400 group-hover:translate-x-1'
                  }`}
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Center Sparky Mascot & Visual Hub */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center p-4">
          <div className="relative flex flex-col items-center">
            {/* Mascot with Dynamic Dialogue */}
            <MascotSparky
              size="lg"
              interactive={true}
              speechBubble={
                language === 'vi'
                  ? `Bước ${activeStep}: ${currentStepData.titleVi.split('. ')[1]}!`
                  : `Step ${activeStep}: ${currentStepData.titleEn.split('. ')[1]}!`
              }
              subtext={language === 'vi' ? 'Nhấn vào Sparky để nghe chào bạn!' : 'Click Sparky for a cheerful cheer!'}
            />
            <div className="mt-4 text-center">
              <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                {language === 'vi' ? 'Robot Sparky – Trợ lý học tập thân thiện' : 'Robot Sparky – Friendly Study Buddy'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Detail Card for Selected Step */}
        <div className="lg:col-span-4">
          <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl p-5 border-2 border-blue-200 shadow-sm flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${currentStepData.badgeBg}`}>
                  {language === 'vi' ? `BƯỚC ${currentStepData.num}` : `STEP ${currentStepData.num}`}
                </span>
                <span className="text-xs text-slate-500 font-medium">English Spark Pedagogy</span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {language === 'vi' ? currentStepData.titleVi : currentStepData.titleEn}
              </h3>

              <p className="text-sm text-slate-700 leading-relaxed mb-4">
                {language === 'vi' ? currentStepData.descVi : currentStepData.descEn}
              </p>

              {/* Sample Activity Snippet */}
              <div className="bg-white rounded-xl p-3 border border-slate-200 mb-5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {language === 'vi' ? 'Ví dụ hoạt động thực tế:' : 'Sample Activity:'}
                </p>
                <p className="text-xs text-slate-800 italic font-medium">
                  {language === 'vi' ? currentStepData.sampleVi : currentStepData.sampleEn}
                </p>
              </div>
            </div>

            {/* Launch Action Button */}
            <button
              type="button"
              onClick={handleGoToActivity}
              className={`w-full py-3 px-4 rounded-xl font-bold text-white shadow-md transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r ${currentStepData.color} hover:opacity-95 hover:shadow-lg active:scale-98 cursor-pointer`}
            >
              <span>{language === 'vi' ? currentStepData.actionVi : currentStepData.actionEn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
