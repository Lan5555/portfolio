'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Mail, ExternalLink, ArrowRight, Code, Zap, Gamepad2, Layers, Sun, Moon, ChevronDown, Upload, Play, Image as ImageIcon, Terminal, Cpu, Globe, Sparkles } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

// Three.js Orbs Component
interface OrbsProps {
  isDark: boolean;
}

const FloatingOrbs: React.FC<OrbsProps> = ({ isDark }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = containerRef.current.clientWidth;
    canvas.height = containerRef.current.clientHeight;
    containerRef.current.appendChild(canvas);

    const ctx = canvas.getContext('2d')!;
    let animationId: number;

    interface Orb {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      color: string;
      glowColor: string;
    }

    const orbs: Orb[] = [
      {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 60,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        color: isDark ? 'rgba(34, 211, 238, 0.8)' : 'rgba(59, 130, 246, 0.6)',
        glowColor: isDark ? 'rgba(34, 211, 238, 0.3)' : 'rgba(59, 130, 246, 0.2)',
      },
      {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 80,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        color: isDark ? 'rgba(99, 102, 241, 0.7)' : 'rgba(139, 92, 246, 0.5)',
        glowColor: isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(139, 92, 246, 0.15)',
      },
      {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 50,
        vx: (Math.random() - 0.5) * 2.5,
        vy: (Math.random() - 0.5) * 2.5,
        color: isDark ? 'rgba(6, 182, 212, 0.75)' : 'rgba(14, 165, 233, 0.55)',
        glowColor: isDark ? 'rgba(6, 182, 212, 0.25)' : 'rgba(14, 165, 233, 0.18)',
      },
    ];

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.1)' : 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      orbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x - orb.radius < 0 || orb.x + orb.radius > canvas.width) {
          orb.vx *= -1;
          orb.x = Math.max(orb.radius, Math.min(canvas.width - orb.radius, orb.x));
        }
        if (orb.y - orb.radius < 0 || orb.y + orb.radius > canvas.height) {
          orb.vy *= -1;
          orb.y = Math.max(orb.radius, Math.min(canvas.height - orb.radius, orb.y));
        }

        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, orb.glowColor);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = isDark ? `rgba(34, 211, 238, 0.5)` : `rgba(59, 130, 246, 0.4)`;
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = containerRef.current?.clientWidth || 0;
      canvas.height = containerRef.current?.clientHeight || 0;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      canvas.remove();
    };
  }, [isDark]);

  return <div ref={containerRef} className="absolute inset-0 opacity-50" />;
};

// Main Portfolio Component
interface SkillGroup {
  category: string;
  items: string[];
}

interface Project {
  name: string;
  description: string;
  longDescription: string;
  tags: string[];
  color: string;
  icon: string;
  link: string;
  media?: string;
  mediaType?: 'image' | 'video';
}

type ThemeType = 'dark' | 'light';

