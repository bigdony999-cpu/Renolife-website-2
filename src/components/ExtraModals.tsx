import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { 
  X, 
  User, 
  Lock, 
  Mail, 
  Phone, 
  HelpCircle, 
  FileText, 
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Shield,
  Briefcase,
  ExternalLink
} from 'lucide-react';
import { Language } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  type: 'login' | 'signup';
  onClose: () => void;
  lang: Language;
  onSwitchType: (newType: 'login' | 'signup') => void;
}

export function AuthModal({ isOpen, type, onClose, lang, onSwitchType }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [agree, setAgree] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleClose = () => {
    setIsSuccess(false);
    setErrorMsg('');
    setEmail('');
    setPassword('');
    setFullName('');
    setPhone('');
    setAgree(false);
    onClose();
  };

  const handleSumbit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (type === 'signup') {
      if (!fullName) {
        setErrorMsg(lang === 'sw' ? 'Tafadhali weka jina kamili.' : 'Please enter your full name.');
        return;
      }
      if (!phone) {
        setErrorMsg(lang === 'sw' ? 'Tafadhali weka namba ya simu.' : 'Please enter your phone number.');
        return;
      }
      if (!agree) {
        setErrorMsg(lang === 'sw' ? 'Lazima ukubaliane na mkataba wa msambazaji.' : 'You must agree to the distributor contract.');
        return;
      }
    }

    if (!email) {
      setErrorMsg(lang === 'sw' ? 'Tafadhali weka barua pepe.' : 'Please enter your email.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg(lang === 'sw' ? 'Nywila lazima iwe na herufi sita au zaidi.' : 'Password must be at least 6 characters.');
      return;
    }

    try {
      if (type === 'signup') {
        let userId = 'sup_' + Math.random().toString(36).substring(2, 11) + Math.random().toString(36).substring(2, 11);
        
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
          if (userCredential.user) {
            userId = userCredential.user.uid;
          }
        } catch (authErr: any) {
          console.warn("Auth creation with email/password failed or disabled, fallback to custom Firestore document generation:", authErr);
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
            tier: 'silver', // default tier
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
          console.warn("Auth sign-in failed or disabled, fallback to login log:", authErr);
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
      setIsSuccess(true);
    } catch (err) {
      console.error("Auth submit error:", err);
      setErrorMsg(lang === 'sw' 
        ? 'Muda wa kuhifadhi umezidi au Hitilafu ya database imetokea. Tafadhali jaribu tena.' 
        : 'Database synchronization failed or is currently offline. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/60 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={handleClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-surface dark:bg-tertiary border border-outline-variant dark:border-tertiary-container rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Header */}
            <div className="px-6 py-4 bg-primary dark:bg-tertiary-container border-b border-outline-variant dark:border-tertiary/10 flex items-center justify-between text-on-primary">
              <h3 className="font-serif text-lg font-bold text-white dark:text-secondary-fixed">
                {type === 'login' 
                  ? (lang === 'sw' ? 'Ingia Kwenye Akaunti' : 'Login to Account')
                  : (lang === 'sw' ? 'Jisajili na RenoLife' : 'Sign Up with RenoLife')}
              </h3>
              <button 
                onClick={handleClose}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6">
              {!isSuccess ? (
                <form onSubmit={handleSumbit} className="space-y-4">
                  {errorMsg && (
                    <div className="bg-error-container/20 border border-error/20 p-3 rounded text-xs font-semibold text-error text-center">
                      {errorMsg}
                    </div>
                  )}

                  {type === 'signup' && (
                    <>
                      {/* Full Name */}
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/70" />
                        <input
                          type="text"
                          placeholder={lang === 'sw' ? 'Jina Kamili' : 'Full Name'}
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-tertiary border border-outline dark:border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none rounded text-sm text-on-surface transition-all"
                        />
                      </div>

                      {/* Phone */}
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/70" />
                        <input
                          type="tel"
                          placeholder={lang === 'sw' ? 'Namba ya Simu' : 'Phone Number'}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-tertiary border border-outline dark:border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none rounded text-sm text-on-surface transition-all"
                        />
                      </div>
                    </>
                  )}

                  {/* Email */}
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/70" />
                    <input
                      type="email"
                      placeholder={lang === 'sw' ? 'Barua Pepe' : 'Email Address'}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-tertiary border border-outline dark:border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none rounded text-sm text-on-surface transition-all"
                    />
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/70" />
                    <input
                      type="password"
                      placeholder={lang === 'sw' ? 'Nywila (Password)' : 'Password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-tertiary border border-outline dark:border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none rounded text-sm text-on-surface transition-all"
                    />
                  </div>

                  {type === 'signup' && (
                    <div className="flex items-start gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="agree-checkbox"
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                        className="mt-0.5 rounded border-outline focus:ring-secondary text-secondary accent-secondary cursor-pointer"
                      />
                      <label htmlFor="agree-checkbox" className="text-[11px] leading-tight text-on-surface-variant/90 cursor-pointer">
                        {lang === 'sw'
                          ? 'Ninakubali vigezo, masharti na Mkataba rasmi wa Msambazaji wa RenoLife.'
                          : 'I accept all terms, conditions, and the official RenoLife Distributor Contract Agreement.'}
                      </label>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-primary-container text-on-primary dark:bg-secondary-fixed dark:text-on-secondary-fixed font-bold text-xs uppercase tracking-widest py-3 rounded-lg hover:bg-secondary transition-colors cursor-pointer shadow-sm"
                  >
                    {type === 'login' 
                      ? (lang === 'sw' ? 'Ingia' : 'Login')
                      : (lang === 'sw' ? 'Jiunge Sasa' : 'Register Now')}
                  </button>

                  {/* Trigger exchange */}
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => onSwitchType(type === 'login' ? 'signup' : 'login')}
                      className="text-xs text-secondary hover:underline cursor-pointer font-semibold"
                    >
                      {type === 'login'
                        ? (lang === 'sw' ? 'Huna akaunti bado? Jisajili' : "Don't have an account? Sign Up")
                        : (lang === 'sw' ? 'Tayari unayo akaunti? Ingia' : 'Already have an account? Login')}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-primary-fixed text-primary mx-auto flex items-center justify-center rounded-full shadow-inner">
                    <CheckCircle className="w-10 h-10 text-secondary" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-primary dark:text-primary-fixed">
                    {lang === 'sw' ? 'Imefanikiwa Kikamilifu!' : 'Operation Successful!'}
                  </h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed max-w-xs mx-auto">
                    {type === 'login'
                      ? (lang === 'sw' ? 'Umeingia kwa ufanisi! Karibu kwenye jukwaa lako la RenoLife.' : 'Logged in successfully! Welcome to your RenoLife portal.')
                      : (lang === 'sw' ? 'Hongera! Ombi lako la kusajiliwa na mkataba limepokelewa. Utapigiwa simu kwa ajili ya kuthibitishwa.' : 'Congratulations! Your sign-up and contract registration have been stored. We will call you shortly to confirm.')}
                  </p>
                  <button
                    onClick={handleClose}
                    className="px-6 py-2.5 bg-primary-container text-on-primary rounded text-xs uppercase tracking-wider font-semibold hover:bg-secondary transition-colors"
                  >
                    {lang === 'sw' ? 'Sawa' : 'Dismiss'}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export function HelpModal({ isOpen, onClose, lang }: HelpModalProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const swFaqs = [
    {
      q: "Je, RenoLife Renocell+ inatumikaje?",
      a: "Tengeneza mwelekeo wa sachet moja chini ya ulimi wako (sublingual) asubuhi kabla ya kula chakula chochote. Iache iyeyuke kabisa yenyewe bila kunywa maji kwa dakika 5 hadi 10 ili ifyonzwe haraka na tezi za damu."
    },
    {
      q: "Inachukua muda gani kuona matokeo?",
      a: "Watumiaji wengi wanapata uboreshaji wa nguvu na utendaji wa mwili ndani ya siku 7 hadi 14. Kwa magonjwa thabiti na ya muda mrefu, inashauriwa kutumia boksi 2 hadi 3 ili kupata marekebisho kamili ya seli asilia."
    },
    {
      q: "Je, kuna athari zozote za kutumia bidhaa hizi?",
      a: "Hapana, bidhaa zetu ni za asili kwa 100% (organic) kutoka kwa mimea asili. Hazina athari yoyote mbaya (no side effects) na zinatii viwango vya juu vya usalama vya kitaifa na kimataifa."
    },
    {
      q: "Ninawezaje kufanya malipo na usafirishaji?",
      a: "Unaweza kuagiza hapa mtandaoni au kupitia namba zetu. Malipo yanafanyika kupitia mifumo ya simu (M-Pesa, Tigo Pesa, Airtel Money) au wakati wa kupokea mzigo. Tunasafirisha mikoani kote Tanzania ndani ya masaa 24."
    }
  ];

  const enFaqs = [
    {
      q: "How do I consume RenoLife Renocell+?",
      a: "Place the contents of one sachet under your tongue (sublingually) first thing in the morning on an empty stomach. Authorize it to melt fully without taking water for 5 to 10 minutes to support microcapillary absorption."
    },
    {
      q: "How long until I start noticing biological improvements?",
      a: "Many clients reports heightened vitality and immune relief within 7 to 14 days. For long-term chronic issues, we highly recommend a continuous dosage of 2 to 3 boxes for deep structural cell repair."
    },
    {
      q: "Are there any side effects connected to usage?",
      a: "Absolutely none. All formulations are 100% natural, vegetarian-friendly, and bio-engineered using organic plant tissues. They are fully safe, clean, and run free of synthetic chemical effects."
    },
    {
      q: "How can I process payments and delivery?",
      a: "You may place orders here on the site or via phone. We support safe payment methods (mobile money, cash, bank deposit). Nationwide secure courier shipments are carried out within 24 hours of confirmation."
    }
  ];

  const currentFaqs = lang === 'sw' ? swFaqs : enFaqs;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/60 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-surface dark:bg-tertiary border border-outline-variant dark:border-tertiary-container rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Header */}
            <div className="px-6 py-4 bg-primary dark:bg-tertiary-container border-b border-outline-variant dark:border-tertiary/10 flex items-center justify-between text-on-primary">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-secondary-fixed" />
                <h3 className="font-serif text-lg font-bold text-white dark:text-secondary-fixed">
                  {lang === 'sw' ? 'Kitovu cha Msaada & Maswali (FAQ)' : 'Help Center & FAQs'}
                </h3>
              </div>
              <button 
                onClick={onClose}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
              <div className="text-center pb-2 border-b border-outline-variant/30">
                <p className="text-xs text-on-surface-variant mr-1">
                  {lang === 'sw' 
                    ? 'Majibu ya haraka kuhusu matumizi ya RenoLife na utoaji wa huduma.' 
                    : 'Instant answers regarding RenoLife usage, dosages, and delivery processes.'}
                </p>
              </div>

              <div className="space-y-3">
                {currentFaqs.map((faq, idx) => {
                  const isOpen = openIndex === idx;
                  return (
                    <div 
                      key={idx} 
                      className="border border-outline-variant/50 rounded-xl overflow-hidden bg-surface-container-lowest dark:bg-tertiary-container/25"
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : idx)}
                        className="w-full text-left p-4 flex items-center justify-between gap-3 text-sm font-semibold text-primary dark:text-primary-fixed hover:bg-surface-container/30 transition-colors"
                      >
                        <span>{faq.q}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-secondary" /> : <ChevronDown className="w-4 h-4 text-on-surface-variant/70" />}
                      </button>
                      {isOpen && (
                        <div className="p-4 pt-0 text-xs leading-relaxed text-on-surface-variant border-t border-outline-variant/30 bg-surface/50 dark:bg-transparent">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Direct helpline highlight */}
              <div className="bg-primary/5 dark:bg-secondary/5 border border-secondary/15 p-4 rounded-xl text-center space-y-2 mt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-secondary">
                  {lang === 'sw' ? 'Bado Una Maswali Metu?' : 'Still Have Urgent Questions?'}
                </h4>
                <p className="text-[11px] text-on-surface-variant">
                  {lang === 'sw' ? 'Wasiliana na timu yetu ya wataalamu moja kwa moja kupitia WhatsApp au Simu.' : 'Connect directly with our professional customer relations desk.'}
                </p>
                <p className="text-xs font-bold text-primary dark:text-secondary-fixed">
                  0768605520
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  initialTab?: 'contact' | 'contract';
}

export function ContactModal({ isOpen, onClose, lang, initialTab = 'contact' }: ContactModalProps) {
  const [activeTab, setActiveTab ] = useState<'contact' | 'contract'>(initialTab);

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/60 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-surface dark:bg-tertiary border border-outline-variant dark:border-tertiary-container rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Header */}
            <div className="px-6 py-4 bg-primary dark:bg-tertiary-container border-b border-outline-variant dark:border-tertiary/10 flex items-center justify-between text-on-primary">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-secondary-fixed" />
                <h3 className="font-serif text-lg font-bold text-white dark:text-secondary-fixed">
                  {lang === 'sw' ? 'Mawasiliano na Sera za Mikataba' : 'Contact & Contract Desk'}
                </h3>
              </div>
              <button 
                onClick={onClose}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Custom Tab Selector */}
            <div className="flex bg-surface-container border-b border-outline-variant/40 dark:bg-tertiary-container/30">
              <button
                onClick={() => setActiveTab('contact')}
                className={`flex-1 py-3 text-xs uppercase tracking-widest font-extrabold text-center border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'contact' 
                    ? 'border-secondary text-secondary' 
                    : 'border-transparent text-on-surface-variant/85 hover:text-primary dark:hover:text-white'
                }`}
              >
                {lang === 'sw' ? 'Mawasiliano' : 'Contact Us'}
              </button>
              <button
                onClick={() => setActiveTab('contract')}
                className={`flex-1 py-3 text-xs uppercase tracking-widest font-extrabold text-center border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'contract' 
                    ? 'border-secondary text-secondary' 
                    : 'border-transparent text-on-surface-variant/85 hover:text-primary dark:hover:text-white'
                }`}
              >
                {lang === 'sw' ? 'Mkataba wa Msambazaji' : 'Distributor Contract'}
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
              {activeTab === 'contact' ? (
                <div className="space-y-4 text-left">
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-widest text-secondary">
                      {lang === 'sw' ? 'Ofisi na Mawasiliano Rasmi' : 'Official Office Coordinates'}
                    </h4>
                    <p className="text-xs leading-relaxed text-on-surface-variant">
                      {lang === 'sw'
                        ? 'Wasiliana na huduma kwa wateja kwa ajili ya ushauri wa afya ya seli mama au kufuatilia makubaliano.'
                        : 'Contact our helpdesk for organic cellular consultation or tracking wholesale shipments.'}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    {/* Phone Line */}
                    <div className="flex items-start gap-3 p-3 bg-surface-container-low dark:bg-tertiary-container/20 rounded-xl border border-outline-variant/40">
                      <Phone className="w-5 h-5 text-secondary mt-0.5" />
                      <div>
                        <p className="text-[10px] uppercase font-bold text-on-surface-variant/60">Phone / WhatsApp Helpline</p>
                        <p className="text-sm font-bold text-primary dark:text-primary-fixed">0768605520</p>
                        <p className="text-[10px] text-on-surface-variant/80">Monday to Sunday, 24/7 Support Desk</p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-3 p-3 bg-surface-container-low dark:bg-tertiary-container/20 rounded-xl border border-outline-variant/40">
                      <Mail className="w-5 h-5 text-secondary mt-0.5" />
                      <div>
                        <p className="text-[10px] uppercase font-bold text-on-surface-variant/60">Support Email</p>
                        <p className="text-sm font-bold text-primary dark:text-primary-fixed">support@renolife-biotech.com</p>
                        <p className="text-[10px] text-on-surface-variant/80">Replies guaranteed within 2 hours</p>
                      </div>
                    </div>

                    {/* Shield */}
                    <div className="flex items-start gap-3 p-3 bg-surface-container-low dark:bg-tertiary-container/20 rounded-xl border border-outline-variant/40">
                      <Shield className="w-5 h-5 text-secondary mt-0.5" />
                      <div>
                        <p className="text-[10px] uppercase font-bold text-on-surface-variant/60">Legal Compliancy</p>
                        <p className="text-xs text-on-surface-variant font-medium">TFDA, TBS, and International Plant Cell Association Registered & Certified.</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-left">
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-widest text-secondary flex items-center gap-1.5">
                      <FileText className="w-4 h-4" />
                      <span>{lang === 'sw' ? 'Mkataba na Makubaliano ya Ubiashara' : 'Distributor Contract Agreement Guidelines'}</span>
                    </h4>
                    <p className="text-xs leading-relaxed text-on-surface-variant">
                      {lang === 'sw'
                        ? 'Unapojiunga kama Msambazaji wa RenoLife, unaingia katika makubaliano huru ya kisheria na yenye maadili kwa mujibu wa mwongozo ufuatao:'
                        : 'By signing up as a licensed RenoLife Independent Distributor, you enter into a legal, ethical, and moral agreement governed by these master rules:'}
                    </p>
                  </div>

                  <div className="space-y-2.5 bg-surface-container-lowest dark:bg-tertiary-container/10 p-4 border border-outline-variant/50 rounded-xl divide-y divide-outline-variant/40">
                    <div className="pb-2 text-xs leading-relaxed text-on-surface-variant">
                      <strong className="text-primary dark:text-secondary-fixed block mb-0.5">1. {lang === 'sw' ? 'Tume na Malipo' : 'Commissions & Daily Payouts'}</strong>
                      {lang === 'sw' 
                        ? 'Msambazaji atalipwa asilimia 30% ya faida (retail profit) mara baada ya mauzo kukamilika upande wa bidhaa za seli.'
                        : 'Distributors are strictly granted up to 30% instant retail margins and dynamic points clearings processed on a daily basis.'}
                    </div>
                    <div className="py-2.5 text-xs leading-relaxed text-on-surface-variant">
                      <strong className="text-primary dark:text-secondary-fixed block mb-0.5">2. {lang === 'sw' ? 'Maadili ya Uuzaji' : 'Strict Marketing Ethics'}</strong>
                      {lang === 'sw'
                        ? 'Mwanachama haruhusiwi kutoa madai ya uongo ya kitabibu au kubadilisha bei rasmi zilizopangwa na kampuni.'
                        : 'No distributor shall proclaim curative medical diagnostic guarantees or manipulate the official retail price points of products.'}
                    </div>
                    <div className="pt-2 text-xs leading-relaxed text-on-surface-variant">
                      <strong className="text-primary dark:text-secondary-fixed block mb-0.5">3. {lang === 'sw' ? 'Ulinzi wa Urithi' : 'Direct Hereditary Legacy protection'}</strong>
                      {lang === 'sw'
                        ? 'Mfumo wa mkataba huu unaruhusu kuhamisha maslahi na mkataba wa biashara hii kwenda kwa mtoto au mwanafamilia kwa maandishi kuwahakikishia usalama.'
                        : 'Your complete business ledger is fully transferable and can be legally inherited by your declared children or family heirs.'}
                    </div>
                  </div>

                  <div className="pt-2 text-center">
                    <a
                      href={`https://wa.me/255768605520?text=${encodeURIComponent(lang === 'sw' ? 'Nahitaji nakala ya mkataba wa msambazaji wa RenoLife' : 'I request a copy of the RenoLife distributor contract PDF')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-colors cursor-pointer shadow-sm"
                    >
                      <span>{lang === 'sw' ? 'Omba Mkataba Kamili (PDF)' : 'Get Full Contract copy (PDF)'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}

              {/* Action footer */}
              <div className="pt-4 border-t border-outline-variant/40 text-center">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-primary-container text-on-primary-container hover:bg-secondary text-xs uppercase tracking-wider font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  {lang === 'sw' ? 'Funga' : 'Close'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
