/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Instagram, 
  User, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  Pencil,
  Frown,
  Clock,
  Zap,
  Cloud,
  Target,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

const SEGMENTS = [
  { label: 'Free Sketch', color: '#fff200', isPrize: true, Icon: Pencil },
  { label: 'Better Luck', color: '#00aeef', isPrize: false, Icon: Frown },
  { label: 'Free Sketch', color: '#8dc63f', isPrize: true, Icon: Pencil },
  { label: 'Better Luck', color: '#92278f', isPrize: false, Icon: Frown },
  { label: 'Free Sketch', color: '#ed1c24', isPrize: true, Icon: Pencil },
  { label: 'Better Luck', color: '#00aeef', isPrize: false, Icon: Frown },
  { label: 'Free Sketch', color: '#8dc63f', isPrize: true, Icon: Pencil },
  { label: 'Better Luck', color: '#0054a6', isPrize: false, Icon: Frown },
  { label: 'Free Sketch', color: '#ec008c', isPrize: true, Icon: Pencil },
  { label: 'Better Luck', color: '#00aeef', isPrize: false, Icon: Frown },
  { label: 'Free Sketch', color: '#8dc63f', isPrize: true, Icon: Pencil },
  { label: 'Better Luck', color: '#92278f', isPrize: false, Icon: Frown },
  { label: 'Free Sketch', color: '#ec008c', isPrize: true, Icon: Pencil },
  { label: 'Try Again', color: '#00aeef', isPrize: false, Icon: RotateCcw },
];

const SPIN_DURATION = 5000; // 5 seconds

