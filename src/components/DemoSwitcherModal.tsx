import React from 'react';
import { UserProfile, GradeLevel } from '../types';
import { DEFAULT_STUDENT_USER, DEFAULT_TEACHER_USER, DEFAULT_GUEST_USER } from '../services/storageService';
import { X, Check, User, Sparkles, GraduationCap, ShieldCheck } from 'lucide-react';
import { audioService } from '../services/audioService';

interface DemoSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
  language: 'vi' | 'en';
}

export const DemoSwitcherModal: React.FC<DemoSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
  language,
}) => {
  if (!isOpen) return null;

  const demoAccounts: { profile: UserProfile; descVi: string; descEn: string; icon: any; color: string }[] = [
    {
      profile: DEFAULT_STUDENT_USER,
      descVi: 'Trải nghiệm giao diện học sinh Lớp 3: làm bài, nhận gợi ý từ Sparky, tích lũy sao và huy hiệu.',
      descEn: 'Experience Grade 3 student view: practice, receive AI hints, earn stars and badges.',
      icon: User,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      profile: {
        ...DEFAULT_STUDENT_USER,
        id: 'stu_2',
        name: 'Trần Minh Khôi',
        alias: 'Minh Khôi (1B)',
        grade: 1,
        className: 'Lớp 1B',
        avatar: '🧒',
        stars: 32,
        streakDays: 3,
        badges: ['Early Bird', 'Phonics Explorer'],
        recentScores: [],
      },
      descVi: 'Trải nghiệm giao diện học sinh Lớp 1: chữ to, câu ngắn, hình ảnh nhiều hơn, chant bảng chữ cái.',
      descEn: 'Grade 1 student view: large text, short sentences, visual flashcards, alphabet chants.',
      icon: Sparkles,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      profile: DEFAULT_TEACHER_USER,
      descVi: 'Không gian Giáo viên: Dùng AI Studio soạn bài, xem thống kê lớp học TH Khoái Châu 1, xuất báo cáo CSV.',
      descEn: 'Teacher Portal: Generate lessons with Gemini, manage classes, view analytics, export reports.',
      icon: GraduationCap,
      color: 'from-purple-500 to-pink-600',
    },
    {
      profile: DEFAULT_GUEST_USER,
      descVi: 'Dành cho Ban Giám khảo & Khách tham quan: Xem minh chứng, tác động thực tế và dùng thử toàn bộ chức năng.',
      descEn: 'For Judges & Visitors: Inspect field evidence, impact metrics, and freely test all modules.',
      icon: ShieldCheck,
      color: 'from-amber-500 to-orange-600',
    },
  ];

  const handleSelect = (profile: UserProfile) => {
    audioService.playSuccessSound();
    onSelectUser(profile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-indigo-100 relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 mb-2">
            {language === 'vi' ? 'Chế độ Demo Một Chạm' : '1-Click Demo Profiles'}
          </span>
          <h3 className="text-2xl font-extrabold text-slate-900">
            {language === 'vi' ? 'Chọn vai trải nghiệm' : 'Select Demo Persona'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'vi'
              ? 'Chuyển đổi tức thì giữa các góc nhìn người dùng mà không cần mật khẩu.'
              : 'Switch instantly between personas with sample data ready.'}
          </p>
        </div>

        <div className="space-y-3">
          {demoAccounts.map((item, idx) => {
            const isCurrent = currentUser.id === item.profile.id && currentUser.role === item.profile.role;
            const Icon = item.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(item.profile)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 cursor-pointer ${
                  isCurrent
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-sm ring-2 ring-indigo-200'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 bg-gradient-to-br ${item.color} shadow-sm`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                      <span>{item.profile.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-slate-200 text-slate-700">
                        {item.profile.className}
                      </span>
                    </h4>
                    {isCurrent && <Check className="w-5 h-5 text-indigo-600 shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {language === 'vi' ? item.descVi : item.descEn}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>{language === 'vi' ? 'Dữ liệu minh họa TH Khoái Châu 1' : 'Sample Khoai Chau 1 Trial Data'}</span>
          <button
            type="button"
            onClick={onClose}
            className="text-indigo-600 font-bold hover:underline"
          >
            {language === 'vi' ? 'Đóng' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
