import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { 
  User, 
  Briefcase, 
  FileText, 
  Mail, 
  X, 
  Github, 
  Twitter, 
  Linkedin,
  Terminal,
  ChevronDown,
  Cpu,
  HardDrive,
  Layers,
  ExternalLink,
  ArrowRight,
  Star,
  Heart,
  Plus
} from 'lucide-react';

// --- Types ---
type Section = 'about' | 'works' | 'resume' | 'contact' | 'project-detail' | null;

interface Project {
  id: number;
  title: string;
  desc: string;
  longDesc: string;
  img: string;
  tags: string[];
}

// --- Mini Games ---

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [dir, setDir] = useState({ x: 0, y: -1 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (gameOver) return;
    const move = setInterval(() => {
      setSnake(prev => {
        const head = { x: prev[0].x + dir.x, y: prev[0].y + dir.y };
        if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 15 || prev.some(s => s.x === head.x && s.y === head.y)) {
          setGameOver(true);
          return prev;
        }
        const newSnake = [head, ...prev];
        if (head.x === food.x && head.y === food.y) {
          setScore(s => s + 10);
          setFood({ x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 15) });
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 150);
    return () => clearInterval(move);
  }, [dir, food, gameOver]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && dir.y === 0) setDir({ x: 0, y: -1 });
      if (e.key === 'ArrowDown' && dir.y === 0) setDir({ x: 0, y: 1 });
      if (e.key === 'ArrowLeft' && dir.x === 0) setDir({ x: -1, y: 0 });
      if (e.key === 'ArrowRight' && dir.x === 0) setDir({ x: 1, y: 0 });
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [dir]);

  return (
    <div className="w-full h-full bg-black flex flex-col items-center justify-center p-2">
      <div className="text-[8px] mb-1">SCORE: {score}</div>
      <div 
        className="relative w-[160px] h-[120px] border border-white/20 grid"
        style={{ 
          gridTemplateColumns: 'repeat(20, 1fr)', 
          gridTemplateRows: 'repeat(15, 1fr)' 
        }}
      >
        {snake.map((s, i) => (
          <div key={i} className="bg-green-400 border-[0.5px] border-black" style={{ gridColumnStart: s.x + 1, gridRowStart: s.y + 1 }} />
        ))}
        <div className="bg-red-500 animate-pulse" style={{ gridColumnStart: food.x + 1, gridRowStart: food.y + 1 }} />
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
            <div className="text-red-500 text-[10px] font-bold">GAME OVER</div>
            <button onClick={() => { setSnake([{ x: 10, y: 10 }]); setGameOver(false); setScore(0); }} className="text-[8px] mt-2 underline">RESTART</button>
          </div>
        )}
      </div>
      <div className="text-[6px] mt-1 opacity-50">USE ARROW KEYS</div>
    </div>
  );
};

const MatrixEffect = () => {
  const [columns, setColumns] = useState<string[]>([]);
  
  useEffect(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~";
    const colCount = 20;
    const interval = setInterval(() => {
      setColumns(prev => {
        const newCols = [...prev];
        for (let i = 0; i < colCount; i++) {
          if (!newCols[i] || Math.random() > 0.95) {
            newCols[i] = chars[Math.floor(Math.random() * chars.length)];
          } else {
            newCols[i] = chars[Math.floor(Math.random() * chars.length)] + newCols[i].slice(0, 10);
          }
        }
        return newCols;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full bg-black flex justify-around overflow-hidden p-1">
      {columns.map((col, i) => (
        <div key={i} className="text-green-500 text-[6px] leading-none break-all opacity-80">
          {col.split('').map((char, j) => (
            <div key={j} style={{ opacity: 1 - j * 0.1 }}>{char}</div>
          ))}
        </div>
      ))}
    </div>
  );
};

const PongGame = () => {
  const [ball, setBall] = useState({ x: 50, y: 50, dx: 2, dy: 2 });
  const [paddle, setPaddle] = useState(40);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const move = setInterval(() => {
      setBall(prev => {
        let { x, y, dx, dy } = prev;
        x += dx;
        y += dy;

        if (y <= 0 || y >= 95) dy *= -1;
        if (x <= 5) {
          if (y >= paddle && y <= paddle + 25) {
            dx *= -1.1;
            setScore(s => s + 1);
          } else {
            x = 50; y = 50; dx = 2; dy = 2;
            setScore(0);
          }
        }
        if (x >= 95) dx *= -1;

        return { x, y, dx, dy };
      });
    }, 30);
    return () => clearInterval(move);
  }, [paddle]);

  useEffect(() => {
    const handleMove = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') setPaddle(p => Math.max(0, p - 10));
      if (e.key === 'ArrowDown') setPaddle(p => Math.min(75, p + 10));
    };
    window.addEventListener('keydown', handleMove);
    return () => window.removeEventListener('keydown', handleMove);
  }, []);

  return (
    <div className="w-full h-full bg-black relative overflow-hidden">
      <div className="absolute top-2 right-2 text-[8px]">SCORE: {score}</div>
      <div className="absolute bg-white w-1 h-1 rounded-full" style={{ left: `${ball.x}%`, top: `${ball.y}%` }} />
      <div className="absolute bg-white w-1 h-[25%] left-1" style={{ top: `${paddle}%` }} />
      <div className="absolute bg-white/20 w-1 h-full right-0" />
    </div>
  );
};

// --- Components ---

const RetroWindow = ({ title, onClose, children }: { title: string, onClose: () => void, children: React.ReactNode }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      onClick={onClose}
    >
      <div 
        className="bg-beige-light border-2 border-ink-black shadow-[12px_12px_0px_0px_rgba(15,15,15,1)] w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title Bar */}
        <div className="bg-ink-black text-beige-light px-4 py-3 flex justify-between items-center cursor-default">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="font-mono text-sm tracking-wider uppercase ml-2">{title}</span>
          </div>
          <button 
            onClick={onClose}
            className="hover:bg-red-600 p-1 transition-colors rounded"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar bg-beige-light">
          {children}
        </div>
      </div>
    </motion.div>
  );
};

