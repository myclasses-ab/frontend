"use client";

import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Menu,
  X,
  ChevronDown,
  GraduationCap,
  MapPin,
  BookOpen,
  Users,
  Award,
  Phone,
  ArrowRight,
  LogOut,
  User,
} from "lucide-react";
import { useScroll } from "@/hooks/useScroll";
import { useAuth } from "@/context/AuthContext";

// Types
interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

// Navigation Data
const mainNavItems: NavItem[] = [
  {
    label: "Explore",
    href: "#",
    icon: <BookOpen className="w-4 h-4" />,
    children: [
      { label: "Coaching Institutes", href: "/search", icon: <BuildingIcon /> },
      { label: "Exam", href: "/exam", icon: <ExamIcon /> },
    ],
  },
  {
    label: "Exam",
    href: "#",
    icon: <Award className="w-4 h-4" />,
    children: [
      { label: "JEE Main & Advanced", href: "/exam/jee" },
      { label: "NEET", href: "/exam/neet" },
      { label: "MHT-CET", href: "/exam/mht-cet" },
      { label: "KVPY", href: "/exam/kvpy" },
      { label: "Olympiads", href: "/exam/olympiads" },
    ],
  },
  {
    label: "Cities",
    href: "#",
    icon: <MapPin className="w-4 h-4" />,
    children: [
      { label: "Mumbai", href: "/cities/mumbai" },
      { label: "Pune", href: "/cities/pune" },
      { label: "Delhi", href: "/cities/delhi" },
      { label: "Bangalore", href: "/cities/bangalore" },
      { label: "Hyderabad", href: "/cities/hyderabad" },
    ],
  },
  {
    label: "Reviews",
    href: "/reviews",
    icon: <Users className="w-4 h-4" />,
  },
  {
    label: "Contact",
    href: "/contact",
    icon: <Phone className="w-4 h-4" />,
  },
];

// Icon Components
function BuildingIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function ExamIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function StreamIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  );
}

