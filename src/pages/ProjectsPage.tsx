import React, { useState } from 'react';
import { StudentProject, UserProfile } from '../types';
import { storageService } from '../services/storageService';
import { geminiService } from '../services/geminiService';
import { audioService } from '../services/audioService';
import {
  Palette,
  Sparkles,
  CheckCircle2,
  Lock,
  Globe,
  Plus,
  Send,
  Lightbulb,
  Star,
  Layers,
  FileCheck,
  Check,
  X,
  Volume2,
} from 'lucide-react';

interface ProjectsPageProps {
  currentUser: UserProfile;
  language: 'vi' | 'en';
  onStarEarned?: (newStars: number) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  currentUser,
  language,
  onStarEarned,
}) => {
  const [projects, setProjects] = useState<StudentProject[]>(() => storageService.getProjects());
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  // Form states
  const [title, setTitle] = useState<string>('');
  const [projectType, setProjectType] = useState<'poster' | 'story-card' | 'comic' | 'dialogue'>('poster');
  const [topic, setTopic] = useState<string>('Animals');
  const [studentText, setStudentText] = useState<string>('');
  const [vietnameseDesc, setVietnameseDesc] = useState<string>('');
  const [themeColor, setThemeColor] = useState<string>('from-sky-100 to-blue-100 border-sky-300');
  const [selfReflection, setSelfReflection] = useState({
    listened: true,
    spoken: true,
    read: true,
    written: true,
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !studentText.trim()) return;

    audioService.playClickSound();
    setIsLoadingAi(true);

    try {
      // Get AI scaffolding feedback
      const aiFeedback = await geminiService.getProjectFeedback(
        currentUser.grade,
        projectType,
        title,
        studentText,
        topic
      );

      const newProj: StudentProject = {
        id: `proj_${Date.now()}`,
        studentId: currentUser.id,
        studentName: currentUser.name || 'Em Bảo An',
        studentGrade: currentUser.grade,
        title: title.trim(),
        projectType,
        topic,
        studentText: studentText.trim(),
        vietnameseDescription: vietnameseDesc.trim() || 'Sản phẩm sáng tạo tiếng Anh của em.',
        themeColor,
        aiFeedback,
        teacherApproved: currentUser.role === 'teacher', // Auto-approved if teacher
        teacherComment:
          currentUser.role === 'teacher'
            ? 'Cô Trang đã phê duyệt sản phẩm!'
            : 'Đang gửi cô giáo kiểm duyệt trước khi chia sẻ lên bảng tin lớp.',
        selfReflection,
        createdAt: new Date().toISOString().split('T')[0],
      };

      const updatedList = storageService.saveProject(newProj);
      setProjects(updatedList);
      audioService.playStarSound();

      // Award 10 stars for creating an authentic product!
      const newStars = storageService.addStars(10);
      if (onStarEarned) onStarEarned(newStars);

      setIsCreating(false);
      resetForm();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setStudentText('');
    setVietnameseDesc('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-2 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md">
            Mô hình Bước 4: Sáng tạo sản phẩm học sinh
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">My Project & Reflection</h1>
          <p className="text-purple-100 text-sm sm:text-base leading-relaxed">
            Học sinh tự tay sáng tạo poster, thẻ truyện mini comic và đoạn văn chú thích bằng tiếng Anh. AI hỗ trợ gợi mở từ vựng và câu văn, tuyệt đối không làm thay!
          </p>
        </div>
        <div className="absolute right-4 bottom-2 text-7xl opacity-20 pointer-events-none">
          🎨
        </div>
      </div>

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Góc trưng bày sản phẩm ({projects.length})
          </h2>
          <p className="text-xs text-slate-500">
            Học sinh chủ động tạo sản phẩm • Giáo viên duyệt trước khi công khai • Tự đánh giá "Today I can..."
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            audioService.playClickSound();
            setIsCreating(!isCreating);
          }}
          className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer w-fit"
        >
          {isCreating ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          <span>{isCreating ? 'Đóng biểu mẫu' : 'Tạo sản phẩm mới (+10 ⭐)'}</span>
        </button>
      </div>

      {/* Create Project Form Modal / Inline Box */}
      {isCreating && (
        <form
          onSubmit={handleCreateSubmit}
          className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-purple-200 shadow-xl space-y-6 animate-in slide-in-from-top duration-300"
        >
          <div className="border-b border-slate-100 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
              Biểu mẫu sáng tạo sản phẩm học sinh
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-1">
              Em hãy thỏa sức sáng tạo bằng tiếng Anh nhé!
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Tên sản phẩm của em: *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="E.g., My Favorite Pet Mimi Poster"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* Project Type */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Dạng sản phẩm:
              </label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
              >
                <option value="poster">Poster ảnh có chú thích (Picture Poster)</option>
                <option value="story-card">Thẻ truyện mini (Story Card)</option>
                <option value="comic">Truyện tranh 3 khung (Mini Comic)</option>
                <option value="dialogue">Đoạn hội thoại nhóm (Dialogue Script)</option>
              </select>
            </div>
          </div>

          {/* Topic & Theme Color */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Chủ đề:</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
              >
                <option value="Animals">Animals (Động vật)</option>
                <option value="School">School (Trường lớp & Bạn bè)</option>
                <option value="Family">Family (Gia đình)</option>
                <option value="Colors">Colors (Màu sắc)</option>
                <option value="Activities">Activities (Hoạt động ngoại khóa)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Màu sắc trang trí thẻ:
              </label>
              <div className="flex gap-2 pt-1">
                {[
                  { label: 'Cam', color: 'from-amber-100 to-orange-100 border-amber-300' },
                  { label: 'Xanh lá', color: 'from-emerald-100 to-teal-100 border-emerald-300' },
                  { label: 'Xanh dương', color: 'from-sky-100 to-blue-100 border-sky-300' },
                  { label: 'Tím', color: 'from-purple-100 to-pink-100 border-purple-300' },
                ].map((th, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setThemeColor(th.color)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                      themeColor === th.color ? 'ring-2 ring-purple-600' : 'opacity-70'
                    }`}
                  >
                    {th.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Student English Sentences */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Câu văn hoặc đoạn văn tiếng Anh do em tự viết: *
            </label>
            <textarea
              required
              rows={3}
              value={studentText}
              onChange={(e) => setStudentText(e.target.value)}
              placeholder="E.g., This is my dog Lucky. He is brown and very friendly. He loves running in the park with me."
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
            />
            <p className="text-xs text-slate-400 mt-1">
              💡 Hãy tự tin viết theo cách của em! Sparky sẽ đọc và gợi mở các từ hay để bài viết của em lấp lánh hơn.
            </p>
          </div>

          {/* Vietnamese Description */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Mô tả ý tưởng bức tranh / sản phẩm (Tiếng Việt):
            </label>
            <input
              type="text"
              value={vietnameseDesc}
              onChange={(e) => setVietnameseDesc(e.target.value)}
              placeholder="E.g., Bức vẽ chú chó Lucky màu nâu đang chạy đuổi theo bóng tròn ở công viên."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Today I can... Self-reflection Checklist */}
          <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-200 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              Mục tự đánh giá hôm nay ("Today I can..."):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold text-slate-800">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selfReflection.listened}
                  onChange={(e) =>
                    setSelfReflection({ ...selfReflection, listened: e.target.checked })
                  }
                  className="rounded text-purple-600"
                />
                <span>Hôm nay em đã nghe tốt</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selfReflection.spoken}
                  onChange={(e) =>
                    setSelfReflection({ ...selfReflection, spoken: e.target.checked })
                  }
                  className="rounded text-purple-600"
                />
                <span>Hôm nay em đã luyện nói</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selfReflection.read}
                  onChange={(e) =>
                    setSelfReflection({ ...selfReflection, read: e.target.checked })
                  }
                  className="rounded text-purple-600"
                />
                <span>Hôm nay em đã đọc hiểu</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selfReflection.written}
                  onChange={(e) =>
                    setSelfReflection({ ...selfReflection, written: e.target.checked })
                  }
                  className="rounded text-purple-600"
                />
                <span>Hôm nay em đã tự viết câu</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs sm:text-sm hover:bg-slate-50 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoadingAi}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              {isLoadingAi ? (
                <span>Sparky đang nhận xét bài làm...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Nộp sản phẩm & Nhận góp ý AI (+10 ⭐)</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Gallery of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className={`rounded-3xl p-6 border-2 bg-gradient-to-br ${proj.themeColor} shadow-md flex flex-col justify-between space-y-4`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/80 text-slate-700 border border-slate-200">
                  {proj.projectType.toUpperCase()} • {proj.topic}
                </span>
                <div className="flex items-center gap-1 text-xs">
                  {proj.teacherApproved ? (
                    <span className="flex items-center gap-1 font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                      <Check className="w-3 h-3 text-emerald-600" />
                      Cô Trang đã duyệt
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full">
                      <Lock className="w-3 h-3 text-amber-600" />
                      Chờ duyệt bảng tin
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-extrabold text-lg text-slate-900">{proj.title}</h3>
                <p className="text-xs text-slate-600 font-medium">
                  Tác giả: <strong>{proj.studentName}</strong> (Lớp {proj.studentGrade})
                </p>
              </div>

              {/* Student text quote box */}
              <div className="bg-white/90 rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2">
                <p className="text-sm font-bold text-slate-900 italic leading-relaxed">
                  "{proj.studentText}"
                </p>
                <button
                  type="button"
                  onClick={() => audioService.speak(proj.studentText)}
                  className="text-xs text-purple-700 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  Nghe bài đọc của em
                </button>
                <p className="text-xs text-slate-500 border-t border-slate-100 pt-1.5">
                  Ý tưởng: {proj.vietnameseDescription}
                </p>
              </div>

              {/* AI Scaffolding Feedback Box */}
              {proj.aiFeedback && (
                <div className="bg-white/70 rounded-2xl p-3 border border-purple-200/80 text-xs space-y-1.5">
                  <p className="font-bold text-purple-900 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    Sparky AI gợi ý:
                  </p>
                  <p className="text-slate-700">{proj.aiFeedback.praise}</p>
                  <p className="text-purple-800 font-semibold">
                    ⭐ Từ vựng hay: {proj.aiFeedback.vocabularySuggestion}
                  </p>
                </div>
              )}
            </div>

            {/* Self reflection pills */}
            <div className="pt-3 border-t border-black/5 flex items-center justify-between text-[11px] text-slate-600 font-bold">
              <span>{proj.createdAt}</span>
              <div className="flex gap-1">
                {proj.selfReflection.listened && <span title="Đã nghe">👂</span>}
                {proj.selfReflection.spoken && <span title="Đã nói">🗣️</span>}
                {proj.selfReflection.read && <span title="Đã đọc">📖</span>}
                {proj.selfReflection.written && <span title="Đã viết">✍️</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
