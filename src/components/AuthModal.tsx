import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Mail,
  Lock,
  User as UserIcon,
  Building,
  Shield,
  ArrowRight,
  Edit2,
  Save,
  Loader2,
} from 'lucide-react';

export const AuthModal: React.FC<{ mode: 'login' | 'register' | 'profile' }> = ({ mode }) => {
  const {
    currentUser,
    login,
    registerUser,
    logout,
    updateUserProfile,
    setCurrentView,
    items,
    isLoading,
  } = useApp();

  // Login states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register states
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDepartment, setRegDepartment] = useState('Computer Science');
  const [regStudentId, setRegStudentId] = useState('');

  // Profile Edit states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editDepartment, setEditDepartment] = useState(currentUser?.department || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail && loginPassword) {
      await login(loginEmail, loginPassword);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regName && regEmail && regPassword) {
      await registerUser(regName, regEmail, regPassword, regDepartment, regStudentId);
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: editName,
      department: editDepartment,
      phone: editPhone,
    });
    setIsEditingProfile(false);
  };

  // If view is Profile
  if (mode === 'profile' && currentUser) {
    const userReports = items.filter((i) => i.userId === currentUser.uid);
    const resolvedReports = userReports.filter((i) => i.status === 'resolved');

    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 pb-8 border-b border-slate-800">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-blue-600/50 shadow-xl"
              />
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-2xl font-bold text-white">{currentUser.name}</h2>
                  <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-blue-900 text-blue-300 border border-blue-700 rounded-full">
                    {currentUser.role || 'Student'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{currentUser.email}</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3 text-xs text-slate-300">
                  <span className="bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
                    Dept: {currentUser.department || 'General'}
                  </span>
                  <span className="bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
                    ID: {currentUser.studentId || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditName(currentUser.name);
                  setEditDepartment(currentUser.department || '');
                  setEditPhone(currentUser.phone || '');
                  setIsEditingProfile(!isEditingProfile);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold flex items-center gap-2"
              >
                <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                <span>{isEditingProfile ? 'Cancel Edit' : 'Edit Profile'}</span>
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800/80 text-rose-300 text-xs font-semibold"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Edit form */}
          {isEditingProfile && (
            <form onSubmit={handleProfileSave} className="py-6 border-b border-slate-800 space-y-4 animate-slide-down">
              <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">Update Personal Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
                  <input
                    type="text"
                    value={editDepartment}
                    onChange={(e) => setEditDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </form>
          )}

          {/* Activity Statistics */}
          <div className="pt-8">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">
              My Campus Activity Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 text-center">
                <p className="text-3xl font-black text-blue-400">{userReports.length}</p>
                <p className="text-xs text-slate-400 font-medium mt-1">Total Reports Created</p>
              </div>
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 text-center">
                <p className="text-3xl font-black text-amber-400">
                  {userReports.filter((i) => i.status === 'active').length}
                </p>
                <p className="text-xs text-slate-400 font-medium mt-1">Active Item Posts</p>
              </div>
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 text-center">
                <p className="text-3xl font-black text-emerald-400">{resolvedReports.length}</p>
                <p className="text-xs text-slate-400 font-medium mt-1">Belongings Reunited 🎉</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100">
        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            {mode === 'login' ? 'Welcome Back' : 'Create Student Account'}
          </h2>
          <p className="text-xs text-slate-400">
            {mode === 'login'
              ? 'Sign in with your Firebase Auth student account'
              : 'Join CampusFind AI to manage and track your belongings'}
          </p>

          <div className="mt-3 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-left text-[11px] text-slate-400 space-y-1">
            <p className="font-semibold text-blue-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>Firebase Authentication & Firestore Sync</span>
            </p>
            <p>
              Accounts are created via <code className="text-blue-300">createUserWithEmailAndPassword()</code> and stored in Firestore <code className="text-blue-300">/users/&#123;uid&#125;</code>.
            </p>
            <p className="text-[10px] text-slate-500">
              * Note: Ensure Email/Password is enabled in <strong>Firebase Console &rarr; Authentication &rarr; Sign-in method</strong>.
            </p>
          </div>
        </div>

        {/* Form */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                University Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in with Firebase...</span>
                </>
              ) : (
                <>
                  <span>Sign In to CampusFind AI</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Jordan Miller"
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                University Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="jordan@university.edu"
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Department / Major
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={regDepartment}
                  onChange={(e) => setRegDepartment(e.target.value)}
                  placeholder="e.g. Electrical Engineering"
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Student / Staff ID (Optional)
              </label>
              <div className="relative">
                <Shield className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={regStudentId}
                  onChange={(e) => setRegStudentId(e.target.value)}
                  placeholder="STU-102938"
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Register & Start Reporting</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Mode Switcher */}
        <div className="mt-6 text-center text-xs text-slate-400">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => setCurrentView('register')}
                className="text-blue-400 font-semibold hover:underline"
              >
                Register now
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                onClick={() => setCurrentView('login')}
                className="text-blue-400 font-semibold hover:underline"
              >
                Sign in here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