export default function App() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<typeof SEGMENTS[0] | null>(null);
  const [winningIndex, setWinningIndex] = useState<number | null>(null);
  const [hasSpun, setHasSpun] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: '', instagram: '' });
  const [errors, setErrors] = useState({ name: '', instagram: '' });

  const wheelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const spun = localStorage.getItem('has_spun_sketch_prize');
    if (spun) {
      setHasSpun(true);
    }
  }, []);

  const handleSpin = () => {
    if (isSpinning || hasSpun) return;

    setIsSpinning(true);
    const extraSpins = 5 + Math.floor(Math.random() * 5); // 5-10 full rotations
    const randomSegmentIndex = Math.floor(Math.random() * SEGMENTS.length);
    const segmentAngle = 360 / SEGMENTS.length;
    
    // Calculate the target rotation
    // We want the pointer (at the top, 0 degrees) to land on the segment
    // The segments are drawn starting from 0 degrees clockwise
    // To land on segment i, we need to rotate by:
    // 360 - (i * segmentAngle + segmentAngle / 2)
    const targetRotation = rotation + (extraSpins * 360) + (360 - (randomSegmentIndex * segmentAngle + segmentAngle / 2));
    
    setRotation(targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setWinningIndex(randomSegmentIndex);
      const landedResult = SEGMENTS[randomSegmentIndex];
      setResult(landedResult);

      if (landedResult.label === 'Try Again') {
        // Allow spinning again
        setIsSpinning(false);
        setWinningIndex(randomSegmentIndex);
      } else {
        setHasSpun(true);
        localStorage.setItem('has_spun_sketch_prize', 'true');
      }

      if (landedResult.isPrize) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6']
        });
        setTimeout(() => setShowForm(true), 1000);
      }
    }, SPIN_DURATION);
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: '', instagram: '' };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }
    if (!formData.instagram.trim()) {
      newErrors.instagram = 'Instagram ID is required';
      valid = false;
    } else if (formData.instagram.startsWith('@')) {
       // Optional: could strip @ but let's just ensure it's not empty
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowForm(false);
      setShowSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-emerald-500/30 flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center mb-12"
      >
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent italic uppercase">
          Sketch Spinner
        </h1>
        <p className="text-neutral-400 text-sm md:text-base font-mono uppercase tracking-widest">
          Spin to win a custom digital sketch
        </p>
      </motion.div>

      {/* Wheel Container */}
      <div className="relative z-10 mb-12 group">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20">
          <div className="w-8 h-10 bg-white clip-path-triangle shadow-xl" style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }} />
        </div>

        {/* The Wheel */}
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: SPIN_DURATION / 1000, ease: [0.45, 0.05, 0.55, 0.95] }}
          className="relative w-72 h-72 md:w-[450px] md:h-[450px] rounded-full border-8 border-neutral-900 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
          style={{ transformOrigin: 'center' }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Outer Ring */}
            <circle cx="50" cy="50" r="49" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
            
            {SEGMENTS.map((seg, i) => {
              const angle = 360 / SEGMENTS.length;
              const startAngle = i * angle;
              const x1 = 50 + 48 * Math.cos((Math.PI * (startAngle - 90)) / 180);
              const y1 = 50 + 48 * Math.sin((Math.PI * (startAngle - 90)) / 180);
              const x2 = 50 + 48 * Math.cos((Math.PI * (startAngle + angle - 90)) / 180);
              const y2 = 50 + 48 * Math.sin((Math.PI * (startAngle + angle - 90)) / 180);

              const isWinner = !isSpinning && winningIndex === i;

              return (
                <g 
                  key={i}
                  className={isWinner ? "animate-pulse" : ""}
                  style={isWinner ? { filter: `drop-shadow(0 0 8px ${seg.color})` } : {}}
                >
                  <path
                    d={`M 50 50 L ${x1} ${y1} A 48 48 0 0 1 ${x2} ${y2} Z`}
                    fill={seg.color}
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="0.2"
                    className={`transition-opacity duration-300 ${isWinner ? 'opacity-100' : 'hover:opacity-90'}`}
                  />
                  <foreignObject
                    x="30"
                    y="13"
                    width="40"
                    height="8"
                    transform={`rotate(${startAngle + angle / 2}, 50, 50) rotate(90, 50, 17)`}
                    className="pointer-events-none"
                  >
                    <div className="flex items-center justify-center w-full h-full gap-1">
                      <div className="flex items-center justify-center text-white/90 drop-shadow-md" style={{ color: seg.color === '#fff200' ? '#333' : 'white' }}>
                        <seg.Icon size={3} strokeWidth={3} />
                      </div>
                      <span 
                        className="uppercase tracking-tighter font-black whitespace-nowrap"
                        style={{ 
                          fontSize: '2.8px',
                          color: seg.color === '#fff200' ? '#333' : 'white',
                          textShadow: seg.color === '#fff200' ? 'none' : '0 1px 2px rgba(0,0,0,0.8)'
                        }}
                      >
                        {seg.label}
                      </span>
                    </div>
                  </foreignObject>
                  
                  {/* Edge Pin */}
                  <circle 
                    cx={x1} 
                    cy={y1} 
                    r="1" 
                    fill="url(#pinGradient)" 
                    stroke="#666" 
                    strokeWidth="0.1" 
                  />
                </g>
              );
            })}
            
            <defs>
              <radialGradient id="pinGradient" cx="50%" cy="50%" r="50%" fx="25%" fy="25%">
                <stop offset="0%" stopColor="#fff" />
                <stop offset="100%" stopColor="#999" />
              </radialGradient>
            </defs>
          </svg>
          {/* Center Hub */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-28 md:h-28 bg-neutral-950 rounded-full border-4 border-neutral-800 flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.8)] z-40">
            <div className="text-yellow-400 font-black text-xl md:text-3xl italic tracking-tighter drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">
              SPIN
            </div>
          </div>
        </motion.div>

        {/* Spin Button */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
          {!hasSpun && (
            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className={`
                px-8 py-3 rounded-full font-black uppercase tracking-tighter text-lg transition-all
                ${isSpinning 
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed scale-95' 
                  : 'bg-white text-black hover:scale-110 active:scale-90 shadow-[0_0_30px_rgba(255,255,255,0.3)]'}
              `}
            >
              {isSpinning ? 'Spinning...' : 'Spin Now'}
            </button>
          )}
        </div>
      </div>

      {/* Status Messages */}
      <AnimatePresence>
        {!isSpinning && result && result.label === 'Try Again' && !hasSpun && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto mb-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 text-blue-400">
              <RotateCcw size={18} className="animate-spin-slow" />
              <span className="font-bold uppercase tracking-tight">Lucky! Spin Again!</span>
            </div>
          </motion.div>
        )}
        {hasSpun && !isSpinning && result && !showForm && !showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto"
          >
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${result.isPrize ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
              {result.isPrize ? <Trophy size={18} /> : <AlertCircle size={18} />}
              <span className="font-bold uppercase tracking-tight">{result.label}</span>
            </div>
            <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest">
              You have already used your spin.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prize Form Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-neutral-900 border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Trophy size={32} />
                </div>
                <h2 className="text-3xl font-black tracking-tighter uppercase italic">You Won!</h2>
                <p className="text-neutral-400 text-sm">Fill in your details to claim your free sketch.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-neutral-500 mb-2 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full bg-neutral-950 border ${errors.name ? 'border-rose-500' : 'border-white/10'} rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-emerald-500 transition-colors`}
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.name && <p className="text-rose-500 text-[10px] mt-1 ml-1 uppercase font-bold">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-neutral-500 mb-2 ml-1">Instagram ID</label>
                  <div className="relative">
                    <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                    <input
                      type="text"
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                      className={`w-full bg-neutral-950 border ${errors.instagram ? 'border-rose-500' : 'border-white/10'} rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-emerald-500 transition-colors`}
                      placeholder="@yourhandle"
                    />
                  </div>
                  {errors.instagram && <p className="text-rose-500 text-[10px] mt-1 ml-1 uppercase font-bold">{errors.instagram}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                >
                  Claim My Prize
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-neutral-900 border border-white/10 p-12 rounded-3xl w-full max-w-md text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-3xl font-black tracking-tighter uppercase italic mb-4">Submission Received!</h2>
              <p className="text-neutral-400 mb-8">We've got your details. Keep an eye on your Instagram DMs for your free sketch!</p>
              <button
                onClick={() => setShowSuccess(false)}
                className="px-8 py-3 bg-white text-black font-black uppercase rounded-full transition-all hover:scale-105 active:scale-95"
              >
                Awesome
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Info */}
      <div className="fixed bottom-8 left-0 right-0 text-center z-10">
        <p className="text-neutral-600 text-[10px] uppercase tracking-[0.3em] font-mono">
          Limited to one spin per device
        </p>
      </div>
    </div>
  );
}
