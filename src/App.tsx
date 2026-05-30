import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Droplet, 
  Activity, 
  Sparkles, 
  Leaf, 
  Scale, 
  Box, 
  Globe, 
  Sun, 
  Moon, 
  Dna, 
  ArrowRight, 
  ShieldCheck, 
  Heart,
  ChevronRight,
  Menu,
  X,
  Share2,
  Instagram,
  Facebook,
  Users
} from 'lucide-react';
import { translations } from './translations';
import { Language } from './types';
import { db, auth, handleFirestoreError, OperationType } from './lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import OrderModal from './components/OrderModal';
import IngredientList from './components/IngredientList';
import LearnMorePage from './components/LearnMorePage';
import AuthPage from './components/AuthPage';
import AdminDashboard from './components/AdminDashboard';
import { HelpModal, ContactModal } from './components/ExtraModals';
import heroBannerImage from './assets/images/renocell_sachets_hero_1779301800545.png';
import renoLifePromoBanner from './assets/images/renolife2.png';
import renoLifePromoBanner3 from './assets/images/renolife03.jpg';

export default function App() {
  const [lang, setLang] = useState<Language>('sw');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactModalTab, setContactModalTab] = useState<'contact' | 'contract'>('contact');
  const [view, setView] = useState<'home' | 'learnMore' | 'login' | 'signup' | 'admin'>('home');
  const [user, setUser] = useState<any>(null);
  const [shareCopied, setShareCopied] = useState(false);

  // Sync auth state & direct known admin to analytics page automatically on session activation
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser?.email === 'jonsongodwin001@gmail.com') {
        setView('admin');
      }
    });
    return unsubscribe;
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: 'RenoLife+ Biotech',
      text: lang === 'sw' 
        ? 'Gundua bidhaa mpya kabisa ya RenoCell+ inayosaidia kuamsha na kurekebisha seli zako kwa afya bora na kulinda ngozi.' 
        : 'Explore RenoLife+ products supporting natural cellular repair for biological longevity.',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 3000);
  };

  // Synced translation definitions
  const t = translations[lang];

  // Sync Dark Mode state to documentElement
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  // Register site visitor log in Firestore database
  useEffect(() => {
    const recordVisitor = async () => {
      try {
        let visitorId = localStorage.getItem('renolife_visitor_id');
        if (!visitorId) {
          visitorId = 'vis_' + Math.random().toString(36).substring(2, 11) + Math.random().toString(36).substring(2, 11);
          localStorage.setItem('renolife_visitor_id', visitorId);
        }

        const path = `visitors/${visitorId}`;
        try {
          await setDoc(doc(db, 'visitors', visitorId), {
            visitorId,
            visitedAt: serverTimestamp(),
            userAgent: navigator.userAgent?.substring(0, 500) || 'unknown',
            language: lang
          });
        } catch (dbErr) {
          handleFirestoreError(dbErr, OperationType.WRITE, path);
        }
      } catch (err) {
        // Silently capture since offline/local testing shouldn't disrupt the page
        console.warn("Analytics registration skipped or blocked: ", err);
      }
    };

    recordVisitor();
  }, [lang]);

  // Handle smooth scroll offset subtraction for and all anchor links on click
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      // If indeed an anchor selector link referencing a section
      if (href && href.startsWith('#')) {
        e.preventDefault();

        if (href === '#') {
          if (view !== 'home') {
            setView('home');
          }
          setTimeout(() => {
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          }, 50);
          return;
        }

        if (view !== 'home') {
          setView('home');
          // Allow the homepage DOM to mount before calculating scroll offset
          setTimeout(() => {
            const targetElement = document.querySelector(href);
            if (targetElement) {
              const headerElement = document.querySelector('header');
              const headerOffset = headerElement ? headerElement.offsetHeight : 75;
              const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerOffset;

              window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
              });

              // Push active window state
              window.history.pushState(null, '', href);
            }
          }, 150);
        } else {
          const targetElement = document.querySelector(href);
          if (targetElement) {
            const headerElement = document.querySelector('header');
            const headerOffset = headerElement ? headerElement.offsetHeight : 75;
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerOffset;

            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });

            // Push active window state
            window.history.pushState(null, '', href);
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, [view]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'sw' ? 'en' : 'sw');
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-primary transition-colors duration-300 w-full overflow-x-hidden font-sans">
      
      {/* TopNavBar */}
      <header className="sticky top-0 z-40 bg-surface/90 dark:bg-primary/90 backdrop-blur-md border-b border-outline-variant/40 dark:border-primary-container/40 shadow-sm transition-colors duration-300">
        <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-4 flex justify-between items-center">
          
          {/* Brand Logo */}
          <button 
            onClick={() => {
              setView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 cursor-pointer border-none bg-transparent"
          >
            <div className="w-8 h-8 rounded-full bg-primary-container dark:bg-secondary-fixed flex items-center justify-center">
              <Dna className="w-4 h-4 text-secondary-fixed dark:text-primary" />
            </div>
            <span className="font-serif text-xl md:text-2xl font-bold tracking-tight text-primary dark:text-primary-fixed">
              Renolife<span className="text-secondary dark:text-secondary-fixed-dim">+</span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a 
              href="#benefits" 
              onClick={() => setView('home')}
              className="relative text-xs font-semibold uppercase tracking-widest text-on-surface-variant dark:text-white/80 hover:text-secondary dark:hover:text-secondary-fixed transition-all duration-300 pb-1 group"
            >
              {t.navBenefits}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-secondary dark:bg-secondary-fixed transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a 
              href="#science" 
              onClick={() => setView('home')}
              className="relative text-xs font-semibold uppercase tracking-widest text-on-surface-variant dark:text-white/80 hover:text-secondary dark:hover:text-secondary-fixed transition-all duration-300 pb-1 group"
            >
              {t.navScience}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-secondary dark:bg-secondary-fixed transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a 
              href="#ingredients" 
              onClick={() => setView('home')}
              className="relative text-xs font-semibold uppercase tracking-widest text-on-surface-variant dark:text-white/80 hover:text-secondary dark:hover:text-secondary-fixed transition-all duration-300 pb-1 group"
            >
              {t.ingredientTitle}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-secondary dark:bg-secondary-fixed transition-all duration-300 group-hover:w-full"></span>
            </a>
            {user ? (
              <button
                onClick={() => setView(user.email === 'jonsongodwin001@gmail.com' ? 'admin' : 'home')}
                className="text-xs font-bold uppercase tracking-widest text-secondary hover:text-secondary/80 transition-colors cursor-pointer border-none bg-transparent ml-2"
              >
                {user.email === 'jonsongodwin001@gmail.com' 
                  ? (lang === 'sw' ? 'Msimamizi' : 'Admin Panel')
                  : (lang === 'sw' ? 'Dashibodi' : 'Dashboard')}
              </button>
            ) : (
              <>
                <button
                  onClick={() => setView('login')}
                  className="text-xs font-bold uppercase tracking-widest text-on-surface-variant dark:text-white/80 hover:text-secondary dark:hover:text-secondary-fixed transition-colors cursor-pointer border-none bg-transparent ml-2"
                >
                  {lang === 'sw' ? 'Ingia' : 'Login'}
                </button>
                <button
                  onClick={() => setView('signup')}
                  className="text-xs font-bold uppercase tracking-widest text-secondary hover:text-secondary/80 transition-colors cursor-pointer border-none bg-transparent ml-2"
                >
                  {lang === 'sw' ? 'Jiunge' : 'Sign Up'}
                </button>
              </>
            )}
          </nav>

          {/* Action Hub */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-surface-container dark:bg-tertiary-container/40 text-on-surface-variant dark:text-secondary-fixed hover:bg-surface-container-high transition-all cursor-pointer"
              aria-label="Toggle dark mode"
              id="theme-toggler"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container dark:bg-tertiary-container/45 text-xs font-bold text-on-surface dark:text-white/90 hover:bg-surface-container-high transition-all cursor-pointer"
              aria-label="Toggle language"
              id="language-toggler"
            >
              <Globe className="w-3.5 h-3.5 text-secondary" />
              <span>{lang === 'sw' ? 'SW' : 'EN'}</span>
            </button>

            {/* Buy Now Button */}
            <a
              href="https://wa.me/255768605520"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex bg-primary-container dark:bg-secondary-fixed text-on-primary dark:text-on-secondary-fixed text-xs font-bold uppercase tracking-wider px-5 py-3 rounded hover:bg-secondary dark:hover:bg-secondary/40 transition-colors cursor-pointer shadow decoration-none no-underline items-center justify-center text-center"
              id="buy-now-desktop"
            >
              {t.navBuyNow}
            </a>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden rounded bg-surface-container dark:bg-tertiary-container/40 text-on-surface dark:text-white transition-colors"
              aria-label="Toggle mobile menu"
              id="mobile-menu-toggler"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface-container dark:bg-tertiary border-b border-outline-variant/60 dark:border-primary-container px-6 py-5 flex flex-col gap-4 shadow-xl absolute w-full left-0 z-30 transition-all">
          <div className="flex flex-col gap-3">
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setView(user.email === 'jonsongodwin001@gmail.com' ? 'admin' : 'home');
                }}
                className="w-full bg-primary-container text-on-primary text-xs font-extrabold uppercase tracking-widest py-3 px-4 rounded-xl hover:bg-secondary hover:text-white transition-all shadow-sm cursor-pointer"
              >
                {user.email === 'jonsongodwin001@gmail.com' 
                  ? (lang === 'sw' ? 'Msimamizi / Dashibodi' : 'Admin Panel') 
                  : (lang === 'sw' ? 'Kuhusu Mimi' : 'Dashboard')}
              </button>
            ) : (
              <>
                {/* Sign Up button */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setView('signup');
                  }}
                  className="w-full bg-secondary-container dark:bg-secondary-fixed text-primary dark:text-on-secondary-fixed text-xs font-extrabold uppercase tracking-widest py-3 px-4 rounded-xl hover:bg-secondary hover:text-white transition-all shadow-sm cursor-pointer"
                >
                  {lang === 'sw' ? 'Jisajili (Sign Up)' : 'Sign Up'}
                </button>
                
                {/* Login button */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setView('login');
                  }}
                  className="w-full bg-primary-container text-on-primary text-xs font-extrabold uppercase tracking-widest py-3 px-4 rounded-xl hover:bg-secondary hover:text-white transition-all shadow-sm cursor-pointer"
                >
                  {lang === 'sw' ? 'Ingia (Login)' : 'Login'}
                </button>
              </>
            )}
          </div>

          <div className="border-t border-outline-variant/30 pt-3 flex flex-col gap-2">
            {/* Navigation Anchors for Mobile Scroll */}
            <a
              href="#benefits"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-on-surface-variant dark:text-white hover:text-secondary px-3 py-3 text-left cursor-pointer decoration-none no-underline border-b border-outline-variant/10 min-h-[44px] transition-colors duration-200"
            >
              <span>{t.navBenefits}</span>
              <ChevronRight className="w-4 h-4 text-on-surface-variant/50" />
            </a>

            <a
              href="#science"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-on-surface-variant dark:text-white hover:text-secondary px-3 py-3 text-left cursor-pointer decoration-none no-underline border-b border-outline-variant/10 min-h-[44px] transition-colors duration-200"
            >
              <span>{t.navScience}</span>
              <ChevronRight className="w-4 h-4 text-on-surface-variant/50" />
            </a>

            <a
              href="#ingredients"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-on-surface-variant dark:text-white hover:text-secondary px-3 py-3 text-left cursor-pointer decoration-none no-underline border-b border-outline-variant/10 min-h-[44px] transition-colors duration-200"
            >
              <span>{t.ingredientTitle}</span>
              <ChevronRight className="w-4 h-4 text-on-surface-variant/50" />
            </a>

            {/* Help */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setHelpModalOpen(true);
              }}
              className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-on-surface-variant dark:text-white hover:text-secondary px-3 py-2 text-left cursor-pointer min-h-[44px]"
            >
              <span>{lang === 'sw' ? 'Msaada (Help)' : 'Help'}</span>
              <ChevronRight className="w-4 h-4 text-on-surface-variant/50" />
            </button>

            {/* Contract & Contact */}
            <a
              href="https://wa.me/255768605520"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-on-surface-variant dark:text-white hover:text-secondary px-3 py-2 text-left cursor-pointer decoration-none no-underline"
            >
              <span>{lang === 'sw' ? 'Mawasiliano na Mkataba' : 'Contact & Contract'}</span>
              <ChevronRight className="w-4 h-4 text-on-surface-variant/50" />
            </a>
          </div>
        </div>
      )}

      {view === 'admin' ? (
        <AdminDashboard 
          lang={lang} 
          onLogout={async () => {
            try {
              await signOut(auth);
            } catch (err) {
              console.error(err);
            }
            setView('home');
          }}
        />
      ) : view === 'login' || view === 'signup' ? (
        <AuthPage 
          mode={view} 
          lang={lang} 
          onBack={() => setView('home')} 
          onSwitchMode={(newMode) => setView(newMode)} 
        />
      ) : view === 'learnMore' ? (
        <LearnMorePage 
          lang={lang} 
          onBack={() => setView('home')} 
          onOrderClick={() => setOrderModalOpen(true)} 
        />
      ) : (
        <>
          {/* Hero Section */}
          <section className="relative w-full min-h-[90vh] flex items-center bg-surface-container-lowest dark:bg-primary-container/10 pt-24 pb-16 md:py-28 overflow-hidden">
            
            {/* Ambient background blur details */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-container/10 dark:bg-secondary-container/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-container/10 dark:bg-tertiary-container/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

            {/* Hero Content Container */}
            <div className="relative z-10 w-full px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto flex flex-col justify-center items-center py-12 md:py-16 text-center">
              
              {/* Plant Stem Cells Photo inside a premium square green frame */}
              <motion.div 
                className="relative w-64 h-64 md:w-80 md:h-80 mb-8 border-8 border-emerald-800 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 p-1.5 shadow-2xl flex items-center justify-center overflow-hidden aspect-square rounded-none"
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                {/* Thin elegant inside border overlay */}
                <div className="absolute inset-1 border border-emerald-700/30 dark:border-emerald-500/30 pointer-events-none z-10"></div>
                
                <img 
                  alt="RenoCell Plant Stem Cells Premium Representation" 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" 
                  src={heroBannerImage}
                  referrerPolicy="no-referrer"
                />
                
                {/* Brand badge overlay */}
                <div className="absolute bottom-3 right-3 bg-emerald-900/95 dark:bg-emerald-950 text-white font-mono text-[9px] uppercase tracking-widest px-3 py-1 border border-emerald-500/20 z-20">
                  RENO CELL®
                </div>
              </motion.div>

              {/* Hero Badge */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-6"
              >
                <span className="font-sans text-[11px] font-bold text-secondary dark:text-secondary-fixed uppercase tracking-[0.25em] bg-secondary-container/40 dark:bg-tertiary-container/60 px-4 py-1.5 rounded-full inline-block border border-secondary/10">
                  {t.heroBadge}
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
                className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary dark:text-white leading-tight tracking-tight mb-6 max-w-4xl"
              >
                {t.heroTitle}
              </motion.h1>

              {/* Description */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
                className="font-sans text-sm md:text-base lg:text-lg text-on-surface-variant dark:text-white/70 mb-8 max-w-2xl leading-relaxed mx-auto"
              >
                {t.heroSub}
              </motion.p>

              {/* Action Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.65, ease: "easeOut" }}
                className="flex flex-row gap-3.5 items-center justify-center flex-wrap w-full mb-12"
              >
                <a
                  href="https://wa.me/255768605520"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary hover:bg-opacity-95 text-white dark:bg-secondary-fixed dark:text-on-secondary-fixed font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded hover:bg-secondary dark:hover:bg-opacity-80 transition-all duration-300 shadow-lg text-center cursor-pointer min-w-[155px] md:min-w-[175px] h-12 inline-flex items-center justify-center decoration-none no-underline hover:-translate-y-0.5 animate-pulse-subtle"
                  id="hero-cta-btn"
                >
                  {t.heroCTA}
                </a>
                
                <button
                  onClick={() => setView('learnMore')}
                  className="border border-outline dark:border-white/30 text-on-surface dark:text-white font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded hover:bg-surface-container-high dark:hover:bg-white/10 transition-all duration-300 text-center inline-flex items-center justify-center gap-1.5 group min-w-[155px] md:min-w-[175px] h-12 cursor-pointer bg-transparent hover:-translate-y-0.5"
                >
                  <span>{t.heroSecondary}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>

              {/* Organic certifications row */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-wrap items-center justify-center gap-6 text-on-surface-variant/80 dark:text-white/60"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-secondary" />
                  <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest">GMP Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-secondary" />
                  <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest">100% Organic Origin</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-secondary" />
                  <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest">Certified Plant Cells</span>
                </div>
              </motion.div>

            </div>
          </section>

      {/* Main Benefits Section */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface dark:bg-primary" id="benefits">
        <div className="max-w-[1280px] mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.span 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-xs uppercase font-bold tracking-[0.2em] text-secondary inline-block"
            >
              {lang === 'sw' ? 'MATOKEO YA BAYOLOJIA' : 'BIOLOGICAL RESULTS'}
            </motion.span>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="font-serif text-3xl md:text-5xl text-primary dark:text-white mt-3 mb-4"
            >
              {t.benefitsTitle}
            </motion.h2>
            
            <motion.div 
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-16 h-1 bg-secondary mx-auto rounded mb-6 origin-center"
            ></motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-sm md:text-base text-on-surface-variant dark:text-white/70"
            >
              {t.benefitsSub}
            </motion.p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.benefitsItems.map((item, idx) => {
              // Map custom icon component based on placeholder string name
              const renderIcon = () => {
                if (item.icon === 'zap') return <Zap className="w-6 h-6 text-secondary" />;
                if (item.icon === 'droplet') return <Droplet className="w-6 h-6 text-secondary" />;
                if (item.icon === 'activity') return <Activity className="w-6 h-6 text-secondary" />;
                return <Sparkles className="w-6 h-6 text-secondary" />;
              };

              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 * idx }}
                  className="bg-surface-container-low dark:bg-tertiary-container/30 border border-outline-variant/60 dark:border-primary-container/20 rounded-xl aspect-square p-6 hover:translate-y-[-4px] hover:border-secondary hover:shadow-lg transition-all duration-300 group flex flex-col items-center justify-center max-w-[285px] w-full mx-auto"
                >
                  <div className="w-12 h-12 rounded-lg bg-surface dark:bg-tertiary border border-outline-variant/50 flex items-center justify-center mb-4 mx-auto shadow-sm group-hover:scale-110 transition-transform">
                    {renderIcon()}
                  </div>
                  <h3 className="font-serif text-base md:text-sm lg:text-base font-semibold text-primary dark:text-primary-fixed mb-2 text-center">
                    {item.title}
                  </h3>
                  <p className="text-[11px] leading-relaxed text-on-surface-variant dark:text-surface-variant/90 text-center">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>      {/* First Featured Promo Showcase: Renolife High Quality Selection */}
      <section className="py-12 md:py-16 px-margin-mobile md:px-margin-desktop bg-surface-container-lowest dark:bg-primary-container/5 overflow-hidden border-t border-outline-variant/10">
        <div className="max-w-[480px] mx-auto flex flex-col justify-center items-center text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-3"
          >
            <span className="font-sans text-[11px] font-bold text-primary dark:text-secondary uppercase tracking-[0.25em] bg-primary/5 dark:bg-secondary/10 px-4 py-1.5 border border-primary/10 dark:border-secondary/20 rounded-full">
              {lang === 'sw' ? 'CHAGUO LA ASILI LA AFYA NJEMA' : 'THE NATURAL CHOICE FOR HEALTH'}
            </span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="font-serif text-2xl sm:text-3xl text-primary dark:text-white mt-1 mb-4"
          >
            {lang === 'sw' ? 'Uhai Mpya Kutokana na Mimeo' : 'A Healthier You, Naturally'}
          </motion.h2>

          <motion.div 
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-16 h-1 bg-primary dark:bg-secondary mx-auto rounded mb-8 origin-center"
          ></motion.div>

          {/* Majestic High-Fidelity Square/Rectangle Container with floating motion */}
          <motion.div
            animate={{
              y: [0, -6, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-full"
          >
            <motion.div 
              className="relative w-full border-[8px] sm:border-[10px] border-primary dark:border-secondary bg-white dark:bg-tertiary-container p-1.5 shadow-2xl overflow-hidden rounded-none"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              {/* Elegant thin inside outline */}
              <div className="absolute inset-1 sm:inset-1.5 border border-dashed border-primary/20 dark:border-secondary/20 pointer-events-none z-10"></div>
              
              <img 
                alt="Renolife High Quality Selection" 
                className="w-full h-auto block transform hover:scale-[1.02] transition-transform duration-700 mx-auto" 
                src={renoLifePromoBanner}
                referrerPolicy="no-referrer"
              />
              
              {/* Brand overlay premium elements */}
              <div className="absolute top-3 right-3 bg-primary dark:bg-tertiary text-white font-mono text-[8px] uppercase tracking-widest px-3 py-1 border border-white/10 dark:border-secondary/20 shadow-md z-20">
                RENO LIFE+
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6"
          >
            <p className="font-sans text-xs text-on-surface-variant dark:text-white/70 max-w-lg leading-relaxed mx-auto">
              {lang === 'sw' 
                ? 'Bidhaa bora iliyoundwa kwa ubunifu wa hali ya juu na sayansi ya kisasa ya seli kwa ajili ya afya endelevu.' 
                : 'Premium quality selection meticulously engineered with nature and science for cellular revitalization.'}
            </p>
          </motion.div>

        </div>
      </section>

      {/* Science Detail Section (Why Sublingual & Specifications) */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface-container-low dark:bg-tertiary-container/10 border-y border-outline-variant/20" id="science">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold uppercase text-secondary tracking-widest block">
              {lang === 'sw' ? 'TEKNOLOJIA INAVYOFANYA KAZI' : 'HOW IT WORKS'}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-primary dark:text-white leading-tight">
              {lang === 'sw' 
                ? 'Sayansi Nyuma ya Seli: Ufyonzwaji Chini ya Ulimi' 
                : 'The Cellular Science: Sublingual Bio-Absorption'}
            </h2>
            <div className="w-16 h-1 bg-secondary rounded"></div>
            
            <p className="text-xs md:text-sm text-on-surface-variant dark:text-surface-variant leading-relaxed">
              {lang === 'sw' 
                ? 'Tofauti na tembe au vidonge vya kumeza vinavyoharibiwa na tindikali (acid) za tumboni, unga wa seli mama wa Renolife+ umewekwa kimkakati ili kuyeyushwa CHINI YA ULIMI (Sublingual delivery).' 
                : 'Unlike capsules or tablets that must navigate the harsh acidic digestive tract which breaks down raw ingredients, Renolife+ powder is formulated to dissolve directly under the tongue (Sublingual Delivery check).'}
            </p>

            <ul className="space-y-3.5 pt-2">
              {[
                { title: lang === 'sw' ? 'Hufyonzwa kwa kasi ndani ya dakika' : 'Absorbed in minutes', text: lang === 'sw' ? 'Huingia moja kwa moja kwenye tezi ya mdomoni na capillaries za damu' : 'Bypasses the liver and stomach acids straight to your salivary glands' },
                { title: lang === 'sw' ? '98% Kiwango cha manufaa' : '98% High biological value', text: lang === 'sw' ? 'Inahakikisha kila chembe ya mmea-seli inafika ili kukarabati seli duni' : 'Ensures close to no therapeutic ingredient waste reaches your target organs' }
              ].map((point, pIdx) => (
                <li key={pIdx} className="flex gap-3">
                  <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
                     <Check className="w-3 h-3 font-extrabold" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-primary dark:text-primary-fixed">{point.title}</h4>
                    <p className="text-[11px] text-on-surface-variant/80 dark:text-surface-variant/80">{point.text}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <a
                href="https://wa.me/255768605520"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary hover:bg-secondary dark:bg-secondary-fixed dark:text-on-secondary-fixed text-white hover:text-white font-semibold text-xs uppercase tracking-widest px-6 py-3 rounded transition-colors inline-flex items-center gap-2 cursor-pointer shadow decoration-none no-underline"
                id="science-buy-button"
              >
                <span>{t.navBuyNow}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            {/* Spec Card Grid */}
            <div className="bg-surface dark:bg-tertiary border border-outline-variant/60 dark:border-primary-container/20 rounded-xl p-8 shadow-sm">
              <div className="mb-6">
                <h3 className="font-serif text-xl font-semibold text-primary dark:text-primary-fixed">
                  {t.specTitle}
                </h3>
                <p className="text-xs text-on-surface-variant dark:text-surface-variant">
                  {t.specSub}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {t.specs.map((item, index) => {
                  const getIcon = () => {
                    if (item.icon === 'leaf') return <Leaf className="w-5 h-5 text-secondary" />;
                    if (item.icon === 'scale') return <Scale className="w-5 h-5 text-secondary" />;
                    if (item.icon === 'box') return <Box className="w-5 h-5 text-secondary" />;
                    return <Dna className="w-5 h-5 text-secondary" />;
                  };

                  return (
                    <div 
                      key={index} 
                      className="border border-outline-variant/30 rounded-lg p-5 bg-surface-container-low dark:bg-tertiary-container/10 flex gap-4"
                    >
                      <div className="w-10 h-10 aspect-square rounded bg-surface dark:bg-tertiary flex items-center justify-center border border-outline-variant/40">
                        {getIcon()}
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant/70 dark:text-surface-variant/70">
                          {item.label}
                        </span>
                        <div className="text-2xl font-serif font-extrabold text-primary dark:text-primary-fixed my-0.5">
                          {item.value}
                        </div>
                        <p className="text-[11px] text-on-surface-variant dark:text-surface-variant/90 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Second Featured Promo Showcase: Renolife Cellular Support */}
      <section className="py-12 md:py-16 px-margin-mobile md:px-margin-desktop bg-surface-container-lowest dark:bg-primary-container/5 overflow-hidden border-t border-outline-variant/10">
        <div className="max-w-[480px] mx-auto flex flex-col justify-center items-center text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-3"
          >
            <span className="font-sans text-[11px] font-bold text-primary dark:text-secondary uppercase tracking-[0.25em] bg-primary/5 dark:bg-secondary/10 px-4 py-1.5 border border-primary/10 dark:border-secondary/20 rounded-full">
              {lang === 'sw' ? 'LISHE BORA YA KIMATAIFA' : 'PREMIUM GLOBAL NUTRITION'}
            </span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="font-serif text-2xl sm:text-3xl text-primary dark:text-white mt-1 mb-4"
          >
            {lang === 'sw' ? 'Lishe ya Kiini na Afya Imara' : 'Cellular Rejuvenation & Vitality'}
          </motion.h2>

          <motion.div 
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-16 h-1 bg-primary dark:bg-secondary mx-auto rounded mb-8 origin-center"
          ></motion.div>

          {/* Majestic High-Fidelity Square/Rectangle Container with floating motion */}
          <motion.div
            animate={{
              y: [0, -6, 0],
            }}
            transition={{
              duration: 5.6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3
            }}
            className="w-full"
          >
            <motion.div 
              className="relative w-full border-[8px] sm:border-[10px] border-primary dark:border-secondary bg-white dark:bg-tertiary-container p-1.5 shadow-2xl overflow-hidden rounded-none"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
            >
              {/* Elegant thin inside outline */}
              <div className="absolute inset-1 sm:inset-1.5 border border-dashed border-primary/20 dark:border-secondary/20 pointer-events-none z-10"></div>
              
              <img 
                alt="Renolife Cellular Support Selection" 
                className="w-full h-auto block transform hover:scale-[1.02] transition-transform duration-700 mx-auto" 
                src={renoLifePromoBanner3}
                referrerPolicy="no-referrer"
              />
              
              {/* Brand overlay premium elements */}
              <div className="absolute top-3 right-3 bg-primary dark:bg-tertiary text-white font-mono text-[8px] uppercase tracking-widest px-3 py-1 border border-white/10 dark:border-secondary/20 shadow-md z-20">
                RENO LIFE+
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6"
          >
            <p className="font-sans text-xs text-on-surface-variant dark:text-white/70 max-w-lg leading-relaxed mx-auto">
              {lang === 'sw' 
                ? 'Hatua kubwa kuelekea kuboresha seli na kujenga afya njema kila siku kwa sayansi ya mimea na lishe bora.' 
                : 'Taking significant steps towards cellular nourishment and vibrant daily health powered by plant science and premium nutrition.'}
            </p>
          </motion.div>

        </div>
      </section>

      {/* Ingredients Section */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface dark:bg-primary" id="ingredients">
        <div className="max-w-[1280px] mx-auto">
          <IngredientList lang={lang} t={t} />
        </div>
      </section>



      {/* Call To Action Container */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-primary border-t border-primary-container text-white text-center relative overflow-hidden">
        {/* Abstract design elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(117,149,131,0.15),transparent_60%)] pointer-events-none" />
        
        <div className="max-w-2xl mx-auto relative z-10 space-y-6">
          <Heart className="w-8 h-8 text-secondary-fixed mx-auto animate-pulse" />
          <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-tight">
            {lang === 'sw' ? 'Kariri Maisha Yako Upya!' : 'Reclaim Your Health Today!'}
          </h2>
          <p className="text-sm text-on-primary-container leading-relaxed max-w-lg mx-auto">
            {lang === 'sw' 
              ? 'Jiunge na maelfu ya watu waliofanikiwa kupunguza maumivu na kujenga seli upya. Shuhuda zote ziko hapa tayari kukusaidia.' 
              : 'Join thousands of families finding lasting stamina and rebuilding systems with certified Swiss plant stems.'}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://wa.me/255768605520"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-secondary-container hover:bg-secondary text-on-secondary-container hover:text-white font-bold text-xs uppercase tracking-widest px-8 py-4 rounded transition-all cursor-pointer shadow-lg inline-flex items-center gap-2 decoration-none no-underline w-full sm:w-auto justify-center text-center"
              id="cta-bottom"
            >
              <span>{lang === 'sw' ? 'Agiza Boksi Lako Sasa' : 'Secure Your Box Now'}</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="https://l.renolife.net/Maggyliban"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs uppercase tracking-widest px-8 py-4 rounded transition-all cursor-pointer shadow-lg inline-flex items-center gap-2 decoration-none no-underline w-full sm:w-auto justify-center text-center"
              id="cta-join-system"
            >
              <Users className="w-4 h-4" />
              <span>{lang === 'sw' ? 'Jiunge na Mfumo' : 'Join the System'}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary dark:bg-tertiary text-on-primary dark:text-on-tertiary w-full py-16 px-margin-mobile md:px-margin-desktop border-t border-primary-container dark:border-tertiary-container transition-colors duration-300">
        <div className="max-w-[1280px] mx-auto flex flex-col items-center gap-6">
          
          <div className="flex items-center gap-2 text-secondary-fixed">
            <Dna className="w-6 h-6 text-secondary-fixed" />
            <span className="font-serif text-2xl font-bold tracking-widest">
              Renolife<span className="text-secondary-fixed-dim">+</span>
            </span>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-2">
            <button
              onClick={() => {
                setContactModalTab('contract');
                setContactModalOpen(true);
              }}
              className="text-on-primary-fixed-variant dark:text-tertiary-fixed-dim hover:text-secondary-fixed transition-colors text-xs font-semibold uppercase tracking-widest cursor-pointer border-none bg-transparent"
            >
              {t.footerTerms}
            </button>
            <button
              onClick={() => {
                setContactModalTab('contract');
                setContactModalOpen(true);
              }}
              className="text-on-primary-fixed-variant dark:text-tertiary-fixed-dim hover:text-secondary-fixed transition-colors text-xs font-semibold uppercase tracking-widest cursor-pointer border-none bg-transparent"
            >
              {t.footerPrivacy}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                if (view !== 'home') {
                  setView('home');
                  setTimeout(() => {
                    document.getElementById('science')?.scrollIntoView({ behavior: 'smooth' });
                  }, 150);
                } else {
                  document.getElementById('science')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-on-primary-fixed-variant dark:text-tertiary-fixed-dim hover:text-secondary-fixed transition-colors text-xs font-semibold uppercase tracking-widest cursor-pointer border-none bg-transparent"
            >
              {t.footerScience}
            </button>
            <button
              onClick={() => {
                setContactModalTab('contact');
                setContactModalOpen(true);
              }}
              className="text-on-primary-fixed-variant dark:text-tertiary-fixed-dim hover:text-secondary-fixed transition-colors text-xs font-semibold uppercase tracking-widest cursor-pointer border-none bg-transparent"
            >
              {t.footerWholesale}
            </button>
          </nav>

          {/* Share & Social Media Row */}
          <div className="flex flex-col sm:flex-row items-center gap-5 mt-2 mb-4 w-full justify-center">
            {/* Elegant Share Button */}
            <button
              onClick={handleShare}
              className="relative group overflow-hidden bg-white/10 hover:bg-white/15 dark:bg-primary-container/30 dark:hover:bg-primary-container/45 border border-white/10 text-white px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest inline-flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow"
              title={lang === 'sw' ? 'Shiriki Tovuti hii' : 'Share this website'}
            >
              {shareCopied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400 animate-bounce" />
                  <span className="text-emerald-400">
                    {lang === 'sw' ? 'Kiungo Kimesafirishwa!' : 'Link Copied!'}
                  </span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-secondary group-hover:rotate-12 transition-transform" />
                  <span>
                    {lang === 'sw' ? 'Shiriki Tovuti hii' : 'Share Website'}
                  </span>
                </>
              )}
            </button>

            {/* Aesthetic Instagram & Facebook Logos */}
            <div className="flex items-center gap-3">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-secondary dark:bg-primary-container/30 dark:hover:bg-secondary text-white flex items-center justify-center transition-all hover:scale-110 shadow hover:-translate-y-0.5 cursor-pointer"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-secondary dark:bg-primary-container/30 dark:hover:bg-secondary text-white flex items-center justify-center transition-all hover:scale-110 shadow hover:-translate-y-0.5 cursor-pointer"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-on-primary-fixed-variant opacity-70">
              {t.footerCopyright}
            </p>
            <p className="text-[10px] text-on-primary-fixed-variant/50 mt-2 max-w-md mx-auto">
              {lang === 'sw' 
                ? 'Kanusho: Renolife+ ni kirutubisho chenye viambata vya seli za mimea asilia. Haichukui nafasi ya ushauri wa kitaalamu wa daktari.' 
                : 'Disclaimer: Renolife+ is a therapeutic plant stem cell health supplement. It does not replace professional medical diagnose or treatment.'}
            </p>
          </div>
        </div>
      </footer>
        </>
      )}

      {/* Render checkout form modal */}
      <OrderModal 
        isOpen={orderModalOpen} 
        onClose={() => setOrderModalOpen(false)} 
        lang={lang} 
        t={t} 
      />

      {/* Render custom extra action modals */}
      <HelpModal 
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
        lang={lang}
      />

      <ContactModal 
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        lang={lang}
        initialTab={contactModalTab}
      />

    </div>
  );
}

// Helper simple icon for lists in custom blocks
function Check(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      strokeWidth={3}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
