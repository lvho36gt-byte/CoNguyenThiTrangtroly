import React, { useState } from 'react';
import { Story, StorySegment, UserProfile } from '../types';
import { sampleStories } from '../data/sampleData';
import { audioService } from '../services/audioService';
import { storageService } from '../services/storageService';
import {
  BookMarked,
  Volume2,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  X,
  Palette,
  Lightbulb,
  Star,
  Clock,
  Layers,
} from 'lucide-react';

interface StoriesPageProps {
  currentUser: UserProfile;
  language: 'vi' | 'en';
  onStarEarned?: (newStars: number) => void;
}

export const StoriesPage: React.FC<StoriesPageProps> = ({
  currentUser,
  language,
  onStarEarned,
}) => {
  const [selectedStory, setSelectedStory] = useState<Story>(sampleStories[0]);
  const [segmentIndex, setSegmentIndex] = useState<number>(0);
  const [showTranslation, setShowTranslation] = useState<boolean>(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [selectedEnding, setSelectedEnding] = useState<string | null>(null);
  const [customEndingText, setCustomEndingText] = useState<string>('');
  const [customEndingAiFeedback, setCustomEndingAiFeedback] = useState<string>('');

  const currentSegment: StorySegment = selectedStory.segments[segmentIndex];
  const isLastSegment = segmentIndex === selectedStory.segments.length - 1;

  const handleSelectStory = (st: Story) => {
    audioService.playClickSound();
    setSelectedStory(st);
    setSegmentIndex(0);
    setShowTranslation(false);
    setQuizAnswer(null);
    setQuizSubmitted(false);
    setSelectedEnding(null);
    setCustomEndingText('');
    setCustomEndingAiFeedback('');
  };

  const handleListenSegment = () => {
    audioService.speak(currentSegment.text, 0.82, 1.05);
  };

  const handleNextSegment = () => {
    audioService.playClickSound();
    if (segmentIndex < selectedStory.segments.length - 1) {
      setSegmentIndex((i) => i + 1);
      setShowTranslation(false);
      setQuizAnswer(null);
      setQuizSubmitted(false);
    } else {
      // Completed story
      audioService.playStarSound();
      const newStars = storageService.addStars(5);
      if (onStarEarned) onStarEarned(newStars);
    }
  };

  const handlePrevSegment = () => {
    audioService.playClickSound();
    if (segmentIndex > 0) {
      setSegmentIndex((i) => i - 1);
      setShowTranslation(false);
      setQuizAnswer(null);
      setQuizSubmitted(false);
    }
  };

  const handleCheckSegmentQuiz = (optionIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswer(optionIdx);
    setQuizSubmitted(true);

    const isCorrect = optionIdx === currentSegment.question?.correctIndex;
    if (isCorrect) {
      audioService.playSuccessSound();
      const newStars = storageService.addStars(2);
      if (onStarEarned) onStarEarned(newStars);
    } else {
      audioService.playTryAgainSound();
    }
  };

  const handleGenerateEndingFeedback = () => {
    if (!customEndingText.trim()) return;
    audioService.playSuccessSound();
    setCustomEndingAiFeedback(
      `Sparky rất thích ý tưởng kết thúc truyện của em! "Đó là một cái kết vô cùng ấm áp và giàu trí tưởng tượng. Em có thể thêm từ 'happily ever after' để kết câu chuyện thật trọn vẹn nhé!"`
    );
    const newStars = storageService.addStars(3);
    if (onStarEarned) onStarEarned(newStars);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-2 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md">
            Mô hình Bước 2 & 4: Đọc truyện & Sáng tạo kết thúc
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">Story Time – Thư viện truyện tương tác</h1>
          <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
            Nghe đọc diễn cảm, câu hỏi hiểu tình tiết và tự tay chắp cánh sáng tạo cái kết mới cho câu chuyện!
          </p>
        </div>
        <div className="absolute right-4 bottom-2 text-7xl opacity-20 pointer-events-none">
          📖
        </div>
      </div>

      {/* Story Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sampleStories.map((st) => {
          const isSelected = selectedStory.id === st.id;
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => handleSelectStory(st)}
              className={`text-left p-5 rounded-3xl border-2 transition-all flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-600 shadow-md ring-2 ring-indigo-200'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{st.coverEmoji}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      Mức: {st.level}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-0.5">
                      <Clock className="w-3 h-3" />
                      {st.readTime}
                    </span>
                  </div>
                </div>

                <h3 className="font-extrabold text-slate-900 text-base line-clamp-1">{st.title}</h3>
                <p className="text-xs text-indigo-700 font-semibold">{st.vietnameseTitle}</p>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2">{st.summary}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                <span>{st.segments.length} đoạn tương tác</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Story Reader Arena */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-100 shadow-lg space-y-8">
        {/* Story Title & Segment Progress Bar */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                {selectedStory.title}
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                {selectedStory.vietnameseTitle}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">
                Đoạn {segmentIndex + 1} / {selectedStory.segments.length}
              </span>
              {/* Progress dots */}
              <div className="flex gap-1">
                {selectedStory.segments.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 rounded-full transition-all ${
                      idx === segmentIndex
                        ? 'w-6 bg-indigo-600'
                        : idx < segmentIndex
                        ? 'w-2 bg-emerald-500'
                        : 'w-2 bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Current Segment Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Illustration Emoji */}
          <div className="md:col-span-3 flex items-center justify-center p-6 bg-indigo-50/60 rounded-3xl border border-indigo-100 text-7xl shadow-inner">
            {currentSegment.imageEmoji}
          </div>

          {/* English Paragraph */}
          <div className="md:col-span-9 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <p className="text-xl sm:text-2xl font-black text-slate-900 leading-relaxed font-['Quicksand']">
                "{currentSegment.text}"
              </p>
              <button
                type="button"
                onClick={handleListenSegment}
                className="p-3 rounded-2xl bg-indigo-100 hover:bg-indigo-200 text-indigo-800 transition-colors shrink-0 cursor-pointer"
                title="Nghe đọc đoạn này"
              >
                <Volume2 className="w-6 h-6" />
              </button>
            </div>

            {/* Translation Hint Toggle */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowTranslation(!showTranslation)}
                className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{showTranslation ? 'Ẩn bản dịch tiếng Việt' : 'Xem bản dịch gợi ý'}</span>
              </button>

              {showTranslation && (
                <div className="mt-2 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm font-medium text-amber-950 animate-in fade-in duration-200">
                  {currentSegment.translation}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Comprehension Quiz if present in this segment */}
        {currentSegment.question && (
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <h4 className="font-bold text-sm text-slate-900">
                Câu hỏi đọc hiểu: {currentSegment.question.q}
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentSegment.question.options.map((opt, optIdx) => {
                const isSelected = quizAnswer === optIdx;
                const isCorrect = optIdx === currentSegment.question?.correctIndex;

                let optStyle = 'bg-white border-slate-200 text-slate-800 hover:bg-indigo-50/50';
                if (quizSubmitted) {
                  if (isCorrect) optStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                  else if (isSelected) optStyle = 'bg-rose-100 border-rose-400 text-rose-950';
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    disabled={quizSubmitted}
                    onClick={() => handleCheckSegmentQuiz(optIdx)}
                    className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold text-left transition-all cursor-pointer ${optStyle}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {quizSubmitted && (
              <p className="text-xs text-slate-600 italic pt-1">
                Giải thích: {currentSegment.question.explanation}
              </p>
            )}
          </div>
        )}

        {/* Ending Section (When at last segment) */}
        {isLastSegment && (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-6 border-2 border-purple-200 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3 className="font-extrabold text-base sm:text-lg text-purple-950">
                Sáng tạo kết thúc câu chuyện cùng AI Sparky
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Theo em, câu chuyện có thể kết thúc theo hướng nào thú vị hơn? Hãy chọn một cái kết có sẵn hoặc tự viết vài câu tiếng Anh theo trí tưởng tượng của em nhé!
            </p>

            {/* Alternative Endings choices */}
            <div className="space-y-2">
              {selectedStory.alternativeEndings.map((end) => (
                <div
                  key={end.id}
                  onClick={() => setSelectedEnding(end.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedEnding === end.id
                      ? 'bg-white border-purple-500 shadow-sm'
                      : 'bg-white/70 border-slate-200 hover:bg-white'
                  }`}
                >
                  <h4 className="font-bold text-sm text-purple-900">{end.title}</h4>
                  <p className="text-xs text-slate-700 italic mt-1">"{end.text}"</p>
                  <p className="text-xs text-slate-500 mt-1 font-semibold">
                    ⭐ Bài học: {end.moral}
                  </p>
                </div>
              ))}
            </div>

            {/* Custom Ending Form */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-700 block">
                Hoặc tự viết kết thúc của riêng em (bằng tiếng Anh):
              </label>
              <textarea
                value={customEndingText}
                onChange={(e) => setCustomEndingText(e.target.value)}
                rows={2}
                placeholder="E.g., Then Sparky and his friends had a delicious party together..."
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
              />
              <button
                type="button"
                onClick={handleGenerateEndingFeedback}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Nhận gợi ý từ Sparky (+3 ⭐)</span>
              </button>

              {customEndingAiFeedback && (
                <div className="p-3.5 rounded-2xl bg-white border border-purple-200 text-xs text-purple-900 font-semibold leading-relaxed animate-in fade-in">
                  {customEndingAiFeedback}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reader Navigation Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            disabled={segmentIndex === 0}
            onClick={handlePrevSegment}
            className="px-5 py-2.5 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-50 disabled:opacity-30 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Đoạn trước</span>
          </button>

          <button
            type="button"
            onClick={handleNextSegment}
            className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>{isLastSegment ? 'Hoàn thành truyện (+5 ⭐)' : 'Đoạn tiếp theo'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
