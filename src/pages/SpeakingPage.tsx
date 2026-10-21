import React, { useState } from 'react';
import { SpeakingScenario, UserProfile } from '../types';
import { sampleSpeakingScenarios } from '../data/sampleData';
import { audioService } from '../services/audioService';
import { geminiService } from '../services/geminiService';
import { storageService } from '../services/storageService';
import {
  MessageSquare,
  Mic,
  MicOff,
  Send,
  Volume2,
  Users,
  Sparkles,
  Info,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

interface SpeakingPageProps {
  currentUser: UserProfile;
  language: 'vi' | 'en';
  onStarEarned?: (newStars: number) => void;
}

interface ChatMessage {
  id: string;
  sender: 'sparky' | 'user';
  text: string;
  vietnameseHint?: string;
  timestamp: string;
}

export const SpeakingPage: React.FC<SpeakingPageProps> = ({
  currentUser,
  language,
  onStarEarned,
}) => {
  const [activeScenario, setActiveScenario] = useState<SpeakingScenario>(sampleSpeakingScenarios[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'sparky',
      text: sampleSpeakingScenarios[0].starterMessage,
      vietnameseHint: sampleSpeakingScenarios[0].starterVi,
      timestamp: 'Vừa xong',
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([
    'Hello Sparky!',
    'My name is An.',
    'Nice to meet you!',
  ]);
  const [praiseText, setPraiseText] = useState<string>(
    'Chào mừng em đến với góc giao tiếp! Sparky luôn lắng nghe và ủng hộ em!'
  );
  const [showTaskCard, setShowTaskCard] = useState<boolean>(false);
  const [recognitionStopper, setRecognitionStopper] = useState<(() => void) | null>(null);

  const handleSelectScenario = (sc: SpeakingScenario) => {
    audioService.playClickSound();
    setActiveScenario(sc);
    setMessages([
      {
        id: `sc_init_${Date.now()}`,
        sender: 'sparky',
        text: sc.starterMessage,
        vietnameseHint: sc.starterVi,
        timestamp: 'Vừa xong',
      },
    ]);
    setSuggestedReplies(sc.targetVocab.slice(0, 3));
    setPraiseText('Hãy tự tin nói câu chào hoặc câu trả lời đầu tiên nhé!');
    audioService.speak(sc.starterMessage);
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoadingAi) return;

    audioService.playClickSound();
    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: 'Bây giờ',
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText('');
    setIsLoadingAi(true);

    try {
      const historyPayload = newHistory.map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const response = await geminiService.chatWithSparky(
        currentUser.grade,
        activeScenario.title,
        historyPayload,
        textToSend
      );

      const botMsg: ChatMessage = {
        id: `s_${Date.now()}`,
        sender: 'sparky',
        text: response.botResponse,
        vietnameseHint: response.vietnameseHint,
        timestamp: 'Bây giờ',
      };

      setMessages((prev) => [...prev, botMsg]);
      setSuggestedReplies(response.suggestedReplies || []);
      setPraiseText(response.praise || 'Em nói rất tốt và tự nhiên!');

      // Speak robot response
      audioService.speak(response.botResponse);
      audioService.playSuccessSound();

      // Award stars for speaking practice
      const newStars = storageService.addStars(1);
      if (onStarEarned) onStarEarned(newStars);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleStartMic = () => {
    if (isListening) {
      if (recognitionStopper) recognitionStopper();
      setIsListening(false);
      return;
    }

    if (!audioService.isSpeechRecognitionSupported()) {
      alert('Trình duyệt chưa hỗ trợ ghi âm trực tiếp. Em hãy dùng ô gõ câu hoặc bấm các câu gợi ý nhé!');
      return;
    }

    setIsListening(true);
    const session = audioService.startListening(
      (transcript) => {
        setIsListening(false);
        if (transcript) {
          handleSendMessage(transcript);
        }
      },
      (error) => {
        setIsListening(false);
        console.warn(error);
      },
      () => {
        setIsListening(false);
      }
    );

    setRecognitionStopper(() => session.stop);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-2 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md">
            Mô hình Bước 3: Luyện nói theo nhiệm vụ
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">Speaking Corner – Hội thoại cùng Sparky</h1>
          <p className="text-sky-100 text-sm sm:text-base leading-relaxed">
            AI nhập vai người bạn học thân thiện, kiên nhẫn hỏi đáp tiếng Anh phù hợp với từng lứa tuổi. Có chế độ luyện cặp và thẻ nhiệm vụ cho lớp học.
          </p>
        </div>
        <div className="absolute right-4 bottom-2 text-7xl opacity-20 pointer-events-none">
          💬
        </div>
      </div>

      {/* Safety Notice */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 flex items-start gap-3 text-xs sm:text-sm text-blue-900">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">An toàn giao tiếp cho học sinh tiểu học:</p>
          <p className="text-blue-800">
            Sparky tuyệt đối không hỏi thông tin cá nhân (địa chỉ, số điện thoại, mật khẩu). Ngôn từ tích cực, kiên nhẫn khích lệ, giúp các em xóa bỏ rào cản sợ sai khi giao tiếp tiếng Anh.
          </p>
        </div>
      </div>

      {/* Scenarios Selector Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-500 uppercase mr-1">Tình huống:</span>
        {sampleSpeakingScenarios.map((sc) => (
          <button
            key={sc.id}
            type="button"
            onClick={() => handleSelectScenario(sc)}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeScenario.id === sc.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {sc.vietnameseTitle} (Khối {sc.gradeRange})
          </button>
        ))}
      </div>

      {/* Main Conversation & Task Card Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Chat Window */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-4 sm:p-6 border-2 border-slate-100 shadow-sm flex flex-col justify-between min-h-[520px]">
          <div>
            {/* Chat header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-xl shadow-sm">
                  🤖
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Robot Sparky – Bạn học thân thiện
                  </h3>
                  <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Sẵn sàng trò chuyện • Chủ đề: {activeScenario.topic}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowTaskCard(!showTaskCard)}
                className="text-xs font-bold px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 flex items-center gap-1 cursor-pointer"
              >
                <Users className="w-3.5 h-3.5" />
                <span>{showTaskCard ? 'Ẩn Thẻ Nhiệm Vụ' : 'Xem Thẻ Nhiệm Vụ Cặp'}</span>
              </button>
            </div>

            {/* Messages Feed */}
            <div className="space-y-4 py-4 max-h-[360px] overflow-y-auto pr-1">
              {messages.map((m) => {
                const isSparky = m.sender === 'sparky';
                return (
                  <div
                    key={m.id}
                    className={`flex items-start gap-2.5 ${isSparky ? 'justify-start' : 'justify-end'}`}
                  >
                    {isSparky && (
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm shrink-0 mt-1">
                        🤖
                      </div>
                    )}

                    <div
                      className={`max-w-md rounded-2xl p-4 shadow-sm space-y-1.5 ${
                        isSparky
                          ? 'bg-slate-50 border border-slate-200 text-slate-800'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold text-sm sm:text-base leading-snug">{m.text}</p>
                        {isSparky && (
                          <button
                            type="button"
                            onClick={() => audioService.speak(m.text)}
                            className="p-1 rounded text-slate-400 hover:text-blue-600 cursor-pointer"
                            title="Nghe câu này"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Vietnamese Hint for kids */}
                      {m.vietnameseHint && (
                        <p className="text-xs text-slate-500 border-t border-slate-200/60 pt-1 font-medium">
                          💡 Gợi ý nghĩa: {m.vietnameseHint}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}

              {isLoadingAi && (
                <div className="flex items-center gap-2 text-xs text-slate-400 italic py-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce delay-100" />
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce delay-200" />
                  <span>Sparky đang suy nghĩ câu trả lời dễ thương...</span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Interactive Input Controls */}
          <div className="pt-3 border-t border-slate-100 space-y-3">
            {/* Scaffolding Gợi ý câu trả lời nhanh (Buttons) */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                Gợi ý câu trả lời nhanh (Em có thể bấm để nói hoặc gõ):
              </p>
              <div className="flex flex-wrap gap-1.5">
                {suggestedReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(reply)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                  >
                    💬 {reply}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar with Mic & Send */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputText);
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={handleStartMic}
                className={`p-3 rounded-2xl transition-all cursor-pointer ${
                  isListening
                    ? 'bg-rose-600 text-white ring-4 ring-rose-200 animate-pulse'
                    : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                }`}
                title={isListening ? 'Đang nghe... bấm để dừng' : 'Bấm mic để nói câu trả lời'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Nhập câu tiếng Anh hoặc bấm Mic để nói..."
                className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isLoadingAi}
                className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold transition-all shadow-md cursor-pointer"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Right: Task Card & Encouragement Panel */}
        <div className="lg:col-span-4 space-y-4">
          {/* Encouragement Badge */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-5 border-2 border-amber-200 shadow-sm space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Lời động viên từ Sparky (+1 ⭐/lượt nói)
            </span>
            <p className="text-xs sm:text-sm text-amber-950 font-bold leading-relaxed">
              "{praiseText}"
            </p>
          </div>

          {/* Task Card for Pair Work (Thẻ Nhiệm Vụ) */}
          <div className="bg-white rounded-3xl p-5 border-2 border-indigo-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-600" />
                Thẻ Nhiệm Vụ theo cặp (Pair Work)
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                Sư phạm TH
              </span>
            </div>

            <div className="text-xs text-slate-600 space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <p>
                <strong>Mục tiêu:</strong> {activeScenario.taskCard.taskGoal}
              </p>
              <p>
                <strong>Vai A:</strong> {activeScenario.taskCard.roleA}
              </p>
              <p>
                <strong>Vai B:</strong> {activeScenario.taskCard.roleB}
              </p>
            </div>

            {/* Suggested dialogue flow */}
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Hội thoại mẫu tham khảo:
              </p>
              <div className="space-y-2">
                {activeScenario.taskCard.suggestedDialogue.map((item, idx) => (
                  <div key={idx} className="bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100 text-xs">
                    <p className="font-bold text-indigo-950">
                      [{item.speaker}]: {item.text}
                    </p>
                    <p className="text-[11px] text-slate-500 italic mt-0.5">({item.vi})</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