const Typewriter = ({ text, speed = 50, delay = 0 }: { text: string, speed?: number, delay?: number }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let i = 0;
    const timeout = setTimeout(() => {
      const timer = setInterval(() => {
        setDisplayedText(text.slice(0, i));
        i++;
        if (i > text.length) clearInterval(timer);
      }, speed);
      return () => clearInterval(timer);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  return (
    <span className="font-mono">
      {displayedText}
      {displayedText.length < text.length && (
        <span className="animate-pulse inline-block w-2 h-4 bg-current ml-1 align-middle" />
      )}
    </span>
  );
};

const GlitchText = ({ text }: { text: string }) => {
  return (
    <div className="relative inline-block group">
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -z-10 text-red-500 translate-x-[2px] opacity-0 group-hover:opacity-70 group-hover:animate-pulse transition-opacity">{text}</span>
      <span className="absolute top-0 left-0 -z-20 text-blue-500 -translate-x-[2px] opacity-0 group-hover:opacity-70 group-hover:animate-pulse transition-opacity">{text}</span>
    </div>
  );
};

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isBooted, setIsBooted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsBooted(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const [currentSection, setCurrentSection] = useState('home');
  const isDarkSection = currentSection === 'about' || currentSection === 'contact';

  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = ['home', 'about', 'works', 'resume', 'contact'];
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setCurrentSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [insertedDisc, setInsertedDisc] = useState<string | null>(null);
  const [showSubBtn, setShowSubBtn] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const discSlotRef = useRef<HTMLDivElement>(null);

  const handleTitleClick = (e: React.MouseEvent) => {
    const newHeart = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY
    };
    setHearts(prev => [...prev, newHeart]);
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 1000);
  };

  const handleDragEnd = (id: string, info: any) => {
    if (!discSlotRef.current) return;
    const slotRect = discSlotRef.current.getBoundingClientRect();
    const dropX = info.point.x;
    const dropY = info.point.y;

    const padding = 80; // Increased padding for much easier detection
    if (
      dropX >= slotRect.left - padding && 
      dropX <= slotRect.right + padding && 
      dropY >= slotRect.top - padding && 
      dropY <= slotRect.bottom + padding
    ) {
      setInsertedDisc(id);
    }
  };

  const projects: Project[] = [
    { 
      id: 1, 
      title: "Project Echo", 
      desc: "Minimalist writing environment.", 
      longDesc: "Project Echo is a distraction-free writing tool designed for authors who value focus. It features a custom markdown engine, cloud sync with version history, and a unique 'Typewriter Mode' that keeps the active line centered. Built with React and Electron for a seamless cross-platform experience.",
      img: "nature", 
      tags: ["React", "Node.js", "Electron"] 
    },
    { 
      id: 2, 
      title: "Vapor UI", 
      desc: "Design system for the nostalgic.", 
      longDesc: "Vapor UI is a comprehensive component library that brings the aesthetic of 90s operating systems to the modern web. It includes over 50 components, from pixel-perfect buttons to window managers, all fully accessible and themeable. Used by over 500 developers worldwide.",
      img: "tech", 
      tags: ["TypeScript", "Tailwind", "Storybook"] 
    },
    { 
      id: 3, 
      title: "Neural Draft", 
      desc: "AI-powered drafting assistant.", 
      longDesc: "Neural Draft leverages large language models to help architects and designers generate initial floor plans and structural concepts. It uses a custom-trained model to understand spatial constraints and aesthetic preferences, reducing early-stage design time by 60%.",
      img: "abstract", 
      tags: ["Python", "PyTorch", "Next.js"] 
    },
    { 
      id: 4, 
      title: "Grid System", 
      desc: "Layout engine for complex data.", 
      longDesc: "A high-performance data visualization engine capable of rendering millions of data points in real-time. It uses WebGL for hardware acceleration and provides a declarative API for building complex dashboards. Perfect for financial and scientific applications.",
      img: "city", 
      tags: ["WebGL", "D3.js", "Rust"] 
    }
  ];

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setActiveSection('project-detail');
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sections = {
    about: {
      title: "System Info / About Me",
      content: (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-32 h-32 bg-beige-dark border-2 border-ink-black flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-500 rounded-2xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(15,15,15,1)]">
              <img 
                src="https://picsum.photos/seed/avatar/200/200" 
                alt="Profile" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-bold tracking-tight">Creative Technologist</h3>
              <p className="text-lg leading-relaxed">
                Hello! I'm a designer and developer based in the digital ether. I specialize in building interfaces that feel human, tactile, and perhaps a bit nostalgic.
              </p>
              <p className="text-lg leading-relaxed">
                My work sits at the intersection of aesthetic storytelling and functional engineering. I believe the best tools are the ones that disappear into the background while you're using them.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-ink-black/10">
            <div>
              <h4 className="font-mono text-sm uppercase opacity-60">Core Stack</h4>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>React / Next.js</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>Framer Motion</li>
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-sm uppercase opacity-60">Interests</h4>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Retro Computing</li>
                <li>Generative Art</li>
                <li>UX Psychology</li>
                <li>Typography</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    resume: {
      title: "Write / Experience",
      content: (
        <div className="space-y-8">
          {[
            { year: "2023 - Present", role: "Senior Product Designer", company: "Future Labs", desc: "Leading the design of next-generation collaborative tools." },
            { year: "2020 - 2023", role: "UX Developer", company: "Retro Studio", desc: "Bridging the gap between design and engineering for high-fidelity prototypes." },
            { year: "2018 - 2020", role: "Junior Designer", company: "Creative Agency", desc: "Crafting visual identities and digital experiences for global brands." }
          ].map((job, i) => (
            <div key={i} className="relative pl-8 border-l-2 border-ink-black">
              <div className="absolute -left-[9px] top-0 w-4 h-4 bg-ink-black rounded-full" />
              <span className="font-mono text-sm opacity-60">{job.year}</span>
              <h4 className="text-2xl font-bold mt-1">{job.role}</h4>
              <div className="text-lg font-medium italic mb-2">{job.company}</div>
              <p className="opacity-80">{job.desc}</p>
            </div>
          ))}
        </div>
      )
    },
    contact: {
      title: "Think / Contact",
      content: (
        <div className="space-y-8">
          <p className="text-xl">
            I'm always open to new projects, collaborations, or just a friendly chat about the future of the web.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="mailto:hello@example.com" className="flex items-center gap-4 p-4 border-2 border-ink-black hover:bg-ink-black hover:text-beige-light transition-all group">
              <Mail className="group-hover:scale-110 transition-transform" />
              <div>
                <div className="font-mono text-xs uppercase opacity-60">Email</div>
                <div className="font-bold">hello@portfolio.com</div>
              </div>
            </a>
            <div className="flex items-center gap-4 p-4 border-2 border-ink-black">
              <Terminal />
              <div>
                <div className="font-mono text-xs uppercase opacity-60">Location</div>
                <div className="font-bold">Digital Nomad / UTC+8</div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-8 pt-6">
            <Github className="cursor-pointer hover:scale-125 transition-transform" />
            <Twitter className="cursor-pointer hover:scale-125 transition-transform" />
            <Linkedin className="cursor-pointer hover:scale-125 transition-transform" />
          </div>
        </div>
      )
    },
    works: {
      title: "Disk A / Portfolio",
      content: null // Not used directly as works has its own detail modal
    }
  };

  return (
    <div className="bg-[#f4f1e6] selection:bg-ink-black selection:text-beige-light relative w-full">
      
      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-ink-black z-[110] origin-left"
        style={{ scaleX }}
      />

      {/* Right Side Navigation Progress */}
      <nav className={`fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center gap-6 transition-colors duration-500 ${isDarkSection ? 'text-beige-light' : 'text-ink-black'}`}>
        <div className={`relative h-64 w-px ${isDarkSection ? 'bg-beige-light/20' : 'bg-ink-black/10'}`}>
          <motion.div 
            className={`absolute top-0 left-0 w-full origin-top ${isDarkSection ? 'bg-beige-light' : 'bg-ink-black'}`}
            style={{ height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
          />
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full flex flex-col justify-between py-2">
            {[
              { id: 'home', label: 'Home' },
              { id: 'about', label: 'About' },
              { id: 'works', label: 'Works' },
              { id: 'resume', label: 'Resume' },
              { id: 'contact', label: 'Contact' }
            ].map((section) => (
              <motion.button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="group relative flex items-center justify-center"
                whileHover="hover"
              >
                <div className={`w-2 h-2 rounded-full transition-all border border-transparent z-10 ${
                  currentSection === section.id 
                    ? (isDarkSection ? 'bg-beige-light scale-150 shadow-[0_0_8px_rgba(245,242,237,0.4)]' : 'bg-ink-black scale-150 shadow-[0_0_8px_rgba(15,15,15,0.4)]')
                    : (isDarkSection ? 'bg-beige-light/20 group-hover:bg-beige-light group-hover:scale-150' : 'bg-ink-black/20 group-hover:bg-ink-black group-hover:scale-150')
                }`} />
                <motion.span
                  variants={{
                    hover: { opacity: 1, x: -20, scale: 1 },
                  }}
                  initial={{ opacity: 0, x: 0, scale: 0.8 }}
                  className={`absolute right-6 px-2 py-1 text-[10px] uppercase tracking-widest font-mono whitespace-nowrap pointer-events-none rounded-sm shadow-lg ${
                    isDarkSection ? 'bg-beige-light text-ink-black' : 'bg-ink-black text-beige-light'
                  }`}
                >
                  {section.label}
                </motion.span>
              </motion.button>
            ))}
          </div>
        </div>
        <div className="[writing-mode:vertical-rl] text-[10px] uppercase tracking-[0.4em] font-bold opacity-20 select-none">
          Scroll Progress
        </div>
      </nav>

      {/* Fixed Back to Home Button */}
      <AnimatePresence>
        {currentSection !== 'home' && (
          <motion.button
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            onClick={() => scrollToSection('home')}
            className={`fixed bottom-8 right-8 z-[60] p-4 rounded-full shadow-2xl transition-all duration-500 group flex items-center gap-2 ${
              isDarkSection ? 'bg-beige-light text-ink-black hover:bg-white' : 'bg-ink-black text-beige-light hover:bg-black'
            }`}
          >
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-mono text-xs uppercase tracking-widest whitespace-nowrap">
              Back to Top
            </span>
            <ArrowRight className="-rotate-90" size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* --- HERO SECTION --- */}
      <section id="home" className="min-h-screen w-full flex flex-col lg:flex-row items-center justify-center p-8 lg:p-16 gap-12 lg:gap-24 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
          <div className="absolute top-10 left-10 text-9xl font-bold font-mono">01</div>
          <div className="absolute bottom-10 right-10 text-9xl font-bold font-mono">84</div>
        </div>

        {/* Hearts Overlay */}
        <AnimatePresence>
          {hearts.map(heart => (
            <motion.div
              key={heart.id}
              initial={{ opacity: 1, scale: 0, y: 0 }}
              animate={{ opacity: 0, scale: 2, y: -100 }}
              exit={{ opacity: 0 }}
              style={{ 
                position: 'fixed', 
                left: heart.x, 
                top: heart.y, 
                zIndex: 100,
                pointerEvents: 'none'
              }}
            >
              <Heart fill="red" color="red" size={32} />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Left Content: Intro */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex-1 z-10 max-w-xl"
        >
          <div className="flex items-center gap-4 mb-6">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowStats(true)}
              className="w-16 h-16 rounded-full border-2 border-ink-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(15,15,15,1)] bg-beige-dark cursor-pointer group relative"
            >
              <img 
                src="https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAESA-9pwAABF8fJdPJbTS7FPE0nONRgr8IAAh8rAAIi3gABVoaCudG7GTGOOgQ.png" 
                alt="Avatar" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-ink-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-[8px] text-white font-mono font-bold">STATS</span>
              </div>
            </motion.div>
            <div className="inline-block px-3 py-1 bg-ink-black text-beige-light font-mono text-xs uppercase tracking-widest">
              Portfolio v1.0.4
            </div>
          </div>
          <div className="relative">
            <motion.div
              onMouseEnter={() => setShowSubBtn(true)}
              onMouseLeave={() => setShowSubBtn(false)}
              onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
              onClick={handleTitleClick}
              className="cursor-pointer"
            >
              <h1 className="text-6xl lg:text-8xl font-medium leading-[1.1] tracking-tighter mb-8 select-none">
                <span>Lie Ma WEN</span>
                <span className="italic block ml-[-4px]">劣马温</span>
              </h1>
            </motion.div>
            
            <AnimatePresence>
              {showSubBtn && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  style={{ 
                    position: 'fixed', 
                    left: mousePos.x + 20, 
                    top: mousePos.y + 20,
                    zIndex: 100,
                    pointerEvents: 'none'
                  }}
                  className="px-4 py-2 bg-red-600 text-white font-bold rounded-full shadow-lg flex items-center gap-2 border-2 border-white/20"
                >
                  <Plus size={20} strokeWidth={3} /> Subscribe
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          <p className="text-xl lg:text-2xl leading-tight mb-12 opacity-80 max-w-md">
            This is my personal webpage introduction. Welcome to visit!
          </p>
          
          <div className="flex flex-wrap gap-4 items-center">
            <button 
              onClick={() => scrollToSection('contact')}
              className="px-8 py-4 bg-ink-black text-beige-light text-xl font-medium rounded-lg border-2 border-ink-black hover:bg-transparent hover:text-ink-black transition-all active:scale-95"
            >
              Get in Touch
            </button>
            <div className="font-mono text-lg font-bold tracking-tight">
              EST. 1992
            </div>
          </div>

          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-16 flex items-center gap-4 opacity-30"
          >
            <ChevronDown size={24} />
            <span className="font-mono text-xs uppercase tracking-widest">Scroll to explore</span>
          </motion.div>
        </motion.div>

        {/* Right Content: 3D Computer */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotateY: 15 }}
          whileInView={{ opacity: 1, scale: 1, rotateY: 10 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex-1 flex items-center justify-center perspective-[2000px] h-[600px] w-full max-w-[500px]"
        >
          <div className="relative transform-style-3d rotate-x-[5deg] group">
            {/* Computer Unit */}
            <div className="relative w-[360px] h-[440px] transform-style-3d transition-transform duration-700 group-hover:rotate-y-[-20deg]">
              {/* Front Face */}
              <div className="absolute inset-0 translate-z-[100px] bg-gradient-to-br from-beige-light to-beige-main border border-black/5 shadow-[inset_2px_2px_5px_rgba(255,255,255,0.8),inset_-5px_-5px_15px_rgba(0,0,0,0.1)] flex flex-col items-center pt-10 rounded-sm">
                {/* Screen Inset */}
                <div className="w-[280px] h-[220px] bg-[#D1CEC7] rounded-2xl shadow-[inset_2px_2px_8px_rgba(0,0,0,0.2),inset_-2px_-2px_8px_rgba(255,255,255,0.5)] flex items-center justify-center mb-8 relative overflow-hidden">
                  {/* CRT Screen */}
                  <div className="w-[260px] h-[200px] bg-screen-black rounded-[40%_40%_40%_40%_/_10%_10%_10%_10%] relative overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,1)] crt-overlay">
                    <div className="absolute inset-0 p-4 font-mono text-xs text-white z-10 flex">
                      {!isBooted ? (
                        <div className="flex flex-col items-center justify-center w-full h-full space-y-2">
                          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                          <div className="animate-pulse">BOOTING...</div>
                        </div>
                      ) : insertedDisc ? (
                        <div className="w-full h-full flex flex-col relative">
                          <div className="flex justify-between items-center border-b border-white/20 pb-1 mb-2">
                            <span className="text-[8px] uppercase">{insertedDisc} v1.0</span>
                            <button 
                              onClick={() => setInsertedDisc(null)}
                              className="text-[8px] hover:text-red-400"
                            >
                              [EJECT]
                            </button>
                          </div>
                          <div className="flex-1 bg-black/40 rounded overflow-hidden relative">
                            {insertedDisc === 'snake' && <SnakeGame />}
                            {insertedDisc === 'matrix' && <MatrixEffect />}
                            {insertedDisc === 'pong' && <PongGame />}
                          </div>
                        </div>
                      ) : (
                        <div className="flex w-full h-full">
                          <div className="w-[30%] border-r border-white/20 pr-2 space-y-3">
                            <div className="w-full aspect-square bg-white/10 rounded-sm overflow-hidden mb-2 border border-white/20 flex items-center justify-center">
                              <User size={32} className="text-white/40" />
                            </div>
                            <button onClick={() => scrollToSection('about')} className="flex items-center gap-1 hover:text-blue-400 transition-colors w-full text-left">
                              <div className="w-2 h-2 rounded-full bg-blue-400" /> System
                            </button>
                            <button onClick={() => scrollToSection('works')} className="flex items-center gap-1 hover:text-orange-400 transition-colors w-full text-left">
                              <div className="w-2 h-2 rounded-full bg-orange-400" /> Disk A
                            </button>
                            <button onClick={() => scrollToSection('resume')} className="flex items-center gap-1 hover:text-zinc-400 transition-colors w-full text-left">
                              <div className="w-2 h-2 rounded-full bg-zinc-400" /> Trash
                            </button>
                            <button onClick={() => scrollToSection('contact')} className="flex items-center gap-1 hover:text-green-400 transition-colors w-full text-left">
                              <div className="w-2 h-2 rounded-full bg-green-400" /> Write
                            </button>
                            <button onClick={() => scrollToSection('contact')} className="flex items-center gap-1 hover:text-purple-400 transition-colors w-full text-left">
                              <div className="w-2 h-2 rounded-full bg-purple-400" /> Think
                            </button>
                          </div>
                          <div className="flex-1 pl-3 flex flex-col">
                            <div className="opacity-50 text-[8px] mb-2 uppercase">FigOS 1.0</div>
                            <div className="bg-white text-black p-2 rounded-sm shadow-[2px_2px_0_rgba(0,0,0,0.5)] flex-1 overflow-hidden">
                              <div className="border-b border-dotted border-black mb-2 text-[8px] font-bold flex justify-between">
                                <span>Untitled.txt</span>
                                <span>[x]</span>
                              </div>
                              <div className="text-[10px] leading-tight">
                                <Typewriter text="Good morning. Your memo is drafted, your files are sorted, and your calendar is set. Ready when you are." speed={40} />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none z-20" />
                  </div>
                </div>

                {/* Disc Slot */}
                <div 
                  ref={discSlotRef}
                  className={`w-[160px] h-4 bg-[#1a1a1a] rounded-full shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] relative transition-colors duration-300 ${insertedDisc ? 'bg-green-900' : ''}`} 
                >
                  {insertedDisc && (
                    <motion.div 
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      className="absolute inset-0 bg-green-500/20 rounded-full"
                    />
                  )}
                </div>

                {/* Stickers */}
                <div className="absolute bottom-6 left-6 flex flex-col gap-2 pointer-events-none">
                  <div className="flex gap-2 items-end">
                    <div className="w-10 h-10 rounded-full bg-[#B3592D] shadow-sm rotate-[-15deg]" />
                    <div className="w-12 h-12 bg-white rounded-md shadow-md flex items-center justify-center rotate-[10deg] -ml-4 mb-2">
                      <Star size={20} className="text-blue-600 fill-blue-600" />
                    </div>
                  </div>
                  <div className="bg-[#8B0000] px-2 py-1 shadow-sm rotate-[-5deg] border border-black/10">
                    <div className="text-[6px] font-black text-[#FFD700] leading-none tracking-tighter uppercase">Machine<br/>Intelligence</div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setInsertedDisc(null); }}
                    className="w-6 h-8 rounded-full bg-gradient-to-b from-red-500 via-yellow-500 via-green-500 via-blue-500 shadow-inner cursor-pointer hover:brightness-110 active:scale-95 transition-all z-30 pointer-events-auto" 
                    title="Reset System"
                  />
                </div>

                {/* Vent */}
                <div className="absolute bottom-6 right-6 grid grid-cols-3 gap-1 opacity-20">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 bg-black rounded-sm" />
                  ))}
                </div>
              </div>

              {/* Retro Apple Keyboard */}
              <div className="absolute bottom-[-100px] left-[-60px] w-[480px] h-[140px] bg-[#E5E0D8] border-2 border-black/10 rounded-lg shadow-2xl transform-style-3d rotate-x-[65deg] translate-z-[180px] flex flex-col p-3">
                {/* Keyboard Body Detail */}
                <div className="absolute inset-0 border-t-4 border-white/40 rounded-lg pointer-events-none" />
                
                {/* Branding */}
                <div className="flex justify-between items-center mb-2 px-1">
                  <div className="flex gap-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  </div>
                  <div className="text-[6px] font-mono opacity-30 tracking-tighter uppercase">Apple Extended Keyboard II</div>
                </div>

                {/* Keys Layout */}
                <div className="flex flex-col gap-1.5 flex-1">
                  {/* Row 1: Function Keys */}
                  <div className="flex gap-1 h-3">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <div key={i} className="flex-1 bg-[#F5F2ED] border-b-2 border-[#C8C2B7] rounded-sm shadow-sm" />
                    ))}
                  </div>
                  {/* Row 2: Numbers */}
                  <div className="flex gap-1 h-4">
                    {Array.from({ length: 14 }).map((_, i) => (
                      <div key={i} className="flex-1 bg-[#F5F2ED] border-b-2 border-[#C8C2B7] rounded-sm shadow-sm" />
                    ))}
                  </div>
                  {/* Row 3: QWERTY */}
                  <div className="flex gap-1 h-4">
                    <div className="w-8 bg-[#F5F2ED] border-b-2 border-[#C8C2B7] rounded-sm shadow-sm" />
                    {Array.from({ length: 13 }).map((_, i) => (
                      <div key={i} className="flex-1 bg-[#F5F2ED] border-b-2 border-[#C8C2B7] rounded-sm shadow-sm" />
                    ))}
                  </div>
                  {/* Row 4: ASDF */}
                  <div className="flex gap-1 h-4">
                    <div className="w-10 bg-[#F5F2ED] border-b-2 border-[#C8C2B7] rounded-sm shadow-sm" />
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="flex-1 bg-[#F5F2ED] border-b-2 border-[#C8C2B7] rounded-sm shadow-sm" />
                    ))}
                  </div>
                  {/* Row 5: ZXCV */}
                  <div className="flex gap-1 h-4">
                    <div className="w-12 bg-[#F5F2ED] border-b-2 border-[#C8C2B7] rounded-sm shadow-sm" />
                    {Array.from({ length: 11 }).map((_, i) => (
                      <div key={i} className="flex-1 bg-[#F5F2ED] border-b-2 border-[#C8C2B7] rounded-sm shadow-sm" />
                    ))}
                  </div>
                  {/* Row 6: Spacebar */}
                  <div className="flex gap-1 h-4">
                    <div className="w-8 bg-[#F5F2ED] border-b-2 border-[#C8C2B7] rounded-sm shadow-sm" />
                    <div className="w-6 bg-[#F5F2ED] border-b-2 border-[#C8C2B7] rounded-sm shadow-sm" />
                    <div className="w-8 bg-[#F5F2ED] border-b-2 border-[#C8C2B7] rounded-sm shadow-sm" />
                    <div className="flex-1 bg-[#F5F2ED] border-b-2 border-[#C8C2B7] rounded-sm shadow-sm" />
                    <div className="w-8 bg-[#F5F2ED] border-b-2 border-[#C8C2B7] rounded-sm shadow-sm" />
                    <div className="w-6 bg-[#F5F2ED] border-b-2 border-[#C8C2B7] rounded-sm shadow-sm" />
                    <div className="w-8 bg-[#F5F2ED] border-b-2 border-[#C8C2B7] rounded-sm shadow-sm" />
                  </div>
                </div>
              </div>

              {/* Disc Rack */}
              <div className="absolute -right-32 bottom-0 flex flex-col gap-3 z-[200] translate-z-[300px]">
                <div className="text-[8px] font-mono uppercase opacity-40 mb-2 text-center -rotate-90 origin-bottom-right translate-x-[-10px] tracking-widest">
                  Drag to Insert
                </div>
                {[
                  { 
                    id: 'snake', 
                    color: 'bg-emerald-500', 
                    label: 'SNAKE.EXE',
                    icon: (
                      <div className="grid grid-cols-3 grid-rows-3 gap-0.5 w-4 h-4">
                        <div className="bg-white/20" /><div className="bg-white/80" /><div className="bg-white/20" />
                        <div className="bg-white/20" /><div className="bg-white/80" /><div className="bg-white/80" />
                        <div className="bg-white/20" /><div className="bg-white/20" /><div className="bg-white/20" />
                      </div>
                    )
                  },
                  { 
                    id: 'matrix', 
                    color: 'bg-zinc-800', 
                    label: 'MATRIX.SYS',
                    icon: (
                      <div className="flex flex-col gap-0.5 w-4 h-4 items-center">
                        <div className="w-full h-1 bg-green-500/40" />
                        <div className="w-full h-1 bg-green-500/80" />
                        <div className="w-full h-1 bg-green-500/20" />
                      </div>
                    )
                  },
                  { 
                    id: 'pong', 
                    color: 'bg-blue-500', 
                    label: 'PONG.COM',
                    icon: (
                      <div className="relative w-4 h-4 border border-white/20">
                        <div className="absolute left-0 top-1 w-1 h-2 bg-white" />
                        <div className="absolute right-0 top-3 w-1 h-2 bg-white" />
                        <div className="absolute left-1.5 top-1.5 w-1 h-1 bg-white rounded-full" />
                      </div>
                    )
                  }
                ].map((disc) => (
                  <motion.div
                    key={disc.id}
                    drag
                    dragSnapToOrigin
                    onDragEnd={(e, info) => handleDragEnd(disc.id, info)}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileDrag={{ scale: 1.2, zIndex: 300 }}
                    className={`w-14 h-14 rounded-full ${disc.color} border-4 border-black/20 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing shadow-lg relative group`}
                  >
                    <div className="w-3 h-3 rounded-full bg-white/30 border border-black/10 mb-0.5" />
                    <div className="scale-50 origin-center opacity-60">
                      {disc.icon}
                    </div>
                    <div className="absolute -right-20 top-1/2 -translate-y-1/2 bg-ink-black text-beige-light text-[8px] px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-mono">
                      {disc.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Other Faces */}
              <div className="absolute w-[200px] h-[440px] -rotate-y-90 translate-x-[-100px] translate-z-[0px] bg-beige-main shadow-inner" />
              <div className="absolute w-[200px] h-[440px] rotate-y-90 translate-x-[260px] translate-z-[0px] bg-beige-dark shadow-inner" />
              <div className="absolute w-[360px] h-[200px] -rotate-x-90 translate-y-[-100px] translate-z-[0px] bg-beige-light" />
              <div className="absolute w-[360px] h-[200px] rotate-x-90 translate-y-[340px] translate-z-[0px] bg-beige-shadow shadow-2xl" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Character Stats Modal */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink-black/80 backdrop-blur-sm"
            onClick={() => setShowStats(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-beige-main border-4 border-ink-black shadow-[12px_12px_0px_0px_rgba(15,15,15,1)] overflow-hidden relative"
            >
              {/* Header */}
              <div className="bg-ink-black text-beige-light p-4 flex justify-between items-center border-b-4 border-ink-black">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <h3 className="font-mono text-xl font-bold tracking-tighter uppercase">Character Status</h3>
                </div>
                <button 
                  onClick={() => setShowStats(false)}
                  className="hover:text-red-400 transition-colors font-mono font-bold"
                >
                  [CLOSE]
                </button>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Left Side: Portrait & Basic Info */}
                <div className="space-y-8">
                  <div className="relative aspect-square bg-beige-dark border-4 border-ink-black shadow-[8px_8px_0px_0px_rgba(15,15,15,0.2)] overflow-hidden group">
                    <img 
                      src="https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAESA-9pwAABF8fJdPJbTS7FPE0nONRgr8IAAh8rAAIi3gABVoaCudG7GTGOOgQ.png" 
                      alt="Portrait" 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-red-600 text-white font-mono text-[10px] font-bold">LV. 95+</div>
                  </div>

                  <div className="space-y-4 font-mono">
                    <div className="flex justify-between border-b-2 border-ink-black/10 pb-1">
                      <span className="opacity-50 uppercase text-xs">Name</span>
                      <span className="font-bold">Lie Ma WEN</span>
                    </div>
                    <div className="flex justify-between border-b-2 border-ink-black/10 pb-1">
                      <span className="opacity-50 uppercase text-xs">Class</span>
                      <span className="font-bold">Creative Technologist</span>
                    </div>
                    <div className="flex justify-between border-b-2 border-ink-black/10 pb-1">
                      <span className="opacity-50 uppercase text-xs">Height</span>
                      <span className="font-bold">178 cm</span>
                    </div>
                    <div className="flex justify-between border-b-2 border-ink-black/10 pb-1">
                      <span className="opacity-50 uppercase text-xs">Generation</span>
                      <span className="font-bold">95后 (Post-95s)</span>
                    </div>
                    <div className="flex justify-between border-b-2 border-ink-black/10 pb-1">
                      <span className="opacity-50 uppercase text-xs">Status</span>
                      <span className="font-bold text-green-600">ACTIVE</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Skills & Attributes */}
                <div className="space-y-8">
                  <div className="space-y-6">
                    <h4 className="font-mono text-sm font-bold uppercase tracking-widest border-l-4 border-red-600 pl-3">Skill Points</h4>
                    
                    {[
                      { name: "Design", value: 95, color: "bg-blue-500" },
                      { name: "Code", value: 90, color: "bg-emerald-500" },
                      { name: "Nostalgia", value: 100, color: "bg-orange-500" },
                      { name: "Coffee", value: 85, color: "bg-amber-800" },
                      { name: "Pixel Perfect", value: 92, color: "bg-purple-500" }
                    ].map((skill) => (
                      <div key={skill.name} className="space-y-2">
                        <div className="flex justify-between font-mono text-[10px] uppercase font-bold">
                          <span>{skill.name}</span>
                          <span>{skill.value}%</span>
                        </div>
                        <div className="h-3 bg-beige-dark border-2 border-ink-black p-[2px]">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.value}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className={`h-full ${skill.color}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-beige-dark border-2 border-ink-black font-mono text-[10px] leading-relaxed italic opacity-80">
                    "A rare specimen that thrives in the intersection of legacy hardware and modern frameworks. High resistance to bugs, but vulnerable to low caffeine levels."
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1 h-8 bg-ink-black text-beige-light flex items-center justify-center font-mono text-[10px] uppercase font-bold tracking-widest">
                      Equip Item
                    </div>
                    <div className="w-8 h-8 border-2 border-ink-black flex items-center justify-center">
                      <Cpu size={14} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Decoration */}
              <div className="h-2 bg-ink-black flex">
                <div className="flex-1 bg-red-600" />
                <div className="flex-1 bg-orange-500" />
                <div className="flex-1 bg-yellow-500" />
                <div className="flex-1 bg-green-500" />
                <div className="flex-1 bg-blue-500" />
                <div className="flex-1 bg-purple-500" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- ABOUT SECTION (Brutalist) --- */}
      <section id="about" className="min-h-screen w-full flex items-center justify-center p-8 lg:p-24 bg-ink-black text-beige-light relative">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-12"
          >
            <div className="flex items-center gap-4">
              <div className="text-8xl font-bold font-mono opacity-20">01</div>
              <h2 className="text-5xl lg:text-7xl font-bold uppercase tracking-tighter">
                System <br/> <span className="italic font-serif normal-case tracking-normal">Diagnostics</span>
              </h2>
            </div>
            <p className="text-2xl lg:text-3xl leading-snug font-light opacity-80">
              I am a <GlitchText text="Creative Technologist" /> based in the intersection of design and code. My mission is to build digital experiences that feel as tactile as physical hardware.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-beige-light/20">
              <div className="space-y-4">
                <h4 className="font-mono text-xs uppercase tracking-[0.3em] opacity-50">Core Stack</h4>
                <ul className="list-disc list-inside mt-2 space-y-1 text-lg opacity-80">
                  <li>React / Next.js</li>
                  <li>TypeScript</li>
                  <li>Tailwind CSS</li>
                  <li>Framer Motion</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-mono text-xs uppercase tracking-[0.3em] opacity-50">Interests</h4>
                <ul className="list-disc list-inside mt-2 space-y-1 text-lg opacity-80">
                  <li>Retro Computing</li>
                  <li>Generative Art</li>
                  <li>UX Psychology</li>
                  <li>Typography</li>
                </ul>
              </div>
            </div>
            <button 
              onClick={() => scrollToSection('home')}
              className="group flex items-center gap-4 text-xl font-bold uppercase tracking-widest hover:text-transparent bg-clip-text hover:bg-gradient-to-r hover:from-blue-400 hover:via-purple-400 hover:to-orange-400 transition-all duration-300 pt-8"
            >
              Back to Home <ArrowRight className="group-hover:-translate-y-2 -rotate-90 transition-transform group-hover:text-orange-400" />
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            viewport={{ once: true }}
            className="relative aspect-square bg-beige-dark overflow-hidden border-4 border-beige-light/10 group/profile cursor-crosshair"
          >
            <img 
              src="https://picsum.photos/seed/tech-profile/800/800" 
              alt="Profile" 
              className="w-full h-full object-cover grayscale mix-blend-multiply opacity-80 group-hover/profile:grayscale-0 group-hover/profile:opacity-100 group-hover/profile:mix-blend-normal transition-all duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-black to-transparent opacity-60 group-hover/profile:opacity-20 transition-opacity" />
            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
              <div className="font-mono text-xs space-y-1">
                <div>MODEL: HUMAN_V1.0</div>
                <div>STATUS: ACTIVE</div>
                <div>LOC: EARTH_ORBIT</div>
              </div>
              <Cpu size={48} className="opacity-50 group-hover/profile:opacity-100 group-hover/profile:text-blue-400 transition-all" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- WORKS SECTION (Technical Grid) --- */}
      <section id="works" className="min-h-screen w-full p-8 lg:p-24 flex flex-col items-center">
        <div className="max-w-7xl w-full">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
            <div className="space-y-4">
              <div className="font-mono text-xs uppercase tracking-[0.4em] opacity-50">Disk A / Archive</div>
              <h2 className="text-6xl lg:text-8xl font-bold tracking-tighter uppercase">Selected <br/> <span className="italic font-serif normal-case tracking-normal">Works</span></h2>
            </div>
            <div className="max-w-sm text-right">
              <p className="text-xl opacity-60 italic">A collection of experiments, products, and digital artifacts built over the last decade.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-ink-black/10 border border-ink-black/10">
            {projects.map((project, i) => (
              <motion.div 
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handleProjectClick(project)}
                className="group bg-[#f4f1e6] p-8 lg:p-12 flex flex-col gap-8 cursor-pointer hover:bg-ink-black hover:text-beige-light transition-all duration-500"
              >
                <div className="flex justify-between items-start">
                  <div className="font-mono text-sm opacity-50">0{project.id}</div>
                  <div className="flex gap-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-[10px] uppercase border border-current px-2 py-0.5 opacity-50">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-4xl lg:text-5xl font-bold tracking-tight group-hover:italic transition-all">{project.title}</h3>
                  <p className="text-lg opacity-70 max-w-md">{project.desc}</p>
                </div>
                <div className="relative aspect-video overflow-hidden bg-beige-dark">
                  <img 
                    src={`https://picsum.photos/seed/${project.img}/800/450`} 
                    alt={project.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-ink-black/20 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  View Details <ExternalLink size={12} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- RESUME SECTION (Oversized Typographic) --- */}
      <section id="resume" className="min-h-screen w-full p-8 lg:p-24 bg-beige-main relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24">
            <h2 className="text-7xl lg:text-9xl font-bold tracking-tighter uppercase opacity-10 absolute -top-10 left-0">Trash / Experience</h2>
            <h2 className="text-5xl lg:text-7xl font-bold relative z-10">Career <span className="italic font-serif normal-case">Timeline</span></h2>
          </div>

          <div className="space-y-32">
            {[
              { year: "2023", role: "Senior Designer", company: "Future Labs", desc: "Leading design systems for distributed teams and AI-integrated workflows." },
              { year: "2020", role: "UX Engineer", company: "Retro Studio", desc: "Developed high-fidelity prototypes using React and Three.js for Fortune 500 clients." },
              { year: "2018", role: "Visual Designer", company: "Creative Agency", desc: "Focused on brand identity and digital storytelling for luxury fashion brands." }
            ].map((job, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8 items-start group"
              >
                <div className="text-8xl lg:text-[12rem] font-bold font-serif leading-none opacity-20 group-hover:opacity-100 group-hover:text-ink-black transition-all duration-700">
                  {job.year}
                </div>
                <div className="pt-8 lg:pt-16 space-y-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <h3 className="text-4xl lg:text-5xl font-bold">{job.role}</h3>
                    <div className="h-px flex-1 bg-ink-black/20 hidden lg:block" />
                    <div className="text-2xl italic font-serif">{job.company}</div>
                  </div>
                  <p className="text-xl lg:text-2xl max-w-2xl opacity-70 leading-relaxed">
                    {job.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CONTACT SECTION (Bold Background) --- */}
      <footer id="contact" className="min-h-screen w-full bg-ink-black text-beige-light p-8 lg:p-24 flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] border border-beige-light/5 rounded-full pointer-events-none"
        />
        
        <div className="max-w-4xl w-full space-y-12 relative z-10">
          <div className="font-mono text-xs uppercase tracking-[0.5em] opacity-50">Write / Think</div>
          <h2 className="text-6xl lg:text-9xl font-bold tracking-tighter leading-none">
            LET'S <br/> <span className="italic font-serif normal-case tracking-normal">CONNECT</span>
          </h2>
          <p className="text-xl lg:text-2xl opacity-70 max-w-2xl mx-auto">
            Whether you have a project in mind or just want to talk about the future of design, my inbox is always open.
          </p>
          
          <div className="flex flex-col lg:flex-row gap-6 justify-center items-center pt-8">
            <a 
              href="mailto:hello@example.com"
              className="px-12 py-6 bg-beige-light text-ink-black text-2xl font-bold rounded-full hover:scale-105 transition-transform active:scale-95"
            >
              hello@portfolio.com
            </a>
            <div className="flex gap-8">
              <Github className="cursor-pointer hover:text-beige-dark transition-colors" size={32} />
              <Twitter className="cursor-pointer hover:text-beige-dark transition-colors" size={32} />
              <Linkedin className="cursor-pointer hover:text-beige-dark transition-colors" size={32} />
            </div>
          </div>

          <div className="pt-24 grid grid-cols-1 md:grid-cols-3 gap-12 text-left border-t border-beige-light/10">
            <div className="space-y-4">
              <h4 className="font-mono text-[10px] uppercase tracking-widest opacity-50">Location</h4>
              <p className="text-sm">Based in Digital Ether<br/>Available Worldwide</p>
            </div>
            <div className="space-y-4">
              <h4 className="font-mono text-[10px] uppercase tracking-widest opacity-50">Socials</h4>
              <div className="flex flex-col gap-1 text-sm">
                <a href="#" className="hover:underline">GitHub</a>
                <a href="#" className="hover:underline">Twitter</a>
                <a href="#" className="hover:underline">LinkedIn</a>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-mono text-[10px] uppercase tracking-widest opacity-50">Legal</h4>
              <p className="text-sm">© 2026 Retro Portfolio.<br/>All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {activeSection === 'project-detail' && selectedProject && (
          <RetroWindow 
            title={`Project Archive / ${selectedProject.title}`} 
            onClose={() => {
              setActiveSection(null);
              setSelectedProject(null);
            }}
          >
            <div className="space-y-8">
              <div className="aspect-video bg-beige-dark overflow-hidden border-2 border-ink-black">
                <img 
                  src={`https://picsum.photos/seed/${selectedProject.img}/1200/675`} 
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedProject.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-ink-black text-beige-light font-mono text-xs uppercase">{tag}</span>
                ))}
              </div>
              <div className="space-y-4">
                <h3 className="text-4xl font-bold">{selectedProject.title}</h3>
                <p className="text-xl leading-relaxed opacity-80">
                  {selectedProject.longDesc}
                </p>
              </div>
              <div className="pt-6 flex gap-4">
                <a href="#" className="px-6 py-3 bg-ink-black text-beige-light font-bold flex items-center gap-2 hover:opacity-80 transition-opacity">
                  Live Preview <ExternalLink size={16} />
                </a>
                <a href="#" className="px-6 py-3 border-2 border-ink-black font-bold flex items-center gap-2 hover:bg-ink-black hover:text-beige-light transition-all">
                  Source Code <Github size={16} />
                </a>
              </div>
            </div>
          </RetroWindow>
        )}
      </AnimatePresence>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #E0DCCF;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #0f0f0f;
          border: 2px solid #E0DCCF;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .perspective-2000 {
          perspective: 2000px;
        }
      `}</style>
    </div>
  );
}
