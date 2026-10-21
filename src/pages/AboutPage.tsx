import React from 'react';
import { projectEvidenceData } from '../data/sampleData';
import {
  Award,
  BookOpen,
  Sparkles,
  Users,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Heart,
  TrendingUp,
  FileCheck,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface AboutPageProps {
  language: 'vi' | 'en';
  navigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ language, navigate }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md">
            Hồ sơ dự thi AI Giáo dục Việt Nam 2026
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            ENGLISH SPARK – AI ĐỒNG HÀNH CÙNG HỌC SINH TIỂU HỌC
          </h1>
          <p className="text-sky-100 text-sm sm:text-base leading-relaxed italic">
            "{projectEvidenceData.slogan}"
          </p>
          <div className="pt-2 text-xs sm:text-sm text-slate-200 space-y-1">
            <p>
              <strong>Giáo viên phát triển:</strong> {projectEvidenceData.author}
            </p>
            <p>
              <strong>Đơn vị công tác:</strong> {projectEvidenceData.school}
            </p>
          </div>
        </div>
        <div className="absolute right-4 bottom-2 text-8xl opacity-15 pointer-events-none">
          ✨
        </div>
      </div>

      {/* Safety & Compliance Notice */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 flex items-start gap-3 text-xs sm:text-sm text-blue-950">
        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p>
          <strong>Cam kết bản quyền & đạo đức AI:</strong> Dự án được phát triển độc lập bởi cô giáo Nguyễn Thị Trang (TH Khoái Châu 1). Ứng dụng tuân thủ nghiêm ngặt chuẩn mực đạo đức sư phạm và an toàn số cho trẻ em: không sao chép trái phép logo tổ chức, không thu thập dữ liệu nhạy cảm, số liệu thực nghiệm được trình bày minh bạch và có nhãn minh họa rõ ràng.
        </p>
      </div>

      {/* 6 Sections Based on Competition Poster */}
      <div className="space-y-12">
        {/* Section 1: Bối cảnh & Thách thức */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-lg">
              1
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {projectEvidenceData.background.title}
              </h2>
              <p className="text-xs text-slate-500">Khó khăn thực tế tại trường tiểu học vùng ven / nông thôn</p>
            </div>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">
            {projectEvidenceData.background.summary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {projectEvidenceData.background.challenges.map((c, idx) => (
              <div
                key={idx}
                className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200 text-xs sm:text-sm font-semibold text-amber-950 flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{c}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Ý tưởng & Giải pháp */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-black text-lg">
              2
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {projectEvidenceData.solution.title}
              </h2>
              <p className="text-xs text-slate-500">Mô hình người bạn học AI kiên nhẫn và quy trình 5 bước</p>
            </div>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">
            {projectEvidenceData.solution.summary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {projectEvidenceData.solution.principles.map((p, idx) => (
              <div
                key={idx}
                className="bg-blue-50/50 p-4 rounded-2xl border border-blue-200 text-xs sm:text-sm font-semibold text-blue-950 flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>{p}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Hoạt động học sinh minh họa */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-lg">
              3
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                3. Hoạt động học sinh minh họa
              </h2>
              <p className="text-xs text-slate-500">Trải nghiệm học tập thực chất qua 5 bước sư phạm</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2">
              <span className="text-3xl block">🎤</span>
              <h4 className="font-bold text-sm text-slate-900">Luyện âm & Chant nhịp điệu</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Học sinh nghe mẫu, hát vang điệu chant vần điệu và bấm micro nhận dạng lời nói không giới hạn số lần.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2">
              <span className="text-3xl block">👥</span>
              <h4 className="font-bold text-sm text-slate-900">Hội thoại cặp (Pair Work)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Thực hành giao tiếp theo Thẻ Nhiệm Vụ phân vai A-B, biến lớp học thành không gian đối thoại sống động.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2">
              <span className="text-3xl block">🎨</span>
              <h4 className="font-bold text-sm text-slate-900">Sáng tạo Poster & Mini Comic</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tự viết câu tiếng Anh miêu tả tranh vẽ; AI gợi mở nâng cấp từ vựng mà không làm hộ học sinh.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Sản phẩm và học liệu số */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-black text-lg">
              4
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                4. Sản phẩm & Học liệu số phân hóa
              </h2>
              <p className="text-xs text-slate-500">Kho học liệu chuẩn mực đồng hành cùng giáo viên</p>
            </div>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">
            Hệ thống tích hợp AI Teacher Studio cho phép tạo nhanh Flashcards 3D, Quiz trắc nghiệm, truyện tương tác và phiếu in A4 phục vụ giảng dạy trực tiếp trên lớp và tự học tại nhà.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/teacher')}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Xem AI Teacher Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-slate-50"
            >
              <span>Xem triển lãm My Project</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

        {/* Section 5: Kết quả & Tác động thực tế */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center font-black text-lg">
              5
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {projectEvidenceData.studentImpact.title}
              </h2>
              <p className="text-xs text-slate-500">Tác động rõ nét đối với học sinh và đối với giáo viên</p>
            </div>
          </div>

          {/* Group 1: Đối với học sinh */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-600" />
              Đối với học sinh tiểu học:
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {projectEvidenceData.studentImpact.studentSide.map((item, idx) => (
                <div key={idx} className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-200 text-center">
                  <p className="text-2xl sm:text-3xl font-black text-indigo-600">{item.metric}</p>
                  <p className="text-xs text-slate-700 mt-1 font-semibold">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Group 2: Đối với giáo viên */}
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              Đối với giáo viên & nhà trường:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {projectEvidenceData.studentImpact.teacherSide.map((item, idx) => (
                <div key={idx} className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200">
                  <p className="text-2xl font-black text-emerald-700">{item.metric}</p>
                  <p className="text-xs text-slate-700 mt-1 font-semibold">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 6: Minh chứng thực hiện tại TH Khoái Châu 1 */}
        <section className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center font-black text-lg">
              6
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {projectEvidenceData.trialNotes.title}
              </h2>
              <p className="text-xs text-slate-400">Nhật ký triển khai thực nghiệm lớp học của Cô Nguyễn Thị Trang</p>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            {projectEvidenceData.trialNotes.description}
          </p>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 text-xs text-slate-300 italic">
            "{projectEvidenceData.trialNotes.demoDisclosure}"
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => navigate('/evidence')}
              className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileCheck className="w-4 h-4" />
              <span>Xem hồ sơ minh chứng chi tiết</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
