// src/App.jsx
import { useState, useEffect } from "react";
import { 
  FaJava, FaPython, FaLinux, FaNetworkWired, FaReact, 
  FaGithub, FaInstagram, FaPhoneAlt, FaFolderPlus 
} from 'react-icons/fa';
import { 
  SiTailwindcss, SiJavascript, SiMaildotru 
} from 'react-icons/si';
import { 
  GiCpu, GiCircuitry 
} from 'react-icons/gi';

// Firebase Imports
import { db } from "./firebase";
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";

// ==========================================
// DATA ZONE
// ==========================================

const skillCategories = [
  {
    title: "Core & Systems Engineering",
    list: [
      { name: "Linux Systems", icon: <FaLinux className="text-[#fdb514]" /> },
      { name: "Networking", icon: <FaNetworkWired className="text-[#0052cc]" /> },
      { name: "Digital Logic Design", icon: <GiCpu className="text-[#a855f7]" /> },
      { name: "Fundamentals of Electronics", icon: <GiCircuitry className="text-[#ef4444]" /> },
    ]
  },
  {
    title: "Software & Web Development",
    list: [
      { name: "Java", icon: <FaJava className="text-[#f89820]" /> },
      { name: "Python", icon: <FaPython className="text-[#3776ab]" /> },
      { name: "JavaScript", icon: <SiJavascript className="text-[#f7df1e]" /> },
      { name: "React", icon: <FaReact className="text-[#61dafb]" /> },
      { name: "Tailwind CSS", icon: <SiTailwindcss className="text-[#06b6d4]" /> },
    ]
  }
];

const projects = [
  {
    title: "Fourier Series Calculator & Plotter",
    desc: "A Python desktop application built with Tkinter, NumPy, SciPy, and Matplotlib. It computes Fourier coefficients using numerical integration and dynamically visualizes the convergence of trigonometric series against original periodic functions, supporting both single and piecewise functions.",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=60",
    tags: ["Python", "Tkinter", "SciPy", "Matplotlib", "Math Modeling"],
    // เพิ่มส่วน links สำหรับแนบไฟล์
    links: [
      { label: "📄 รายงานฉบับเต็ม (PDF)", url: "/fourier_report.pdf" },
      { label: "💻 Source Code (.py)", url: "/fourier_series.py" }
    ]
  },
  {
    title: "DropHere: E-Waste Management",
    desc: "An application concept designed to track and optimize electronic waste disposal locations. Integrated mapping and hardware life-cycle algorithms to help local communities and students manage scrap efficiently.",
    image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&auto=format&fit=crop&q=60",
    tags: ["Android Studio", "Java", "Firebase", "System Design"]
  },
  {
    title: "Credit Risk Predictive ML Model",
    desc: "Implemented and compared Logistic Regression and Support Vector Machine (SVM) algorithms using the German Credit dataset. Focused on log transformations and balancing high precision/recall metrics for imbalanced data analysis.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=60",
    tags: ["Python", "Machine Learning", "Data Science", "Scikit-Learn"]
  },
  {
    title: "Transient Response Circuit Analyzer",
    desc: "Developed a computational script using numerical methods to analyze and simulate Transient Responses in complex RL, RC, and RLC networks utilizing Kirchhoff's laws, Nodal/Mesh analysis, and matrix operations.",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=60",
    tags: ["Python", "Circuit Analysis", "Engineering Math"]
  },
];