const Portfolio: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<ThemeType>('dark');
  const [profileImage, setProfileImage] = useState<string>('/pic.jpeg');
  const [isNavSticky, setIsNavSticky] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [projectMedias, setProjectMedias] = useState<{ [key: number]: string }>({
    0: '/nacos.png',
    1: '/game.png',
    2: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800',
  });
  const [projectMediaTypes, setProjectMediaTypes] = useState<{ [key: number]: 'image' | 'video' }>({
    0: 'image', 1: 'image', 2: 'image'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [requestStatus, setRequestStatus] = useState<'IDLE' | 'SENDING' | 'SUCCESS'>('IDLE');
  const projectMediaInputRef = useRef<HTMLInputElement>(null);
  const [activeProjectForMedia, setActiveProjectForMedia] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "Your Name",
    email: "hello@example.com",
    subject: "Collaboration Inquiry",
    message: "Let's build something amazing together!"
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isDark = theme === 'dark';

  // Handle sticky nav
  useEffect(() => {
    const handleScroll = () => {
      setIsNavSticky(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    audioRef.current = new Audio('/tender.mp3');
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }
  }, []);

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProjectMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeProjectForMedia !== null) {
      const reader = new FileReader();
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');

      reader.onload = (event) => {
        const data = event.target?.result as string;
        setProjectMedias(prev => ({
          ...prev,
          [activeProjectForMedia]: data
        }));
        setProjectMediaTypes(prev => ({
          ...prev,
          [activeProjectForMedia]: isVideo ? 'video' : isImage ? 'image' : 'image'
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (requestStatus !== 'IDLE') return;
    
    setRequestStatus('SENDING');
    
    // Construct mailto link to notify the user
    const mailtoLink = `mailto:okekejohnson24@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`From: ${formData.name} (${formData.email})\n\n${formData.message}`)}`;
    
    setTimeout(() => {
      setRequestStatus('SUCCESS');
      window.location.href = mailtoLink;
      setTimeout(() => setRequestStatus('IDLE'), 3000);
    }, 1000);
  };

  const skills: SkillGroup[] = [
    { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Three.js','Nite'] },
    { category: 'Backend', items: ['Go', 'Node.js', 'Nest.js', 'Express', 'Socket.io', 'REST APIs'] },
    { category: 'Mobile', items: ['Flutter', 'Android', 'Cross-platform','React Native'] },
    { category: 'Game Dev', items: ['C++', 'Unity', 'Unreal Engine', 'Blender', 'C#'] },
  ];

  const experience = [
    { year: '2025 - Present', role: 'Software Engineer', company: 'Techfusion Africa', desc: 'Building scalable and high tech applications.' },
    { year: '2023 - 2025', role: 'Game Developer', company: "Lan's Enterprise", desc: 'Developed core gameplay mechanics and optimized 3D rendering pipelines for indie titles.' },
    { year: '2021 - 2023', role: 'Frontend Developer', company: "Lan's Enterprise", desc: 'Built responsive web applications and interactive marketing experiences for global brands.' },
  ];


  const projects: Project[] = [
    {
      name: 'Nacos',
      description: 'Modern educational platform with auth, marketplace, real-time features, and quiz functionality.',
      longDescription: 'A comprehensive educational platform built with React and Nest.js, featuring real-time quiz functionality, user authentication, integrated marketplace with payment processing, PDF library support, and a full admin dashboard. Handles thousands of users with real-time notifications.',
      tags: ['React', 'PostgressSQL', 'Nest.js', 'Real-time'],
      color: 'from-cyan-500 to-blue-500',
      icon: '🎓',
      link: '#',
    },
    {
      name: 'Dawn of Alchemy',
      description: 'Narrative-driven tragedy RPG with deep storytelling, multiple acts, and emotional plot twists.',
      longDescription: 'An immersive narrative-driven RPG inspired by NieR Replicant and Clair Obscur: Expedition 33. Features complex story arcs, romance systems, multiple acts with branching narratives, stunning visual design, and emotional storytelling that spans 40+ hours of gameplay.',
      tags: ['Game Dev', 'C++', 'Story Design','Unity'],
      color: 'from-purple-500 to-pink-500',
      icon: '⚔️',
      link: '#',
    },
    {
      name: 'Virtual Lab Platform',
      description: 'Interactive 3D laboratory experience with immersive visualizations and simulations.',
      longDescription: 'An advanced 3D laboratory environment built with Next.js and Three.js, featuring interactive molecular simulations, real-time physics calculations, immersive visualizations, and educational content. Created with Blender for stunning 3D assets and animations.',
      tags: ['Next.js', 'Three.js', 'Blender', '3D','Firebase'],
      color: 'from-emerald-500 to-teal-500',
      icon: '🧪',
      link: '#',
    },
  ];

  return (
    <div className={`transition-colors duration-300 ${isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-950'}`}>
      {/* Navigation */}
      <nav className={`fixed w-full top-0 z-50 transition-all duration-500 ${isNavSticky ? 'py-3 shadow-2xl translate-y-0' : 'py-6'} ${isDark ? 'bg-slate-950/80' : 'bg-white/80'} backdrop-blur-xl ${isDark ? 'border-slate-800/50' : 'border-slate-200/50'} border-b`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <a href="#home" className="group flex items-center gap-2 text-2xl font-black tracking-tighter transition-all duration-300">
            <span className="bg-linear-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent group-hover:from-blue-400 group-hover:to-cyan-600">NICHOLAS</span>
            <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>DEV</span>
          </a>
          <div className={`hidden md:flex items-center gap-1 p-1 rounded-full border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-100/50 border-slate-200'}`}>
            {['Home', 'About', 'Projects', 'Skills', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`} 
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-950 hover:bg-white shadow-sm'}`}
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-lg transition-all duration-300 hover:scale-110 ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden transition-all ${isDark ? 'text-slate-300 hover:text-cyan-400' : 'text-slate-600 hover:text-cyan-600'}`}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden transition-all ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'} border-t px-6 py-4 space-y-3 animate-slideDown`}>
            {['Home', 'About', 'Projects', 'Skills', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`block transition-all ${isDark ? 'text-slate-300 hover:text-cyan-400' : 'text-slate-600 hover:text-cyan-600'} hover:translate-x-2`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className={`relative min-h-screen pt-32 md:pt-40 overflow-hidden transition-colors duration-300 ${isDark ? 'bg-slate-950' : 'bg-linear-to-b from-white to-slate-50'}`}>
        <FloatingOrbs isDark={isDark} />

        {/* Animated background */}
        {isDark && (
          <>
            <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" />
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse animation-delay-2000" />
          </>
        )}

        <div className="max-w-7xl mx-auto px-6 h-full flex items-center relative z-10">
          <div className="space-y-8 max-w-2xl">
            <div className="space-y-4 animate-fade-in">
              <div className="inline-block group">
                <span className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 group-hover:scale-105 ${isDark ? 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' : 'text-cyan-600 border-cyan-400/50 bg-cyan-100/50'} border`}>
                  Welcome to my portfolio
                </span>
              </div>
              <h1 className="text-6xl md:text-7xl font-bold leading-tight group hover:text-transparent hover:bg-clip-text hover:bg-linear-to-r hover:from-cyan-400 hover:to-blue-500 transition-all duration-500">
                Nicholas Johnson
              </h1>
              <p className={`text-xl leading-relaxed transition-all duration-300 ${isDark ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-600 group-hover:text-slate-700'}`}>
                Full-stack engineer crafting scalable web platforms, high-performance backend systems, cross-platform mobile applications, immersive 3D experiences, and interactive game systems. Passionate about performance-focused architecture, real-time technologies, mobile development with Flutter, backend engineering, and interactive storytelling.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-8">
              <a
                href="#projects"
                className="group px-6 py-2.5 md:px-8 md:py-3 bg-linear-to-r from-cyan-400 to-blue-500 text-slate-950 font-semibold rounded-lg hover:shadow-xl hover:shadow-cyan-500/70 hover:scale-105 transition-all duration-300 flex items-center gap-2 text-sm md:text-base"
              >
                View my work
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#contact"
                className={`px-6 py-2.5 md:px-8 md:py-3 font-semibold rounded-lg transition-all duration-300 hover:scale-105 text-sm md:text-base ${isDark ? 'border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-400 hover:bg-slate-900/50' : 'border-slate-300 hover:border-cyan-600 text-slate-700 hover:text-cyan-600 hover:bg-cyan-50/50'} border`}
              >
                Get in touch
              </a>
            </div>

            {/* Social Links */}
            <div className="flex gap-6 pt-8">
              {[
                { Icon: FaGithub, label: 'GitHub' },
                { Icon: FaLinkedin, label: 'LinkedIn' },
                { Icon: Mail, label: 'Email' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href={label === 'GitHub' ? 'https://github.com/Lan5555' : label === 'LinkedIn' ? 'http://linkedin.com/in/nicholas-johnson-0abb582a3' : label === 'Email' ? 'mailto:okekejohnson24@gmail.com': '#'}
                  className={`group transition-all duration-300 hover:scale-125 hover:-translate-y-2 ${isDark ? 'text-slate-400 hover:text-cyan-400' : 'text-slate-500 hover:text-cyan-600'}`}
                  title={label}
                >
                  <Icon size={24} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className={isDark ? 'text-slate-400' : 'text-slate-500'} size={32} />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={`relative py-24 transition-colors duration-300 ${isDark ? 'bg-linear-to-b from-slate-950 to-slate-900' : 'bg-linear-to-b from-slate-50 to-white'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            About Me
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-6">
              {[
                'I\'m a passionate full-stack developer focused on building scalable web platforms, cross-platform mobile applications, backend systems, and interactive game experiences.',
                'I specialize in modern technologies and enjoy creating high-performance applications, real-time systems, immersive 3D experiences, and developer tools.',
                'My interests span full-stack engineering, game development, 3D graphics, mobile experiences, real-time applications, and performance optimization.',
              ].map((text, idx) => (
                <p
                  key={idx}
                  className={`text-lg leading-relaxed transition-all duration-500 hover:translate-x-2 cursor-default ${isDark ? 'text-slate-300 hover:text-cyan-300' : 'text-slate-700 hover:text-cyan-700'}`}
                >
                  {text}
                </p>
              ))}
            </div>

            {/* Profile Image + Achievements */}
            <div className="space-y-8">
              {/* Profile Image Section */}
              <div className="relative group">
                <div className={`absolute -inset-1 bg-linear-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500`} />
                <div className={`relative w-64 h-64 mx-auto rounded-2xl overflow-hidden border-2 transition-all duration-300 ${isDark ? 'border-cyan-500/30 group-hover:border-cyan-400 bg-slate-800' : 'border-cyan-400/30 group-hover:border-cyan-500 bg-slate-100'}`}>
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center transition-all ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                      <div className="text-center">
                        <div className="text-6xl mb-2 group-hover:scale-125 transition-transform">📸</div>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Click to add photo</p>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 opacity-0 hover:opacity-100 bg-black/50 flex items-center justify-center transition-opacity cursor-pointer backdrop-blur-sm"
                  >
                    <span className="text-white font-semibold">Upload Photo</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Skill Cards */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: '💻', title: 'Full-Stack', desc: 'End-to-end development' },
                  { icon: '🎮', title: 'Game Dev', desc: 'Interactive experiences' },
                  { icon: '⚡', title: 'Real-time', desc: 'High-performance systems' },
                  { icon: '🎨', title: '3D Graphics', desc: 'Immersive visuals' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-6 rounded-lg transition-all duration-300 group cursor-default hover:scale-105 hover:-translate-y-1 ${isDark ? 'bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 border' : 'bg-slate-100 border-slate-200 hover:border-cyan-400 border'}`}
                  >
                    <div className="text-3xl mb-2 group-hover:scale-125 transition-transform">{item.icon}</div>
                    <h3 className="font-semibold text-slate-200">{item.title}</h3>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Timeline Section */}
      <section className={`py-24 transition-colors duration-300 ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Experience
            </h2>
            <div className={`h-px flex-1 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
          </div>

          <div className="space-y-12">
            {experience.map((exp, idx) => (
              <div key={idx} className="relative pl-8 group">
                {/* Timeline Line */}
                <div className={`absolute left-0 top-0 bottom-0 w-px ${isDark ? 'bg-slate-800' : 'bg-slate-200'} group-last:h-8`} />
                {/* Timeline Dot */}
                <div className={`absolute -left-1 top-2 w-2 h-2 rounded-full transition-all duration-500 group-hover:scale-150 group-hover:bg-cyan-400 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
                
                <div className="grid md:grid-cols-[200px_1fr] gap-4">
                  <div className={`text-sm font-bold font-mono ${isDark ? 'text-cyan-500/70' : 'text-cyan-600'}`}>
                    {exp.year}
                  </div>
                  <div className="space-y-2">
                    <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {exp.role} <span className="text-cyan-500">@</span> {exp.company}
                    </h3>
                    <p className={`max-w-2xl leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {exp.desc}
                    </p>
                    <div className="flex gap-2 pt-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded border ${isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'}`}>Full-time</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className={`py-24 transition-colors duration-300 ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Featured Projects
            </h2>
            <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Explore my recent work across web, mobile, and game development
            </p>
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {projects.map((project, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() => {
                    if (audioRef.current && project.name === 'Dawn of Alchemy') audioRef.current.play().catch(() => {});
                  }}
                  onMouseLeave={() => {
                    if (audioRef.current && project.name === 'Dawn of Alchemy') {
                      audioRef.current.pause();
                      audioRef.current.currentTime = 0;
                    }
                  }}
                  className={`group relative rounded-2xl overflow-hidden transition-all duration-500 ${isDark ? 'bg-slate-900 border-slate-800 hover:border-cyan-500/80 shadow-lg hover:shadow-cyan-500/10' : 'bg-slate-50 border-slate-200 hover:border-cyan-400 shadow-md'} border`}
                >
                  {/* Project Image Space */}
                  <div className={`relative h-52 w-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                    {projectMedias[idx] ? (
                      projectMediaTypes[idx] === 'video' ? (
                        <video src={projectMedias[idx]} className="w-full h-full object-cover" autoPlay muted loop />
                      ) : (
                        <img src={projectMedias[idx]} alt={project.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      )
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                        <ImageIcon size={32} className="opacity-20" />
                        <button 
                          onClick={() => { setActiveProjectForMedia(idx); projectMediaInputRef.current?.click(); }}
                          className="text-xs font-bold px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500 hover:text-white transition-all"
                        >
                          Add Preview
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Icon */}
                  <div className={`absolute top-4 right-4 text-4xl group-hover:scale-125 group-hover:-rotate-12 transition-all duration-300`}>
                    {project.icon}
                  </div>

                  <div className="p-8 relative">
                    <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                      {project.name}
                      <ExternalLink size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className={`mb-6 leading-relaxed transition-all duration-300 text-sm ${isDark ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-600 group-hover:text-slate-700'}`}>
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map((tag, i) => (
                        <span
                          key={i}
                          className={`px-3 py-1 text-xs rounded-full border transition-all duration-300 group-hover:scale-105 ${isDark ? 'bg-slate-800 text-cyan-400 border-slate-700 group-hover:border-cyan-400' : 'bg-cyan-100 text-cyan-700 border-cyan-300 group-hover:border-cyan-500'}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                  </div>
                </div>
              ))}
          </div>
          <input
            ref={projectMediaInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleProjectMediaUpload}
            className="hidden"
          />
          {/* Project Stats */}
          <div className={`grid md:grid-cols-3 gap-6 mt-16 p-8 rounded-xl ${isDark ? 'bg-linear-to-r from-slate-800/50 to-slate-900/50 border-slate-700' : 'bg-linear-to-r from-slate-50 to-slate-100 border-slate-200'} border`}>
            {[
              { number: '10+', label: 'Major Projects' },
              { number: '50+', label: 'Technologies Used' },
              { number: '∞', label: 'Coffee Consumed' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center group hover:scale-110 transition-transform cursor-default">
                <div className="text-3xl font-bold bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent group-hover:text-4xl transition-all">
                  {stat.number}
                </div>
                <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className={`py-24 transition-colors duration-300 ${isDark ? 'bg-linear-to-b from-slate-950 to-slate-900' : 'bg-linear-to-b from-white to-slate-50'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Skills & Technologies
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skills.map((skillGroup, idx) => (
              <div
                key={idx}
                className={`p-8 rounded-xl transition-all duration-500 group hover:scale-105 hover:-translate-y-2 cursor-default ${isDark ? 'bg-slate-800/30 border-slate-700 hover:bg-slate-800/50 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10' : 'bg-slate-100 border-slate-200 hover:bg-slate-50 hover:border-cyan-400 hover:shadow-lg'} border`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-900 text-cyan-400' : 'bg-white text-cyan-600 shadow-sm'}`}>
                    {idx === 0 && <Globe size={20} />}
                    {idx === 1 && <Terminal size={20} />}
                    {idx === 2 && <Cpu size={20} />}
                    {idx === 3 && <Gamepad2 size={20} />}
                  </div>
                  <h3 className="text-lg font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                    {skillGroup.category}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {skillGroup.items.map((skill, i) => (
                    <li
                      key={i}
                      className={`flex items-center gap-2 transition-all duration-300 group-hover:translate-x-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
                    >
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full group-hover:scale-150 transition-transform" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Achievements */}
          <div className={`mt-16 p-8 rounded-xl transition-all duration-500 group hover:scale-[1.02] ${isDark ? 'bg-linear-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/30 hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-500/10' : 'bg-linear-to-r from-cyan-100/50 to-blue-100/50 border-cyan-300 hover:shadow-lg'} border`}>
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="text-cyan-400 animate-pulse" />
              <h3 className="text-xl font-bold group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-cyan-400 group-hover:to-blue-500 transition-all">
                Notable Achievements
              </h3>
            </div>
            <ul className={`grid md:grid-cols-2 gap-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            <li className="flex gap-3 group/item cursor-default hover:translate-x-2 transition-transform">
              <span className="text-cyan-400 group-hover/item:scale-150 transition-transform">✦</span>
              <span>
                Creator of the <a href="https://nite-documentation.vercel.app" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline font-medium">Nite Framework</a>, a utility-first SPA framework
              </span>
            </li>
            {[
              'Built production real-time chat systems with Socket.io',
              'Developed immersive 3D experiences with Three.js and Blender',
              'Deployed scalable applications on cloud-native platforms',
            ].map((achievement, idx) => (
              <li
                key={idx}
                className="flex gap-3 group/item cursor-default hover:translate-x-2 transition-transform"
              >
                <span className="text-cyan-400 group-hover/item:scale-150 transition-transform">✦</span>
                <span>{achievement}</span>
              </li>
            ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={`py-24 transition-colors duration-300 ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto px-6">
          <div className={`rounded-xl border overflow-hidden shadow-2xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            {/* Postman Header */}
            <div className={`px-4 py-2 border-b flex items-center gap-4 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300'}`}>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className={`text-xs font-mono font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>POST /api/contact/nicholas-johnson</span>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className={`px-3 py-2 rounded font-mono text-sm font-bold ${isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'}`}>POST</div>
                <div className={`flex-1 px-3 py-2 rounded font-mono text-sm border ${isDark ? 'bg-slate-950 border-slate-700 text-slate-300' : 'bg-white border-slate-300 text-slate-700'}`}>
                  https://nicholas.dev/contact
                </div>
                <button 
                  onClick={handleSendRequest}
                  disabled={requestStatus !== 'IDLE'}
                  className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded transition-colors disabled:opacity-50"
                >
                  {requestStatus === 'SENDING' ? 'SENDING...' : 'SEND'}
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4 border-b border-slate-700 pb-2">
                  <span className="text-xs font-bold text-blue-400 border-b-2 border-blue-400 pb-2">Body</span>
                  <span className="text-xs font-bold text-slate-500">Headers</span>
                  <span className="text-xs font-bold text-slate-500">Auth</span>
                </div>
                
                <div className={`p-4 rounded font-mono text-[10px] sm:text-sm min-h-37.5 overflow-x-auto ${isDark ? 'bg-slate-950 text-cyan-400' : 'bg-white text-blue-600 border border-slate-200'}`}>
                  <div className="opacity-50">{"{"}</div>
                  <div className="pl-2 sm:pl-4 space-y-1">
                    <div>
                      <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>"name":</span> 
                      <input
                        className="bg-transparent border-none outline-none ml-2 w-[60%]" 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />,
                    </div>
                    <div>
                      <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>"email":</span> 
                      <input
                        className="bg-transparent border-none outline-none ml-2 w-[60%]" 
                        value={formData.email} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />,
                    </div>
                    <div>
                      <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>"subject":</span> 
                      <input
                        className="bg-transparent border-none outline-none ml-2 w-[60%]" 
                        value={formData.subject} 
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      />,
                    </div>
                    <div>
                      <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>"message":</span> 
                      <input
                        className="bg-transparent border-none outline-none ml-2 w-[60%]" 
                        value={formData.message} 
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                      />,
                    </div>
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>"contact":</span> "+234 906 559 0812",<br/>
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>"recipient":</span> "okekejohnson24@gmail.com",<br/>
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>"urgency":</span> "High",<br/>
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>"status":</span> "Ready to code"<br/>
                  </div>
                  <div className="opacity-50">{"}"}</div>
                </div>
              </div>

              {requestStatus === 'SUCCESS' && (
                <div className={`mt-4 p-4 rounded border animate-fade-in ${isDark ? 'bg-slate-950 border-green-500/30' : 'bg-green-50 border-green-200'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-green-500">Status: 200 OK</span>
                    <span className="text-xs text-slate-500">Time: 124ms</span>
                  </div>
                  <p className={`text-sm font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {"{"} "response": "Message received! I'll get back to you shortly." {"}"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Floating Catch Modal / Status Card */}
          <div className="hidden xl:block absolute right-12 top-1/2 -translate-y-1/2 animate-fade-in animation-delay-1000">
            <div className={`p-6 rounded-2xl border backdrop-blur-md transition-all duration-500 hover:scale-105 hover:-rotate-2 ${isDark ? 'bg-slate-900/40 border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.1)]' : 'bg-white/40 border-cyan-200 shadow-xl'}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute inset-0" />
                  <div className="w-3 h-3 bg-green-500 rounded-full relative" />
                </div>
                <span className={`text-xs font-bold tracking-widest uppercase ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>Available for Hire</span>
              </div>
              <h4 className="font-bold text-lg mb-1">Current Focus</h4>
              <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Building the next gen<br/>of 3D web experiences.</p>
              <div className={`h-1 w-full rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                <div className="h-full bg-linear-to-r from-cyan-400 to-blue-500 w-3/4 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-8 border-t transition-colors ${isDark ? 'border-slate-800 bg-slate-950/50 text-slate-500' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p>© {new Date().getFullYear()} Nicholas Johnson. All rights reserved.</p>
        </div>
      </footer>

      {/* Global Styles */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.3;
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .animate-pulse {
          animation: pulse 4s ease-in-out infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        * {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: rgb(34, 211, 238);
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgb(6, 182, 212);
        }
      `}</style>
    </div>
  );
};

export default Portfolio;