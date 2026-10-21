import React, { useState } from 'react';
import { UserProfile, GradeLevel } from '../types';
import { audioService } from '../services/audioService';
import { DemoSwitcherModal } from './DemoSwitcherModal';
import {
  Volume2,
  VolumeX,
  Globe,
  Sparkles,
  Menu,
  X,
  UserCheck,
  Star,
  BookOpen,
  Mic,
  GraduationCap,
  Award,
  Layers,
  HeartHandshake,
  Settings,
} from 'lucide-react';

interface NavbarProps {
  currentRoute: string;
  navigate: (route: string) => void;
  currentUser: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  language: 'vi' | 'en';
  onToggleLanguage: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  navigate,
  currentUser,
  onUpdateUser,
  language,
  onToggleLanguage,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(audioService.isSoundEnabled());
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  const toggleSound = () => {
    const newState = !soundOn;
    audioService.setSoundEnabled(newState);
    setSoundOn(newState);
    if (newState) {
      audioService.playClickSound();
    }
  };

  const handleGradeChange = (grade: GradeLevel) => {
    audioService.playClickSound();
    onUpdateUser({ ...currentUser, grade });
  };

  const navLinks = [
    { route: '/', labelVi: 'Trang chủ', labelEn: 'Home' },
    { route: '/learn', labelVi: 'Học tập', labelEn: 'Learn' },
    { route: '/phonics', labelVi: 'AI Phonics', labelEn: 'Phonics' },
    { route: '/vocabulary', labelVi: 'Từ vựng', labelEn: 'Vocab' },
    { route: '/speaking', labelVi: 'Luyện nói', labelEn: 'Speaking' },
    { route: '/stories', labelVi: 'Truyện', labelEn: 'Stories' },
    { route: '/quiz', labelVi: 'Quiz', labelEn: 'Quiz' },
    { route: '/projects', labelVi: 'My Project', labelEn: 'Projects' },
    { route: '/my-progress', labelVi: 'Tiến độ', labelEn: 'Progress' },
    { route: '/teacher', labelVi: 'GV Studio', labelEn: 'Teacher' },
    { route: '/about', labelVi: 'Giới thiệu', labelEn: 'About' },
    { route: '/evidence', labelVi: 'Minh chứng', labelEn: 'Evidence' },
  ];

  const handleNav = (route: string) => {
    audioService.playClickSound();
    navigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-indigo-100 shadow-sm">
      {/* Top Banner with Project Credentials */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white text-[11px] sm:text-xs py-1 px-3 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 truncate">
          <span className="bg-white/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px]">
            AI EdTech 2026
          </span>
          <span className="truncate">
            <strong className="font-bold">ENGLISH SPARK</strong> – Trường Tiểu học Khoái Châu 1 (GV: Nguyễn Thị Trang)
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4 shrink-0 text-slate-200">
          <span className="italic">"Mỗi học sinh đều được tỏa sáng"</span>
          <button
            type="button"
            onClick={() => handleNav('/settings')}
            className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{language === 'vi' ? 'Cài đặt' : 'Settings'}</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Logo & Brand */}
        <div
          onClick={() => handleNav('/')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          {/* Mini Robot Badge */}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-black text-xl tracking-tight bg-gradient-to-r from-blue-700 via-indigo-600 to-rose-600 bg-clip-text text-transparent">
                ENGLISH SPARK
              </span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-200">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-500 -mt-1 font-semibold hidden sm:block">
              {language === 'vi' ? 'Đồng hành cùng học sinh tiểu học' : 'Primary AI Companion'}
            </p>
          </div>
        </div>

        {/* Grade Selector Pills (Quick 1-click for grades 1-5) */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200">
          <span className="text-[11px] font-bold text-slate-500 px-2 uppercase">
            {language === 'vi' ? 'Khối:' : 'Grade:'}
          </span>
          {([1, 2, 3, 4, 5] as GradeLevel[]).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => handleGradeChange(g)}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                currentUser.grade === g
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              {language === 'vi' ? `Lớp ${g}` : `G${g}`}
            </button>
          ))}
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 text-sm font-bold text-slate-600">
          {navLinks.slice(0, 8).map((link) => {
            const isActive = currentRoute === link.route;
            return (
              <button
                key={link.route}
                type="button"
                onClick={() => handleNav(link.route)}
                className={`px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'text-blue-700 bg-blue-50 font-extrabold border border-blue-200/60'
                    : 'hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {language === 'vi' ? link.labelVi : link.labelEn}
              </button>
            );
          })}
        </nav>

        {/* Right Action Tools: Stars, Sound, Language, Demo Role */}
        <div className="flex items-center gap-2">
          {/* Stars Pill (For Students) */}
          <div
            title="Số ngôi sao English Star tích lũy được!"
            onClick={() => handleNav('/my-progress')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-extrabold cursor-pointer hover:bg-amber-100 transition-colors"
          >
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>{currentUser.stars || 0}</span>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            title={soundOn ? 'Tắt âm thanh' : 'Bật âm thanh'}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              soundOn
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                : 'bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200'
            }`}
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Language Toggle */}
          <button
            type="button"
            onClick={() => {
              audioService.playClickSound();
              onToggleLanguage();
            }}
            title="Chuyển đổi ngôn ngữ Tiếng Việt / English"
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-600" />
            <span>{language.toUpperCase()}</span>
          </button>

          {/* Demo Persona Switcher Button */}
          <button
            type="button"
            onClick={() => {
              audioService.playClickSound();
              setDemoModalOpen(true);
            }}
            className="hidden sm:flex items-center gap-2 py-1.5 px-3 rounded-xl border-2 border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-900 text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <span className="text-base">{currentUser.avatar || '👤'}</span>
            <span className="max-w-[90px] truncate">{currentUser.alias || currentUser.name}</span>
            <UserCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          </button>

          {/* Mobile Hamburger Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-indigo-100 px-4 py-4 space-y-3 animate-in slide-in-from-top duration-200">
          {/* Mobile Grade Selector */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-600 uppercase">
              {language === 'vi' ? 'Chọn khối lớp:' : 'Select Grade:'}
            </span>
            <div className="flex gap-1">
              {([1, 2, 3, 4, 5] as GradeLevel[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => handleGradeChange(g)}
                  className={`px-3 py-1 rounded-lg text-xs font-black ${
                    currentUser.grade === g
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  Lớp {g}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Nav Links */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {navLinks.map((link) => (
              <button
                key={link.route}
                type="button"
                onClick={() => handleNav(link.route)}
                className={`text-left px-3 py-2 rounded-xl text-sm font-bold ${
                  currentRoute === link.route
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {language === 'vi' ? link.labelVi : link.labelEn}
              </button>
            ))}
          </div>

          {/* Persona switch button on mobile */}
          <button
            type="button"
            onClick={() => {
              setDemoModalOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full mt-2 py-2.5 px-4 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-900 font-bold text-xs flex items-center justify-center gap-2"
          >
            <span>{currentUser.avatar}</span>
            <span>Đổi vai trải nghiệm Demo ({currentUser.alias})</span>
          </button>
        </div>
      )}

      {/* Demo Switcher Modal */}
      <DemoSwitcherModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        currentUser={currentUser}
        onSelectUser={onUpdateUser}
        language={language}
      />
    </header>
  );
};
