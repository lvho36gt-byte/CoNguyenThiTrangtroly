import React, { useState } from 'react';
import { PhonicsItem, UserProfile } from '../types';
import { samplePhonics } from '../data/sampleData';
import { audioService } from '../services/audioService';
import { storageService } from '../services/storageService';
import {
  Mic,
  MicOff,
  Volume2,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Star,
  Keyboard,
  Info,
  Music,
} from 'lucide-react';

interface PhonicsPageProps {
  currentUser: UserProfile;
  language: 'vi' | 'en';
  onStarEarned?: (newStars: number) => void;
}

export const PhonicsPage: React.FC<PhonicsPageProps> = ({ currentUser, language, onStarEarned }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeItem, setActiveItem] = useState<PhonicsItem>(samplePhonics[0]);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [spokenTranscript, setSpokenTranscript] = useState<string>('');
  const [evaluation, setEvaluation] = useState<{ accuracy: number; match: boolean; feedback: string } | null>(null);
  const [manualInput, setManualInput] = useState<string>('');
  const [showManualInput, setShowManualInput] = useState<boolean>(false);
  const [speechError, setSpeechError] = useState<string>('');
  const [recognitionStopper, setRecognitionStopper] = useState<(() => void) | null>(null);

  const categories = ['All', 'Vowels', 'Consonants', 'Blends'];

  const filteredItems = samplePhonics.filter(
    (item) => selectedCategory === 'All' || item.category === selectedCategory
  );

  const handleSelectItem = (item: PhonicsItem) => {
    audioService.playClickSound();
    setActiveItem(item);
    setSpokenTranscript('');
    setEvaluation(null);
    setSpeechError('');
    setManualInput('');
    // Auto speak the target word
    audioService.speak(item.word);
  };

  const handleListenWord = () => {
    audioService.speak(activeItem.word);
  };

  const handleListenChant = () => {
    audioService.speak(activeItem.chant, 0.8, 1.1);
  };

  const handleStartSpeaking = () => {
    setSpeechError('');
    setSpokenTranscript('');
    setEvaluation(null);

    if (!audioService.isSpeechRecognitionSupported()) {
      setShowManualInput(true);
      setSpeechError(
        'Trình duyệt chưa hỗ trợ ghi âm trực tiếp. Em hãy dùng ô gõ chữ bên dưới để luyện tập với Sparky nhé!'
      );
      return;
    }

    setIsListening(true);
    const session = audioService.startListening(
      (transcript) => {
        setSpokenTranscript(transcript);
        const evalResult = audioService.evaluatePronunciation(transcript, activeItem.word);
        setEvaluation(evalResult);
        setIsListening(false);

        if (evalResult.match) {
          audioService.playSuccessSound();
          const newStars = storageService.addStars(2);
          if (onStarEarned) onStarEarned(newStars);
        } else {
          audioService.playTryAgainSound();
        }
      },
      (error) => {
        setSpeechError(error);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    setRecognitionStopper(() => session.stop);
  };

  const handleStopSpeaking = () => {
    if (recognitionStopper) {
      recognitionStopper();
    }
    setIsListening(false);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;

    setSpokenTranscript(manualInput);
    const evalResult = audioService.evaluatePronunciation(manualInput, activeItem.word);
    setEvaluation(evalResult);

    if (evalResult.match) {
      audioService.playSuccessSound();
      const newStars = storageService.addStars(1);
      if (onStarEarned) onStarEarned(newStars);
    } else {
      audioService.playTryAgainSound();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-2 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md">
            Mô hình Bước 1: Khởi động & Phát âm
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">AI Phonics & Pronunciation Studio</h1>
          <p className="text-amber-100 text-sm sm:text-base leading-relaxed">
            Lắng nghe âm thanh chuẩn bản ngữ, hát theo Chant điệu nhạc và nhấn microphone để luyện phát âm cùng bạn Sparky!
          </p>
        </div>
        <div className="absolute right-4 bottom-2 text-7xl opacity-20 pointer-events-none">
          🎙️
        </div>
      </div>

      {/* Safety & Pedagogy Disclosure Alert */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs sm:text-sm text-amber-900">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Quy chuẩn đánh giá phát âm cho học sinh tiểu học:</p>
          <p className="text-amber-800">
            Hệ thống nhận dạng lời nói hoạt động qua Web Speech API nhằm tạo môi trường tương tác thân thiện, khuyến khích các em tự tin cất tiếng nói tiếng Anh mà không sợ bị phán xét. Đánh giá dựa trên độ tương đồng văn bản để động viên tiến bộ, không thay thế bộ chấm âm vị chuyên sâu.
          </p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-bold text-slate-500 uppercase mr-2">Nhóm âm:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              audioService.playClickSound();
              setSelectedCategory(cat);
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat === 'All' ? 'Tất cả âm' : cat}
          </button>
        ))}
      </div>

      {/* Main Phonics Studio Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Phonics List Selector */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-4 sm:p-6 border-2 border-slate-100 shadow-sm space-y-3 max-h-[580px] overflow-y-auto">
          <h3 className="text-sm font-bold uppercase text-slate-500 tracking-wider mb-2">
            Danh sách âm & từ mẫu ({filteredItems.length})
          </h3>
          <div className="space-y-2">
            {filteredItems.map((item) => {
              const isSelected = activeItem.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectItem(item)}
                  className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50/80 border-amber-500 shadow-sm ring-1 ring-amber-300'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-white border border-slate-200 font-black text-amber-600 flex items-center justify-center text-base shadow-sm">
                      {item.letter.split(' ')[0]}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-base">{item.word}</h4>
                        <span className="text-xs font-mono text-slate-500">{item.phonetic}</span>
                      </div>
                      <p className="text-xs text-slate-500">{item.vietnameseMeaning}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                    {item.soundIpa}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Interactive Practice Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-100 shadow-md flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            {/* Header of Active Word */}
            <div className="flex items-start justify-between">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  {activeItem.category} • Âm {activeItem.soundIpa}
                </span>
                <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mt-2 tracking-tight">
                  {activeItem.word}
                </h2>
                <p className="text-lg text-indigo-600 font-mono font-semibold mt-1">
                  {activeItem.phonetic} • <span className="font-normal text-slate-600">{activeItem.vietnameseMeaning}</span>
                </p>
              </div>

              {/* Native Audio Button */}
              <button
                type="button"
                onClick={handleListenWord}
                className="p-4 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-800 shadow-sm transition-all flex flex-col items-center gap-1 cursor-pointer"
                title="Nghe phát âm chuẩn bản ngữ"
              >
                <Volume2 className="w-6 h-6 text-amber-700" />
                <span className="text-[11px] font-bold">Nghe từ</span>
              </button>
            </div>

            {/* Phonics Chant Box */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5 uppercase">
                  <Music className="w-3.5 h-3.5 text-amber-600" />
                  Chant nhịp điệu ghi nhớ
                </span>
                <button
                  type="button"
                  onClick={handleListenChant}
                  className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  Nghe điệu Chant
                </button>
              </div>
              <p className="text-sm sm:text-base font-bold text-slate-800 italic">
                "{activeItem.chant}"
              </p>
              <p className="text-xs text-slate-500">
                Ví dụ: {activeItem.exampleSentence}
              </p>
            </div>

            {/* Recording Controls */}
            <div className="flex flex-col items-center justify-center py-4 space-y-4">
              <div className="relative">
                {isListening && (
                  <div className="absolute -inset-3 rounded-full bg-rose-400 animate-ping opacity-30" />
                )}
                <button
                  type="button"
                  onClick={isListening ? handleStopSpeaking : handleStartSpeaking}
                  className={`w-20 h-20 rounded-full flex flex-col items-center justify-center text-white shadow-xl transition-all transform active:scale-95 cursor-pointer ${
                    isListening
                      ? 'bg-rose-600 hover:bg-rose-700 ring-4 ring-rose-200 animate-pulse'
                      : 'bg-gradient-to-br from-amber-500 to-rose-500 hover:scale-105'
                  }`}
                  title={isListening ? 'Bấm để dừng' : 'Bấm để nói từ này'}
                >
                  {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                </button>
              </div>

              <div className="text-center">
                <p className="font-bold text-slate-800 text-sm sm:text-base">
                  {isListening ? 'Sparky đang lắng nghe em nói...' : 'Nhấn nút Mic và nói to từ này!'}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mục tiêu phát âm: <strong className="text-amber-700 font-bold">{activeItem.word}</strong>
                </p>
              </div>

              {/* Speech Error message */}
              {speechError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl p-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{speechError}</span>
                </div>
              )}

              {/* Evaluation Feedback Card */}
              {evaluation && (
                <div
                  className={`w-full rounded-2xl p-4 border-2 transition-all animate-in fade-in zoom-in-95 ${
                    evaluation.match
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-amber-50 border-amber-300 text-amber-950'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      {evaluation.match ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Phát âm chính xác! (+2 ⭐)
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 text-amber-600" />
                          Gợi ý luyện tập
                        </>
                      )}
                    </span>
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-white border">
                      Độ tương đồng: {evaluation.accuracy}%
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 mb-1">
                    Hệ thống nhận diện được: <strong>"{spokenTranscript}"</strong>
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800">
                    {evaluation.feedback}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer Controls: Toggle Manual Mode & Next */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setShowManualInput(!showManualInput)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
            >
              <Keyboard className="w-4 h-4" />
              <span>{showManualInput ? 'Ẩn ô gõ chữ' : 'Không dùng được Mic? Gõ câu thủ công'}</span>
            </button>

            {/* Manual Form */}
            {showManualInput && (
              <form onSubmit={handleManualSubmit} className="w-full flex items-center gap-2">
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder={`Gõ từ "${activeItem.word}" vào đây...`}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 cursor-pointer"
                >
                  Kiểm tra
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
