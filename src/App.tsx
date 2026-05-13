import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { 
  motion, 
  useScroll, 
  useTransform, 
  AnimatePresence, 
  useSpring,
  useMotionValue
} from 'motion/react';
import { 
  Heart, 
  Sparkles, 
  Flower, 
  Stars, 
  MessageCircle, 
  ArrowDown, 
  Clock,
  CircleHelp,
  PartyPopper,
  MailOpen,
  Music,
  Zap
} from 'lucide-react';

// --- Components ---

const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      setIsHovering(
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('.cursor-pointer') !== null
      );
      
      setIsHidden(
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.isContentEditable
      );
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (isHidden) return null;

  return (
    <>
      {/* Main Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: mousePos.x - 12,
          y: mousePos.y - 12,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 300, mass: 0.5 }}
      >
        <Heart size={24} className="text-primary fill-current" />
      </motion.div>
      
      {/* Trail effect */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed top-0 left-0 w-2 h-2 pointer-events-none z-[9998] opacity-30"
          animate={{
            x: mousePos.x - 4,
            y: mousePos.y - 4,
          }}
          transition={{ 
            type: 'spring', 
            damping: 25 + i * 5, 
            stiffness: 200 - i * 30, 
            mass: 0.8 
          }}
        >
          <Sparkles size={8 + i * 2} className="text-secondary" />
        </motion.div>
      ))}
    </>
  );
};

