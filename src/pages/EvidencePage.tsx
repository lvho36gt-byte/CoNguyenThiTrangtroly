import React from 'react';
import {
  FileCheck,
  CheckCircle2,
  Calendar,
  School,
  Award,
  Users,
  Lightbulb,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface EvidencePageProps {
  language: 'vi' | 'en';
  navigate: (route: string) => void;
}

export const EvidencePage: React.FC<EvidencePageProps> = ({ language, navigate }) => {
  const trialPhases = [
    {
      phase: 'Giai đoạn 1 (01/2026 - 02/2026)',
      title: 'Khảo sát nhu cầu & Thiết kế mô hình 5 bước',
      details:
        'Khảo sát thực trạng giao tiếp tiếng Anh tại Trường TH Khoái Châu 1. Nhận diện rào cản chính: thiếu thời lượng luyện nói cá nhân, tâm lý ngại sai và học sinh ít có cơ hội nghe giọng bản ngữ.',
    },
    {
      phase: 'Giai đoạn 2 (03/2026 - 05/2026)',
      title: 'Thử nghiệm nguyên mẫu cùng Lớp 3A1 & 1B',
      details:
        'Áp dụng robot Sparky trong các hoạt động Khởi động (Chant) và Luyện nói theo cặp (Task Cards). Giáo viên quan sát mức độ hào hứng và tần suất giơ tay phát biểu.',
    },
    {
      phase: 'Giai đoạn 3 (06/2026 - 10/2026)',
      title: 'Hoàn thiện AI Teacher Studio & Báo cáo tác động',
      details:
        'Tích hợp công cụ sinh học liệu phân hóa cho giáo viên, chuẩn hóa tiêu chí tự đánh giá "Today I can..." và quy chuẩn an toàn số cho trẻ em.',
    },
  ];

  const qualitativeObservations = [
    {
      title: 'Vượt qua tâm lý e ngại (Affective Filter)',
      observation:
        'Khi nói chuyện với robot Sparky, học sinh không sợ bị chê cười nếu phát âm chưa chuẩn. Các em sẵn sàng nhấn nút nói lặp lại 3-5 lần cho đến khi đạt được sao thưởng.',
    },
    {
      title: 'Tăng hứng thú qua minigame và chant',
      observation:
        'Các bài chant có vần điệu /æ/ /æ/ Apple giúp học sinh lớp 1 ghi nhớ nhanh âm vị mà không cần ghi chép ngữ pháp khô khan.',
    },
    {
      title: 'Chuyển hóa thành sản phẩm thực tế (Output)',
      observation:
        'Học sinh rất hào hứng khi được cô giáo duyệt sản phẩm poster và thẻ truyện mini của mình để chia sẻ lên góc trưng bày lớp học.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-2 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md">
            Hồ sơ minh chứng thực nghiệm
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">Hồ sơ Minh chứng Triển khai</h1>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            Nhật ký thực nghiệm, giai đoạn triển khai và quan sát sư phạm thực tế tại Trường Tiểu học Khoái Châu 1.
          </p>
        </div>
        <div className="absolute right-4 bottom-2 text-7xl opacity-20 pointer-events-none">
          📑
        </div>
      </div>

      {/* Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <School className="w-5 h-5 text-emerald-600" />
          <h2 className="text-xl font-bold text-slate-900">Thông tin đơn vị & Địa bàn thực nghiệm</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-slate-500 font-bold uppercase text-[11px]">Đơn vị triển khai</span>
            <p className="font-extrabold text-slate-900 text-base mt-1">Trường TH Khoái Châu 1</p>
            <p className="text-slate-500 text-xs">Huyện Khoái Châu, Tỉnh Hưng Yên</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-slate-500 font-bold uppercase text-[11px]">Giáo viên phụ trách</span>
            <p className="font-extrabold text-slate-900 text-base mt-1">Cô giáo Nguyễn Thị Trang</p>
            <p className="text-slate-500 text-xs">Giáo viên Tiếng Anh Tiểu học</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-slate-500 font-bold uppercase text-[11px]">Đối tượng thực nghiệm</span>
            <p className="font-extrabold text-slate-900 text-base mt-1">Lớp 3A1 & Nhóm Lớp 1B</p>
            <p className="text-slate-500 text-xs">Học sinh tiểu học (7 - 9 tuổi)</p>
          </div>
        </div>
      </div>

      {/* Trial Phases Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-100 shadow-sm space-y-6">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          Các giai đoạn triển khai thực nghiệm
        </h3>

        <div className="space-y-4">
          {trialPhases.map((tp, idx) => (
            <div
              key={idx}
              className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-1.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  {tp.phase}
                </span>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Đã hoàn thành
                </span>
              </div>
              <h4 className="text-base font-extrabold text-slate-900">{tp.title}</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{tp.details}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pedagogical Observations */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-100 shadow-sm space-y-4">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          Quan sát sư phạm thực tế từ lớp học
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {qualitativeObservations.map((obs, idx) => (
            <div
              key={idx}
              className="bg-amber-50/40 p-5 rounded-2xl border border-amber-200 space-y-2"
            >
              <h4 className="font-bold text-sm text-amber-950">{obs.title}</h4>
              <p className="text-xs text-slate-700 leading-relaxed">{obs.observation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Callout to Reports & Studio */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-6 border-2 border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-slate-900 text-sm sm:text-base">
            Xem báo cáo định lượng chi tiết của Lớp 3A1
          </h4>
          <p className="text-xs text-slate-600 mt-1">
            Số liệu thống kê số bài làm, lượt nói, tỷ lệ đúng và nhận xét cá nhân hóa của từng em.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/teacher/reports')}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <span>Xem báo cáo thống kê</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
