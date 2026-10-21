import React, { useState, useMemo } from 'react';
import { QuizQuestion, UserProfile } from '../types';
import { sampleQuizQuestions } from '../data/sampleData';
import { audioService } from '../services/audioService';
import { storageService } from '../services/storageService';
import {
  Award,
  CheckCircle2,
  XCircle,
  Volume2,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Star,
  Check,
  X,
  Clock,
  HelpCircle,
} from 'lucide-react';

interface QuizPageProps {
  currentUser: UserProfile;
  language: 'vi' | 'en';
  onStarEarned?: (newStars: number) => void;
}

export const QuizPage: React.FC<QuizPageProps> = ({ currentUser, language, onStarEarned }) => {
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<{
    questionId: string;
    chosen: string;
    correct: boolean;
  }[]>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Filter questions for the student
  const filteredQuestions = useMemo(() => {
    let pool = sampleQuizQuestions.filter(
      (q) => selectedTopic === 'All' || q.topic === selectedTopic
    );
    // Shuffle options for variety
    return pool.map((q) => ({
      ...q,
      options: [...q.options].sort(() => Math.random() - 0.5),
    }));
  }, [selectedTopic]);

  const currentQ: QuizQuestion = filteredQuestions[currentIdx] || filteredQuestions[0];

  const handleSelectOption = (opt: string) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);

    const isCorrect = opt === currentQ.correctAnswer;
    const newAnswers = [
      ...userAnswers,
      { questionId: currentQ.id, chosen: opt, correct: isCorrect },
    ];
    setUserAnswers(newAnswers);

    if (isCorrect) {
      audioService.playSuccessSound();
      setScore((s) => s + 1);
    } else {
      audioService.playTryAgainSound();
    }
  };

  const handleNext = () => {
    audioService.playClickSound();
    if (currentIdx < filteredQuestions.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Quiz finished
      setIsFinished(true);
      audioService.playStarSound();
      const finalScore = score + (selectedOption === currentQ.correctAnswer ? 0 : 0);
      storageService.recordQuizResult(
        `Quiz ${selectedTopic === 'All' ? 'Tổng hợp' : selectedTopic} (Lớp ${currentUser.grade})`,
        finalScore,
        filteredQuestions.length
      );
      if (onStarEarned) {
        onStarEarned(storageService.getCurrentUser().stars);
      }
    }
  };

  const handleRestart = () => {
    audioService.playClickSound();
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setUserAnswers([]);
    setIsFinished(false);
  };

  const handlePlayAudio = () => {
    if (currentQ.audioPrompt) {
      audioService.speak(currentQ.audioPrompt);
    }
  };

  // Wrong questions filter for review
  const wrongQuestions = filteredQuestions.filter((q) => {
    const ans = userAnswers.find((a) => a.questionId === q.id);
    return ans && !ans.correct;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-2 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md">
            Mô hình Bước 5: Thử thách & Đánh giá quá trình
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">English Quiz Arena</h1>
          <p className="text-rose-100 text-sm sm:text-base leading-relaxed">
            Thử thách kiến thức qua câu hỏi trắc nghiệm, đúng/sai và nghe chọn. Nhận giải thích chi tiết sau mỗi câu!
          </p>
        </div>
        <div className="absolute right-4 bottom-2 text-7xl opacity-20 pointer-events-none">
          🏆
        </div>
      </div>

      {/* Topic Filter Pills */}
      {!isFinished && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold text-slate-500 uppercase mr-1">Chủ đề:</span>
          {['All', 'Colors', 'Animals', 'Numbers', 'School', 'Family'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                audioService.playClickSound();
                setSelectedTopic(t);
                handleRestart();
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedTopic === t
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {t === 'All' ? 'Tất cả chủ đề' : t}
            </button>
          ))}
        </div>
      )}

      {/* Main Quiz Flow */}
      {!isFinished ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-rose-100 shadow-lg space-y-6">
          {/* Question Progress Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                {currentQ.topic} • Lớp {currentQ.grade}
              </span>
              <p className="text-xs text-slate-400 mt-1 font-semibold">
                Dạng bài: {currentQ.type}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-slate-500">
                Câu {currentIdx + 1} / {filteredQuestions.length}
              </span>
              <div className="flex items-center gap-1 text-sm font-black text-amber-700 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{score}</span>
              </div>
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              {currentQ.question}
            </h3>
            {currentQ.vietnameseGuide && (
              <p className="text-xs text-slate-500 font-medium">
                💡 Hướng dẫn: {currentQ.vietnameseGuide}
              </p>
            )}

            {/* Audio Prompt button if available */}
            {currentQ.audioPrompt && (
              <button
                type="button"
                onClick={handlePlayAudio}
                className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Bấm để nghe phát âm câu hỏi</span>
              </button>
            )}
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isCorrectAnswer = opt === currentQ.correctAnswer;

              let btnStyle =
                'bg-white border-slate-200 text-slate-800 hover:border-rose-300 hover:bg-rose-50/50';

              if (isAnswered) {
                if (isCorrectAnswer) {
                  btnStyle =
                    'bg-emerald-100 border-emerald-500 text-emerald-950 font-black ring-2 ring-emerald-300';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-100 border-rose-400 text-rose-950';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(opt)}
                  className={`p-4 rounded-2xl border-2 text-left text-sm sm:text-base font-bold transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswered && isCorrectAnswer && (
                    <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {isAnswered && isSelected && !isCorrectAnswer && (
                    <X className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Post Answer Feedback & Next Button */}
          {isAnswered && (
            <div className="pt-4 border-t border-slate-100 space-y-4 animate-in fade-in">
              <div
                className={`p-4 rounded-2xl border ${
                  selectedOption === currentQ.correctAnswer
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-sm mb-1">
                  {selectedOption === currentQ.correctAnswer ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Tuyệt vời! Em chọn hoàn toàn chính xác!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>
                        Chưa chính xác. Đáp án đúng là: <strong>"{currentQ.correctAnswer}"</strong>
                      </span>
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-700">{currentQ.explanation}</p>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>
                    {currentIdx === filteredQuestions.length - 1 ? 'Xem kết quả' : 'Câu tiếp theo'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Summary & Review Screen */
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-indigo-100 shadow-xl text-center space-y-8 animate-in zoom-in-95">
          <div className="space-y-3">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-rose-400 flex items-center justify-center text-4xl shadow-lg">
              🎉
            </div>
            <h2 className="text-3xl font-black text-slate-900">Hoàn thành thử thách Quiz!</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Chúc mừng em đã hoàn thành bộ câu hỏi. Kết quả học tập đã được lưu tự động vào bảng tiến độ cá nhân.
            </p>
          </div>

          {/* Score Stats Cards */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <p className="text-xs text-slate-500 font-bold uppercase">Số câu đúng</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">
                {score} / {filteredQuestions.length}
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <p className="text-xs text-slate-500 font-bold uppercase">Tỷ lệ chính xác</p>
              <p className="text-2xl font-black text-blue-600 mt-1">
                {Math.round((score / filteredQuestions.length) * 100)}%
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <p className="text-xs text-slate-500 font-bold uppercase">Sao thưởng</p>
              <p className="text-2xl font-black text-amber-500 mt-1 flex items-center justify-center gap-1">
                <Star className="w-5 h-5 fill-amber-400" />+{score}
              </p>
            </div>
          </div>

          {/* Wrong Questions Review Section if any */}
          {wrongQuestions.length > 0 && (
            <div className="text-left bg-rose-50/50 rounded-2xl p-5 border border-rose-200 max-w-xl mx-auto space-y-3">
              <h4 className="font-bold text-sm text-rose-950 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-rose-600" />
                Ôn lại {wrongQuestions.length} câu em cần lưu ý:
              </h4>
              <div className="space-y-2">
                {wrongQuestions.map((wq, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-xl border border-rose-200 text-xs">
                    <p className="font-bold text-slate-800">{wq.question}</p>
                    <p className="text-emerald-700 font-semibold mt-1">
                      ✓ Đáp án đúng: {wq.correctAnswer}
                    </p>
                    <p className="text-slate-500 italic mt-0.5">{wq.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={handleRestart}
              className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Làm lại bộ đề này</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