const FloatingElement = ({ children, delay = 0, duration = 5, xOffset = 20, yOffset = 20 }: { children: ReactNode, delay?: number, duration?: number, xOffset?: number, yOffset?: number, key?: any }) => (
  <motion.div
    animate={{
      y: [0, -yOffset, 0],
      x: [0, xOffset, 0],
      rotate: [0, 5, -5, 0],
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
  >
    {children}
  </motion.div>
);

const Section = ({ children, className = "" }: { children: ReactNode, className?: string }) => (
  <section className={`min-h-screen flex flex-col items-center justify-center p-6 text-center ${className}`}>
    {children}
  </section>
);

const GlassCard = ({ children, className = "" }: { children: ReactNode, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`card-glass p-8 md:p-12 max-w-2xl w-full ${className}`}
  >
    {children}
  </motion.div>
);

const SecretLetter = ({ name }: { name: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="perspective-1000 my-24">
      <motion.div
        animate={{ 
          rotateX: isOpen ? -20 : 0, 
        }}
        className="relative w-80 h-64 mx-auto cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Envelope Back */}
        <div className="absolute inset-0 bg-[#3a2a24] rounded-lg shadow-xl z-0" />
        
        {/* Paper Inside */}
        <motion.div
          animate={{ 
            y: isOpen ? -180 : 0, 
            rotateX: isOpen ? 2 : 0,
            scale: isOpen ? 1.1 : 1,
            zIndex: isOpen ? 50 : 5,
            boxShadow: isOpen 
              ? "0 30px 60px rgba(0,0,0,0.5), 0 0 30px rgba(251,194,235,0.4)" 
              : "0 4px 10px rgba(0,0,0,0.2)"
          }}
          transition={{ type: "spring", stiffness: 70, damping: 25 }}
          className="absolute inset-2 bg-[#fdfdfb] rounded shadow-2xl p-7 flex flex-col justify-between border border-[#eee5d8] min-h-[90%]"
          style={{ transformOrigin: "bottom" }}
        >
          {/* Subtle Glow Effect behind content when open */}
          <AnimatePresence>
            {isOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.2, 0.4, 0.2] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-radial from-pink-100/40 to-transparent pointer-events-none"
              />
            )}
          </AnimatePresence>

          <div className="overflow-hidden relative z-10 flex-grow">
            <h4 className="text-[#5d4037] font-serif italic text-2xl mb-3">Dearest {name},</h4>
            <p className="text-[#8d6e63] font-serif text-sm leading-relaxed">
              I wrote this message because sometimes it's easier to put my heart on paper. 
              You are the most important person in my life, and I am deeply sorry for any moment I made you feel otherwise. 
              Every second without your smile feels like an eternity. Please let me make it up to you.
            </p>
          </div>
          
          <div className="flex justify-end pt-4 mt-6 relative z-10 border-t border-[#eee5d8]/50">
            <div className="flex flex-col items-end">
              <Heart size={18} className="text-pink-400 fill-current mb-1" />
              <span className="text-xs text-[#8d6e63] font-serif leading-none italic font-bold">Forever yours</span>
            </div>
          </div>

          {/* Ripple Effect on Open */}
          {isOpen && (
            <motion.div 
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 5, opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-pink-200/40 rounded-full pointer-events-none"
            />
          )}
        </motion.div>

        {/* Envelope Front Flap */}
        <motion.div
          animate={{ rotateX: isOpen ? -160 : 0, zIndex: isOpen ? 0 : 20 }}
          style={{ originY: 0 }}
          className="absolute top-0 left-0 right-0 h-[65%] bg-[#4e342e] rounded-t-lg flex items-center justify-center shadow-lg transform-gpu"
        >
          {!isOpen && (
            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2.5 }}>
               <MailOpen className="text-pink-200" size={36} />
               <p className="text-[11px] text-pink-200/60 mt-2 uppercase tracking-[0.2em]">Open me</p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

const PerspectiveCard = ({ children }: { children: ReactNode }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className="relative h-96 w-72 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 card-glass flex items-center justify-center perspective-1000"
    >
      <div
        style={{
          transform: "translateZ(75px)",
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-4 grid place-content-center rounded-xl bg-white/5 shadow-lg"
      >
        {children}
      </div>
    </motion.div>
  );
};

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  // Assets set up for your GitHub deployment:
  // 1. Upload your song as 'song.mp3' to the 'public' folder
  // 2. Upload your photos as 'photo1.jpeg' and 'photo2.jpeg' to the 'public' folder
  const audioUrl = "/song.mp3"; 

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(e => {
          console.error("Audio playback failed:", e);
          // Auto-fallback to a CDN link if local file is missing (good for preview)
          if (audioRef.current) {
            audioRef.current.src = "https://cdn.pixabay.com/audio/2022/05/27/audio_1808f3030e.mp3";
            audioRef.current.play()
              .then(() => setIsPlaying(true))
              .catch(err => console.error("Everything failed:", err));
          }
        });
    }
  };

  return (
    <div className="fixed bottom-8 left-8 z-[100] flex flex-col items-start gap-4">
      <audio ref={audioRef} src={audioUrl} loop preload="auto" />
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={togglePlay}
        className="card-glass p-4 text-primary flex items-center gap-3 shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/10"
      >
        <div className="relative">
          <div className={isPlaying ? 'animate-spin-slow' : ''}>
            <Music size={20} />
          </div>
          {isPlaying && (
            <motion.div 
              animate={{ height: [4, 12, 6, 14, 8, 4] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="absolute -right-1 -bottom-1 w-0.5 bg-primary rounded-full shadow-[0_0_4px_rgba(251,194,235,0.8)]"
            />
          )}
          {isPlaying && (
            <motion.div 
              animate={{ height: [6, 4, 10, 5, 12, 6] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="absolute -right-2 -bottom-1 w-0.5 bg-primary rounded-full shadow-[0_0_4px_rgba(251,194,235,0.8)]"
            />
          )}
        </div>
        <span className="text-[10px] font-mono tracking-widest hidden md:block">
          {isPlaying ? "STOP MUSIC" : "PLAY APOLOGY SONG"}
        </span>
      </motion.button>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [forgiven, setForgiven] = useState(false);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  
  const moveNoButton = () => {
    const newX = Math.random() * 200 - 100;
    const newY = Math.random() * 200 - 100;
    setNoPos({ x: newX, y: newY });
  };

  return (
    <div ref={containerRef} className="relative w-full selection:bg-primary/30 cursor-none">
      <CustomCursor />
      <MusicPlayer />
      {/* Background & Atmosphere */}
      <div className="atmosphere" />
      <motion.div 
        style={{ y: backgroundY }}
        className="fixed inset-0 pointer-events-none opacity-20"
      >
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-20 blur-[1px]"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
            }}
          />
        ))}
      </motion.div>

      {/* Hero Section */}
      <Section className="min-h-screen relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute -top-32 -left-20 text-primary/20 blur-sm">
            <Heart size={120} strokeWidth={0.5} />
          </div>
          
          <h1 className="text-7xl md:text-9xl font-serif font-light mb-6 tracking-tight">
            Hi <span className="text-gradient italic">Vaishnavi</span>
          </h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-lg md:text-xl text-white/50 tracking-[0.3em] uppercase font-sans mb-12"
          >
            A symphony of apologies
          </motion.p>
          
          <SecretLetter name="Vaishnavi" />

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="flex flex-col items-center gap-3 cursor-pointer mt-12"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          >
            <span className="text-[10px] text-white/30 font-mono tracking-widest">EXPLORE MY HEART</span>
            <ArrowDown size={16} className="text-white/30" />
          </motion.div>
        </motion.div>
      </Section>

      {/* The Sincere Apology Section */}
      <Section className="min-h-screen">
        <GlassCard className="relative overflow-hidden">
           {/* Decorative corner */}
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <Flower size={100} />
           </div>

          <div className="mb-6 flex justify-center text-primary/60">
            <Sparkles size={48} />
          </div>
          <h2 className="text-4xl font-serif mb-10 italic gold-text">To the one who holds my heart...</h2>
          <div className="space-y-8 text-xl leading-relaxed text-white/80 font-serif text-left px-4">
            <p>
              I've been reflecting on everything lately. My silence, my mistakes, and the times I wasn't the version of myself that you deserve.
            </p>
            <p>
              Vaishnavi, you are like sunlight on a cold morning—warm, essential, and beautiful. Letting you down felt like blocking out that sun. I am so sorry for hurting you.
            </p>
            <p className="italic text-primary/80 border-l-2 border-primary/30 pl-6 py-2">
              "In your happiness, I find my peace. In your smile, I find my home."
            </p>
          </div>
        </GlassCard>
      </Section>

      {/* Photo Gallery Section */}
      <Section className="py-24">
        <h3 className="text-3xl font-serif mb-16 italic text-white/40">Glimpses of Us</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 max-w-6xl w-full">
          <motion.div 
            whileHover={{ scale: 1.02, y: -5 }}
            className="card-glass overflow-hidden aspect-[4/5] relative group shadow-2xl w-full"
          >
            <img 
              src="/photo1.jpeg" 
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1518621736915-f371c4198fb1?auto=format&fit=crop&q=80&w=800";
              }}
              alt="Together" 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8 text-left translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <h4 className="text-2xl font-serif text-primary italic">Every moment with you</h4>
              <p className="text-white/60 text-sm mt-2 font-light">Is a memory I hold close to my heart.</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02, y: -5 }}
            className="card-glass overflow-hidden aspect-[4/5] relative group shadow-2xl w-full"
          >
            <img 
              src="/photo2.jpeg" 
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1516589174184-c6858b16ecbe?auto=format&fit=crop&q=80&w=800";
              }}
              alt="Joy" 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8 text-left translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <h4 className="text-2xl font-serif text-secondary italic">Your beautiful smile</h4>
              <p className="text-white/60 text-sm mt-2 font-light">Makes even the darkest days bright again.</p>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Interactive 3D Memories */}
      <div className="py-32 px-4 max-w-6xl mx-auto">
        <h3 className="text-center text-3xl font-serif mb-20 italic text-white/40">The Little Things I Cherish</h3>
        <div className="memories-grid">
          <PerspectiveCard>
            <div className="text-center p-6">
              <Music className="mx-auto text-pink-300/60 mb-6" size={48} />
              <h4 className="text-2xl font-serif mb-3 italic">Our Song</h4>
              <p className="text-sm text-white/50 leading-relaxed">The way we hum the same tunes without even realizing it.</p>
            </div>
          </PerspectiveCard>
          
          <PerspectiveCard>
            <div className="text-center p-6">
              <Zap className="mx-auto text-blue-300/60 mb-6" size={48} />
              <h4 className="text-2xl font-serif mb-3 italic">The Spark</h4>
              <p className="text-sm text-white/50 leading-relaxed">That electric connection every time we finally see each other after a long day.</p>
            </div>
          </PerspectiveCard>

          <PerspectiveCard>
            <div className="text-center p-6">
              <Stars className="mx-auto text-accent/60 mb-6" size={48} />
              <h4 className="text-2xl font-serif mb-3 italic">The Dreams</h4>
              <p className="text-sm text-white/50 leading-relaxed">Planning our world trip while looking at the stars on the terrace.</p>
            </div>
          </PerspectiveCard>
        </div>
      </div>

      {/* Forgiveness Section */}
      <Section className="min-h-screen py-32 bg-gradient-to-b from-transparent to-black/40">
        <AnimatePresence mode="wait">
          {!forgiven ? (
            <motion.div
              key="ask"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex flex-col items-center"
            >
              <CircleHelp size={80} className="text-primary/10 mb-10" />
              <h2 className="text-5xl font-serif mb-16 italic text-gradient">Will you forgive me, Vaishnavi?</h2>
              
              <div className="flex flex-wrap items-center justify-center gap-12 relative">
                <motion.button
                  whileHover={{ scale: 1.1, boxShadow: "0 0 40px rgba(251, 194, 235, 0.6)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setForgiven(true)}
                  className="px-16 py-6 bg-primary text-black font-semibold rounded-full tracking-widest text-lg shadow-lg"
                >
                  YES, ALWAYS
                </motion.button>

                <motion.button
                  animate={{ x: noPos.x, y: noPos.y }}
                  onHoverStart={moveNoButton}
                  onClick={moveNoButton}
                  className="px-8 py-6 border border-white/10 rounded-full text-white/20 cursor-default hover:bg-white/5 transition-colors"
                >
                  Not yet...
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center flex flex-col items-center px-6"
            >
              <div className="relative mb-12">
                {[...Array(15)].map((_, i) => (
                  <FloatingElement key={i} delay={i * 0.1} duration={1.5 + Math.random()} xOffset={120} yOffset={120}>
                    <Heart className="text-primary/40 absolute" size={Math.random() * 20 + 20} style={{ 
                      top: Math.random() * 300 - 150, 
                      left: Math.random() * 300 - 150,
                      filter: 'blur(1px)'
                    }} />
                  </FloatingElement>
                ))}
                <div className="relative z-10 p-8 card-glass inline-block">
                  <PartyPopper size={100} className="text-primary animate-bounce" />
                </div>
              </div>
              <h2 className="text-6xl md:text-7xl font-serif mb-8 text-gradient italic">My Queen!</h2>
              <p className="text-2xl text-white/60 font-serif max-w-xl italic leading-relaxed">
                Thank you for your kindness, Vaishnavi. I'll spend every day making sure you never regret this choice. You are my everything. ❤️
              </p>
              
              <motion.div 
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                className="h-px w-64 bg-gradient-to-r from-transparent via-gold to-transparent mt-16 mb-6"
              />
              <p className="text-xs font-mono text-gold/40 tracking-[0.5em] uppercase">Eternally Yours</p>
            </motion.div>
          )}
        </AnimatePresence>
      </Section>

      {/* Enhanced Footer */}
      <footer className="py-20 text-center relative">
         <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
         <div className="relative z-10 flex flex-col items-center gap-4">
            <Heart size={20} className="text-primary/30 fill-current animate-pulse" />
            <p className="text-white/20 text-sm font-light tracking-widest uppercase">
               Crafted with love for Vaishnavi
            </p>
         </div>
      </footer>

      {/* Ambient Floating Hearts/Flowers */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: "-10vh", 
              rotate: 0,
              opacity: 0
            }}
            animate={{ 
              y: "110vh", 
              x: (Math.random() * 100 - 50) + "vw",
              rotate: 360,
              opacity: [0, 0.4, 0]
            }}
            transition={{ 
              duration: 15 + Math.random() * 25, 
              repeat: Infinity, 
              ease: "linear",
              delay: i * 1.5
            }}
            className="absolute text-primary/30"
          >
            {i % 3 === 0 ? <Heart size={20} /> : i % 3 === 1 ? <Flower size={20} /> : <Sparkles size={16} />}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
