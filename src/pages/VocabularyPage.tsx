import React, { useState } from 'react';
import { VocabularyItem, UserProfile } from '../types';
import { sampleVocabulary } from '../data/sampleData';
import { audioService } from '../services/audioService';
import { storageService } from '../services/storageService';
import {
  BookOpen,
  Volume2,
  RotateCw,
  Gamepad2,
  Check,
  X,
  Sparkles,
  ArrowRight,
  Star,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

interface VocabularyPageProps {
  currentUser: UserProfile;
  language: 'vi' | 'en';
  onStarEarned?: (newStars: number) => void;
}

export const VocabularyPage: React.FC<VocabularyPageProps> = ({
  currentUser,
  language,
  onStarEarned,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'flashcards' | 'minigames'>('flashcards');
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [masteredWordIds, setMasteredWordIds] = useState<string[]>([]);

  // Minigame states
  const [gameType, setGameType] = useState<'match' | 'fill' | 'listen'>('match');
  const [gameScore, setGameScore] = useState<number>(0);
  const [gameQuestionIdx, setGameQuestionIdx] = useState<number>(0);
  const [selectedGameChoice, setSelectedGameChoice] = useState<string | null>(null);
  const [isGameAnswered, setIsGameAnswered] = useState<boolean>(false);

  const topics = ['All', 'Alphabet', 'Numbers', 'Colors', 'Animals', 'School', 'Family'];

  const filteredWords = sampleVocabulary.filter(
    (w) => selectedTopic === 'All' || w.category === selectedTopic
  );

  const currentCard = filteredWords[cardIndex] || filteredWords[0] || sampleVocabulary[0];

  const handleNextCard = () => {
    audioService.playClickSound();
    setIsFlipped(false);
    setCardIndex((prev) => (prev + 1) % filteredWords.length);
  };

  const handlePrevCard = () => {
    audioService.playClickSound();
    setIsFlipped(false);
    setCardIndex((prev) => (prev - 1 + filteredWords.length) % filteredWords.length);
  };

  const handleFlip = () => {
    audioService.playClickSound();
    setIsFlipped(!isFlipped);
  };

  const handleListen = (e: React.MouseEvent, word: string) => {
    e.stopPropagation();
    audioService.speak(word);
  };

  const handleMarkMastered = (wordId: string) => {
    audioService.playSuccessSound();
    if (!masteredWordIds.includes(wordId)) {
      const updated = [...masteredWordIds, wordId];
      setMasteredWordIds(updated);
      const newStars = storageService.addStars(1);
      if (onStarEarned) onStarEarned(newStars);
    }
  };

  // Minigame Logic
  const gameItems = filteredWords.length >= 4 ? filteredWords : sampleVocabulary;
  const currentGameWord = gameItems[gameQuestionIdx % gameItems.length];

  // Generate 4 choices
  const gameChoices = React.useMemo(() => {
    const wrong = sampleVocabulary
      .filter((w) => w.id !== currentGameWord.id)
      .slice(0, 3)
      .map((w) => w.word);
    const pool = [currentGameWord.word, ...wrong].sort(() => Math.random() - 0.5);
    return pool;
  }, [currentGameWord.id]);

  const handleSelectGameOption = (choice: string) => {
    if (isGameAnswered) return;
    setSelectedGameChoice(choice);
    setIsGameAnswered(true);

    const isCorrect = choice === currentGameWord.word;
    if (isCorrect) {
      audioService.playSuccessSound();
      setGameScore((s) => s + 1);
      const newStars = storageService.addStars(2);
      if (onStarEarned) onStarEarned(newStars);
    } else {
      audioService.playTryAgainSound();
    }
  };

  const handleNextGameQuestion = () => {
    audioService.playClickSound();
    setIsGameAnswered(false);
    setSelectedGameChoice(null);
    setGameQuestionIdx((prev) => prev + 1);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-2 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md">
            Mô hình Bước 2: Từ vựng qua ngữ cảnh
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">Vocabulary Adventure</h1>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            Học từ vựng qua thẻ 3D lật hai mặt kèm tranh, phiên âm chuẩn và câu ngữ cảnh thực tế. Thử thách trò chơi trí tuệ!
          </p>
        </div>
        <div className="absolute right-4 bottom-2 text-7xl opacity-20 pointer-events-none">
          🎒
        </div>
      </div>

      {/* Tabs & Topic Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Main Mode Tabs */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
          <button
            type="button"
            onClick={() => {
              audioService.playClickSound();
              setActiveTab('flashcards');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'flashcards'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Thẻ từ vựng 3D ({filteredWords.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              audioService.playClickSound();
              setActiveTab('minigames');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'minigames'
                ? 'bg-white text-teal-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Minigames luyện tập</span>
          </button>
        </div>

        {/* Topic Filters */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-xs font-bold text-slate-500 uppercase mr-1">Chủ đề:</span>
          {topics.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                audioService.playClickSound();
                setSelectedTopic(t);
                setCardIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedTopic === t
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {t === 'All' ? 'Tất cả' : t}
            </button>
          ))}
        </div>
      </div>

      {/* View 1: 3D Interactive Flashcards */}
      {activeTab === 'flashcards' && (
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Card Counter & Mastered Tracker */}
          <div className="flex items-center justify-between w-full max-w-lg text-xs font-bold text-slate-500 px-2">
            <span>
              Thẻ số {cardIndex + 1} / {filteredWords.length}
            </span>
            <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Đã thuộc: {masteredWordIds.length} từ ⭐
            </span>
          </div>

          {/* 3D Flip Card Container */}
          <div
            onClick={handleFlip}
            className="w-full max-w-lg h-96 perspective-1000 cursor-pointer select-none group"
          >
            <div
              className={`w-full h-full relative duration-500 transform-style-3d ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* Card FRONT */}
              <div className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-white to-emerald-50/40 rounded-3xl p-8 border-2 border-emerald-200 shadow-xl flex flex-col items-center justify-between text-center hover:border-emerald-400 transition-colors">
                <div className="w-full flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    {currentCard.category} • Lớp {currentCard.grade}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleListen(e, currentCard.word)}
                    className="p-3 rounded-2xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-colors"
                    title="Nghe phát âm"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Big Emoji Illustration */}
                <div className="text-8xl drop-shadow-md transform group-hover:scale-110 transition-transform">
                  {currentCard.imageEmoji}
                </div>

                {/* Big Word & Hint */}
                <div>
                  <h3 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                    {currentCard.word}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 flex items-center justify-center gap-1">
                    <RotateCw className="w-3.5 h-3.5" />
                    Nhấn vào thẻ để xem nghĩa và câu ví dụ
                  </p>
                </div>
              </div>

              {/* Card BACK */}
              <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white rounded-3xl p-8 shadow-xl flex flex-col justify-between text-center">
                <div className="w-full flex items-center justify-between text-emerald-100 text-xs">
                  <span className="font-bold uppercase tracking-wider">Mặt sau: Nghĩa & Ngữ cảnh</span>
                  <button
                    type="button"
                    onClick={(e) => handleListen(e, currentCard.example)}
                    className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
                    title="Nghe đọc cả câu ví dụ"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <h3 className="text-3xl font-black text-white">{currentCard.word}</h3>
                  <p className="text-lg font-mono text-emerald-200 font-bold">{currentCard.phonetic}</p>
                  <p className="text-2xl font-black text-amber-300">{currentCard.meaning}</p>

                  <div className="bg-black/20 rounded-2xl p-4 mt-2 border border-white/10 text-left">
                    <p className="text-xs uppercase font-bold text-emerald-200 mb-1">Câu ví dụ ngữ cảnh:</p>
                    <p className="text-base font-bold text-white italic">"{currentCard.example}"</p>
                    <p className="text-xs text-emerald-100 mt-1">Gợi ý: {currentCard.hint}</p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkMastered(currentCard.id);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      masteredWordIds.includes(currentCard.id)
                        ? 'bg-amber-400 text-slate-900 shadow'
                        : 'bg-white/20 hover:bg-white/30 text-white'
                    }`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                    <span>
                      {masteredWordIds.includes(currentCard.id)
                        ? 'Đã thuộc từ này (+1 ⭐)'
                        : 'Đánh dấu đã thuộc (+1 ⭐)'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Controls: Prev / Next / Pronounce */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handlePrevCard}
              className="px-5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
            >
              ← Thẻ trước
            </button>
            <button
              type="button"
              onClick={handleFlip}
              className="px-5 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-sm hover:bg-emerald-100 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCw className="w-4 h-4" />
              Lật thẻ
            </button>
            <button
              type="button"
              onClick={handleNextCard}
              className="px-5 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-500/20 flex items-center gap-1 cursor-pointer"
            >
              Thẻ kế tiếp →
            </button>
          </div>
        </div>
      )}

      {/* View 2: Vocabulary Minigames */}
      {activeTab === 'minigames' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border-2 border-teal-100 shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">
                Minigame Ghép từ & Tranh
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                Câu hỏi {gameQuestionIdx + 1}
              </h3>
            </div>
            <div className="flex items-center gap-1 text-sm font-black text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>Điểm game: {gameScore}</span>
            </div>
          </div>

          {/* Question Showcase */}
          <div className="text-center py-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <span className="text-7xl block">{currentGameWord.imageEmoji}</span>
            <p className="text-xs font-semibold text-slate-500 uppercase">
              Nghĩa tiếng Việt: <strong className="text-slate-800">{currentGameWord.meaning}</strong>
            </p>
            <button
              type="button"
              onClick={(e) => handleListen(e, currentGameWord.word)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 hover:bg-teal-200 cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              Nghe âm thanh gợi ý
            </button>
          </div>

          {/* 4 Choices */}
          <div className="grid grid-cols-2 gap-3">
            {gameChoices.map((choice) => {
              const isSelected = selectedGameChoice === choice;
              const isCorrectAnswer = choice === currentGameWord.word;

              let btnStyle = 'bg-white border-slate-200 text-slate-800 hover:border-teal-300 hover:bg-teal-50/50';
              if (isGameAnswered) {
                if (isCorrectAnswer) {
                  btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-black ring-2 ring-emerald-300';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-100 border-rose-400 text-rose-950';
                }
              }

              return (
                <button
                  key={choice}
                  type="button"
                  disabled={isGameAnswered}
                  onClick={() => handleSelectGameOption(choice)}
                  className={`p-4 rounded-2xl border-2 text-base font-bold transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                >
                  <span>{choice}</span>
                  {isGameAnswered && isCorrectAnswer && (
                    <Check className="w-5 h-5 text-emerald-600" />
                  )}
                  {isGameAnswered && isSelected && !isCorrectAnswer && (
                    <X className="w-5 h-5 text-rose-600" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Post-answer feedback & Next */}
          {isGameAnswered && (
            <div className="pt-2 animate-in fade-in duration-200 space-y-4">
              <div
                className={`p-4 rounded-2xl border ${
                  selectedGameChoice === currentGameWord.word
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <p className="font-bold text-sm">
                  {selectedGameChoice === currentGameWord.word
                    ? 'Chính xác! Xuất sắc lắm! (+2 ⭐)'
                    : `Gần đúng rồi! Đáp án đúng là "${currentGameWord.word}" (${currentGameWord.meaning}).`}
                </p>
                <p className="text-xs mt-1 text-slate-600">
                  Câu ví dụ: <em>"{currentGameWord.example}"</em>
                </p>
              </div>

              <button
                type="button"
                onClick={handleNextGameQuestion}
                className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Câu tiếp theo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