// ==========================================
// COMPONENT ZONE
// ==========================================
export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const q = query(collection(db, "comments"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const commentsArray = [];
      querySnapshot.forEach((doc) => {
        commentsArray.push({ id: doc.id, ...doc.data() });
      });
      setComments(commentsArray);
    });
    return () => unsubscribe();
  }, []);

  async function sendMessage() {
    if (!message.trim()) return;
    try {
      await addDoc(collection(db, "comments"), {
        name: name || "Anonymous",
        message: message,
        createdAt: serverTimestamp(),
      });
      setName("");
      setMessage("");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to send message. Please try again.");
    }
  }

  return (
    <div
      className={
        darkMode
          ? "overflow-x-hidden min-h-screen font-sans text-zinc-100 bg-[#09090b] transition-all duration-500"
          : "overflow-x-hidden min-h-screen font-sans text-zinc-900 bg-[#fafafa] transition-all duration-500"
      }
    >
      {/* Background Glow */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-cyan-500/10 blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/10 blur-[140px]" />
      </div>

      {/* Navbar */}
      <nav className={`flex flex-wrap justify-between items-center gap-4 px-6 md:px-12 py-5 border-b backdrop-blur-md sticky top-0 z-50 transition-colors ${darkMode ? "border-zinc-800/50 bg-[#09090b]/70" : "border-zinc-200 bg-[#fafafa]/75"}`}>
        <h1 className="text-xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
          KITTITHAT.D
        </h1>
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 font-medium text-sm w-full sm:w-auto">
          <a href="#about" className={`transition-colors ${darkMode ? "text-zinc-400 hover:text-cyan-400" : "text-zinc-600 hover:text-cyan-600"}`}>About</a>
          <a href="#skills" className={`transition-colors ${darkMode ? "text-zinc-400 hover:text-cyan-400" : "text-zinc-600 hover:text-cyan-600"}`}>Skills</a>
          <a href="#projects" className={`transition-colors ${darkMode ? "text-zinc-400 hover:text-cyan-400" : "text-zinc-600 hover:text-cyan-600"}`}>Projects</a>
          <a href="#contact" className={`transition-colors ${darkMode ? "text-zinc-400 hover:text-cyan-400" : "text-zinc-600 hover:text-cyan-600"}`}>Contact</a>
          <a href="#comments" className={`transition-colors ${darkMode ? "text-zinc-400 hover:text-cyan-400" : "text-zinc-600 hover:text-cyan-600"}`}>Comments</a>
          
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative w-12 h-7 rounded-full transition-all duration-300 ml-2 ${darkMode ? "bg-cyan-500" : "bg-zinc-200"}`}
          >
            <div className={`absolute top-0.5 w-6 h-6 rounded-full transition-all duration-300 flex items-center justify-center text-xs ${darkMode ? "left-5.5 bg-zinc-950" : "left-0.5 bg-white shadow-sm"}`}>
              {darkMode ? "🌙" : "☀️"}
            </div>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-5xl mx-auto px-6 md:px-12 py-20 lg:py-28 grid md:grid-cols-5 gap-12 items-center">
        <div className="md:col-span-3 text-left">
          <p className="text-cyan-500 font-bold uppercase tracking-[4px] text-xs mb-3">
            Computer Engineering Student
          </p>
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.15] ${darkMode ? "text-zinc-50" : "text-zinc-900"}`}>
            Hi, I am <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              Kittithat Dokboua
            </span>
          </h1>
          <p className={`mt-5 text-base leading-relaxed max-w-xl ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
           A passionate developer and System Engineering enthusiast with foundational knowledge in both hardware infrastructure and scalable web applications. Driven by curiosity and a strong eagerness to learn, I enjoy exploring modern digital architectures and continuously improving my technical skills.
          </p>
          <div className="mt-8 flex gap-4 text-sm font-semibold">
            <a href="#projects" className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:opacity-95 transition shadow-sm">
              View My Work
            </a>
            <a href="#contact" className={`px-5 py-3 rounded-xl border transition-colors ${darkMode ? "border-zinc-800 text-zinc-300 hover:bg-zinc-900/50" : "border-zinc-200 text-zinc-700 hover:bg-zinc-100"}`}>
              Let's Talk
            </a>
          </div>
        </div>

        <div className="md:col-span-2 flex justify-center">
          <div className={`relative w-full max-w-[270px] p-3 rounded-[24px] border ${darkMode ? "bg-zinc-900/40 border-zinc-800/80" : "bg-white border-zinc-200 shadow-sm"}`}>
            <img
              src="/profile.jpg"
              alt="Profile"
              className="w-full h-[320px] object-cover rounded-[16px]"
            />
            <div className="mt-3.5 text-center">
              <h3 className={`text-lg font-bold tracking-tight ${darkMode ? "text-zinc-100" : "text-zinc-900"}`}>Kittithat Dokboua (ICE)</h3>
              <p className={`text-xs mt-0.5 ${darkMode ? "text-zinc-350" : "text-zinc-350"}`}>
                Srinakharinwirot University (SWU) 
              </p>
              <p className={`text-xs ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                Computer Engineering Student
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={`max-w-5xl mx-auto px-6 md:px-12 py-16 border-t ${darkMode ? "border-zinc-900" : "border-zinc-200"}`}>
        <h2 className={`text-2xl font-bold tracking-tight mb-8 ${darkMode ? "text-zinc-100" : "text-zinc-900"}`}>About Me</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className={`p-6 rounded-2xl border ${darkMode ? "bg-zinc-900/20 border-zinc-850" : "bg-white border-zinc-200/80 shadow-sm"}`}>
            <h3 className="text-base font-bold text-cyan-400 mb-3">Introduction</h3>
            <p className={`leading-relaxed text-sm ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
             "Hello, I'm Kittithat. I am a passionate Developer and System Engineering enthusiast with a strong interest in Web Development, system design, and systems thinking. I thrive on learning new technologies and love building modern, scalable applications that balance clean code with robust system logic."
            </p>
          </div>

          <div className={`p-6 rounded-2xl border ${darkMode ? "bg-zinc-900/20 border-zinc-850" : "bg-white border-zinc-200/80 shadow-sm"}`}>
            <h3 className="text-base font-bold text-cyan-400 mb-3">Education</h3>
            <div className={`space-y-4 leading-relaxed text-sm ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
              <div>
                <h4 className={`font-semibold ${darkMode ? "text-zinc-200" : "text-zinc-800"}`}>Computer Engineering</h4>
                <p>Srinakharinwirot University</p>
                <p className="text-xs mt-1 opacity-60">2025 - Present</p>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-2xl border ${darkMode ? "bg-zinc-900/20 border-zinc-850" : "bg-white border-zinc-200/80 shadow-sm"}`}>
            <h3 className="text-base font-bold text-cyan-400 mb-3">Interests</h3>
            <ul className={`space-y-2.5 text-sm ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
              <li>• Application Development</li>
              <li>• System Engineering (Cloud & Edge AI)</li>
              <li>• Linux & Networking</li>
              <li>• Electronics & Circuit Analysis</li>
              <li>• Digital Logic</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="max-w-5xl mx-auto px-6 md:px-12 py-16">
        <h2 className={`text-2xl font-bold tracking-tight mb-8 ${darkMode ? "text-zinc-100" : "text-zinc-900"}`}>
          Technical Skillset
        </h2>
        <div className="space-y-8">
          {skillCategories.map((category, catIdx) => (
            <div key={catIdx}>
              <h3 className={`text-xs uppercase tracking-widest font-bold mb-3.5 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                {category.title}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {category.list.map((skill, index) => (
                  <div
                    key={index}
                    className={`p-3.5 rounded-xl border flex items-center gap-3.5 transition group ${darkMode ? "bg-zinc-900/30 border-zinc-850 hover:border-cyan-500" : "bg-white border-zinc-200 hover:border-cyan-500 shadow-sm"}`}
                  >
                    <div className="text-2xl transform group-hover:scale-105 transition duration-300 shrink-0">
                      {skill.icon}
                    </div>
                    <span className={`text-xs font-semibold truncate ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="max-w-5xl mx-auto px-6 md:px-12 py-16">
        <h2 className={`text-2xl font-bold tracking-tight mb-2 ${darkMode ? "text-zinc-100" : "text-zinc-900"}`}>Engineering Projects</h2>
        <p className={`text-xs mb-8 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>
          Swipe horizontally to explore projects across software engineering, machine learning, and mathematical modeling.
        </p>
        
        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin snap-x snap-mandatory">
          {projects.map((project, index) => (
            <div
              key={index}
              onClick={() => setSelectedProject(project)}
              className={
                darkMode
                  ? "min-w-[290px] md:min-w-[380px] bg-zinc-900/20 border border-zinc-850 rounded-2xl p-5 hover:border-cyan-500 transition cursor-pointer flex flex-col justify-between snap-start"
                  : "min-w-[290px] md:min-w-[380px] bg-white border border-zinc-200 rounded-2xl p-5 hover:border-cyan-500 transition cursor-pointer flex flex-col justify-between snap-start shadow-sm"
              }
            >
              <div>
                <div className="h-44 w-full rounded-xl overflow-hidden mb-4">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                </div>
                <h3 className={`text-lg font-bold tracking-tight mb-2 truncate ${darkMode ? "text-zinc-100" : "text-zinc-900"}`}>{project.title}</h3>
                <p className={`text-xs leading-relaxed line-clamp-4 ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
                  {project.desc}
                </p>
              </div>

              <div className="mt-5 flex justify-between items-center">
                <div className="flex gap-1.5 overflow-hidden">
                  {project.tags.slice(0, 2).map((tag, tIdx) => (
                    <span key={tIdx} className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/10 shrink-0 font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-cyan-400 font-semibold shrink-0">Explore →</span>
              </div>
            </div>
          ))}

          {/* View More Box */}
          <div 
            className={`min-w-[240px] rounded-2xl border border-dashed flex flex-col items-center justify-center text-center p-5 transition snap-start group ${
              darkMode 
                ? "bg-gradient-to-b from-transparent to-cyan-500/5 border-zinc-800 hover:border-cyan-500" 
                : "bg-gradient-to-b from-transparent to-cyan-500/5 border-zinc-300 hover:border-cyan-500"
            }`}
          >
            <div className="text-3xl text-cyan-400 mb-3 transform group-hover:translate-y-[-2px] transition duration-300">
              <FaFolderPlus />
            </div>
            <h3 className={`text-base font-bold ${darkMode ? "text-zinc-200" : "text-zinc-800"}`}>More to Come</h3>
            <p className={`text-[11px] max-w-[160px] leading-relaxed mb-4 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>
              Developing future applications and core engineering systems.
            </p>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer"
              className="text-xs px-3.5 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20 hover:bg-cyan-500 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Popup Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl w-full max-w-2xl max-h-[80vh] border flex flex-col md:flex-row overflow-hidden shadow-xl ${darkMode ? "bg-[#0c0c0e] border-zinc-800" : "bg-white border-zinc-200"}`}>
            <div className="md:w-1/2 p-4 flex items-center justify-center bg-black/5">
              <img src={selectedProject.image} alt={selectedProject.title} className="max-h-[200px] md:max-h-[300px] w-full object-cover rounded-xl" />
            </div>
            <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
              <div>
                <h2 className={`text-xl font-bold tracking-tight mb-2.5 ${darkMode ? "text-zinc-100" : "text-zinc-900"}`}>{selectedProject.title}</h2>
                <p className={`text-xs leading-relaxed ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
                  {selectedProject.desc}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {selectedProject.tags.map((tag, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 📌 จุดที่เพิ่มเข้ามา: ปุ่มกดดาวน์โหลด/ดูไฟล์ */}
                {selectedProject.links && (
                  <div className={`mt-5 pt-5 border-t ${darkMode ? "border-zinc-800" : "border-zinc-100"}`}>
                    <h4 className={`text-[10px] uppercase font-bold tracking-wider mb-2.5 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>Project Files & Assets</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.links.map((link, i) => (
                        <a 
                          key={i} 
                          href={link.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-[11px] px-3.5 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20 hover:bg-cyan-500 hover:text-white transition-colors"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="mt-6 bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-4 py-2 rounded-lg font-bold text-xs w-fit self-end hover:opacity-95 transition shadow-sm"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Section */}
      <section id="contact" className="max-w-5xl mx-auto px-6 md:px-12 py-16">
        <h2 className={`text-2xl font-bold tracking-tight mb-6 ${darkMode ? "text-zinc-100" : "text-zinc-900"}`}>Contact & Network</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-xl border transition-colors hover:border-cyan-500/40 flex flex-col justify-between ${darkMode ? "bg-zinc-900/20 border-zinc-850" : "bg-white border-zinc-200 shadow-sm"}`}>
            <div>
              <div className="text-lg text-[#ea4335] mb-1.5"><SiMaildotru /></div>
              <span className={`text-[10px] uppercase font-bold tracking-wider ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>Email</span>
            </div>
            <a href="mailto:kittithat8673@gmail.com" className={`text-xs font-semibold hover:underline break-all mt-2 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>kittithat8673@gmail.com</a>
          </div>
          
          <div className={`p-4 rounded-xl border transition-colors hover:border-cyan-500/40 flex flex-col justify-between ${darkMode ? "bg-zinc-900/20 border-zinc-850" : "bg-white border-zinc-200 shadow-sm"}`}>
            <div>
              <div className="text-lg text-zinc-400 dark:text-zinc-200 mb-1.5"><FaGithub /></div>
              <span className={`text-[10px] uppercase font-bold tracking-wider ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>GitHub</span>
            </div>
            <a href="https://github.com" target="_blank" rel="noreferrer" className={`text-xs font-semibold hover:underline mt-2 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>github.com/yourname</a>
          </div>
          
          <div className={`p-4 rounded-xl border transition-colors hover:border-cyan-500/40 flex flex-col justify-between ${darkMode ? "bg-zinc-900/20 border-zinc-850" : "bg-white border-zinc-200 shadow-sm"}`}>
            <div>
              <div className="text-lg text-[#e1306c] mb-1.5"><FaInstagram /></div>
              <span className={`text-[10px] uppercase font-bold tracking-wider ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>Instagram</span>
            </div>
            <span className={`text-xs font-semibold mt-2 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>icekung_114</span>
          </div>
          
          <div className={`p-4 rounded-xl border transition-colors hover:border-cyan-500/40 flex flex-col justify-between ${darkMode ? "bg-zinc-900/20 border-zinc-850" : "bg-white border-zinc-200 shadow-sm"}`}>
            <div>
              <div className="text-lg text-green-500 mb-1.5"><FaPhoneAlt /></div>
              <span className={`text-[10px] uppercase font-bold tracking-wider ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>Phone</span>
            </div>
            <span className={`text-xs font-semibold mt-2 ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>081-146-8673</span>
          </div>
        </div>
      </section>

      {/* Comments Section */}
      <section id="comments" className={`max-w-5xl mx-auto px-6 md:px-12 py-16 border-t ${darkMode ? "border-zinc-900" : "border-zinc-200"}`}>
        <h2 className={`text-2xl font-bold tracking-tight mb-6 ${darkMode ? "text-zinc-100" : "text-zinc-900"}`}>Guestbook</h2>
        <div className={`p-5 rounded-2xl border mb-6 ${darkMode ? "bg-zinc-900/10 border-zinc-850" : "bg-white border-zinc-200 shadow-sm"}`}>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full p-3 rounded-xl mb-3 border text-xs outline-none transition-colors ${darkMode ? "bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-cyan-500" : "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-cyan-500"}`}
          />
          <textarea
            placeholder="Leave a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`w-full h-28 p-3 rounded-xl border text-xs outline-none transition-colors resize-none ${darkMode ? "bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-cyan-500" : "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-cyan-500"}`}
          />
          <button onClick={sendMessage} className="mt-2 bg-gradient-to-r from-cyan-500 to-purple-500 px-5 py-2.5 rounded-lg font-bold text-xs text-white hover:opacity-95 transition-opacity">
            Send Message
          </button>
        </div>

        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c.id} className={`p-4 rounded-xl border ${darkMode ? "bg-zinc-900/20 border-zinc-850" : "bg-white border-zinc-200 shadow-sm"}`}>
              <h4 className="text-cyan-400 font-bold text-xs">{c.name}</h4>
              <p className={`text-xs mt-1.5 leading-relaxed ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>{c.message}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className={`text-center py-8 text-[11px] font-medium border-t ${darkMode ? "border-zinc-900 text-zinc-600" : "border-zinc-200 text-zinc-400"}`}>
        © 2026 Kittithat Dokboua. All rights reserved.
      </footer>
    </div>
  );
}