// Header Component
export function Header(): React.ReactElement {
  const { isScrolled } = useScroll(20);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleDropdownEnter = useCallback((label: string) => {
    setActiveDropdown(label);
  }, []);

  const handleDropdownLeave = useCallback(() => {
    setActiveDropdown(null);
  }, []);

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
      }
    },
    [searchQuery]
  );

  return (
    <>
      {/* Main Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
          isScrolled
            ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-gray-900/5 border-b border-gray-100"
            : "bg-white"
        }`}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 group"
              aria-label="My Classes - Home"
            >
              <div className="relative">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-[var(--primary)] to-[var(--accent-purple)] rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/30 transition-shadow duration-300">
                  <GraduationCap className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--accent-orange)] rounded-full animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg lg:text-xl font-bold bg-gradient-to-r from-[var(--gray-900)] to-[var(--gray-700)] bg-clip-text text-transparent">
                  My Classes
                </span>
                <span className="text-[10px] lg:text-xs text-[var(--gray-500)] -mt-1 hidden sm:block">
                  Find Your Perfect Coaching
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav
              className="hidden lg:flex items-center gap-1"
              role="navigation"
              aria-label="Main navigation"
            >
              {mainNavItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.children && handleDropdownEnter(item.label)}
                  onMouseLeave={handleDropdownLeave}
                >
                  {item.children ? (
                    <button
                      type="button"
                      onClick={() =>
                        setActiveDropdown(activeDropdown === item.label ? null : item.label)
                      }
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeDropdown === item.label
                          ? "bg-[var(--primary-50)] text-[var(--primary-700)]"
                          : "text-[var(--gray-600)] hover:text-[var(--gray-900)] hover:bg-gray-50"
                      }`}
                      aria-expanded={activeDropdown === item.label}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          activeDropdown === item.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium text-[var(--gray-600)] hover:text-[var(--gray-900)] hover:bg-gray-50 transition-all duration-200"
                    >
                      {item.label}
                    </Link>
                  )}

                  {/* Dropdown Menu */}
                  {item.children && activeDropdown === item.label && (
                    <div
                      className="absolute top-full left-0 w-56 bg-white rounded-xl shadow-xl shadow-gray-900/10 border border-gray-100 overflow-hidden animate-slide-down"
                      role="menu"
                    >
                      <div className="p-2">
                        {item.children.map((child, idx) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--gray-600)] hover:text-[var(--primary-700)] hover:bg-[var(--primary-50)] transition-all duration-200 group"
                            role="menuitem"
                            style={{ animationDelay: `${idx * 50}ms` }}
                          >
                            {child.icon && (
                              <span className="text-[var(--gray-400)] group-hover:text-[var(--primary)] transition-colors">
                                {child.icon}
                              </span>
                            )}
                            <span className="font-medium">{child.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Search Bar - Desktop */}
            <form
              onSubmit={handleSearchSubmit}
              className={`hidden md:flex items-center relative transition-all duration-300 ${
                isSearchFocused ? "w-72" : "w-56"
              }`}
              role="search"
            >
              <div className="relative w-full">
                <Search
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${
                    isSearchFocused ? "text-[var(--primary)]" : "text-[var(--gray-400)]"
                  }`}
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Search institutes, courses..."
                  className="w-full pl-10 pr-4 py-2.5 bg-[var(--gray-50)] border border-transparent rounded-xl text-sm text-[var(--gray-700)] placeholder:text-[var(--gray-400)] focus:bg-white focus:border-[var(--primary-100)] focus:ring-4 focus:ring-[var(--primary-50)] transition-all duration-200"
                  aria-label="Search institutes and courses"
                />
              </div>
            </form>

            {/* Auth Buttons - Desktop */}
            <div className="hidden lg:flex items-center gap-3">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-[var(--primary)] to-[var(--accent-purple)] rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user?.fullName?.charAt(0)?.toUpperCase() || user?.phone?.charAt(user.phone.length - 1) || 'U'}
                    </div>
                    <span className="text-sm font-medium text-[var(--gray-700)] max-w-[100px] truncate">
                      {user?.fullName || user?.phone || 'User'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-[var(--gray-400)] transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  {showUserDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl shadow-gray-900/10 border border-gray-100 overflow-hidden z-50">
                      <div className="p-2">
                        <div className="px-3 py-2 text-xs text-[var(--gray-500)] border-b border-gray-100 mb-1">
                          {user?.phone}
                        </div>
                        <button
                          onClick={() => { logout(); setShowUserDropdown(false); }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-5 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-700)] text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-200 flex items-center gap-2"
                >
                  Login
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-2">
              {/* Mobile Search Icon */}
              <button
                type="button"
                className="p-2.5 text-[var(--gray-500)] hover:text-[var(--gray-900)] hover:bg-gray-100 rounded-xl transition-colors duration-200"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Hamburger Menu */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2.5 rounded-xl transition-all duration-200 ${
                  isMobileMenuOpen
                    ? "bg-[var(--primary-50)] text-[var(--primary)]"
                    : "text-[var(--gray-500)] hover:text-[var(--gray-900)] hover:bg-gray-100"
                }`}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        id="mobile-menu"
        className={`fixed inset-x-0 top-[64px] bottom-0 bg-white z-40 lg:hidden transform transition-transform duration-300 ease-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="h-full overflow-y-auto">
          {/* Mobile Search */}
          <div className="p-4 border-b border-gray-100">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--gray-400)]" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search institutes, courses..."
                className="w-full pl-12 pr-4 py-3 bg-[var(--gray-50)] border border-gray-200 rounded-xl text-[var(--gray-700)] placeholder:text-[var(--gray-400)] focus:bg-white focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-50)] transition-all duration-200"
                aria-label="Search institutes and courses"
              />
            </form>
          </div>

          {/* Mobile Navigation Links */}
          <nav className="p-4" aria-label="Mobile navigation">
            <ul className="space-y-2">
              {mainNavItems.map((item) => (
                <li key={item.label}>
                  {item.children ? (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveDropdown(activeDropdown === item.label ? null : item.label)
                        }
                        className="flex items-center justify-between w-full px-4 py-3 text-left text-[var(--gray-700)] font-medium rounded-xl hover:bg-gray-50 transition-colors duration-200"
                        aria-expanded={activeDropdown === item.label}
                      >
                        <span className="flex items-center gap-3">
                          {item.icon && (
                            <span className="text-[var(--primary)]">{item.icon}</span>
                          )}
                          {item.label}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-[var(--gray-400)] transition-transform duration-200 ${
                            activeDropdown === item.label ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {activeDropdown === item.label && (
                        <div className="ml-4 pl-4 border-l-2 border-[var(--primary-100)] space-y-1 animate-slide-down">
                          {item.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--gray-600)] hover:text-[var(--primary-700)] hover:bg-[var(--primary-50)] rounded-lg transition-all duration-200"
                            >
                              {child.icon && <span>{child.icon}</span>}
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-[var(--gray-700)] font-medium rounded-xl hover:bg-gray-50 transition-colors duration-200"
                    >
                      {item.icon && <span className="text-[var(--primary)]">{item.icon}</span>}
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile CTA Section */}
          <div className="p-4 mt-auto border-t border-gray-100 space-y-3">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary)] to-[var(--accent-purple)] rounded-full flex items-center justify-center text-white font-bold">
                    {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--gray-900)]">{user?.fullName || 'User'}</p>
                    <p className="text-xs text-[var(--gray-500)]">{user?.phone}</p>
                  </div>
                </div>
                <button
                  onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 text-red-600 font-medium border border-red-200 rounded-xl hover:bg-red-50 transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center w-full px-4 py-3 bg-[var(--primary)] hover:bg-[var(--primary-700)] text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-200"
              >
                Login
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
