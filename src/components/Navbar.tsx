import React, { useState } from 'react';
import { useApp, PageView } from '../context/AppContext';
import {
  GraduationCap,
  Sparkles,
  Search,
  PlusCircle,
  FolderOpen,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ChevronDown,
  Bell,
  Home,
  CheckCircle,
} from 'lucide-react';
import { DEMO_USERS } from '../data/mockData';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    currentUser,
    logout,
    switchDemoUser,
    items,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems: { label: string; view: PageView; icon: React.ReactNode; badge?: string }[] = [
    { label: 'Home', view: 'landing', icon: <Home className="w-4 h-4" /> },
    { label: 'Dashboard', view: 'dashboard', icon: <FolderOpen className="w-4 h-4" /> },
    { label: 'Browse Items', view: 'browse', icon: <Search className="w-4 h-4" /> },
    {
      label: 'AI Matcher',
      view: 'ai_match',
      icon: <Sparkles className="w-4 h-4 text-amber-500" />,
      badge: 'AI',
    },
    { label: 'My Reports', view: 'my_reports', icon: <CheckCircle className="w-4 h-4" /> },
  ];

  const myActiveCount = currentUser
    ? items.filter((i) => i.userId === currentUser.uid && i.status === 'active').length
    : 0;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-white font-sans">
                  CampusFind
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-widest text-blue-400 bg-blue-950/80 border border-blue-800/80 rounded-md uppercase">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">University Lost & Found</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => setCurrentView(item.view)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full animate-pulse">
                      {item.badge}
                    </span>
                  )}
                  {item.view === 'my_reports' && myActiveCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 text-[11px] font-bold bg-blue-500 text-white rounded-full">
                      {myActiveCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs & User Menu */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => setCurrentView('report_lost')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Lost</span>
            </button>

            <button
              onClick={() => setCurrentView('report_found')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Found</span>
            </button>

            {/* Profile / Auth Dropdown */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-xl bg-slate-800/90 border border-slate-700/80 hover:bg-slate-800 transition-colors"
                >
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-blue-500/50"
                  />
                  <div className="text-left hidden xl:block">
                    <p className="text-xs font-semibold text-white leading-none">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-400 capitalize mt-0.5">{currentUser.role || 'Student'}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Box */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 text-slate-200 animate-slide-up"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-3 border-b border-slate-700/80 bg-slate-850">
                      <p className="text-xs font-semibold text-white">{currentUser.name}</p>
                      <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-blue-300 bg-blue-950/60 px-2 py-1 rounded border border-blue-800/50">
                        <ShieldCheck className="w-3 h-3 text-blue-400" />
                        <span>ID: {currentUser.studentId || 'STU-AUTH'}</span>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setCurrentView('profile');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs hover:bg-slate-700 flex items-center gap-2.5"
                      >
                        <UserIcon className="w-4 h-4 text-blue-400" />
                        <span>My Profile & Settings</span>
                      </button>

                      <button
                        onClick={() => {
                          setCurrentView('dashboard');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs hover:bg-slate-700 flex items-center gap-2.5"
                      >
                        <FolderOpen className="w-4 h-4 text-indigo-400" />
                        <span>Campus Dashboard</span>
                      </button>
                    </div>

                    {/* Switch Demo Account Quick Option */}
                    <div className="border-t border-slate-700/80 pt-2 px-2">
                      <p className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Quick Demo Accounts
                      </p>
                      {DEMO_USERS.map((user) => (
                        <button
                          key={user.uid}
                          onClick={() => {
                            switchDemoUser(user);
                            setUserDropdownOpen(false);
                          }}
                          className={`w-full text-left px-2 py-1.5 rounded text-xs flex items-center gap-2 transition-colors ${
                            currentUser.uid === user.uid
                              ? 'bg-blue-600/30 text-blue-300 font-semibold'
                              : 'hover:bg-slate-700/80 text-slate-300'
                          }`}
                        >
                          <img src={user.avatarUrl} alt="" className="w-5 h-5 rounded-full" />
                          <div className="truncate text-[11px]">
                            <span className="font-medium">{user.name}</span>
                            <span className="opacity-60 ml-1">({user.role})</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-slate-700/80 mt-2 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs hover:bg-rose-950/40 text-rose-300 flex items-center gap-2.5"
                      >
                        <LogOut className="w-4 h-4 text-rose-400" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('login')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => setCurrentView('register')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-colors"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            {currentUser ? (
              <button
                onClick={() => setCurrentView('profile')}
                className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-blue-400"
              >
                <img src={currentUser.avatarUrl} alt="" className="w-full h-full object-cover" />
              </button>
            ) : (
              <button
                onClick={() => setCurrentView('login')}
                className="px-2.5 py-1 text-xs font-semibold bg-blue-600 text-white rounded-md"
              >
                Sign In
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:bg-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3 animate-slide-down">
          <div className="space-y-1 pt-2">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => {
                  setCurrentView(item.view);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  currentView === item.view
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500 text-slate-950 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                setCurrentView('report_lost');
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Lost</span>
            </button>

            <button
              onClick={() => {
                setCurrentView('report_found');
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-emerald-600 text-white font-bold text-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Found</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
