// src/App.jsx
import { useState, useEffect } from "react";
import { 
  FaJava, FaPython, FaLinux, FaNetworkWired, FaReact, 
  FaGithub, FaInstagram, FaPhoneAlt, FaFolderPlus,
  FaAward, FaGraduationCap, FaArrowUp, FaTimes, FaExpand,
  FaCheckCircle, FaHeart, FaChevronRight, FaTerminal, FaCode
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
  serverTimestamp 
} from "firebase/firestore";

// Helper for GitHub Pages asset resolution
const baseAsset = (path) => `${import.meta.env.BASE_URL}${path.startsWith('/') ? path.slice(1) : path}`;

// ==========================================
// DATA ZONE
// ==========================================

const skillCategories = [
  {
    title: "Core & Systems Engineering",
    list: [
      { name: "Linux Systems", icon: <FaLinux className="text-[#fdb514]" />, glowColor: "group-hover:border-[#fdb514]/60 group-hover:shadow-[#fdb514]/20" },
      { name: "Networking", icon: <FaNetworkWired className="text-[#0052cc]" />, glowColor: "group-hover:border-[#0052cc]/60 group-hover:shadow-[#0052cc]/20" },
      { name: "Digital Logic Design", icon: <GiCpu className="text-[#a855f7]" />, glowColor: "group-hover:border-[#a855f7]/60 group-hover:shadow-[#a855f7]/20" },
      { name: "Fundamentals of Electronics", icon: <GiCircuitry className="text-[#ef4444]" />, glowColor: "group-hover:border-[#ef4444]/60 group-hover:shadow-[#ef4444]/20" },
    ]
  },
  {
    title: "Software & Web Development",
    list: [
      { name: "Java", icon: <FaJava className="text-[#f89820]" />, glowColor: "group-hover:border-[#f89820]/60 group-hover:shadow-[#f89820]/20" },
      { name: "Python", icon: <FaPython className="text-[#3776ab]" />, glowColor: "group-hover:border-[#3776ab]/60 group-hover:shadow-[#3776ab]/20" },
      { name: "JavaScript", icon: <SiJavascript className="text-[#f7df1e]" />, glowColor: "group-hover:border-[#f7df1e]/60 group-hover:shadow-[#f7df1e]/20" },
      { name: "React", icon: <FaReact className="text-[#61dafb]" />, glowColor: "group-hover:border-[#61dafb]/60 group-hover:shadow-[#61dafb]/20" },
      { name: "Tailwind CSS", icon: <SiTailwindcss className="text-[#06b6d4]" />, glowColor: "group-hover:border-[#06b6d4]/60 group-hover:shadow-[#06b6d4]/20" },
    ]
  }
];

const skillNames = {
  en: {
    "Linux Systems": "Linux Systems",
    "Networking": "Networking",
    "Digital Logic Design": "Digital Logic Design",
    "Fundamentals of Electronics": "Fundamentals of Electronics",
    "Java": "Java",
    "Python": "Python",
    "JavaScript": "JavaScript",
    "React": "React",
    "Tailwind CSS": "Tailwind CSS"
  },
  th: {
    "Linux Systems": "ระบบปฏิบัติการ Linux",
    "Networking": "ระบบเครือข่าย",
    "Digital Logic Design": "การออกแบบตรรกะดิจิทัล",
    "Fundamentals of Electronics": "พื้นฐานอิเล็กทรอนิกส์",
    "Java": "ภาษา Java",
    "Python": "ภาษา Python",
    "JavaScript": "ภาษา JavaScript",
    "React": "ไลบรารี React",
    "Tailwind CSS": "Tailwind CSS"
  }
};

