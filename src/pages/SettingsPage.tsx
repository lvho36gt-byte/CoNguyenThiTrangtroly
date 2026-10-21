import React, { useState } from 'react';
import { GradeLevel, UserProfile } from '../types';
import { audioService } from '../services/audioService';
import { storageService } from '../services/storageService';
import {
  Settings,
  Volume2,
  VolumeX,
  RotateCcw,
  ShieldCheck,
  Globe,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface SettingsPageProps {
  currentUser: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  language: 'vi' | 'en';
  onToggleLanguage: () => void;
  navigate: (route: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  currentUser,
  onUpdateUser,
  language,
  onToggleLanguage,
  navigate,
}) => {
  const [soundOn, setSoundOn] = useState<boolean>(audioService.isSoundEnabled());
  const [resetSuccess, setResetSuccess] = useState<boolean>(false);

  const handleToggleSound = () => {
    const newState = !soundOn;
    audioService.setSoundEnabled(newState);
    setSoundOn(newState);
    if (newState) audioService.playSuccessSound();
  };

  const handleGradeChange = (g: GradeLevel) => {
    audioService.playClickSound();
    const updated = storageService.updateGrade(g);
    onUpdateUser(updated);
  };

  const handleResetData = () => {
    if (confirm('Em có chắc chắn muốn đặt lại dữ liệu minh họa về trạng thái mặc định ban đầu không?')) {
      audioService.playClickSound();
      storageService.resetToDefaults();
      setResetSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-2 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md">
            Cấu hình & Quyền riêng tư
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">Cài đặt hệ thống</h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Tùy chỉnh âm thanh, cấp độ lớp học và quản lý dữ liệu an toàn cho học sinh tiểu học.
          </p>
        </div>
        <div className="absolute right-4 bottom-2 text-7xl opacity-20 pointer-events-none">
          ⚙️
        </div>
      </div>

      {/* Main Settings List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-100 shadow-sm space-y-6">
        {/* Sound Toggle */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              {soundOn ? <Volume2 className="w-5 h-5 text-emerald-600" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
              Âm thanh hiệu ứng & Giọng đọc mẫu
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Bao gồm chuông chúc mừng đúng/sai, tiếng reo sao và giọng phát âm tiếng Anh.
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleSound}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              soundOn
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            {soundOn ? 'Đang bật (ON)' : 'Đang tắt (OFF)'}
          </button>
        </div>

        {/* Language Setting */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              Ngôn ngữ giao diện (Bilingual)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hỗ trợ chuyển đổi giữa Tiếng Việt và Tiếng Anh.
            </p>
          </div>

          <button
            type="button"
            onClick={onToggleLanguage}
            className="px-4 py-2 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 font-bold text-xs hover:bg-blue-100 transition-colors cursor-pointer"
          >
            {language === 'vi' ? 'Tiếng Việt (VI)' : 'English (EN)'}
          </button>
        </div>

        {/* Grade Level Setting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-600" />
              Khối lớp đang học
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hệ thống sẽ ưu tiên các câu hỏi và tình huống phù hợp với độ tuổi này.
            </p>
          </div>

          <div className="flex gap-1.5">
            {([1, 2, 3, 4, 5] as GradeLevel[]).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => handleGradeChange(g)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  currentUser.grade === g
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Lớp {g}
              </button>
            ))}
          </div>
        </div>

        {/* Reset Demo Data */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-rose-600" />
              Khôi phục dữ liệu minh họa
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Đặt lại toàn bộ tiến độ, điểm số và bài tập về dữ liệu mẫu ban đầu của TH Khoái Châu 1.
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetData}
            className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-bold text-xs transition-colors cursor-pointer shrink-0"
          >
            Khôi phục mặc định
          </button>
        </div>

        {resetSuccess && (
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-900 text-xs font-bold">
            Đang tải lại dữ liệu ban đầu...
          </div>
        )}
      </div>

      {/* Child Data Safety & Ethics Policy */}
      <div className="bg-slate-900 text-slate-300 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-white">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-base">Chính sách Bảo vệ Dữ liệu Trẻ em (Child Safety First)</h3>
        </div>

        <ul className="space-y-2 text-xs leading-relaxed text-slate-400">
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 font-bold">•</span>
            <span>
              <strong>Không thu thập dữ liệu nhạy cảm:</strong> Tuyệt đối không yêu cầu số điện thoại, địa chỉ nhà riêng, hình ảnh nhạy cảm hoặc mật khẩu của trẻ em.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 font-bold">•</span>
            <span>
              <strong>Xử lý giọng nói an toàn:</strong> Giọng nói nhận dạng qua Web Speech API không bị lưu trữ vĩnh viễn trên máy chủ, chỉ được đối sánh tức thời trên trình duyệt.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 font-bold">•</span>
            <span>
              <strong>Quyền riêng tư có kiểm soát:</strong> Mọi sản phẩm sáng tạo của học sinh ở chế độ riêng tư mặc định và phải được giáo viên phê duyệt trước khi chia sẻ trong phạm vi lớp học.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 font-bold">•</span>
            <span>
              <strong>Kiến trúc kỹ thuật:</strong> Bản thử nghiệm lưu trữ bằng LocalStorage trên trình duyệt máy trạm; cấu trúc mã nguồn được thiết kế sẵn adapter để kết nối Firebase Firestore / Cloud SQL khi nhà trường chính thức triển khai.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
