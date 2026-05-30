import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Phone, MapPin, User, CheckCircle, Plus, Minus, Mail } from 'lucide-react';
import { Language, TranslationSet } from '../types';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  t: TranslationSet;
}

export default function OrderModal({ isOpen, onClose, lang, t }: OrderModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pricePerBox = lang === 'sw' ? 150000 : 60;
  const deliveryCost = lang === 'sw' ? 10000 : 5;
  const totalPrice = (quantity * pricePerBox) + (quantity >= 2 ? 0 : deliveryCost); // Free delivery for 2+ boxes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg(lang === 'sw' ? 'Tafadhali weka jina lako' : 'Please provide your name');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg(lang === 'sw' ? 'Tafadhali weka anwani sahihi ya barua pepe' : 'Please provide a valid email address');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg(lang === 'sw' ? 'Tafadhali weka namba yako ya simu' : 'Please provide your phone number');
      return;
    }
    if (!address.trim()) {
      setErrorMsg(lang === 'sw' ? 'Tafadhali weka anwani ya uwasilishaji' : 'Please provide a delivery address');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      // 1. Save the order payload to Firestore
      const orderId = 'ord_' + Math.random().toString(36).substring(2, 11) + Math.random().toString(36).substring(2, 11);
      const pathStr = `orders/${orderId}`;
      
      try {
        await setDoc(doc(db, 'orders', orderId), {
          fullName: name,
          email: email,
          phone: phone,
          address: address,
          quantity: quantity,
          totalPrice: totalPrice,
          currency: lang === 'sw' ? 'TZS' : 'USD',
          orderedAt: serverTimestamp(),
          status: 'pending'
        });
      } catch (dbErr) {
        console.error("Firestore database write error:", dbErr);
        handleFirestoreError(dbErr, OperationType.WRITE, pathStr);
      }

      // 2. Fire full-stack backend confirmation email dispatch endpoint
      try {
        await fetch('/api/send-confirmation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fullName: name,
            email: email,
            phone: phone,
            address: address,
            quantity: quantity,
            totalPrice: totalPrice,
            currency: lang === 'sw' ? 'TZS' : 'USD',
            lang: lang
          })
        });
      } catch (emailErr) {
        // Non-blocking error: ensure booking flow succeeds even if network fails
        console.error("Background confirmation email trigger issue:", emailErr);
      }
      
      // 3. Open WhatsApp structured order link for customer convenience
      const orderDetails = lang === 'sw'
        ? `Habari! Nahitaji agizo la RenoLife+:\n\n👤 Jina: ${name}\n📧 Email: ${email}\n📞 Namba ya Simu: ${phone}\n📍 Anwani: ${address}\n📦 Idadi ya Maboksi: ${quantity}\n💰 Jumla Kuu: ${totalPrice.toLocaleString()} TZS`
        : `Hello! I would like to place an order for RenoLife+:\n\n👤 Name: ${name}\n📧 Email: ${email}\n📞 Phone: ${phone}\n📍 Address: ${address}\n📦 Quantity: ${quantity} box(es)\n💰 Total Cost: $${totalPrice}`;

      const whatsappUrl = `https://wa.me/255768605520?text=${encodeURIComponent(orderDetails)}`;
      window.open(whatsappUrl, '_blank');

      setIsSuccess(true);
    } catch (err: unknown) {
      console.error("Order submission failure:", err);
      setErrorMsg(lang === 'sw' 
        ? 'Agizo limekabidhiwa kwa mafanikio lakini hitilafu ndogo ya database imejitokeza. Tafadhali thibitisha agizo na mshauri wetu.'
        : 'Your order was processed, but a minor database sync error occurred. Please contact our support.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setQuantity(1);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="order-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/60 backdrop-blur-sm">
          {/* Backdrop Click */}
          <div className="absolute inset-0" onClick={handleClose} />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-surface dark:bg-tertiary border border-outline-variant dark:border-tertiary-container rounded-xl shadow-2xl overflow-hidden z-10"
          >
            {/* Header */}
            <div className="px-6 py-4 bg-primary dark:bg-tertiary-container border-b border-outline-variant dark:border-tertiary/10 flex items-center justify-between text-on-primary">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-secondary-fixed" />
                <h3 className="font-serif text-lg md:text-xl font-medium tracking-tight text-white dark:text-secondary-fixed">
                  {t.orderModalTitle}
                </h3>
              </div>
              <button 
                onClick={handleClose}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors"
                id="close-modal-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6">
              {!isSuccess ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Quantity Selector */}
                  <div className="bg-surface-container dark:bg-tertiary-container/40 p-4 rounded-lg border border-outline-variant/50">
                    <label className="block text-xs font-semibold tracking-wider uppercase text-on-surface-variant dark:text-tertiary-fixed-dim mb-3">
                      {t.orderFormQuantity}
                    </label>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setQuantity(q => Math.max(1, q - 1))}
                          className="w-10 h-10 flex items-center justify-center bg-surface dark:bg-tertiary border border-outline dark:border-outline-variant rounded hover:bg-surface-container-high dark:hover:bg-tertiary-container text-on-surface transition-colors"
                          id="qty-minus"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-bold text-lg text-primary dark:text-primary-fixed">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(q => q + 1)}
                          className="w-10 h-10 flex items-center justify-center bg-surface dark:bg-tertiary border border-outline dark:border-outline-variant rounded hover:bg-surface-container-high dark:hover:bg-tertiary-container text-on-surface transition-colors"
                          id="qty-plus"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-xs text-on-surface-variant block">
                          {lang === 'sw' ? 'Bei kwa Boksi: 150,000' : 'Price per Box: $60'}
                        </span>
                        <span className="text-sm font-semibold text-secondary block">
                          {quantity >= 2 
                            ? (lang === 'sw' ? 'Uwasilishaji Bure' : 'Free Delivery') 
                            : `+ ${lang === 'sw' ? 'Kiingilio uwasilishaji: 10,000' : 'Delivery: $5'}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Sum */}
                  <div className="flex justify-between items-center py-2 border-b border-outline-variant text-on-surface font-sans">
                    <span className="text-sm font-medium">{t.orderPriceCalc}</span>
                    <span className="text-xl font-bold text-primary dark:text-primary-fixed">
                      {lang === 'sw' 
                        ? `${totalPrice.toLocaleString()} TZS` 
                        : `$${totalPrice} USD`}
                    </span>
                  </div>

                  {/* Errors */}
                  {errorMsg && (
                    <p className="text-xs font-semibold text-error text-center bg-error-container/40 px-3 py-1.5 rounded border border-error/20">
                      {errorMsg}
                    </p>
                  )}

                  {/* Form Fields */}
                  <div className="space-y-3">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/70" />
                      <input
                        type="text"
                        placeholder={t.orderFormName}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-tertiary border border-outline dark:border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none rounded text-sm text-on-surface transition-all"
                        required
                        id="order-name-input"
                      />
                    </div>

                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/70" />
                      <input
                        type="email"
                        placeholder={lang === 'sw' ? 'Anwani ya Barua Pepe (Email)' : 'Email Address'}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-tertiary border border-outline dark:border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none rounded text-sm text-on-surface transition-all"
                        required
                        id="order-email-input"
                      />
                    </div>

                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/70" />
                      <input
                        type="tel"
                        placeholder={t.orderFormPhone}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-tertiary border border-outline dark:border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none rounded text-sm text-on-surface transition-all"
                        required
                        id="order-phone-input"
                      />
                    </div>

                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-on-surface-variant/70" />
                      <textarea
                        placeholder={t.orderFormAddress}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        rows={2}
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-tertiary border border-outline dark:border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none rounded text-sm text-on-surface transition-all resize-none"
                        required
                        id="order-address-input"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full font-semibold text-xs tracking-widest uppercase border-0 p-4 rounded active:scale-[0.99] transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 ${
                      isSubmitting 
                        ? 'bg-outline text-on-surface-variant opacity-70 cursor-not-allowed' 
                        : 'bg-primary-container text-on-primary hover:bg-secondary'
                    }`}
                    id="submit-order-button"
                  >
                    {isSubmitting ? (
                      <span>{lang === 'sw' ? 'Inatuma...' : 'Submitting...'}</span>
                    ) : (
                      <span>{t.orderFormSubmit}</span>
                    )}
                  </button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-10 text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-primary-fixed text-primary-container mx-auto flex items-center justify-center rounded-full shadow-inner">
                    <CheckCircle className="w-10 h-10 text-on-primary-fixed-variant" />
                  </div>
                  <h4 className="font-serif text-xl font-semibold text-primary dark:text-primary-fixed">
                    {lang === 'sw' ? 'Agizo Limefanikiwa!' : 'Order Placed Successfully!'}
                  </h4>
                  <p className="text-sm text-on-surface-variant max-w-sm mx-auto leading-relaxed">
                    {t.orderFormSuccess}
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-6 px-8 py-3 bg-primary-container text-on-primary hover:bg-secondary text-xs uppercase tracking-wider font-semibold rounded transition-colors"
                    id="confirm-success-close"
                  >
                    {lang === 'sw' ? 'Sawa, Asante' : 'Okay, Thank you'}
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
