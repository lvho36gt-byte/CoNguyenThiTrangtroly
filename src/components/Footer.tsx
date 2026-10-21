import React from 'react';
import { ShieldCheck, Sparkles, Heart, Award, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  navigate: (route: string) => void;
  language: 'vi' | 'en';
}

export const Footer: React.FC<FooterProps> = ({ navigate, language }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Brand & Teacher */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <span className="font-black text-xl text-white tracking-tight">ENGLISH SPARK</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              {language === 'vi'
                ? 'Nền tảng EdTech AI tương tác phát triển năng lực giao tiếp tiếng Anh cho học sinh tiểu học (Lớp 1–5). Học sinh chủ động sáng tạo sản phẩm, AI đồng hành kiên nhẫn và hỗ trợ.'
                : 'Interactive EdTech AI platform fostering English communicative competence for primary school students (Grades 1-5).'}
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <p>
                <strong className="text-slate-200">Giáo viên phát triển:</strong> Cô giáo Nguyễn Thị Trang
              </p>
              <p>
                <strong className="text-slate-200">Đơn vị:</strong> Trường Tiểu học Khoái Châu 1, Huyện Khoái Châu, Hưng Yên
              </p>
              <p className="text-amber-400 font-semibold flex items-center gap-1.5 pt-1">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                Dự án tham gia Cuộc thi Ứng dụng AI trong Giáo dục Việt Nam 2026
              </p>
            </div>
          </div>

          {/* Quick Learning Links */}
          <div>
            <h4 className="font-bold text-white text-sm mb-3 uppercase tracking-wider">
              {language === 'vi' ? 'Hoạt động học tập' : 'Learning Hub'}
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/phonics')}
                  className="hover:text-amber-300 transition-colors"
                >
                  AI Phonics & Phát âm
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/vocabulary')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Vocabulary Adventure
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/speaking')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Speaking Corner & Role-play
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/stories')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Story Time & Đọc hiểu
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/quiz')}
                  className="hover:text-amber-300 transition-colors"
                >
                  English Quiz Arena
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/projects')}
                  className="hover:text-amber-300 transition-colors"
                >
                  My Project & Reflection
                </button>
              </li>
            </ul>
          </div>

          {/* Teacher & Evidence Links */}
          <div>
            <h4 className="font-bold text-white text-sm mb-3 uppercase tracking-wider">
              {language === 'vi' ? 'Giáo viên & Minh chứng' : 'Teacher & Evidence'}
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/teacher')}
                  className="hover:text-blue-400 transition-colors"
                >
                  AI Teacher Studio
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/teacher/classes')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Quản lý lớp & Nhiệm vụ
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/teacher/reports')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Báo cáo & Thống kê thực tế
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/about')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Giới thiệu dự án (6 trụ cột)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/evidence')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Minh chứng thực nghiệm
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/settings')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Cài đặt & An toàn AI
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Safety & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              {language === 'vi'
                ? 'Cam kết AI an toàn cho trẻ em: Không lưu trữ giọng nói nhạy cảm, giao diện tích cực không phán xét.'
                : 'Child Safety First: Safe speech recognition, positive encouragement, privacy-focused.'}
            </span>
          </div>
          <p className="text-center sm:text-right">
            © 2026 English Spark – Cô giáo Nguyễn Thị Trang (TH Khoái Châu 1).
          </p>
        </div>
      </div>
    </footer>
  );
};
