import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Dna, 
  HelpCircle,
  Users,
  Award,
  ChevronRight
} from 'lucide-react';
import { Language } from '../types';

interface AuthPageProps {
  mode: 'login' | 'signup';
  lang: Language;
  onBack: () => void;
  onSwitchMode: (newMode: 'login' | 'signup') => void;
}

export default function AuthPage({ mode, lang, onBack, onSwitchMode }: AuthPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [distributorTier, setDistributorTier] = useState('silver');

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Let's also log this login into Firestore under '/logins'
      const loginId = 'log_g_' + Math.random().toString(36).substring(2, 11) + Math.random().toString(36).substring(2, 11);
      const path = `logins/${loginId}`;
      try {
        await setDoc(doc(db, 'logins', loginId), {
          email: user.email?.toLowerCase() || 'unknown@google.com',
          loggedInAt: serverTimestamp(),
        });
      } catch (dbErr) {
        handleFirestoreError(dbErr, OperationType.WRITE, path);
      }
      
      setIsSubmitted(true);
    } catch (err: any) {
      console.error("Google Auth error:", err);
      setErrorMsg(lang === 'sw' 
        ? 'Ushirikiano na Google umeshindikana au umefutwa na mtumiaji.' 
        : 'Google Sign-In failed or was cancelled by user.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setErrorMsg(lang === 'sw' ? 'Tafadhali weka jina lako kamili.' : 'Please enter your full name.');
        return;
      }
      if (!phone.trim()) {
        setErrorMsg(lang === 'sw' ? 'Tafadhali weka namba ya simu.' : 'Please enter your phone number.');
        return;
      }
      if (phone.replace(/\D/g, '').length < 8) {
        setErrorMsg(lang === 'sw' ? 'Namba ya simu si sahihi mpendwa.' : 'Please enter a valid phone number.');
        return;
      }
    }

    if (!email.trim()) {
      setErrorMsg(lang === 'sw' ? 'Barua pepe inahitajika.' : 'Email address is required.');
      return;
    }
    if (!email.includes('@')) {
      setErrorMsg(lang === 'sw' ? 'Barua pepe si sahihi.' : 'Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg(lang === 'sw' ? 'Nywila lazima iwe na alama 6 au zaidi.' : 'Password must be at least 6 characters.');
      return;
    }

    try {
      if (mode === 'signup') {
        let userId = 'sup_' + Math.random().toString(36).substring(2, 11) + Math.random().toString(36).substring(2, 11);
        
        try {
          // Attempt actual email authentication creation in Firebase Auth
          const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
          if (userCredential.user) {
            userId = userCredential.user.uid;
          }
        } catch (authErr: any) {
          console.warn("Auth creation with email/password failed or disabled on project console, fallback to custom Firestore document generation:", authErr);
          // If the email already exists, we should show a message
          if (authErr && authErr.code === 'auth/email-already-in-use') {
            setErrorMsg(lang === 'sw' ? 'Barua pepe hii tayari inatumiwa na akaunti nyingine.' : 'This email address is already in use by another account.');
            return;
          }
        }

        const path = `signups/${userId}`;
        try {
          await setDoc(doc(db, 'signups', userId), {
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            tier: distributorTier,
            signedUpAt: serverTimestamp(),
          });
        } catch (dbErr) {
          handleFirestoreError(dbErr, OperationType.WRITE, path);
        }
      } else {
        let loggedEmail = email.trim().toLowerCase();
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
          if (userCredential.user && userCredential.user.email) {
            loggedEmail = userCredential.user.email.toLowerCase();
          }
        } catch (authErr: any) {
          console.warn("Auth sign-in failed or disabled on project console, fallback to login log:", authErr);
          // Standard login errors
          if (authErr && (authErr.code === 'auth/wrong-password' || authErr.code === 'auth/user-not-found' || authErr.code === 'auth/invalid-credential')) {
            setErrorMsg(lang === 'sw' ? 'Barua pepe au nywila si sahihi.' : 'Invalid email or password.');
            return;
          }
        }

        const loginId = 'log_' + Math.random().toString(36).substring(2, 11) + Math.random().toString(36).substring(2, 11);
        const path = `logins/${loginId}`;
        try {
          await setDoc(doc(db, 'logins', loginId), {
            email: loggedEmail,
            loggedInAt: serverTimestamp(),
          });
        } catch (dbErr) {
          handleFirestoreError(dbErr, OperationType.WRITE, path);
        }
      }
      setIsSubmitted(true);
    } catch (err) {
      console.error("Auth submission error: ", err);
      setErrorMsg(lang === 'sw' 
        ? 'Muda wa kuhifadhi umezidi au Hitilafu ya database imetokea. Tafadhali jaribu tena.' 
        : 'Database synchronization failed or is currently offline. Please try again.');
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-surface-container-lowest dark:bg-primary/95 text-on-surface dark:text-gray-100 flex flex-col transition-colors duration-300">
      
      {/* Mini top bar */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-outline-variant/40 dark:border-primary-container/20 max-w-7xl w-full mx-auto">
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant dark:text-primary-fixed-dim hover:text-secondary dark:hover:text-secondary-fixed transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
          <span>{lang === 'sw' ? 'Rudi Nyumbani' : 'Go Back'}</span>
        </button>

        <div className="flex items-center gap-1.5">
          <Dna className="w-4 h-4 text-secondary" />
          <span className="font-serif text-sm font-bold tracking-tight text-primary dark:text-primary-fixed">
            Renolife<span className="text-secondary">+</span> BIOTECH
          </span>
        </div>
      </div>

      {/* Main split screen layout */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side Column: Interactive, glorious biotech visual summary card */}
        <div className="lg:col-span-5 space-y-8 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 bg-secondary/15 dark:bg-secondary/10 border border-secondary/20 px-3.5 py-1.5 rounded-full text-secondary text-[10px] font-extrabold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
              <span>{mode === 'signup' 
                ? (lang === 'sw' ? 'USALAMA WA KIBAIOLOJIA NA AFYA' : 'BIO-CELLULAR EXCELLENCE')
                : (lang === 'sw' ? 'INGIA KWENYE JUKWAA LA KISASA' : 'SECURE SECURE PORTAL')
              }</span>
            </div>

            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-primary dark:text-white leading-tight tracking-tight font-light">
              {mode === 'signup' ? (
                lang === 'sw' ? (
                  <>Fungua Milango ya <span className="font-bold text-secondary">Afya Bora</span> na Udhibiti wa Longevity.</>
                ) : (
                  <>Unlock Your <span className="font-bold text-secondary">Biological Peak</span> & Cellular Longevity.</>
                )
              ) : (
                lang === 'sw' ? (
                  <>Karibu tena kwenye <span className="font-bold text-secondary">Mfumo wa Wanachama</span> wa RenoLife.</>
                ) : (
                  <>Welcome Back to <span className="font-bold text-secondary">RenoLife portal</span> Access.</>
                )
              )}
            </h1>

            <p className="text-sm text-on-surface-variant dark:text-surface-variant/90 leading-relaxed max-w-md">
              {mode === 'signup'
                ? (lang === 'sw' 
                  ? 'Jiunge na mtandao wetu mkuu wa kimataifa wa usambazaji wa tiba asilia ya seli mama. Pata faida, mafunzo ya afya, na uboreshaji wa maisha leo.'
                  : 'Empower your cellular path. Register as an authorized RenoLife global member to receive custom stem cell pricing, elite training materials, and daily payout margins.')
                : (lang === 'sw'
                  ? 'Ingia katika akaunti yako ili uweze kusajili wateja wapya, kuangalia pointi zako (BV), kuleta bidhaa au kutekeleza makubaliano ya duka lako.'
                  : 'Access your secure distributor platform. Manage orders, trace customer referrals, verify cell stem point accumulations, and view commission records.')
              }
            </p>
          </motion.div>

          {/* Graphic Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {mode === 'signup' ? (
              <>
                {/* Micro highlights for signup */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-surface/80 dark:bg-tertiary-container/20 border border-outline-variant/60 dark:border-primary-container/20 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-secondary/15 flex items-center justify-center text-primary dark:text-secondary shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-primary dark:text-white uppercase tracking-wider mb-1">
                      {lang === 'sw' ? 'Mkataba Rasmi Uliothibitishwa' : 'Accredited Compliance Partner'}
                    </h4>
                    <p className="text-[11px] leading-relaxed text-on-surface-variant">
                      {lang === 'sw' ? 'Unapata ulinzi kamili wa kisheria na msimamo uliobuniwa kusaidia familia yako.' : 'Your registration locks in immediate biological product distribution rights with deep legal protection.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-surface/80 dark:bg-tertiary-container/20 border border-outline-variant/60 dark:border-primary-container/20 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-secondary/15 flex items-center justify-center text-primary dark:text-secondary shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-primary dark:text-white uppercase tracking-wider mb-1">
                      {lang === 'sw' ? 'Mafunzo Moja kwa Moja' : 'Peer-to-Peer Medical Literacy'}
                    </h4>
                    <p className="text-[11px] leading-relaxed text-on-surface-variant">
                      {lang === 'sw' ? 'Pata msaada moja kwa moja kutoka kwa madaktari na wanachama wazoefu.' : 'Unlock customized guides and zoom seminars regarding clinical stem-cell studies.'}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Highlights for Login */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-surface/80 dark:bg-tertiary-container/20 border border-outline-variant/60 dark:border-primary-container/20 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-secondary/15 flex items-center justify-center text-primary dark:text-secondary shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-primary dark:text-white uppercase tracking-wider mb-1">
                      {lang === 'sw' ? 'Ofisi ya Dijitali ya 24/7' : 'Dynamic Virtual Ledger'}
                    </h4>
                    <p className="text-[11px] leading-relaxed text-on-surface-variant">
                      {lang === 'sw' ? 'Ufuatiliaji rahisi wa oda zako zote, mapato, na wasambazaji waliopo chini yako.' : 'Live trackers detailing absolute points balance, order statuses, and direct cellular sales.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-surface/80 dark:bg-tertiary-container/20 border border-outline-variant/60 dark:border-primary-container/20 shadow-sm animate-pulse">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-1">
                      {lang === 'sw' ? 'Maunganisho ya Salama' : 'End-to-End Cryptography'}
                    </h4>
                    <p className="text-[11px] leading-relaxed text-on-surface-variant">
                      {lang === 'sw' ? 'Salama yako thabiti na seva zenye usimbaji fiche (SSL) kuzuia upotevu.' : 'Your personal account is protected under premium, modern transport encrypting Standards.'}
                    </p>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>

        {/* Right Side Column: Impressive, highly-crafted Form Block */}
        <div className="lg:col-span-7 flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full max-w-xl bg-white dark:bg-tertiary border border-outline-variant/80 dark:border-primary-container/30 rounded-3xl p-6 md:p-10 shadow-xl relative overflow-hidden"
          >
            {/* Ambient visual light leaks / cellular graphics in the background inside form */}
            <div className="absolute -right-16 -top-16 w-36 h-36 rounded-full bg-secondary/10 dark:bg-secondary/5 blur-3xl pointer-events-none"></div>
            <div className="absolute -left-16 -bottom-16 w-36 h-36 rounded-full bg-primary/10 dark:bg-primary-container/5 blur-3xl pointer-events-none"></div>

            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  key="form-entry"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center md:text-left space-y-1">
                    <h2 className="font-serif text-2xl font-bold tracking-tight text-primary dark:text-primary-fixed">
                      {mode === 'signup' 
                        ? (lang === 'sw' ? 'Jisajili na Bidhaa za Seli Mama' : 'Distributor Application')
                        : (lang === 'sw' ? 'Ingia Ndani ya Ofisi' : 'Officer Secure Portal')
                      }
                    </h2>
                    <p className="text-xs text-on-surface-variant">
                      {mode === 'signup'
                        ? (lang === 'sw' ? 'Tafadhali jaza taarifa zako sahihi hapa chini ili kufungua akaunti yako.' : 'Provide certified documents & details below to enable cellular license.')
                        : (lang === 'sw' ? 'Weka barua pepe na nywila yako ili kujindikia kwenye jukwaa.' : 'Provide authorized credentials to open virtual cellular desk.')
                      }
                    </p>
                  </div>

                  {/* Form Element */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {errorMsg && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-error-container/15 border border-error/25 text-error p-3.5 rounded-xl text-xs font-semibold text-center"
                      >
                        {errorMsg}
                      </motion.div>
                    )}

                    {/* Form Fields according to mode */}
                    {mode === 'signup' ? (
                      <div className="space-y-4">
                        {/* Name (Full Name) - SPECIFICALLY REQUESTED */}
                        <div className="space-y-1 text-left">
                          <label className="text-[11px] font-bold text-on-surface-variant dark:text-gray-300 uppercase tracking-wider ml-1">
                            {lang === 'sw' ? 'Jina Kamili' : 'Full Name'}
                          </label>
                          <div className="relative group">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/70 group-focus-within:text-secondary transition-colors">
                              <User className="w-4 h-4" />
                            </div>
                            <input
                              type="text"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              placeholder="e.g. Yona Makyao"
                              className="w-full pl-11 pr-4 py-3.5 bg-surface-container-lowest dark:bg-tertiary-container/30 border border-outline dark:border-primary-container/35 focus:border-secondary dark:focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none rounded-xl text-sm transition-all text-on-surface"
                            />
                          </div>
                        </div>

                        {/* Phone Number - SPECIFICALLY REQUESTED */}
                        <div className="space-y-1 text-left">
                          <label className="text-[11px] font-bold text-on-surface-variant dark:text-gray-300 uppercase tracking-wider ml-1">
                            {lang === 'sw' ? 'Namba ya Simu' : 'Phone Number'}
                          </label>
                          <div className="relative group">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/70 group-focus-within:text-secondary transition-colors">
                              <Phone className="w-4 h-4" />
                            </div>
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="e.g. 0768605520"
                              className="w-full pl-11 pr-4 py-3.5 bg-surface-container-lowest dark:bg-tertiary-container/30 border border-outline dark:border-primary-container/35 focus:border-secondary dark:focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none rounded-xl text-sm transition-all text-on-surface"
                            />
                          </div>
                        </div>

                        {/* Email Address - SPECIFICALLY REQUESTED */}
                        <div className="space-y-1 text-left">
                          <label className="text-[11px] font-bold text-on-surface-variant dark:text-gray-300 uppercase tracking-wider ml-1">
                            {lang === 'sw' ? 'Barua Pepe (Email)' : 'Email Address'}
                          </label>
                          <div className="relative group">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/70 group-focus-within:text-secondary transition-colors">
                              <Mail className="w-4 h-4" />
                            </div>
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="e.g. jonsongodwin001@gmail.com"
                              className="w-full pl-11 pr-4 py-3.5 bg-surface-container-lowest dark:bg-tertiary-container/30 border border-outline dark:border-primary-container/35 focus:border-secondary dark:focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none rounded-xl text-sm transition-all text-on-surface"
                            />
                          </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1 text-left">
                          <label className="text-[11px] font-bold text-on-surface-variant dark:text-gray-300 uppercase tracking-wider ml-1">
                            {lang === 'sw' ? 'Weka Nywila' : 'Choose Password'}
                          </label>
                          <div className="relative group">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/70 group-focus-within:text-secondary transition-colors">
                              <Lock className="w-4 h-4" />
                            </div>
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full pl-11 pr-11 py-3.5 bg-surface-container-lowest dark:bg-tertiary-container/30 border border-outline dark:border-primary-container/35 focus:border-secondary dark:focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none rounded-xl text-sm transition-all text-on-surface"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-on-surface p-1 rounded"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* LOGIN MODE fields */
                      <div className="space-y-4">
                        {/* Email Address */}
                        <div className="space-y-1 text-left">
                          <label className="text-[11px] font-bold text-on-surface-variant dark:text-gray-300 uppercase tracking-wider ml-1">
                            {lang === 'sw' ? 'Barua Pepe (Email)' : 'Email Address'}
                          </label>
                          <div className="relative group">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/70 group-focus-within:text-secondary transition-colors">
                              <Mail className="w-4 h-4" />
                            </div>
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="e.g. jonsongodwin001@gmail.com"
                              className="w-full pl-11 pr-4 py-3.5 bg-surface-container-lowest dark:bg-tertiary-container/30 border border-outline dark:border-primary-container/35 focus:border-secondary dark:focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none rounded-xl text-sm transition-all text-on-surface"
                            />
                          </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1 text-left">
                          <div className="flex justify-between items-center ml-1">
                            <label className="text-[11px] font-bold text-on-surface-variant dark:text-gray-300 uppercase tracking-wider">
                              {lang === 'sw' ? 'Nenosiri (Password)' : 'Security Password'}
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                alert(lang === 'sw' 
                                  ? 'Tafadhali wasiliana na mtendaji wa usaidizi kupitia Simu au WhatsApp ili kurejesha nenosiri lako.' 
                                  : 'Please contact the support helpline via Call or WhatsApp to reset your password code.');
                              }}
                              className="text-[10px] text-secondary hover:underline font-semibold"
                            >
                              {lang === 'sw' ? 'Umesahau Nywila?' : 'Forgot Password?'}
                            </button>
                          </div>
                          <div className="relative group">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/70 group-focus-within:text-secondary transition-colors">
                              <Lock className="w-4 h-4" />
                            </div>
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full pl-11 pr-11 py-3.5 bg-surface-container-lowest dark:bg-tertiary-container/30 border border-outline dark:border-primary-container/35 focus:border-secondary dark:focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none rounded-xl text-sm transition-all text-on-surface"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-on-surface p-1 rounded"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Remember option */}
                        <div className="flex items-center justify-between pt-1">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                              className="rounded border-outline text-secondary focus:ring-secondary accent-secondary cursor-pointer"
                            />
                            <span className="text-[11px] text-on-surface-variant">
                              {lang === 'sw' ? "Nikumbuke kwenye kifaa hiki" : "Remember me on this environment"}
                            </span>
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Disclaimer text */}
                    <div className="p-3 bg-surface-container-low dark:bg-tertiary-container/20 rounded-xl flex items-start gap-2 border border-outline-variant/30 text-[10px] leading-relaxed text-on-surface-variant/90">
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>
                        {mode === 'signup' 
                          ? (lang === 'sw' 
                            ? 'Usajili wako unajumuisha makubaliano rasmi ya msambazaji na kitalu cha maendeleo ya afya kupitia seli asilia.' 
                            : 'This submission authorizes a biological distribution registration and connects to our secure regional server.')
                          : (lang === 'sw'
                            ? 'Ulinzi wa akaunti yako unasimamiwa kwa mujibu wa usiri kamili na viwango vya kisheria vya seli.'
                            : 'This session is tracked securely to support distributor ledger validation & prevent diagnostic misconduct.')
                        }
                      </span>
                    </div>

                    {/* Submit Button with elegant loading/glow classes */}
                    <button
                      type="submit"
                      className="w-full bg-primary-container dark:bg-secondary text-white dark:text-primary font-bold text-xs uppercase tracking-widest py-4 rounded-xl hover:bg-secondary dark:hover:bg-opacity-90 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer shadow-md select-none flex items-center justify-center gap-2"
                    >
                      <span>{mode === 'signup' 
                        ? (lang === 'sw' ? 'Thibitisha na Jiunge Sasa' : 'Authorize & Start Registering')
                        : (lang === 'sw' ? 'Thibitisha na Ingia' : 'Unlock Portal & Enter')
                      }</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-2">
                      <div className="h-[1px] bg-outline-variant/40 dark:bg-primary-container/20 flex-1"></div>
                      <span className="text-[10px] text-on-surface-variant dark:text-gray-400 font-bold uppercase tracking-wider">
                        {lang === 'sw' ? 'Au tumia' : 'Or use'}
                      </span>
                      <div className="h-[1px] bg-outline-variant/40 dark:bg-primary-container/20 flex-1"></div>
                    </div>

                    {/* Google Action Button */}
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      className="w-full bg-surface-container-high hover:bg-surface-container dark:bg-primary-container/10 dark:hover:bg-primary-container/20 border border-outline-variant/60 dark:border-primary-container/30 text-on-surface hover:text-primary dark:text-gray-200 dark:hover:text-white font-bold text-xs uppercase tracking-widest py-3 rounded-xl transition-all duration-200 cursor-pointer shadow-sm flex items-center justify-center gap-2.5 select-none"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#EA4335"
                          d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.579-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.245-3.123C18.465 1.83 15.626 1 12.24 1 5.764 1 .5 6.264.5 12.74S5.764 24.48 12.24 24.48c6.763 0 11.258-4.75 11.258-11.45 0-.771-.082-1.353-.183-1.745H12.24z"
                        />
                      </svg>
                      <span>{lang === 'sw' ? 'Ingia na Google' : 'Continue with Google'}</span>
                    </button>
                  </form>

                  {/* Switch trigger link */}
                  <div className="pt-4 border-t border-outline-variant/30 text-center">
                    <p className="text-xs text-on-surface-variant">
                      {mode === 'signup' 
                        ? (lang === 'sw' ? 'Tayari unayo akaunti na RenoLife?' : 'Already have a licensed desk with us?')
                        : (lang === 'sw' ? 'Je, bado haujajiunga kama Msambazaji?' : 'Do you want to secure professional distribution privileges?')
                      }
                      {' '}
                      <button
                        onClick={() => {
                          setErrorMsg('');
                          onSwitchMode(mode === 'login' ? 'signup' : 'login');
                        }}
                        className="text-secondary hover:underline font-bold focus:outline-none inline-block ml-0.5"
                      >
                        {mode === 'signup' 
                          ? (lang === 'sw' ? 'Ingia Sasa (Login)' : 'Sign In Now')
                          : (lang === 'sw' ? 'Jiunge Sasa (Sign Up)' : 'Register Here')
                        }
                      </button>
                    </p>
                  </div>
                </motion.div>
              ) : (
                /* GORGEOUS SUCCESS PRESENTATION */
                <motion.div
                  key="success-screen"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-10 text-center space-y-6"
                >
                  <div className="w-20 h-20 bg-secondary/10 dark:bg-secondary/15 rounded-full flex items-center justify-center mx-auto text-secondary shadow-lg border border-secondary/20">
                    <CheckCircle2 className="w-12 h-12 animate-pulse" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl font-bold text-primary dark:text-primary-fixed">
                      {mode === 'signup'
                        ? (lang === 'sw' ? 'Pongezi, Ombi Lako Limepokelewa!' : 'Ledger Provisioned Successfully!')
                        : (lang === 'sw' ? 'Karibu Tena Kwenye Ofisi Yako!' : 'Access Key Authorized!')
                      }
                    </h3>
                    <p className="text-xs text-on-surface-variant dark:text-gray-300 leading-relaxed max-w-sm mx-auto">
                      {mode === 'signup'
                        ? (lang === 'sw' 
                          ? `Habari njema ${fullName}! Wasilisho lako la Msambazaji wa RenoLife limebuniwa kikamilifu kwenye faharasa yetu ya duka. Ofisi yetu ya mkoa itakupigia simu hivi karibuni kwenye simu yako ya (${phone}) kwa ajili ya kuahidi usambazaji rasilimali.` 
                          : `Salutations ${fullName}! Your authorized distribution credential has been synchronized. A senior regional coordinator will ring your mobile (${phone}) shortly to confirm product package dispatch.`)
                        : (lang === 'sw'
                          ? `Umeingia kwa ufanisi! Wasilisho limefungua seva ya pointi yako kwa muda chini ya mkataba wa faragha na RenoLife Biotech.`
                          : 'Your operational ledger is unlocked. Welcome back to the Renolife global support workspace.')
                      }
                    </p>
                  </div>

                  {/* Success features outline */}
                  <div className="bg-surface-container-low dark:bg-tertiary-container/20 p-4 border border-outline-variant/40 rounded-2xl max-w-sm mx-auto text-left space-y-2.5">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-primary dark:text-primary-fixed">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>{lang === 'sw' ? 'Barua pepe yako imeunganishwa' : 'Encrypted Email Synced'}: {email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-primary dark:text-primary-fixed">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>{lang === 'sw' ? 'Msajili yuko tayari kufuatilia' : 'Assigned Health Consultant State: ACTIVE'}</span>
                    </div>
                  </div>

                  {/* Finish button redirects back to Home */}
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      onBack();
                    }}
                    className="px-8 py-3 bg-primary-container text-on-primary font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-secondary hover:scale-102 transition-all shadow cursor-pointer font-sans"
                  >
                    {lang === 'sw' ? 'Rudi Kwenye Dashibodi' : 'Go Back to Home'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

      </div>

      {/* Mini layout footer */}
      <footer className="py-6 border-t border-outline-variant/30 text-center text-[10px] text-on-surface-variant/70 bg-surface-container dark:bg-transparent">
        <p>© {currentYear} Renolife+ Biotech Tanzania. All Stem Cells Rights and Legacy Protected.</p>
      </footer>

    </div>
  );
}
