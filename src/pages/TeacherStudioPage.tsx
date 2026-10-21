import React, { useState } from 'react';
import { GradeLevel, TeacherMaterialDraft, UserProfile } from '../types';
import { geminiService } from '../services/geminiService';
import { storageService } from '../services/storageService';
import { audioService } from '../services/audioService';
import {
  GraduationCap,
  Sparkles,
  Printer,
  Download,
  Save,
  CheckCircle2,
  FileText,
  Copy,
  Plus,
  RefreshCw,
  Eye,
  Sliders,
  Send,
  HelpCircle,
} from 'lucide-react';

interface TeacherStudioPageProps {
  currentUser: UserProfile;
  language: 'vi' | 'en';
  navigate: (route: string) => void;
}

export const TeacherStudioPage: React.FC<TeacherStudioPageProps> = ({
  currentUser,
  language,
  navigate,
}) => {
  const [grade, setGrade] = useState<GradeLevel>(3);
  const [topic, setTopic] = useState<string>('Animals');
  const [materialType, setMaterialType] = useState<'quiz' | 'flashcard' | 'story' | 'worksheet'>('quiz');
  const [targetCount, setTargetCount] = useState<number>(4);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [printMode, setPrintMode] = useState<boolean>(false);

  // Prompt Templates Library for Teachers
  const promptTemplates = [
    {
      title: 'Bài tập phân hóa lớp 3 (Trắc nghiệm)',
      type: 'quiz',
      topic: 'Animals',
      notes: 'Tạo 4 câu hỏi trắc nghiệm kèm giải thích ngắn gọn bằng tiếng Việt cho học sinh tiểu học.',
    },
    {
      title: 'Phiếu học tập từ vựng lớp 1-2',
      type: 'flashcard',
      topic: 'School Things',
      notes: 'Từ vựng đồ dùng học tập kèm phiên âm đơn giản, câu ví dụ gần gũi.',
    },
    {
      title: 'Truyện đọc hiểu ngắn có bài học đạo đức',
      type: 'story',
      topic: 'Friendship & Helping Others',
      notes: 'Truyện 3 đoạn ngắn, mỗi đoạn kèm câu hỏi đọc hiểu 4 lựa chọn.',
    },
  ];

  const handleApplyTemplate = (tpl: any) => {
    audioService.playClickSound();
    setTopic(tpl.topic);
    setMaterialType(tpl.type);
    setCustomPrompt(tpl.notes);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    audioService.playClickSound();
    setIsLoading(true);
    setSavedSuccess(false);

    try {
      const data = await geminiService.generateTeacherMaterial(
        grade,
        topic,
        materialType,
        targetCount,
        customPrompt
      );
      setGeneratedData(data);
      audioService.playSuccessSound();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = () => {
    if (!generatedData) return;
    audioService.playClickSound();

    const newDraft: TeacherMaterialDraft = {
      id: `draft_${Date.now()}`,
      title: generatedData.title || `Học liệu ${topic} - Lớp ${grade}`,
      grade,
      topic,
      materialType,
      items: generatedData.items || [],
      status: 'reviewed',
      assignedClass: '3A1',
      createdAt: new Date().toISOString().split('T')[0],
    };

    storageService.saveTeacherDraft(newDraft);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    if (!generatedData) return;
    const blob = new Blob([JSON.stringify(generatedData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EnglishSpark_Lop${grade}_${topic}_${materialType}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    if (!generatedData || !generatedData.items) return;
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (materialType === 'quiz') {
      csvContent += 'ID,Question,Options,CorrectAnswer,Explanation\n';
      generatedData.items.forEach((item: any, idx: number) => {
        const row = `"${item.id || idx}","${(item.question || '').replace(/"/g, '""')}","${(
          item.options || []
        ).join(' | ')}","${item.correctAnswer || ''}","${(item.explanation || '').replace(
          /"/g,
          '""'
        )}"`;
        csvContent += row + '\n';
      });
    } else {
      csvContent += 'Item,Content\n';
      generatedData.items.forEach((item: any, idx: number) => {
        csvContent += `"${idx + 1}","${JSON.stringify(item).replace(/"/g, '""')}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EnglishSpark_Lop${grade}_${topic}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-2 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md">
            Không gian sư phạm EdTech 2026
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">AI Teacher Studio</h1>
          <p className="text-sky-100 text-sm sm:text-base leading-relaxed">
            Hỗ trợ giáo viên xây dựng học liệu phân hóa cho học sinh Lớp 1-5 chỉ trong 30 giây. Giáo viên toàn quyền xem trước, chỉnh sửa, kiểm duyệt và xuất bản phiếu học tập.
          </p>
        </div>
        <div className="absolute right-4 bottom-2 text-7xl opacity-20 pointer-events-none">
          👩‍🏫
        </div>
      </div>

      {/* Sub Navigation Bar for Teacher */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase px-2">Điều hướng GV:</span>
          <button
            type="button"
            className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200 cursor-pointer"
          >
            Tạo học liệu AI
          </button>
          <button
            type="button"
            onClick={() => navigate('/teacher/classes')}
            className="px-3 py-1.5 rounded-xl text-slate-600 hover:text-slate-900 font-bold text-xs hover:bg-slate-100 cursor-pointer"
          >
            Quản lý lớp & Giao bài
          </button>
          <button
            type="button"
            onClick={() => navigate('/teacher/reports')}
            className="px-3 py-1.5 rounded-xl text-slate-600 hover:text-slate-900 font-bold text-xs hover:bg-slate-100 cursor-pointer"
          >
            Báo cáo & Thống kê
          </button>
        </div>

        <span className="text-xs text-slate-500 italic hidden sm:block">
          GV: Cô giáo Nguyễn Thị Trang – TH Khoái Châu 1
        </span>
      </div>

      {/* Main Studio Arena: Generator Form + Preview Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & Prompt Templates */}
        <div className="lg:col-span-5 space-y-6">
          {/* Generator Form */}
          <form
            onSubmit={handleGenerate}
            className="bg-white rounded-3xl p-6 border-2 border-indigo-100 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                Cấu hình bài học cần tạo
              </h3>
            </div>

            {/* Grade & Target Count */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Khối lớp:</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(parseInt(e.target.value, 10) as GradeLevel)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value={1}>Lớp 1</option>
                  <option value={2}>Lớp 2</option>
                  <option value={3}>Lớp 3</option>
                  <option value={4}>Lớp 4</option>
                  <option value={5}>Lớp 5</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Số lượng câu:</label>
                <select
                  value={targetCount}
                  onChange={(e) => setTargetCount(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value={3}>3 câu / mục</option>
                  <option value={4}>4 câu / mục</option>
                  <option value={6}>6 câu / mục</option>
                </select>
              </div>
            </div>

            {/* Topic & Material Type */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Chủ đề bài học:</label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="E.g., Animals, School Things..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Dạng học liệu:</label>
                <select
                  value={materialType}
                  onChange={(e) => setMaterialType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="quiz">Trắc nghiệm Quiz</option>
                  <option value="flashcard">Thẻ từ vựng (Flashcard)</option>
                  <option value="story">Truyện tương tác</option>
                  <option value="worksheet">Phiếu bài tập in ấn</option>
                </select>
              </div>
            </div>

            {/* Custom Prompt / Objectives */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Yêu cầu sư phạm bổ sung (Tùy chọn):
              </label>
              <textarea
                rows={2}
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="E.g., Chú trọng phân biệt âm p và b; câu ngắn phù hợp học sinh nông thôn..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Gemini AI đang tạo học liệu...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Tạo học liệu với Gemini AI</span>
                </>
              )}
            </button>
          </form>

          {/* Prompt Templates for Reusable Lesson Planning */}
          <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Copy className="w-3.5 h-3.5 text-indigo-600" />
              Mẫu câu lệnh sư phạm gợi ý:
            </h4>
            <div className="space-y-2">
              {promptTemplates.map((tpl, idx) => (
                <div
                  key={idx}
                  onClick={() => handleApplyTemplate(tpl)}
                  className="bg-white p-3 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{tpl.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      Áp dụng
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] line-clamp-1">{tpl.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Preview & Inspection */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-100 shadow-sm flex flex-col justify-between min-h-[550px]">
          <div>
            {/* Preview Action Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                  Xem trước & Kiểm duyệt của Giáo viên
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  {generatedData?.title || 'Chưa tạo học liệu'}
                </h3>
              </div>

              {/* Action Buttons: Save, Print, Export */}
              {generatedData && (
                <div className="flex flex-wrap items-center gap-1.5 no-print">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                    title="Lưu vào kho học liệu"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Lưu duyệt</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                    title="In ấn phiếu học tập khổ A4"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-600" />
                    <span>In A4</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                    title="Xuất CSV"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportJSON}
                    className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                    title="Xuất JSON"
                  >
                    <span>JSON</span>
                  </button>
                </div>
              )}
            </div>

            {/* Saved Alert */}
            {savedSuccess && (
              <div className="mt-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Đã lưu học liệu vào kho bài giảng thành công! Sẵn sàng giao cho học sinh.</span>
              </div>
            )}

            {/* Render Preview Content Area */}
            <div className="py-6 printable-area">
              {generatedData ? (
                <div className="space-y-4">
                  {/* Worksheet Header for Printable View */}
                  <div className="border-b-2 border-slate-800 pb-3 mb-4 text-center">
                    <h2 className="text-xl font-black uppercase tracking-wider text-slate-900">
                      {generatedData.title}
                    </h2>
                    <p className="text-xs text-slate-600 mt-1">
                      Trường Tiểu học Khoái Châu 1 • Khối {grade} • GV: Nguyễn Thị Trang
                    </p>
                    <div className="flex justify-between text-xs text-slate-500 pt-2 italic">
                      <span>Họ và tên học sinh: ........................................................</span>
                      <span>Lớp: .............</span>
                    </div>
                  </div>

                  {/* Render Items */}
                  {generatedData.items && generatedData.items.length > 0 ? (
                    generatedData.items.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-bold text-slate-900">
                            Câu {idx + 1}: {item.question || item.word || item.text}
                          </p>
                          {item.correctAnswer && (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0 no-print">
                              Đáp án: {item.correctAnswer}
                            </span>
                          )}
                        </div>

                        {/* Options if quiz */}
                        {item.options && (
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            {item.options.map((opt: string, optIdx: number) => (
                              <div
                                key={optIdx}
                                className={`p-2 rounded-xl border text-xs font-semibold ${
                                  opt === item.correctAnswer
                                    ? 'bg-emerald-50 border-emerald-300 font-bold'
                                    : 'bg-white border-slate-200'
                                }`}
                              >
                                {String.fromCharCode(65 + optIdx)}. {opt}
                              </div>
                            ))}
                          </div>
                        )}

                        {item.explanation && (
                          <p className="text-xs text-slate-500 italic pt-1 no-print">
                            💡 Giải thích: {item.explanation}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl">
                      <pre className="whitespace-pre-wrap font-sans">
                        {JSON.stringify(generatedData, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-72 flex flex-col items-center justify-center text-center p-6 space-y-3 text-slate-400">
                  <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400 text-2xl">
                    📝
                  </div>
                  <p className="text-sm font-semibold text-slate-600">
                    Chưa có nội dung xem trước
                  </p>
                  <p className="text-xs max-w-sm">
                    Hãy chọn cấu hình ở cột bên trái và nhấn nút "Tạo học liệu với Gemini AI" để bắt đầu soạn bài.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Teacher Guidance Note */}
          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Quyền kiểm soát thuộc về giáo viên: AI đóng vai trò trợ lý sinh ý tưởng, thầy cô luôn là người duyệt cuối cùng trước khi chuyển đến học sinh.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
