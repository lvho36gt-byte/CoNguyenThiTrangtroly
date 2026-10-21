import React, { useState } from 'react';
import { StudentRecord, UserProfile } from '../types';
import { storageService } from '../services/storageService';
import { audioService } from '../services/audioService';
import {
  Users,
  GraduationCap,
  Calendar,
  Send,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
  Plus,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';

interface TeacherClassesPageProps {
  currentUser: UserProfile;
  language: 'vi' | 'en';
  navigate: (route: string) => void;
}

export const TeacherClassesPage: React.FC<TeacherClassesPageProps> = ({
  currentUser,
  language,
  navigate,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('3A1');
  const [students, setStudents] = useState<StudentRecord[]>(() =>
    storageService.getStudentRecords()
  );
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState<string>('');

  // Assignment Modal / State
  const [showAssignModal, setShowAssignModal] = useState<boolean>(false);
  const [taskTitle, setTaskTitle] = useState<string>('Luyện nói tình huống "At School"');
  const [taskDueDate, setTaskDueDate] = useState<string>('2026-10-25');
  const [taskSentSuccess, setTaskSentSuccess] = useState<boolean>(false);

  const filteredStudents = students.filter(
    (s) =>
      s.className.includes(selectedClass) &&
      (s.aliasName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.studentCode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEditNote = (student: StudentRecord) => {
    setEditingStudentId(student.id);
    setNoteInput(student.teacherNotes);
  };

  const handleSaveNote = (student: StudentRecord) => {
    audioService.playClickSound();
    const updated = { ...student, teacherNotes: noteInput };
    const newList = storageService.updateStudentRecord(updated);
    setStudents(newList);
    setEditingStudentId(null);
  };

  const handleSendAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    audioService.playSuccessSound();
    setTaskSentSuccess(true);
    setTimeout(() => {
      setTaskSentSuccess(false);
      setShowAssignModal(false);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-2 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md">
            Quản trị & Sư phạm
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">Quản lý lớp học & Giao nhiệm vụ</h1>
          <p className="text-sky-100 text-sm sm:text-base leading-relaxed">
            Theo dõi tiến độ luyện tập của từng học sinh với mã định danh nội bộ ẩn danh, bảo đảm quyền riêng tư an toàn cho trẻ.
          </p>
        </div>
        <div className="absolute right-4 bottom-2 text-7xl opacity-20 pointer-events-none">
          🏫
        </div>
      </div>

      {/* Class tabs and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedClass('3A1')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              selectedClass === '3A1'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Lớp 3A1 – TH Khoái Châu 1 (5 em)
          </button>
          <button
            type="button"
            onClick={() => setSelectedClass('1B')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              selectedClass === '1B'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Lớp 1B – TH Khoái Châu 1 (Nhóm mẫu)
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowAssignModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Giao nhiệm vụ mới cho lớp</span>
        </button>
      </div>

      {/* Assign Task Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-indigo-100 space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Giao nhiệm vụ cho Lớp {selectedClass}</h3>
            {taskSentSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-900 font-bold text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Đã gửi nhiệm vụ đến toàn bộ học sinh lớp {selectedClass}!</span>
              </div>
            ) : (
              <form onSubmit={handleSendAssignment} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Nhiệm vụ học tập:
                  </label>
                  <input
                    type="text"
                    required
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Hạn hoàn thành:
                  </label>
                  <input
                    type="date"
                    required
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAssignModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow"
                  >
                    Giao bài ngay
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm kiếm theo mã số hoặc tên học sinh..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Student List Table */}
      <div className="bg-white rounded-3xl border-2 border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px] font-extrabold">
              <tr>
                <th className="py-3.5 px-4">Mã nội bộ</th>
                <th className="py-3.5 px-4">Học sinh (Bí danh)</th>
                <th className="py-3.5 px-4 text-center">Số bài làm</th>
                <th className="py-3.5 px-4 text-center">Tỷ lệ đúng</th>
                <th className="py-3.5 px-4">Chủ đề cần củng cố</th>
                <th className="py-3.5 px-4">Nhận xét của Cô Trang</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-slate-600">
                    {st.studentCode}
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-extrabold text-slate-900">{st.aliasName}</p>
                    <p className="text-[11px] text-slate-400">{st.lastActive}</p>
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-slate-700">
                    {st.quizzesCompleted} bài ({st.practiceCount} lượt nói)
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full font-black text-xs ${
                        st.accuracyRate >= 90
                          ? 'bg-emerald-100 text-emerald-800'
                          : st.accuracyRate >= 80
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {st.accuracyRate}%
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-xs text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold">
                      {st.needsPractice.join(', ')}
                    </span>
                  </td>
                  <td className="py-4 px-4 max-w-xs">
                    {editingStudentId === st.id ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={noteInput}
                          onChange={(e) => setNoteInput(e.target.value)}
                          className="px-2 py-1 rounded border text-xs w-full"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveNote(st)}
                          className="p-1 rounded bg-emerald-600 text-white text-xs font-bold"
                        >
                          Lưu
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-600 italic line-clamp-2">
                        "{st.teacherNotes}"
                      </p>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleEditNote(st)}
                      className="text-xs text-indigo-600 font-bold hover:underline cursor-pointer"
                    >
                      Ghi nhận xét
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