const projects = {
  en: [
    {
      title: "Fourier Series Calculator & Plotter",
      desc: "A Python desktop application built with Tkinter, NumPy, SciPy, and Matplotlib. It computes Fourier coefficients using numerical integration and dynamically visualizes the convergence of trigonometric series against original periodic functions, supporting both single and piecewise functions.",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=60",
      tags: ["Python", "Tkinter", "SciPy", "Matplotlib", "Math Modeling"],
      links: [
        { label: "📄 Full Report (PDF)", url: baseAsset("fourier_report.pdf") },
        { label: "💻 Source Code (.py)", url: baseAsset("fourier_series.py") }
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
    }
  ],
  th: [
    {
      title: "เครื่องคำนวณและวาดกราฟอนุกรมฟูเรียร์",
      desc: "แอปพลิเคชันเดสก์ท็อป Python ที่พัฒนาขึ้นด้วย Tkinter, NumPy, SciPy และ Matplotlib คำนวณสัมประสิทธิ์อนุกรมฟูเรียร์ด้วยการหาปริพันธ์เชิงตัวเลขและแสดงภาพความสอดคล้องและการลู่เข้าของอนุกรมตรีโกณมิติเปรียบเทียบกับฟังก์ชันคาบดั้งเดิม รองรับทั้งฟังก์ชันเดี่ยวและฟังก์ชันเป็นช่วง",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=60",
      tags: ["Python", "Tkinter", "SciPy", "Matplotlib", "การจำลองทางคณิตศาสตร์"],
      links: [
        { label: "📄 รายงานฉบับเต็ม (PDF)", url: baseAsset("fourier_report.pdf") },
        { label: "💻 ซอร์สโค้ด (.py)", url: baseAsset("fourier_series.py") }
      ]
    },
    {
      title: "DropHere: การจัดการขยะอิเล็กทรอนิกส์",
      desc: "แนวคิดแอปพลิเคชันที่ออกแบบมาเพื่อติดตามและเพิ่มประสิทธิภาพจุดทิ้งขยะอิเล็กทรอนิกส์ มีการผสานรวมแผนที่และอัลกอริทึมการคำนวณวงจรชีวิตของฮาร์ดแวร์เพื่อช่วยให้ชุมชนและนักศึกษาจัดการขยะได้อย่างคุ้มค่าและปลอดภัย",
      image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&auto=format&fit=crop&q=60",
      tags: ["Android Studio", "Java", "Firebase", "การออกแบบระบบ"]
    },
    {
      title: "แบบจำลอง ML ทำนายความเสี่ยงเครดิต",
      desc: "พัฒนาและเปรียบเทียบอัลกอริทึมการถดถอยโลจิสติก (Logistic Regression) และซัปพอร์ตเวกเตอร์แมชชีน (SVM) โดยใช้ชุดข้อมูลสินเชื่อเยอรมัน เน้นที่การแปลงลอการิทึมและการปรับความแม่นยำและระดับการระลึกในชุดข้อมูลที่ไม่สมดุล",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=60",
      tags: ["Python", "การเรียนรู้ของเครื่อง", "วิทยาการข้อมูล", "Scikit-Learn"]
    },
    {
      title: "เครื่องวิเคราะห์วงจรตอบสนองชั่วครู่",
      desc: "พัฒนาสคริปต์คำนวณโดยใช้วิธีเชิงตัวเลขเพื่อวิเคราะห์และจำลองการตอบสนองชั่วครู่ (Transient Responses) ในวงจรเครือข่าย RL, RC และ RLC ที่มีความซับซ้อนตามกฎของ Kirchhoff การวิเคราะห์โหนด/เมช และการคำนวณเมทริกซ์",
      image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=60",
      tags: ["Python", "การวิเคราะห์วงจร", "คณิตศาสตร์วิศวกรรม"]
    }
  ]
};

const certificates = {
  en: [
    {
      id: "cert-linux",
      title: "Linux Systems & Network Architecture",
      issuer: "Systems Engineering Institute",
      date: "2025",
      image: baseAsset("cert_linux.jpg"),
      desc: "Course completion in Linux Administration basics, Shell Scripting, Network Concepts, and System Infrastructure fundamentals.",
      tags: ["Linux", "Networking", "Systems Basics"]
    },
    {
      id: "cert-python",
      title: "Python Scientific Computing & Fourier Analysis",
      issuer: "Engineering Computation Board",
      date: "2025",
      image: baseAsset("cert_python.jpg"),
      desc: "Course completion in numerical Fourier coefficient calculations, SciPy integration, and mathematical modeling.",
      tags: ["Python", "SciPy", "Math Modeling"]
    },
    {
      id: "cert-fullstack",
      title: "Full Stack Web Application Architecture",
      issuer: "Modern Web Engineering Academy",
      date: "2026",
      image: baseAsset("cert_fullstack.jpg"),
      desc: "Course completion in React application development, Vite tooling, Tailwind UI components, and Firebase database integration.",
      tags: ["React", "Full Stack", "Firebase"]
    },
    {
      id: "cert-circuits",
      title: "Digital Logic Design & Transient Analysis",
      issuer: "Computer Engineering Department",
      date: "2025",
      image: baseAsset("cert_circuits.jpg"),
      desc: "Course completion in Transient Response numerical simulation (RL, RC, RLC), Kirchhoff's laws, and digital logic gates.",
      tags: ["Digital Logic", "Circuits", "Electronics"]
    }
  ],
  th: [
    {
      id: "cert-linux",
      title: "ระบบปฏิบัติการ Linux & โครงสร้างพื้นฐานเครือข่าย",
      issuer: "สถาบันวิศวกรรมระบบและระบบเครือข่าย",
      date: "2025",
      image: baseAsset("cert_linux.jpg"),
      desc: "ใบรับรองการผ่านหลักสูตรเรียนรู้ระบบปฏิบัติการ Linux, Shell Scripting และพื้นฐานระบบเครือข่าย",
      tags: ["Linux", "ระบบเครือข่าย", "วิศวกรรมระบบ"]
    },
    {
      id: "cert-python",
      title: "การประมวลผลคณิตศาสตร์ & อนุกรมฟูเรียร์ด้วย Python",
      issuer: "สถาบันคำนวณและจำลองทางวิศวกรรม",
      date: "2025",
      image: baseAsset("cert_python.jpg"),
      desc: "ใบรับรองการผ่านหลักสูตรคำนวณสัมประสิทธิ์อนุกรมฟูเรียร์เชิงตัวเลขและการใช้งาน Python SciPy",
      tags: ["Python", "SciPy", "คณิตศาสตร์วิศวกรรม"]
    },
    {
      id: "cert-fullstack",
      title: "สถาปัตยกรรมเว็บแอปพลิเคชัน Full Stack & React",
      issuer: "สถาบันพัฒนาซอฟต์แวร์และเว็บสมัยใหม่",
      date: "2026",
      image: baseAsset("cert_fullstack.jpg"),
      desc: "ใบรับรองการผ่านหลักสูตรพัฒนาเว็บแอปพลิเคชันด้วย React, Vite, Tailwind CSS และ Firebase",
      tags: ["React", "Full Stack", "Firebase"]
    },
    {
      id: "cert-circuits",
      title: "การออกแบบตรรกศาสตร์ดิจิทัล & วิเคราะห์วงจร",
      issuer: "ภาควิชาวิศวกรรมคอมพิวเตอร์",
      date: "2025",
      image: baseAsset("cert_circuits.jpg"),
      desc: "ใบรับรองการผ่านหลักสูตรจำลองการตอบสนองชั่วครู่ (Transient Responses) และตรรกศาสตร์ดิจิทัล",
      tags: ["ตรรกศาสตร์ดิจิทัล", "วิเคราะห์วงจร", "อิเล็กทรอนิกส์"]
    }
  ]
};

const translations = {
  en: {
    navAbout: "About",
    navSkills: "Skills",
    navProjects: "Projects",
    navCerts: "Certificates",
    navContact: "Contact",
    navComments: "Guestbook",
    heroSub: "Computer Engineering Student",
    heroTitle: "Hi, I am",
    heroName: "Kittithat Dokboua",
    heroDesc: "A passionate developer and System Engineering enthusiast with foundational knowledge in both hardware infrastructure and scalable web applications. Driven by curiosity and a strong eagerness to learn, I enjoy exploring modern digital architectures and continuously improving my technical skills.",
    heroViewWork: "View My Work",
    heroTalk: "Let's Talk",
    profileName: "Kittithat Dokboua (ICE)",
    profileUni: "Srinakharinwirot University (SWU)",
    profileSub: "Computer Engineering Student",
    aboutTitle: "About Me",
    aboutIntroTitle: "Introduction",
    aboutIntroDesc: "Hello, I'm Kittithat. I am a passionate Developer and System Engineering enthusiast with a strong interest in Web Development, system design, and systems thinking. I thrive on learning new technologies and love building modern, scalable applications that balance clean code with robust system logic.",
    aboutEduTitle: "Education",
    aboutEduDegree: "Computer Engineering",
    aboutEduUni: "Srinakharinwirot University",
    aboutEduPeriod: "2025 - Present",
    aboutIntTitle: "Interests",
    aboutInterests: [
      "Application Development",
      "System Engineering (Cloud & Edge AI)",
      "Linux & Networking",
      "Electronics & Circuit Analysis",
      "Digital Logic"
    ],
    skillsTitle: "Technical Skillset",
    skillsCategories: {
      "Core & Systems Engineering": "Core & Systems Engineering",
      "Software & Web Development": "Software & Web Development"
    },
    projectsTitle: "Engineering Projects",
    projectsSub: "Swipe horizontally to explore projects across software engineering, machine learning, and mathematical modeling.",
    projectFilesTitle: "Project Files & Assets",
    projectClose: "Close Details",
    projectMoreTitle: "More to Come",
    projectMoreDesc: "Developing future applications and core engineering systems.",
    projectMoreBtn: "GitHub",
    certsTitle: "Certificates & Coursework",
    certsSub: "Swipe horizontally to explore official course completion certificates and academic credentials.",
    certsView: "View Certificate",
    certModalClose: "Close Preview",
    contactTitle: "Contact & Network",
    contactEmail: "Email",
    contactGithub: "GitHub",
    contactInstagram: "Instagram",
    contactPhone: "Phone",
    guestbookTitle: "Guestbook",
    guestbookNamePlaceholder: "Your Name",
    guestbookMsgPlaceholder: "Leave a message...",
    guestbookSendBtn: "Send Message",
    guestbookSuccess: "Message sent successfully! (It will be saved privately in the database)",
    footer: "© 2026 Kittithat Dokboua. All rights reserved.",
    dogDogName: "Buddy 🐶 (ICE's AI Dog Helper)",
    dogTips: [
      "Woof! 🐶 Welcome to Kittithat (ICE)'s portfolio! Click me anytime for helpful tips!",
      "ICE is a Computer Engineering student at SWU who loves learning both Hardware & Software! 💻⚙️",
      "Scroll down to explore Fourier Calculator & E-Waste Management projects! 🚀",
      "Check out ICE's Certificates in Linux, Python, React & Circuit Logic! 📜",
      "Feel free to leave a friendly note in the Guestbook below! ✍️"
    ],
    backToTop: "Back to Top"
  },
  th: {
    navAbout: "เกี่ยวกับฉัน",
    navSkills: "ทักษะ",
    navProjects: "ผลงาน",
    navCerts: "ใบประกาศนียบัตร",
    navContact: "ติดต่อ",
    navComments: "สมุดเยี่ยมชม",
    heroSub: "นักศึกษาวิศวกรรมคอมพิวเตอร์",
    heroTitle: "สวัสดีครับ ผมชื่อ",
    heroName: "กิตติธัช ดอกบัว",
    heroDesc: "นักพัฒนาที่มีความมุ่งมั่นและผู้สนใจในระบบวิศวกรรม (System Engineering) ที่มีพื้นฐานทั้งด้านโครงสร้างพื้นฐานฮาร์ดแวร์และเว็บแอปพลิเคชันที่พร้อมรองรับการขยายตัว ขับเคลื่อนด้วยความอยากรู้อยากเห็นและพร้อมเรียนรู้สิ่งใหม่ๆ อยู่เสมอ ผมชอบที่จะค้นหาและพัฒนาสถาปัตยกรรมดิจิทัลที่ทันสมัยเพื่อยกระดับทักษะความสามารถของตนเอง",
    heroViewWork: "ดูผลงานของผม",
    heroTalk: "พูดคุยกัน",
    profileName: "กิตติธัช ดอกบัว (ไอซ์)",
    profileUni: "มหาวิทยาลัยศรีนครินทรวิโรฒ (มศว)",
    profileSub: "นักศึกษาวิศวกรรมคอมพิวเตอร์",
    aboutTitle: "เกี่ยวกับฉัน",
    aboutIntroTitle: "แนะนำตัว",
    aboutIntroDesc: "สวัสดีครับ ผมกิตติทัศน์ ผมเป็นนักพัฒนาซอฟต์แวร์และผู้สนใจด้านระบบวิศวกรรมที่มีความหลงใหลในการพัฒนาเว็บ การออกแบบระบบ และการคิดเชิงระบบ ผมรักการเรียนรู้เทคโนโลยีใหม่ๆ และชอบสร้างแอปพลิเคชันที่ทันสมัย ทรงพลัง และยืดหยุ่น โดยมุ่งเน้นการเขียนโค้ดที่สะอาดควบคู่กับตรรกะระบบที่เสถียร",
    aboutEduTitle: "ประวัติการศึกษา",
    aboutEduDegree: "วิศวกรรมคอมพิวเตอร์",
    aboutEduUni: "มหาวิทยาลัยศรีนครินทรวิโรฒ",
    aboutEduPeriod: "2025 - ปัจจุบัน",
    aboutIntTitle: "ความสนใจ",
    aboutInterests: [
      "การพัฒนาแอปพลิเคชัน",
      "วิศวกรรมระบบ (Cloud & Edge AI)",
      "Linux และระบบเครือข่าย",
      "อิเล็กทรอนิกส์และการวิเคราะห์วงจร",
      "ตรรกศาสตร์ดิจิทัล (Digital Logic)"
    ],
    skillsTitle: "ทักษะทางเทคนิค",
    skillsCategories: {
      "Core & Systems Engineering": "วิศวกรรมระบบและแกนหลัก",
      "Software & Web Development": "การพัฒนาซอฟต์แวร์และเว็บ"
    },
    projectsTitle: "โครงการทางวิศวกรรม",
    projectsSub: "เลื่อนในแนวนอนเพื่อสำรวจโครงการต่างๆ ทั้งวิศวกรรมซอฟต์แวร์, การเรียนรู้ของเครื่อง, และการสร้างแบบจำลองทางคณิตศาสตร์",
    projectFilesTitle: "ไฟล์และข้อมูลโครงการ",
    projectClose: "ปิด",
    projectMoreTitle: "ผลงานเพิ่มเติมเร็วๆ นี้",
    projectMoreDesc: "กำลังพัฒนาแอปพลิเคชันและระบบวิศวกรรมหลักอื่นๆ เพิ่มเติมในอนาคต",
    projectMoreBtn: "กิตฮับ (GitHub)",
    certsTitle: "ใบประกาศนียบัตร & วุฒิบัตร",
    certsSub: "เลื่อนในแนวนอนเพื่อสำรวจใบประกาศนียบัตรและวุฒิบัตรทางวิชาการ",
    certsView: "ดูใบประกาศ",
    certModalClose: "ปิดหน้าต่าง",
    contactTitle: "ช่องทางการติดต่อ",
    contactEmail: "อีเมล",
    contactGithub: "กิตฮับ (GitHub)",
    contactInstagram: "อินสตาแกรม (Instagram)",
    contactPhone: "เบอร์โทรศัพท์",
    guestbookTitle: "สมุดเยี่ยมชม",
    guestbookNamePlaceholder: "ชื่อของคุณ",
    guestbookMsgPlaceholder: "พิมพ์ข้อความที่นี่...",
    guestbookSendBtn: "ส่งข้อความ",
    guestbookSuccess: "ส่งข้อความเรียบร้อยแล้ว! (ข้อความจะถูกบันทึกอย่างปลอดภัยในฐานข้อมูล)",
    footer: "© 2026 กิตติธัช ดอกบัว. สงวนลิขสิทธิ์ทั้งหมด",
    dogDogName: "บัดดี้ 🐶 (โฮ่งน้อยผู้ช่วย)",
    dogTips: [
      "โฮ่ง! 🐶 ยินดีต้อนรับสู่พอร์ตโฟลิโอของพี่ไอซ์ครับ! คลิกที่ตัวผมเพื่อฟังคำแนะนำได้เลยนะ!",
      "พี่ไอซ์เป็นนักศึกษาวิศวกรรมคอมพิวเตอร์ มศว ที่กำลังศึกษาและเรียนรู้ทั้ง Hardware และ Software ครับ! 💻⚙️",
      "เลื่อนลงไปชมโครงการคำนวณอนุกรมฟูเรียร์และแอปจัดการขยะอิเล็กทรอนิกส์ได้เลยนะ โฮ่ง! 🚀",
      "กดดูใบประกาศนียบัตร (Certificates) ของพี่ไอซ์ด้านล่างได้เลยครับ! 📜",
      "อย่าลืมแวะเขียนข้อความทักทายในสมุดเยี่ยมชม (Guestbook) ให้พี่ไอซ์ด้วยน้า! ✍️"
    ],
    backToTop: "เลื่อนกลับขึ้นบน"
  }
};

// ==========================================
// COMPONENT ZONE
// ==========================================
export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [lang, setLang] = useState(() => {
    if (typeof window !== "undefined" && typeof window.localStorage !== "undefined" && window.localStorage !== null) {
      try {
        return localStorage.getItem("portfolio-lang") || "en";
      } catch (e) {
        return "en";
      }
    }
    return "en";
  });

  const [selectedProjectIndex, setSelectedProjectIndex] = useState(null);
  const [selectedCertIndex, setSelectedCertIndex] = useState(null);
  
  // Form State
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll Progress, Active Section & Back to Top State
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  // Interactive Mouse Cursor Spotlight
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });

  // Interactive Dog Mascot State
  const [dogTipIndex, setDogTipIndex] = useState(0);
  const [dogBubbleOpen, setDogBubbleOpen] = useState(true);
  const [sparkles, setSparkles] = useState([]);

  const selectedProject = selectedProjectIndex !== null ? projects[lang][selectedProjectIndex] : null;
  const selectedCert = selectedCertIndex !== null ? certificates[lang][selectedCertIndex] : null;

  // Track Mouse Movement for Futuristic Cursor Glow
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Handle Scroll Events for Progress, Active Section & Back To Top Button
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = windowHeight > 0 ? (totalScroll / windowHeight) * 100 : 0;
      
      setScrollProgress(scrollPercent);
      setShowBackToTop(totalScroll > 280);

      // Active Section Tracking
      const sections = ["about", "skills", "projects", "certificates", "contact", "comments"];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLanguage = () => {
    const nextLang = lang === "th" ? "en" : "th";
    setLang(nextLang);
    if (typeof window !== "undefined" && typeof window.localStorage !== "undefined" && window.localStorage !== null) {
      try {
        localStorage.setItem("portfolio-lang", nextLang);
      } catch (e) {
        // Silently ignore storage errors
      }
    }
  };

  const handleDogClick = (e) => {
    setDogBubbleOpen(true);
    setDogTipIndex((prev) => (prev + 1) % translations[lang].dogTips.length);

    // Create micro-sparkles effect
    const newSparkle = {
      id: Date.now(),
      x: Math.random() * 40 - 20,
      y: Math.random() * -30 - 10
    };
    setSparkles((prev) => [...prev.slice(-4), newSparkle]);
    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id));
    }, 1000);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

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
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to send message. Please try again.");
    }
  }

  return (
    <div
      id="top"
      className={
        darkMode
          ? "overflow-x-hidden min-h-screen font-sans text-zinc-100 bg-[#09090b] bg-cyber-grid transition-colors duration-300 relative"
          : "overflow-x-hidden min-h-screen font-sans text-zinc-900 bg-[#fafafa] transition-colors duration-300 relative"
      }
    >
      {/* Interactive Mouse Glow Spotlight Following Cursor across the Entire Page */}
      <div 
        className="fixed w-[420px] h-[420px] rounded-full bg-cyan-500/15 blur-[120px] pointer-events-none transition-transform duration-100 ease-out z-0 hidden lg:block"
        style={{
          transform: `translate(${mousePos.x - 210}px, ${mousePos.y - 210}px)`
        }}
      />

      {/* Scroll Progress Bar at Top */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-transparent pointer-events-none">
        <div 
          className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 transition-all duration-150 shadow-md shadow-cyan-500/50"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Full-Page Continuous Ambient Glowing Orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Top/Hero Glow */}
        <div className={`absolute top-0 left-0 w-[700px] h-[700px] rounded-full blur-[180px] animate-pulse-glow ${darkMode ? "bg-cyan-500/15" : "bg-cyan-500/5"}`} />
        {/* Mid-Upper/Skills Glow */}
        <div className={`absolute top-[25%] right-0 w-[650px] h-[650px] rounded-full blur-[180px] animate-particle-1 ${darkMode ? "bg-purple-500/15" : "bg-purple-500/5"}`} />
        {/* Center/Projects Glow */}
        <div className={`absolute top-[50%] left-[-100px] w-[700px] h-[700px] rounded-full blur-[180px] animate-particle-2 ${darkMode ? "bg-pink-500/15" : "bg-pink-500/5"}`} />
        {/* Mid-Lower/Certificates Glow */}
        <div className={`absolute top-[70%] right-[-100px] w-[700px] h-[700px] rounded-full blur-[180px] animate-particle-3 ${darkMode ? "bg-cyan-500/15" : "bg-cyan-500/5"}`} />
        {/* Bottom/Guestbook Glow */}
        <div className={`absolute bottom-0 left-[20%] w-[700px] h-[700px] rounded-full blur-[180px] animate-pulse-glow ${darkMode ? "bg-purple-500/15" : "bg-purple-500/5"}`} />
      </div>

      {/* Navbar */}
      <nav className={`px-6 md:px-12 py-4 border-b backdrop-blur-md sticky top-0 z-40 transition-colors ${darkMode ? "border-zinc-800/60 bg-[#09090b]/85 text-zinc-100" : "border-zinc-200 bg-[#fafafa]/90 text-zinc-900 shadow-sm"}`}>
        <div className="max-w-5xl mx-auto flex justify-between items-center w-full">
          <a href="#top" className="text-xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 hover:opacity-90 transition group flex items-center gap-1">
            KITTITHAT.D<span className="text-cyan-400 group-hover:animate-ping">.</span>
          </a>

          {/* Desktop Navigation Links with Active Highlighting */}
          <div className="hidden md:flex items-center gap-6 font-medium text-sm">
            {[
              { id: "about", label: translations[lang].navAbout },
              { id: "skills", label: translations[lang].navSkills },
              { id: "projects", label: translations[lang].navProjects },
              { id: "certificates", label: translations[lang].navCerts },
              { id: "contact", label: translations[lang].navContact },
              { id: "comments", label: translations[lang].navComments }
            ].map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className={`relative py-1 transition-all duration-200 ${
                    isActive 
                      ? "text-cyan-400 font-bold" 
                      : darkMode ? "text-zinc-400 hover:text-cyan-400" : "text-zinc-600 hover:text-cyan-600"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full animate-fadeIn" />
                  )}
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
                darkMode 
                  ? "border-zinc-800 text-zinc-300 bg-zinc-900/60 hover:border-cyan-500 hover:text-cyan-400 shadow-inner" 
                  : "border-zinc-300 text-zinc-700 bg-white hover:border-cyan-600 hover:text-cyan-600 shadow-sm"
              }`}
              title={lang === "th" ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย"}
            >
              <span className={lang === "th" ? "text-cyan-400 font-extrabold" : ""}>TH</span>
              <span className="text-zinc-400">/</span>
              <span className={lang === "en" ? "text-cyan-400 font-extrabold" : ""}>EN</span>
            </button>

            {/* Dark Mode Switcher */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-12 h-7 rounded-full transition-all duration-300 ${darkMode ? "bg-cyan-500 shadow-cyan-500/20" : "bg-zinc-300"}`}
              title="Toggle theme"
            >
              <div className={`absolute top-0.5 w-6 h-6 rounded-full transition-all duration-300 flex items-center justify-center text-xs ${darkMode ? "left-5.5 bg-zinc-950 text-white" : "left-0.5 bg-white text-zinc-900 shadow-sm"}`}>
                {darkMode ? "🌙" : "☀️"}
              </div>
            </button>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg md:hidden transition-colors ${darkMode ? "text-zinc-400 hover:bg-zinc-900" : "text-zinc-600 hover:bg-zinc-100"}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className={`md:hidden mt-4 pt-4 border-t flex flex-col gap-3.5 font-medium text-sm ${darkMode ? "border-zinc-800/50" : "border-zinc-200"}`}>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className={`transition-colors ${darkMode ? "text-zinc-400 hover:text-cyan-400" : "text-zinc-600 hover:text-cyan-600"}`}>{translations[lang].navAbout}</a>
            <a href="#skills" onClick={() => setMobileMenuOpen(false)} className={`transition-colors ${darkMode ? "text-zinc-400 hover:text-cyan-400" : "text-zinc-600 hover:text-cyan-600"}`}>{translations[lang].navSkills}</a>
            <a href="#projects" onClick={() => setMobileMenuOpen(false)} className={`transition-colors ${darkMode ? "text-zinc-400 hover:text-cyan-400" : "text-zinc-600 hover:text-cyan-600"}`}>{translations[lang].navProjects}</a>
            <a href="#certificates" onClick={() => setMobileMenuOpen(false)} className={`transition-colors ${darkMode ? "text-zinc-400 hover:text-cyan-400" : "text-zinc-600 hover:text-cyan-600"}`}>{translations[lang].navCerts}</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className={`transition-colors ${darkMode ? "text-zinc-400 hover:text-cyan-400" : "text-zinc-600 hover:text-cyan-600"}`}>{translations[lang].navContact}</a>
            <a href="#comments" onClick={() => setMobileMenuOpen(false)} className={`transition-colors ${darkMode ? "text-zinc-400 hover:text-cyan-400" : "text-zinc-600 hover:text-cyan-600"}`}>{translations[lang].navComments}</a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-5xl mx-auto px-6 md:px-12 py-12 md:py-20 lg:py-24 grid md:grid-cols-5 gap-8 md:gap-12 items-center">
        <div className="md:col-span-3 text-center md:text-left">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-4 border backdrop-blur-md ${darkMode ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-500/10" : "bg-cyan-50 border-cyan-200 text-cyan-700 shadow-sm"}`}>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            {translations[lang].heroSub}
          </div>
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.15] ${darkMode ? "text-zinc-50" : "text-zinc-900"}`}>
            {translations[lang].heroTitle} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500">
              {translations[lang].heroName}
            </span>
          </h1>
          <p className={`mt-5 text-base leading-relaxed max-w-xl mx-auto md:mx-0 ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
           {translations[lang].heroDesc}
          </p>

          {/* Interactive Floating Code Terminal Window */}
          <div className={`mt-6 p-4 rounded-xl border font-mono text-[11px] leading-relaxed shadow-xl text-left max-w-md ${darkMode ? "bg-zinc-950/90 border-zinc-800 text-zinc-300" : "bg-zinc-900 text-zinc-200"}`}>
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-zinc-800 text-xs text-zinc-500">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span>
              <span className="ml-2 font-sans font-medium text-[10px] text-zinc-400 flex items-center gap-1">
                <FaTerminal className="text-cyan-400 text-[10px]" /> developer_profile.js
              </span>
            </div>
            <div>
              <span className="text-purple-400">const</span> <span className="text-cyan-300">engineer</span> = &#123;<br />
              &nbsp;&nbsp;<span className="text-zinc-400">name:</span> <span className="text-green-400">"Kittithat Dokboua (ICE)"</span>,<br />
              &nbsp;&nbsp;<span className="text-zinc-400">degree:</span> <span className="text-green-400">"Computer Engineering @ SWU"</span>,<br />
              &nbsp;&nbsp;<span className="text-zinc-400">passions:</span> [<span className="text-cyan-300">"System Eng"</span>, <span className="text-purple-300">"Web Apps"</span>, <span className="text-pink-300">"Digital Logic"</span>],<br />
              &nbsp;&nbsp;<span className="text-zinc-400">status:</span> <span className="text-yellow-400">"Always Eager to Learn 🚀"</span><br />
              &#125;;
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-center md:justify-start gap-4 text-sm font-semibold">
            <a href="#projects" className="px-6 py-3.5 rounded-xl text-white font-bold btn-shimmer shadow-lg hover:scale-105 transition-all text-center flex items-center justify-center gap-2">
              {translations[lang].heroViewWork} <FaChevronRight className="text-xs" />
            </a>
            <a href="#certificates" className={`px-6 py-3.5 rounded-xl border transition-all hover:scale-105 text-center flex items-center justify-center gap-2 ${darkMode ? "border-zinc-800 text-zinc-300 hover:bg-zinc-900/50 hover:border-cyan-500/50" : "border-zinc-200 text-zinc-700 hover:bg-zinc-100 shadow-sm hover:border-cyan-400"}`}>
              <FaAward className="text-cyan-400" /> {translations[lang].navCerts}
            </a>
          </div>
        </div>

        {/* Profile Picture Frame */}
        <div className="md:col-span-2 flex justify-center order-first md:order-last">
          <div className={`relative w-full max-w-[280px] p-3.5 rounded-[28px] border transition-all duration-500 hover:scale-[1.02] ${darkMode ? "bg-zinc-900/40 border-cyan-500/30 shadow-2xl shadow-cyan-500/10 hover:border-cyan-400" : "bg-white border-zinc-200 shadow-xl hover:border-cyan-400"}`}>
            <div className="relative overflow-hidden rounded-[20px] group">
              <img
                src={baseAsset("profile.jpg")}
                alt="Profile"
                className="w-full h-[330px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 text-white text-xs font-medium">
                ✨ Computer Engineering Student @ SWU
              </div>
            </div>
            <div className="mt-4 text-center">
              <h3 className={`text-lg font-bold tracking-tight ${darkMode ? "text-zinc-100" : "text-zinc-900"}`}>{translations[lang].profileName}</h3>
              <p className={`text-xs mt-0.5 ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                {translations[lang].profileUni} 
              </p>
              <p className={`text-xs ${darkMode ? "text-zinc-500" : "text-zinc-600"}`}>
                {translations[lang].profileSub}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={`max-w-5xl mx-auto px-6 md:px-12 py-16 border-t ${darkMode ? "border-zinc-900" : "border-zinc-200"}`}>
        <h2 className={`text-2xl font-bold tracking-tight mb-8 ${darkMode ? "text-zinc-100" : "text-zinc-900"}`}>{translations[lang].aboutTitle}</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1.5 ${darkMode ? "bg-zinc-900/40 border-zinc-800 hover:border-cyan-500/60 hover:shadow-xl hover:shadow-cyan-500/10" : "bg-white border-zinc-200/80 shadow-sm hover:border-cyan-400"}`}>
            <h3 className="text-base font-bold text-cyan-400 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span> {translations[lang].aboutIntroTitle}
            </h3>
            <p className={`leading-relaxed text-sm ${darkMode ? "text-zinc-300" : "text-zinc-600"}`}>
             {translations[lang].aboutIntroDesc}
            </p>
          </div>

          <div className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1.5 ${darkMode ? "bg-zinc-900/40 border-zinc-800 hover:border-purple-500/60 hover:shadow-xl hover:shadow-purple-500/10" : "bg-white border-zinc-200/80 shadow-sm hover:border-purple-400"}`}>
            <h3 className="text-base font-bold text-purple-400 mb-3 flex items-center gap-2">
              <FaGraduationCap /> {translations[lang].aboutEduTitle}
            </h3>
            <div className={`space-y-4 leading-relaxed text-sm ${darkMode ? "text-zinc-300" : "text-zinc-600"}`}>
              <div>
                <h4 className={`font-semibold ${darkMode ? "text-zinc-100" : "text-zinc-800"}`}>{translations[lang].aboutEduDegree}</h4>
                <p>{translations[lang].aboutEduUni}</p>
                <p className="text-xs mt-1 opacity-70 text-cyan-400">{translations[lang].aboutEduPeriod}</p>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1.5 ${darkMode ? "bg-zinc-900/40 border-zinc-800 hover:border-pink-500/60 hover:shadow-xl hover:shadow-pink-500/10" : "bg-white border-zinc-200/80 shadow-sm hover:border-pink-400"}`}>
            <h3 className="text-base font-bold text-pink-400 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-400"></span> {translations[lang].aboutIntTitle}
            </h3>
            <ul className={`space-y-2.5 text-sm ${darkMode ? "text-zinc-300" : "text-zinc-600"}`}>
              {translations[lang].aboutInterests.map((interest, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">•</span> {interest}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className={`max-w-5xl mx-auto px-6 md:px-12 py-16 border-t ${darkMode ? "border-zinc-900" : "border-zinc-200"}`}>
        <div className="flex items-center gap-2 mb-8">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 border border-purple-500/30 text-purple-400">
            ⚡ Tech Stack
          </span>
          <h2 className={`text-2xl font-bold tracking-tight ${darkMode ? "text-zinc-100" : "text-zinc-900"}`}>
            {translations[lang].skillsTitle}
          </h2>
        </div>

        <div className="space-y-8">
          {skillCategories.map((category, catIdx) => (
            <div key={catIdx}>
              <h3 className={`text-xs uppercase tracking-widest font-bold mb-3.5 flex items-center gap-2 ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                {translations[lang].skillsCategories[category.title] || category.title}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {category.list.map((skill, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border flex items-center gap-3.5 transition-all duration-300 group hover:-translate-y-1.5 ${skill.glowColor} ${darkMode ? "bg-zinc-900/40 border-zinc-800 hover:shadow-xl" : "bg-white border-zinc-200 hover:border-cyan-400 shadow-sm"}`}
                  >
                    <div className="text-2xl transform group-hover:scale-125 transition duration-300 shrink-0">
                      {skill.icon}
                    </div>
                    <span className={`text-xs font-bold truncate transition-colors ${darkMode ? "text-zinc-300 group-hover:text-cyan-400" : "text-zinc-700 group-hover:text-cyan-600"}`}>
                      {skillNames[lang][skill.name] || skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className={`max-w-5xl mx-auto px-6 md:px-12 py-16 border-t ${darkMode ? "border-zinc-900" : "border-zinc-200"}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-pink-500/10 border border-pink-500/30 text-pink-400">
            🚀 Showcases
          </span>
          <h2 className={`text-2xl font-bold tracking-tight ${darkMode ? "text-zinc-100" : "text-zinc-900"}`}>{translations[lang].projectsTitle}</h2>
        </div>
        <p className={`text-xs mb-8 ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>
          {translations[lang].projectsSub}
        </p>
        
        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin snap-x snap-mandatory">
          {projects[lang].map((project, index) => (
            <div
              key={index}
              onClick={() => setSelectedProjectIndex(index)}
              className={
                darkMode
                  ? "min-w-[290px] md:min-w-[380px] bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 hover:border-cyan-500/60 hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col justify-between snap-start group shadow-xl hover:shadow-cyan-500/15"
                  : "min-w-[290px] md:min-w-[380px] bg-white border border-zinc-200 rounded-2xl p-5 hover:border-cyan-500 hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col justify-between snap-start shadow-sm group hover:shadow-lg"
              }
            >
              <div>
                <div className="h-44 w-full rounded-xl overflow-hidden mb-4 relative bg-zinc-950">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover transform group-hover:scale-108 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-50 group-hover:opacity-20 transition-opacity" />
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-bold text-cyan-300 border border-cyan-500/30">
                    Project #{index + 1}
                  </span>
                </div>
                <h3 className={`text-lg font-bold tracking-tight mb-2 truncate transition-colors group-hover:text-cyan-400 ${darkMode ? "text-zinc-100" : "text-zinc-900"}`}>{project.title}</h3>
                <p className={`text-xs leading-relaxed line-clamp-4 ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
                  {project.desc}
                </p>
              </div>

              <div className="mt-5 flex justify-between items-center">
                <div className="flex gap-1.5 overflow-hidden">
                  {project.tags.slice(0, 2).map((tag, tIdx) => (
                    <span key={tIdx} className="text-[10px] px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0 font-bold">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-cyan-400 font-bold shrink-0 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Explore <FaChevronRight className="text-[10px]" />
                </span>
              </div>
            </div>
          ))}

          {/* View More Box */}
          <div 
            className={`min-w-[240px] rounded-2xl border border-dashed flex flex-col items-center justify-center text-center p-5 transition-all duration-300 snap-start group hover:-translate-y-1.5 ${
              darkMode 
                ? "bg-gradient-to-b from-transparent via-cyan-500/5 to-purple-500/5 border-zinc-800 hover:border-cyan-500" 
                : "bg-gradient-to-b from-transparent via-cyan-500/5 to-purple-500/5 border-zinc-300 hover:border-cyan-500 shadow-sm"
            }`}
          >
            <div className="text-3xl text-cyan-400 mb-3 transform group-hover:scale-110 transition duration-300">
              <FaFolderPlus />
            </div>
            <h3 className={`text-base font-bold ${darkMode ? "text-zinc-200" : "text-zinc-800"}`}>{translations[lang].projectMoreTitle}</h3>
            <p className={`text-[11px] max-w-[160px] leading-relaxed mb-4 ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>
              {translations[lang].projectMoreDesc}
            </p>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer"
              className="text-xs px-4 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20 hover:bg-cyan-500 hover:text-white transition-colors shadow-sm"
            >
              {translations[lang].projectMoreBtn}
            </a>
          </div>
        </div>
      </section>

      {/* Certificates Section */}
      <section id="certificates" className={`max-w-5xl mx-auto px-6 md:px-12 py-16 border-t ${darkMode ? "border-zinc-900" : "border-zinc-200"}`}>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30">
              <FaAward /> Credentials
            </div>
            <h2 className={`text-2xl font-bold tracking-tight ${darkMode ? "text-zinc-100" : "text-zinc-900"}`}>{translations[lang].certsTitle}</h2>
          </div>
          <p className={`text-xs max-w-md ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
            {translations[lang].certsSub}
          </p>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin snap-x snap-mandatory">
          {certificates[lang].map((cert, index) => (
            <div 
              key={cert.id}
              onClick={() => setSelectedCertIndex(index)}
              className={`min-w-[270px] md:min-w-[320px] rounded-2xl border overflow-hidden transition-all duration-300 group cursor-pointer flex flex-col justify-between snap-start hover:-translate-y-2 ${
                darkMode 
                  ? "bg-zinc-900/40 border-zinc-800 hover:border-cyan-500/60 hover:shadow-xl hover:shadow-cyan-500/15" 
                  : "bg-white border-zinc-200 shadow-sm hover:border-cyan-500 hover:shadow-md"
              }`}
            >
              <div>
                <div className="relative h-44 w-full overflow-hidden bg-zinc-950">
                  <img 
                    src={cert.image} 
                    alt={cert.title} 
                    className="w-full h-full object-cover transform group-hover:scale-108 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                  <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-cyan-300 border border-cyan-500/30">
                    {cert.date}
                  </div>
                  <div className="absolute bottom-3 left-3 text-white text-xs font-bold flex items-center gap-1">
                    <FaCheckCircle className="text-cyan-400" /> {cert.issuer}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className={`text-sm font-bold leading-snug mb-2 line-clamp-2 transition-colors group-hover:text-cyan-400 ${darkMode ? "text-zinc-100" : "text-zinc-900"}`}>
                    {cert.title}
                  </h3>
                  <p className={`text-[11px] leading-relaxed line-clamp-3 mb-3 ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
                    {cert.desc}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center justify-between">
                <div className="flex gap-1 overflow-hidden">
                  {cert.tags.slice(0, 2).map((t, idx) => (
                    <span key={idx} className={`text-[9px] px-2.5 py-1 rounded-lg font-bold ${darkMode ? "bg-zinc-800/80 text-zinc-300 border border-zinc-700/50" : "bg-zinc-100 text-zinc-600"}`}>
                      {t}
                    </span>
                  ))}
                </div>
                <span className="text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <FaExpand className="text-[10px]" /> {translations[lang].certsView}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Certificate Lightbox Modal Preview */}
      {selectedCert && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className={`relative rounded-2xl w-full max-w-3xl border overflow-hidden shadow-2xl flex flex-col animate-modal-zoom ${darkMode ? "bg-zinc-950 border-zinc-800 text-zinc-100 shadow-cyan-500/10" : "bg-white border-zinc-200 text-zinc-900"}`}>
            <div className={`flex justify-between items-center p-4 border-b ${darkMode ? "border-zinc-800/60" : "border-zinc-200"}`}>
              <div className="flex items-center gap-2">
                <FaAward className="text-cyan-400 text-lg" />
                <div>
                  <h3 className="text-sm font-bold">{selectedCert.title}</h3>
                  <p className={`text-[10px] ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>{selectedCert.issuer} ({selectedCert.date})</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCertIndex(null)}
                className={`p-1.5 rounded-lg transition ${darkMode ? "bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-800" : "bg-zinc-100 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200"}`}
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-4 flex items-center justify-center bg-black/40">
              <img 
                src={selectedCert.image} 
                alt={selectedCert.title} 
                className="max-h-[60vh] w-auto object-contain rounded-lg border border-zinc-800 shadow-md"
              />
            </div>

            <div className={`p-4 flex justify-between items-center border-t text-xs ${darkMode ? "border-zinc-800/60" : "border-zinc-200"}`}>
              <p className={`max-w-md ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>{selectedCert.desc}</p>
              <button
                onClick={() => setSelectedCertIndex(null)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold hover:opacity-90 transition shrink-0 shadow-sm"
              >
                {translations[lang].certModalClose}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl w-full max-w-2xl max-h-[90vh] md:max-h-[80vh] border flex flex-col md:flex-row overflow-hidden shadow-xl animate-modal-zoom ${darkMode ? "bg-[#0c0c0e] border-zinc-800 shadow-cyan-500/10" : "bg-white border-zinc-200"}`}>
            <div className="md:w-1/2 p-4 flex items-center justify-center bg-black/5 shrink-0">
              <img src={selectedProject.image} alt={selectedProject.title} className="max-h-[160px] md:max-h-[300px] w-full object-cover rounded-xl shadow-md" />
            </div>
            <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto min-h-0">
              <div>
                <h2 className={`text-xl font-bold tracking-tight mb-2.5 ${darkMode ? "text-zinc-100" : "text-zinc-900"}`}>{selectedProject.title}</h2>
                <p className={`text-xs leading-relaxed ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
                  {selectedProject.desc}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {selectedProject.tags.map((tag, i) => (
                    <span key={i} className="text-[10px] px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                      {tag}
                    </span>
                  ))}
                </div>

                {selectedProject.links && (
                  <div className={`mt-5 pt-5 border-t ${darkMode ? "border-zinc-800" : "border-zinc-100"}`}>
                    <h4 className={`text-[10px] uppercase font-bold tracking-wider mb-2.5 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>{translations[lang].projectFilesTitle}</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.links.map((link, i) => (
                        <a 
                          key={i} 
                          href={link.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className={`flex items-center gap-1.5 text-[11px] px-3.5 py-2 rounded-lg font-bold border transition-colors ${
                            darkMode 
                              ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500 hover:text-white" 
                              : "bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-500 hover:text-white"
                          }`}
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

              </div>
              <button
                onClick={() => setSelectedProjectIndex(null)}
                className="mt-6 bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs w-fit self-end hover:opacity-95 transition shadow-sm"
              >
                {translations[lang].projectClose}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Section */}
      <section id="contact" className={`max-w-5xl mx-auto px-6 md:px-12 py-16 border-t ${darkMode ? "border-zinc-900" : "border-zinc-200"}`}>
        <h2 className={`text-2xl font-bold tracking-tight mb-6 ${darkMode ? "text-zinc-100" : "text-zinc-900"}`}>{translations[lang].contactTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-xl border transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-500/50 flex flex-col justify-between ${darkMode ? "bg-zinc-900/40 border-zinc-800 hover:shadow-xl hover:shadow-cyan-500/10" : "bg-white border-zinc-200 shadow-sm"}`}>
            <div>
              <div className="text-lg text-[#ea4335] mb-1.5"><SiMaildotru /></div>
              <span className={`text-[10px] uppercase font-bold tracking-wider ${darkMode ? "text-zinc-400" : "text-zinc-400"}`}>{translations[lang].contactEmail}</span>
            </div>
            <a href="mailto:kittithat8673@gmail.com" className={`text-xs font-semibold hover:underline break-all mt-2 ${darkMode ? "text-zinc-200" : "text-zinc-700"}`}>kittithat8673@gmail.com</a>
          </div>
          
          <div className={`p-4 rounded-xl border transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-500/50 flex flex-col justify-between ${darkMode ? "bg-zinc-900/40 border-zinc-800 hover:shadow-xl hover:shadow-cyan-500/10" : "bg-white border-zinc-200 shadow-sm"}`}>
            <div>
              <div className="text-lg text-zinc-300 dark:text-zinc-200 mb-1.5"><FaGithub /></div>
              <span className={`text-[10px] uppercase font-bold tracking-wider ${darkMode ? "text-zinc-400" : "text-zinc-400"}`}>{translations[lang].contactGithub}</span>
            </div>
            <a href="https://github.com/icekung11" target="_blank" rel="noreferrer" className={`text-xs font-semibold hover:underline mt-2 ${darkMode ? "text-zinc-200" : "text-zinc-700"}`}>icekung11</a>
          </div>
          
          <div className={`p-4 rounded-xl border transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-500/50 flex flex-col justify-between ${darkMode ? "bg-zinc-900/40 border-zinc-800 hover:shadow-xl hover:shadow-cyan-500/10" : "bg-white border-zinc-200 shadow-sm"}`}>
            <div>
              <div className="text-lg text-[#e1306c] mb-1.5"><FaInstagram /></div>
              <span className={`text-[10px] uppercase font-bold tracking-wider ${darkMode ? "text-zinc-400" : "text-zinc-400"}`}>{translations[lang].contactInstagram}</span>
            </div>
            <span className={`text-xs font-semibold mt-2 ${darkMode ? "text-zinc-200" : "text-zinc-700"}`}>icekung_114</span>
          </div>
          
          <div className={`p-4 rounded-xl border transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-500/50 flex flex-col justify-between ${darkMode ? "bg-zinc-900/40 border-zinc-800 hover:shadow-xl hover:shadow-cyan-500/10" : "bg-white border-zinc-200 shadow-sm"}`}>
            <div>
              <div className="text-lg text-green-500 mb-1.5"><FaPhoneAlt /></div>
              <span className={`text-[10px] uppercase font-bold tracking-wider ${darkMode ? "text-zinc-400" : "text-zinc-400"}`}>{translations[lang].contactPhone}</span>
            </div>
            <span className={`text-xs font-semibold mt-2 ${darkMode ? "text-zinc-200" : "text-zinc-700"}`}>081-146-8673</span>
          </div>
        </div>
      </section>

      {/* Comments Section */}
      <section id="comments" className={`max-w-5xl mx-auto px-6 md:px-12 py-16 border-t ${darkMode ? "border-zinc-900" : "border-zinc-200"}`}>
        <h2 className={`text-2xl font-bold tracking-tight mb-6 ${darkMode ? "text-zinc-100" : "text-zinc-900"}`}>{translations[lang].guestbookTitle}</h2>
        <div className={`p-6 rounded-2xl border backdrop-blur-md ${darkMode ? "bg-zinc-900/30 border-zinc-800 shadow-xl" : "bg-white border-zinc-200 shadow-sm"}`}>
          <input
            type="text"
            placeholder={translations[lang].guestbookNamePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full p-3.5 rounded-xl mb-3 border text-xs outline-none transition-all ${
              darkMode 
                ? "bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-cyan-500 focus:shadow-md focus:shadow-cyan-500/10" 
                : "bg-white border-zinc-300 text-zinc-900 focus:border-cyan-600"
            }`}
          />
          <textarea
            placeholder={translations[lang].guestbookMsgPlaceholder}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`w-full h-28 p-3.5 rounded-xl border text-xs outline-none transition-all resize-none ${
              darkMode 
                ? "bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-cyan-500 focus:shadow-md focus:shadow-cyan-500/10" 
                : "bg-white border-zinc-300 text-zinc-900 focus:border-cyan-600"
            }`}
          />
          <button onClick={sendMessage} className="mt-2 text-white font-bold btn-shimmer px-6 py-3 rounded-xl text-xs hover:opacity-95 transition-all shadow-lg hover:scale-105">
            {translations[lang].guestbookSendBtn}
          </button>
          
          {showSuccess && (
            <div className="mt-3 text-xs text-green-500 font-semibold animate-pulse flex items-center gap-1.5">
              <FaCheckCircle /> {translations[lang].guestbookSuccess}
            </div>
          )}
        </div>
      </section>

      {/* Interactive Dog Mascot Assistant */}
      <div className="fixed bottom-6 right-20 z-40 flex flex-col items-end">
        {/* Floating Sparkles Effects */}
        {sparkles.map((sp) => (
          <div 
            key={sp.id} 
            className="absolute text-cyan-400 text-sm font-bold pointer-events-none animate-ping"
            style={{ transform: `translate(${sp.x}px, ${sp.y}px)` }}
          >
            ✨
          </div>
        ))}

        {/* Speech Bubble */}
        {dogBubbleOpen && (
          <div className={`mb-3 max-w-[260px] p-4 rounded-2xl border shadow-2xl backdrop-blur-md relative animate-bounce-subtle ${
            darkMode 
              ? "bg-zinc-900/95 border-cyan-500/40 text-white shadow-cyan-500/10" 
              : "bg-white/95 border-cyan-500/40 text-zinc-900 shadow-cyan-500/10"
          }`}>
            <button 
              onClick={() => setDogBubbleOpen(false)}
              className={`absolute top-2 right-2 text-xs p-1 ${darkMode ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-zinc-900"}`}
              title="Close speech bubble"
            >
              <FaTimes />
            </button>
            <div className="text-[11px] font-bold text-cyan-400 mb-1 flex items-center gap-1.5">
              <span>{translations[lang].dogDogName}</span>
            </div>
            <p className={`text-xs leading-relaxed ${darkMode ? "text-zinc-200" : "text-zinc-700"}`}>
              {translations[lang].dogTips[dogTipIndex]}
            </p>
            <div 
              className={`mt-2 text-[10px] text-right italic cursor-pointer hover:text-cyan-400 transition ${darkMode ? "text-zinc-500" : "text-zinc-400"}`} 
              onClick={handleDogClick}
            >
              Click me for next tip ✨
            </div>
            {/* Bubble Arrow */}
            <div className={`absolute -bottom-2 right-6 w-3 h-3 border-r border-b rotate-45 ${
              darkMode ? "bg-zinc-900 border-cyan-500/40" : "bg-white border-cyan-500/40"
            }`}></div>
          </div>
        )}

        {/* Floating Dog Mascot Avatar Button */}
        <button
          onClick={handleDogClick}
          className="relative w-14 h-14 rounded-full p-0.5 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 shadow-xl shadow-cyan-500/20 animate-float-mascot hover:scale-110 transition-all duration-300 group"
          title="Click to talk to Buddy the AI Dog Mascot!"
        >
          <img 
            src={baseAsset("dog_mascot.jpg")} 
            alt="Dog Mascot Helper" 
            className="w-full h-full object-cover rounded-full border-2 border-zinc-950"
          />
          <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-cyan-400 rounded-full border-2 border-zinc-950 flex items-center justify-center text-[9px] font-bold text-black animate-pulse">
            💬
          </span>
        </button>
      </div>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full border transition-all duration-300 flex items-center justify-center shadow-lg group backdrop-blur-md hover:scale-110 ${
            darkMode 
              ? "bg-zinc-900/90 border-cyan-500/40 text-cyan-400 hover:text-white hover:bg-cyan-500 shadow-cyan-500/10" 
              : "bg-white/90 border-cyan-500/50 text-cyan-600 hover:text-white hover:bg-cyan-500 shadow-cyan-500/20"
          }`}
          title={translations[lang].backToTop}
          aria-label={translations[lang].backToTop}
        >
          <FaArrowUp className="text-base group-hover:-translate-y-1 transition-transform duration-200" />
        </button>
      )}

      {/* Footer */}
      <footer className={`text-center py-8 text-[11px] font-medium border-t ${darkMode ? "border-zinc-900 text-zinc-600" : "border-zinc-200 text-zinc-400"}`}>
        {translations[lang].footer}
      </footer>
    </div>
  );
}