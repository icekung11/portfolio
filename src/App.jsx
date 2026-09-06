// src/App.jsx
import { useState, useEffect } from "react";
import { 
  FaJava, FaPython, FaLinux, FaNetworkWired, FaReact, 
  FaGithub, FaInstagram, FaPhoneAlt, FaFolderPlus,
  FaAward, FaGraduationCap, FaArrowUp, FaTimes, FaExpand,
  FaCheckCircle, FaChevronRight, FaTerminal
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
      image: baseAsset("Fourier.png"),
      tags: ["Python", "Tkinter", "SciPy", "Matplotlib", "Math Modeling"],
      links: [
        { label: "📄 Full Report (PDF)", url: baseAsset("fourier_report.pdf") },
        { label: "💻 Source Code (.py)", url: baseAsset("fourier_series.py") }
      ]
    },
    {
      title: "Electrical Circuit Simulation and Analysis",
      desc: "This study analyzes and simulates the electrical behavior of three basic circuit types: RC circuit, Transistor switching circuits, and diode-capacitor circuits.",
      image: baseAsset("circuit.png"),
      tags: ["Transistor", "Diode", "Circuit Analysis", "Capacitor", "RC"],
      links: [
        { label: "📄 Full Report (PDF)", url: baseAsset("circuit_report.pdf") }
      ]
    },
    {
      title: "Kijhub Application",
      desc: "A mobile application developed using Flutter and Dart, integrated with Kafka for real-time data streaming and Go for backend services.",
      image: baseAsset("Kijhub.png"),
      tags: ["Dart", "Flutter", "Kafka", "Mobile App", "Go"],
      links: [
        { label: "📄 Full Report (PDF)", url: baseAsset("Kijhub_report.pdf") }
      ]
    }
    /* Stored for future release:
    {
      title: "Transient Response Circuit Analyzer",
      desc: "Developed a computational script using numerical methods to analyze and simulate Transient Responses in complex RL, RC, and RLC networks utilizing Kirchhoff's laws, Nodal/Mesh analysis, and matrix operations.",
      image: baseAsset("circuit.png"),
      tags: ["Python", "Circuit Analysis", "Engineering Math"]
    }
    */
  ],
  th: [
    {
      title: "เครื่องคำนวณและวาดกราฟอนุกรมฟูเรียร์",
      desc: "แอปพลิเคชันเดสก์ท็อป Python ที่พัฒนาขึ้นด้วย Tkinter, NumPy, SciPy และ Matplotlib คำนวณสัมประสิทธิ์อนุกรมฟูเรียร์ด้วยการหาปริพันธ์เชิงตัวเลขและแสดงภาพความสอดคล้องและการลู่เข้าของอนุกรมตรีโกณมิติเปรียบเทียบกับฟังก์ชันคาบดั้งเดิม รองรับทั้งฟังก์ชันเดี่ยวและฟังก์ชันเป็นช่วง",
      image: baseAsset("Fourier.png"),
      tags: ["Python", "Tkinter", "SciPy", "Matplotlib", "การจำลองทางคณิตศาสตร์"],
      links: [
        { label: "📄 รายงานฉบับเต็ม (PDF)", url: baseAsset("fourier_report.pdf") },
        { label: "💻 ซอร์สโค้ด (.py)", url: baseAsset("fourier_series.py") }
      ]
    },
    {
      title: "การจำลองและวิเคราะห์วงจรไฟฟ้า",
      desc: "การศึกษาวิเคราะห์และจำลองพฤติกรรมทางไฟฟ้าของวงจรพื้นฐาน 3 ประเภท: วงจร RC, วงจรสวิตชิ่งทรานซิสเตอร์ และวงจรไดโอด-คาปาซิเตอร์",
      image: baseAsset("circuit.png"),
      tags: ["ทรานซิสเตอร์", "ไดโอด", "การวิเคราะห์วงจร", "ตัวเก็บประจุ", "RC"],
      links: [
        { label: "📄 รายงานฉบับเต็ม (PDF)", url: baseAsset("circuit_report.pdf") }
      ]
    },
    {
      title: "แอปพลิเคชัน Kijhub",
      desc: "แอปพลิเคชันมือถือที่พัฒนาด้วย Flutter และ Dart ผสานการทำงานกับ Kafka สำหรับการสตรีมข้อมูลแบบเรียลไทม์และ Go สำหรับบริการแบ็กเอนด์",
      image: baseAsset("Kijhub.png"),
      tags: ["Dart", "Flutter", "Kafka", "Mobile App", "Go"],
      links: [
        { label: "📄 รายงานฉบับเต็ม (PDF)", url: baseAsset("Kijhub_report.pdf") }
      ]
    }
    /* Stored for future release:
    {
      title: "เครื่องวิเคราะห์วงจรตอบสนองชั่วครู่",
      desc: "พัฒนาสคริปต์คำนวณโดยใช้วิธีเชิงตัวเลขเพื่อวิเคราะห์และจำลองการตอบสนองชั่วครู่ (Transient Responses) ในวงจรเครือข่าย RL, RC และ RLC ที่มีความซับซ้อนตามกฎของ Kirchhoff การวิเคราะห์โหนด/เมช และการคำนวณเมทริกซ์",
      image: baseAsset("circuit.png"),
      tags: ["Python", "การวิเคราะห์วงจร", "คณิตศาสตร์วิศวกรรม"]
    }
    */
  ]
};

const certificates = {
  en: [
    {
      id: "cert-Foundation AI (theory)",
      title: "AI & Machine Learning Foundations (Theory)",
      issuer: "Artificial Intelligence Association of Thailand",
      date: "2026",
      image: baseAsset("Ai_theory.png"),
      desc: "Course completion in AI and Machine Learning foundations, including theory and applications.",
      tags: ["AI", "Machine Learning", "Theory", "Computer Vision"]
    },
    {
      id: "cert-Ethical Hacker",
      title: "Ethical Hacking & Cybersecurity",
      issuer: "Cisco Networking Academy program and National Cyber Security Agency",
      date: "2025",
      image: baseAsset("Ethical_Hacker.png"),
      desc: "Course completion in ethical hacking techniques and cybersecurity principles.",
      tags: ["Cybersecurity", "Ethical Hacking"]
    },
    {
      id: "cert-Generative AI Foundation Program",
      title: "AWS Generative AI Foundation Program including KIRO Challenge",
      issuer: "AWS, gosoft, depa, ERT",
      date: "2026",
      image: baseAsset("cert_ws.jpg"),
      desc: "Course completion in Generative AI foundation program, including KIRO Challenge and practical applications.",
      tags: ["Generative AI", "KIRO", "Pitching", "AI Applications"]
    }
    /* Stored for future release:
    {
      id: "cert-circuits",
      title: "Digital Logic Design & Transient Analysis",
      issuer: "Computer Engineering Department",
      date: "2025",
      image: baseAsset("cert_circuits.jpg"),
      desc: "Course completion in Transient Response numerical simulation (RL, RC, RLC), Kirchhoff's laws, and digital logic gates.",
      tags: ["Digital Logic", "Circuits", "Electronics"]
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
      id: "cert-linux",
      title: "Linux Systems & Network Architecture",
      issuer: "Systems Engineering Institute",
      date: "2025",
      image: baseAsset("cert_linux.jpg"),
      desc: "Course completion in Linux Administration basics, Shell Scripting, Network Concepts, and System Infrastructure fundamentals.",
      tags: ["Linux", "Networking", "Systems Basics"]
    }
    */
  ],
  th: [
    {
      id: "cert-Foundation AI (theory)",
      title: "รากฐานปัญญาประดิษฐ์และการเรียนรู้ของเครื่อง (ทฤษฎี)",
      issuer: "สมาคมปัญญาประดิษฐ์แห่งประเทศไทย",
      date: "2025",
      image: baseAsset("Ai_theory.png"),
      desc: "การผ่านหลักสูตรรากฐานปัญญาประดิษฐ์และการเรียนรู้ของเครื่อง รวมถึงทฤษฎีและการประยุกต์ใช้งาน",
      tags: ["ปัญญาประดิษฐ์", "การเรียนรู้ของเครื่อง", "ทฤษฎี", "การประมวลผลภาพ"]
    },
    {
      id: "cert-Ethical Hacker",
      title: "นักเจาะระบบเชิงจริยธรรมและความปลอดภัยไซเบอร์",
      issuer: "Cisco Networking Academy และ สำนักงานความมั่นคงปลอดภัยไซเบอร์แห่งชาติ",
      date: "2025",
      image: baseAsset("Ethical_Hacker.png"),
      desc: "ใบรับรองการผ่านหลักสูตรเทคนิคการเจาะระบบเชิงจริยธรรมและหลักการรักษาความปลอดภัยไซเบอร์",
      tags: ["Cybersecurity", "Ethical Hacking"]
    },
    {
      id: "cert-Generative AI Foundation Program",
      title: "AWS Generative AI Foundation Program including KIRO Challenge",
      issuer: "AWS, gosoft, depa, ERT",
      date: "2026",
      image: baseAsset("cert_ws.jpg"),
      desc: "ใบรับรองการผ่านการเรียนรู้ Generative AI Foundation Program รวมถึง KIRO Challenge และการประยุกต์ใช้งานจริง",
      tags: ["Generative AI", "KIRO", "Pitching", "AI Applications"]
    }
    /* Stored for future release:
    {
      id: "cert-circuits",
      title: "การออกแบบตรรกศาสตร์ดิจิทัล & วิเคราะห์วงจร",
      issuer: "ภาควิชาวิศวกรรมคอมพิวเตอร์",
      date: "2025",
      image: baseAsset("cert_circuits.jpg"),
      desc: "ใบรับรองการผ่านหลักสูตรจำลองการตอบสนองชั่วครู่ (Transient Responses) และตรรกศาสตร์ดิจิทัล",
      tags: ["ตรรกศาสตร์ดิจิทัล", "วิเคราะห์วงจร", "อิเล็กทรอนิกส์"]
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
      id: "cert-linux",
      title: "ระบบปฏิบัติการ Linux & โครงสร้างพื้นฐานเครือข่าย",
      issuer: "สถาบันวิศวกรรมระบบและระบบเครือข่าย",
      date: "2025",
      image: baseAsset("cert_linux.jpg"),
      desc: "ใบรับรองการผ่านหลักสูตรเรียนรู้ระบบปฏิบัติการ Linux, Shell Scripting และพื้นฐานระบบเครือข่าย",
      tags: ["Linux", "ระบบเครือข่าย", "วิศวกรรมระบบ"]
    }
    */
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
      } catch {
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

  // Track Mouse Movement for Cursor Glow
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
      } catch {
        // Silently ignore storage errors
      }
    }
  };

  const handleDogClick = () => {
    setDogBubbleOpen(true);
    setDogTipIndex((prev) => (prev + 1) % translations[lang].dogTips.length);
    const newSparkle = {
      id: Date.now() + Math.random(),
      x: (Math.random() - 0.5) * 50,
      y: (Math.random() - 0.5) * 50 - 20,
    };
    setSparkles((prev) => [...prev.slice(-6), newSparkle]);
    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id));
    }, 900);
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
          : "overflow-x-hidden min-h-screen font-sans text-zinc-900 bg-[#f8fafc] transition-colors duration-300 relative"
      }
    >
      {/* Interactive Mouse Glow Spotlight */}
      <div 
        className={`fixed w-[420px] h-[420px] rounded-full pointer-events-none transition-transform duration-75 ease-out z-0 hidden lg:block ${
          darkMode ? "bg-blue-600/10 blur-[110px]" : "bg-blue-500/15 blur-[95px]"
        }`}
        style={{
          transform: `translate(${mousePos.x - 210}px, ${mousePos.y - 210}px)`
        }}
      />

      {/* Clean Scroll Progress Bar at Top */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-transparent pointer-events-none">
        <div 
          className="h-full bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.8)] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Ambient Background Glowing Particles & Orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className={`absolute top-10 left-1/4 w-[500px] h-[500px] rounded-full blur-[140px] animate-pulse-glow ${darkMode ? "bg-blue-600/10" : "bg-blue-400/15"}`} />
        <div className={`absolute top-1/3 right-10 w-[420px] h-[420px] rounded-full blur-[150px] animate-particle-1 ${darkMode ? "bg-blue-800/10" : "bg-blue-300/20"}`} />
        <div className={`absolute bottom-20 left-10 w-[380px] h-[380px] rounded-full blur-[140px] animate-particle-2 ${darkMode ? "bg-zinc-800/20" : "bg-zinc-200/50"}`} />
      </div>

      {/* Navbar */}
      <nav className={`px-6 md:px-12 py-4 border-b backdrop-blur-md sticky top-0 z-40 transition-colors ${darkMode ? "border-zinc-800/80 bg-[#09090b]/90 text-zinc-100" : "border-zinc-200 bg-white/90 text-zinc-900 shadow-sm"}`}>
        <div className="max-w-5xl mx-auto flex justify-between items-center w-full">
          <a href="#top" className={`text-lg font-bold tracking-tight transition flex items-center gap-1 ${darkMode ? "text-white hover:text-blue-400" : "text-zinc-900 hover:text-blue-600"}`}>
            KITTITHAT.D
          </a>

          {/* Desktop Navigation Links */}
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
                      ? darkMode ? "text-blue-400 font-semibold" : "text-blue-600 font-semibold"
                      : darkMode ? "text-zinc-400 hover:text-zinc-200" : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${darkMode ? "bg-blue-400" : "bg-blue-600"}`} />
                  )}
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                darkMode 
                  ? "border-zinc-800 text-zinc-300 bg-zinc-900/80 hover:border-zinc-700 hover:text-white" 
                  : "border-zinc-300 text-zinc-700 bg-white hover:border-zinc-400 hover:text-zinc-900 shadow-sm"
              }`}
              title={lang === "th" ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย"}
            >
              <span className={lang === "th" ? (darkMode ? "text-blue-400 font-bold" : "text-blue-600 font-bold") : "text-zinc-400"}>TH</span>
              <span className={darkMode ? "text-zinc-600" : "text-zinc-300"}>/</span>
              <span className={lang === "en" ? (darkMode ? "text-blue-400 font-bold" : "text-blue-600 font-bold") : "text-zinc-400"}>EN</span>
            </button>

            {/* Dark Mode Switcher */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-12 h-7 rounded-full transition-all duration-300 ${darkMode ? "bg-zinc-800 border border-zinc-700" : "bg-zinc-200 border border-zinc-300"}`}
              title="Toggle theme"
            >
              <div className={`absolute top-0.5 w-5.5 h-5.5 rounded-full transition-all duration-300 flex items-center justify-center text-xs ${darkMode ? "left-5.5 bg-zinc-950 text-white" : "left-0.5 bg-white text-zinc-900 shadow-sm"}`}>
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
          <div className={`md:hidden mt-4 pt-4 border-t flex flex-col gap-3 font-medium text-sm ${darkMode ? "border-zinc-800/80" : "border-zinc-200"}`}>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className={`transition-colors ${darkMode ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-zinc-900"}`}>{translations[lang].navAbout}</a>
            <a href="#skills" onClick={() => setMobileMenuOpen(false)} className={`transition-colors ${darkMode ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-zinc-900"}`}>{translations[lang].navSkills}</a>
            <a href="#projects" onClick={() => setMobileMenuOpen(false)} className={`transition-colors ${darkMode ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-zinc-900"}`}>{translations[lang].navProjects}</a>
            <a href="#certificates" onClick={() => setMobileMenuOpen(false)} className={`transition-colors ${darkMode ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-zinc-900"}`}>{translations[lang].navCerts}</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className={`transition-colors ${darkMode ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-zinc-900"}`}>{translations[lang].navContact}</a>
            <a href="#comments" onClick={() => setMobileMenuOpen(false)} className={`transition-colors ${darkMode ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-zinc-900"}`}>{translations[lang].navComments}</a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-5xl mx-auto px-6 md:px-12 py-12 md:py-20 lg:py-24 grid md:grid-cols-5 gap-8 md:gap-12 items-center">
        <div className="md:col-span-3 text-center md:text-left">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium mb-4 border transition-all ${darkMode ? "bg-zinc-900/90 border-zinc-800 text-zinc-300" : "bg-blue-50 border-blue-200 text-blue-800 shadow-sm"}`}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {translations[lang].heroSub}
          </div>
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.15] ${darkMode ? "text-zinc-100" : "text-zinc-900"}`}>
            {translations[lang].heroTitle} <br />
            <span className={darkMode ? "text-white" : "text-zinc-900"}>
              {translations[lang].heroName}
            </span>
          </h1>
          <p className={`mt-5 text-base leading-relaxed max-w-xl mx-auto md:mx-0 ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
           {translations[lang].heroDesc}
          </p>

          {/* Clean Code Terminal Window */}
          <div className="mt-6 p-4 rounded-xl border font-mono text-[11px] leading-relaxed shadow-lg text-left max-w-md bg-zinc-950 border-zinc-800 text-zinc-300">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-zinc-800 text-xs text-zinc-500">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-700 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-700 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-700 inline-block"></span>
              <span className="ml-2 font-sans font-medium text-[10px] text-zinc-400 flex items-center gap-1">
                <FaTerminal className="text-blue-400 text-[10px]" /> developer_profile.js
              </span>
            </div>
            <div>
              <span className="text-blue-400">const</span> <span className="text-zinc-200">engineer</span> = &#123;<br />
              &nbsp;&nbsp;<span className="text-zinc-500">name:</span> <span className="text-emerald-400">"Kittithat Dokboua (ICE)"</span>,<br />
              &nbsp;&nbsp;<span className="text-zinc-500">degree:</span> <span className="text-emerald-400">"Computer Engineering @ SWU"</span>,<br />
              &nbsp;&nbsp;<span className="text-zinc-500">passions:</span> [<span className="text-blue-400">"System Eng"</span>, <span className="text-blue-400">"Web Apps"</span>, <span className="text-blue-400">"Digital Logic"</span>],<br />
              &nbsp;&nbsp;<span className="text-zinc-500">status:</span> <span className="text-zinc-300">"Always Eager to Learn"</span><br />
              &#125;;
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-center md:justify-start gap-4 text-sm font-semibold">
            <a href="#projects" className="px-6 py-3.5 rounded-xl text-white font-semibold btn-shimmer shadow-lg shadow-blue-600/25 hover:scale-[1.03] transition-all text-center flex items-center justify-center gap-2">
              {translations[lang].heroViewWork} <FaChevronRight className="text-xs" />
            </a>
            <a href="#certificates" className={`px-6 py-3.5 rounded-xl border transition-all hover:scale-[1.02] text-center flex items-center justify-center gap-2 ${darkMode ? "border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:border-zinc-700" : "border-zinc-300 text-zinc-700 hover:bg-zinc-100 shadow-sm hover:border-zinc-400"}`}>
              <FaAward className={darkMode ? "text-blue-400" : "text-blue-600"} /> {translations[lang].navCerts}
            </a>
          </div>
        </div>

        {/* Profile Picture Frame */}
        <div className="md:col-span-2 flex justify-center order-first md:order-last">
          <div className={`relative w-full max-w-[280px] p-3 rounded-2xl border transition-all duration-300 hover:border-zinc-700 ${darkMode ? "bg-zinc-900/60 border-zinc-800 shadow-xl" : "bg-white border-zinc-200 shadow-lg"}`}>
            <div className="relative overflow-hidden rounded-xl group">
              <img
                src={baseAsset("profile.jpg")}
                alt="Profile"
                className="w-full h-[330px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 text-white text-xs font-medium">
                Computer Engineering Student @ SWU
              </div>
            </div>
            <div className="mt-4 text-center pb-1">
              <h3 className={`text-base font-bold tracking-tight ${darkMode ? "text-zinc-100" : "text-zinc-900"}`}>{translations[lang].profileName}</h3>
              <p className={`text-xs mt-0.5 ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                {translations[lang].profileUni} 
              </p>
              <p className={`text-xs ${darkMode ? "text-zinc-500" : "text-zinc-500"}`}>
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
          <div className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${darkMode ? "bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 hover:shadow-lg" : "bg-white border-zinc-200 shadow-sm hover:border-zinc-300"}`}>
            <h3 className={`text-base font-bold mb-3 flex items-center gap-2 ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
              <span className={`w-2 h-2 rounded-full ${darkMode ? "bg-blue-400" : "bg-blue-600"}`}></span> {translations[lang].aboutIntroTitle}
            </h3>
            <p className={`leading-relaxed text-sm ${darkMode ? "text-zinc-300" : "text-zinc-600"}`}>
             {translations[lang].aboutIntroDesc}
            </p>
          </div>

          <div className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${darkMode ? "bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 hover:shadow-lg" : "bg-white border-zinc-200 shadow-sm hover:border-zinc-300"}`}>
            <h3 className={`text-base font-bold mb-3 flex items-center gap-2 ${darkMode ? "text-zinc-200" : "text-zinc-900"}`}>
              <FaGraduationCap className={darkMode ? "text-blue-400" : "text-blue-600"} /> {translations[lang].aboutEduTitle}
            </h3>
            <div className={`space-y-4 leading-relaxed text-sm ${darkMode ? "text-zinc-300" : "text-zinc-600"}`}>
              <div>
                <h4 className={`font-semibold ${darkMode ? "text-zinc-100" : "text-zinc-900"}`}>{translations[lang].aboutEduDegree}</h4>
                <p className={darkMode ? "text-zinc-300" : "text-zinc-700"}>{translations[lang].aboutEduUni}</p>
                <p className={`text-xs mt-1 ${darkMode ? "text-zinc-500" : "text-zinc-500"}`}>{translations[lang].aboutEduPeriod}</p>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${darkMode ? "bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 hover:shadow-lg" : "bg-white border-zinc-200 shadow-sm hover:border-zinc-300"}`}>
            <h3 className={`text-base font-bold mb-3 flex items-center gap-2 ${darkMode ? "text-zinc-200" : "text-zinc-900"}`}>
              <span className={`w-2 h-2 rounded-full ${darkMode ? "bg-blue-400" : "bg-blue-600"}`}></span> {translations[lang].aboutIntTitle}
            </h3>
            <ul className={`space-y-2.5 text-sm ${darkMode ? "text-zinc-300" : "text-zinc-600"}`}>
              {translations[lang].aboutInterests.map((interest, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className={`font-bold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>•</span> {interest}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className={`max-w-5xl mx-auto px-6 md:px-12 py-16 border-t ${darkMode ? "border-zinc-900" : "border-zinc-200"}`}>
        <div className="flex items-center gap-2 mb-8">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${darkMode ? "bg-zinc-900 border-zinc-800 text-zinc-300" : "bg-blue-50 border-blue-200 text-blue-800"}`}>
            Tech Stack
          </span>
          <h2 className={`text-2xl font-bold tracking-tight ${darkMode ? "text-zinc-100" : "text-zinc-900"}`}>
            {translations[lang].skillsTitle}
          </h2>
        </div>

        <div className="space-y-8">
          {skillCategories.map((category, catIdx) => (
            <div key={catIdx}>
              <h3 className={`text-xs uppercase tracking-widest font-bold mb-3.5 flex items-center gap-2 ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${darkMode ? "bg-blue-400" : "bg-blue-600"}`}></span>
                {translations[lang].skillsCategories[category.title] || category.title}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {category.list.map((skill, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border flex items-center gap-3.5 transition-all duration-300 group hover:-translate-y-1 ${darkMode ? "bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 hover:shadow-lg" : "bg-white border-zinc-200 hover:border-zinc-400 shadow-sm"}`}
                  >
                    <div className="text-2xl transform group-hover:scale-110 transition duration-300 shrink-0">
                      {skill.icon}
                    </div>
                    <span className={`text-xs font-semibold whitespace-normal leading-tight transition-colors ${darkMode ? "text-zinc-300 group-hover:text-white" : "text-zinc-800 group-hover:text-black"}`}>
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
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${darkMode ? "bg-zinc-900 border-zinc-800 text-zinc-300" : "bg-blue-50 border-blue-200 text-blue-800"}`}>
            Showcases
          </span>
          <h2 className={`text-2xl font-bold tracking-tight ${darkMode ? "text-zinc-100" : "text-zinc-900"}`}>{translations[lang].projectsTitle}</h2>
        </div>
        <p className={`text-xs mb-8 ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
          {translations[lang].projectsSub}
        </p>
        
        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin snap-x snap-mandatory">
          {projects[lang].map((project, index) => (
            <div
              key={index}
              onClick={() => setSelectedProjectIndex(index)}
              className={
                darkMode
                  ? "min-w-[290px] md:min-w-[380px] bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between snap-start group shadow-xl"
                  : "min-w-[290px] md:min-w-[380px] bg-white border border-zinc-200 rounded-2xl p-5 hover:border-zinc-400 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between snap-start shadow-sm group hover:shadow-md"
              }
            >
              <div>
                <div className="h-44 w-full rounded-xl overflow-hidden mb-4 relative bg-zinc-950">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-50 group-hover:opacity-20 transition-opacity" />
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-semibold text-zinc-200 border border-zinc-700">
                    Project #{index + 1}
                  </span>
                </div>
                <h3 className={`text-base md:text-lg font-bold tracking-tight mb-2 leading-snug break-words transition-colors ${darkMode ? "text-zinc-100 group-hover:text-blue-400" : "text-zinc-900 group-hover:text-blue-600"}`}>{project.title}</h3>
                <p className={`text-xs leading-relaxed ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
                  {project.desc}
                </p>
              </div>

              <div className="mt-5 flex justify-between items-center gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.slice(0, 3).map((tag, tIdx) => (
                    <span key={tIdx} className={`text-[10px] px-2.5 py-1 rounded-lg shrink-0 font-medium border ${darkMode ? "bg-zinc-800/80 text-zinc-300 border-zinc-700/60" : "bg-zinc-100 text-zinc-700 border-zinc-200"}`}>
                      {tag}
                    </span>
                  ))}
                </div>
                <span className={`text-xs font-semibold shrink-0 flex items-center gap-1 group-hover:translate-x-1 transition-transform ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                  Explore <FaChevronRight className="text-[10px]" />
                </span>
              </div>
            </div>
          ))}

          {/* View More Box */}
          <div 
            className={`min-w-[240px] rounded-2xl border border-dashed flex flex-col items-center justify-center text-center p-5 transition-all duration-300 snap-start group hover:-translate-y-1 ${
              darkMode 
                ? "bg-zinc-900/20 border-zinc-800 hover:border-zinc-700" 
                : "bg-zinc-50 border-zinc-300 hover:border-zinc-400 shadow-sm"
            }`}
          >
            <div className={`text-3xl mb-3 transform group-hover:scale-110 transition duration-300 ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>
              <FaFolderPlus />
            </div>
            <h3 className={`text-base font-bold ${darkMode ? "text-zinc-200" : "text-zinc-800"}`}>{translations[lang].projectMoreTitle}</h3>
            <p className={`text-[11px] max-w-[160px] leading-relaxed mb-4 ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>
              {translations[lang].projectMoreDesc}
            </p>
            <a 
              href="https://github.com/icekung11" 
              target="_blank" 
              rel="noreferrer"
              className={`text-xs px-4 py-2 rounded-xl font-semibold border transition-colors shadow-sm ${darkMode ? "bg-zinc-800 text-zinc-200 border-zinc-700 hover:bg-blue-600 hover:text-white hover:border-blue-500" : "bg-white text-zinc-800 border-zinc-300 hover:bg-blue-600 hover:text-white hover:border-blue-500"}`}
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
            <div className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest mb-2 px-3 py-1 rounded-full border ${darkMode ? "bg-zinc-900 border-zinc-800 text-zinc-300" : "bg-blue-50 border-blue-200 text-blue-800"}`}>
              <FaAward className={darkMode ? "text-blue-400" : "text-blue-600"} /> Credentials
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
              className={`min-w-[270px] md:min-w-[320px] rounded-2xl border overflow-hidden transition-all duration-300 group cursor-pointer flex flex-col justify-between snap-start hover:-translate-y-1.5 ${
                darkMode 
                  ? "bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 hover:shadow-xl" 
                  : "bg-white border-zinc-200 shadow-sm hover:border-zinc-400 hover:shadow-md"
              }`}
            >
              <div>
                <div className="relative h-44 w-full overflow-hidden bg-zinc-950">
                  <img 
                    src={cert.image} 
                    alt={cert.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                  <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-semibold text-zinc-200 border border-zinc-700">
                    {cert.date}
                  </div>
                  <div className="absolute bottom-3 left-3 text-white text-xs font-semibold flex items-center gap-1">
                    <FaCheckCircle className="text-blue-400" /> {cert.issuer}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className={`text-sm font-bold leading-snug mb-2 break-words transition-colors ${darkMode ? "text-zinc-100 group-hover:text-blue-400" : "text-zinc-900 group-hover:text-blue-600"}`}>
                    {cert.title}
                  </h3>
                  <p className={`text-[11px] leading-relaxed mb-3 ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
                    {cert.desc}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1">
                  {cert.tags.slice(0, 3).map((t, idx) => (
                    <span key={idx} className={`text-[9px] px-2.5 py-1 rounded-lg font-medium border ${darkMode ? "bg-zinc-800/80 text-zinc-300 border-zinc-700/50" : "bg-zinc-100 text-zinc-700 border-zinc-200"}`}>
                      {t}
                    </span>
                  ))}
                </div>
                <span className={`text-xs font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1 ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
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
          <div className={`relative rounded-2xl w-full max-w-3xl border overflow-hidden shadow-2xl flex flex-col animate-modal-zoom ${darkMode ? "bg-zinc-950 border-zinc-800 text-zinc-100" : "bg-white border-zinc-200 text-zinc-900"}`}>
            <div className={`flex justify-between items-center p-4 border-b ${darkMode ? "border-zinc-800/80" : "border-zinc-200"}`}>
              <div className="flex items-center gap-2">
                <FaAward className={darkMode ? "text-blue-400 text-lg" : "text-blue-600 text-lg"} />
                <div>
                  <h3 className={`text-sm font-bold ${darkMode ? "text-zinc-100" : "text-zinc-900"}`}>{selectedCert.title}</h3>
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

            <div className={`p-4 flex justify-between items-center border-t text-xs ${darkMode ? "border-zinc-800/80" : "border-zinc-200"}`}>
              <p className={`max-w-md ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>{selectedCert.desc}</p>
              <button
                onClick={() => setSelectedCertIndex(null)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition shrink-0 shadow-sm"
              >
                {translations[lang].certModalClose}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl w-full max-w-2xl max-h-[90vh] md:max-h-[80vh] border flex flex-col md:flex-row overflow-hidden shadow-2xl animate-modal-zoom ${darkMode ? "bg-[#0c0c0e] border-zinc-800" : "bg-white border-zinc-200"}`}>
            <div className="md:w-1/2 p-4 flex items-center justify-center bg-black/20 shrink-0">
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
                    <span key={i} className={`text-[10px] px-2.5 py-1 rounded-lg font-medium border ${darkMode ? "bg-zinc-800 text-zinc-300 border-zinc-700" : "bg-zinc-100 text-zinc-700 border-zinc-200"}`}>
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
                          className={`flex items-center gap-1.5 text-[11px] px-3.5 py-2 rounded-lg font-semibold border transition-colors ${
                            darkMode 
                              ? "bg-zinc-800 text-zinc-200 border-zinc-700 hover:bg-blue-600 hover:text-white hover:border-blue-500" 
                              : "bg-zinc-100 text-zinc-800 border-zinc-300 hover:bg-blue-600 hover:text-white hover:border-blue-500"
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
                className="mt-6 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold text-xs w-fit self-end transition shadow-sm"
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
          <div className={`p-4 rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700 flex flex-col justify-between ${darkMode ? "bg-zinc-900/40 border-zinc-800 hover:shadow-lg" : "bg-white border-zinc-200 shadow-sm hover:border-zinc-300"}`}>
            <div>
              <div className="text-lg text-[#ea4335] mb-1.5"><SiMaildotru /></div>
              <span className={`text-[10px] uppercase font-bold tracking-wider ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>{translations[lang].contactEmail}</span>
            </div>
            <a href="mailto:kittithat8673@gmail.com" className={`text-xs font-semibold hover:underline break-all mt-2 ${darkMode ? "text-zinc-200" : "text-zinc-800"}`}>kittithat8673@gmail.com</a>
          </div>
          
          <div className={`p-4 rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700 flex flex-col justify-between ${darkMode ? "bg-zinc-900/40 border-zinc-800 hover:shadow-lg" : "bg-white border-zinc-200 shadow-sm hover:border-zinc-300"}`}>
            <div>
              <div className={`text-lg mb-1.5 ${darkMode ? "text-zinc-300" : "text-zinc-800"}`}><FaGithub /></div>
              <span className={`text-[10px] uppercase font-bold tracking-wider ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>{translations[lang].contactGithub}</span>
            </div>
            <a href="https://github.com/icekung11" target="_blank" rel="noreferrer" className={`text-xs font-semibold hover:underline mt-2 ${darkMode ? "text-zinc-200" : "text-zinc-800"}`}>icekung11</a>
          </div>
          
          <div className={`p-4 rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700 flex flex-col justify-between ${darkMode ? "bg-zinc-900/40 border-zinc-800 hover:shadow-lg" : "bg-white border-zinc-200 shadow-sm hover:border-zinc-300"}`}>
            <div>
              <div className="text-lg text-[#e1306c] mb-1.5"><FaInstagram /></div>
              <span className={`text-[10px] uppercase font-bold tracking-wider ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>{translations[lang].contactInstagram}</span>
            </div>
            <span className={`text-xs font-semibold mt-2 ${darkMode ? "text-zinc-200" : "text-zinc-800"}`}>icekung_114</span>
          </div>
          
          <div className={`p-4 rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700 flex flex-col justify-between ${darkMode ? "bg-zinc-900/40 border-zinc-800 hover:shadow-lg" : "bg-white border-zinc-200 shadow-sm hover:border-zinc-300"}`}>
            <div>
              <div className="text-lg text-emerald-500 mb-1.5"><FaPhoneAlt /></div>
              <span className={`text-[10px] uppercase font-bold tracking-wider ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>{translations[lang].contactPhone}</span>
            </div>
            <span className={`text-xs font-semibold mt-2 ${darkMode ? "text-zinc-200" : "text-zinc-800"}`}>081-146-8673</span>
          </div>
        </div>
      </section>

      {/* Comments Section */}
      <section id="comments" className={`max-w-5xl mx-auto px-6 md:px-12 py-16 border-t ${darkMode ? "border-zinc-900" : "border-zinc-200"}`}>
        <h2 className={`text-2xl font-bold tracking-tight mb-6 ${darkMode ? "text-zinc-100" : "text-zinc-900"}`}>{translations[lang].guestbookTitle}</h2>
        <div className={`p-6 rounded-2xl border ${darkMode ? "bg-zinc-900/30 border-zinc-800" : "bg-white border-zinc-200 shadow-sm"}`}>
          <input
            type="text"
            placeholder={translations[lang].guestbookNamePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full p-3.5 rounded-xl mb-3 border text-xs outline-none transition-all ${
              darkMode 
                ? "bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-600" 
                : "bg-zinc-50 border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500"
            }`}
          />
          <textarea
            placeholder={translations[lang].guestbookMsgPlaceholder}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`w-full h-28 p-3.5 rounded-xl border text-xs outline-none transition-all resize-none ${
              darkMode 
                ? "bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-600" 
                : "bg-zinc-50 border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500"
            }`}
          />
          <button onClick={sendMessage} className="mt-2 text-white font-bold btn-shimmer px-6 py-3 rounded-xl text-xs transition-all shadow-md shadow-blue-600/25 hover:scale-[1.02]">
            {translations[lang].guestbookSendBtn}
          </button>
          
          {showSuccess && (
            <div className="mt-3 text-xs text-emerald-500 font-semibold flex items-center gap-1.5">
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
            className="absolute text-blue-400 text-sm font-bold pointer-events-none animate-ping select-none z-50"
            style={{ transform: `translate(${sp.x}px, ${sp.y}px)` }}
          >
            ✨
          </div>
        ))}

        {/* Speech Bubble */}
        {dogBubbleOpen && (
          <div className={`mb-3 max-w-[260px] p-4 rounded-2xl border shadow-xl backdrop-blur-md relative ${
            darkMode 
              ? "bg-zinc-900 border-zinc-700 text-zinc-100" 
              : "bg-white border-zinc-200 text-zinc-900 shadow-xl"
          }`}>
            <button 
              onClick={() => setDogBubbleOpen(false)}
              className={`absolute top-2 right-2 text-xs p-1 ${darkMode ? "text-zinc-400 hover:text-white" : "text-zinc-400 hover:text-zinc-900"}`}
              title="Close speech bubble"
            >
              <FaTimes />
            </button>
            <div className={`text-[11px] font-bold mb-1 flex items-center gap-1.5 ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
              <span>{translations[lang].dogDogName}</span>
            </div>
            <p className={`text-xs leading-relaxed ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
              {translations[lang].dogTips[dogTipIndex]}
            </p>
            <div 
              className={`mt-2 text-[10px] text-right italic cursor-pointer transition ${darkMode ? "text-zinc-500 hover:text-blue-400" : "text-zinc-400 hover:text-blue-600"}`} 
              onClick={handleDogClick}
            >
              Click me for next tip ✨
            </div>
            {/* Bubble Arrow */}
            <div className={`absolute -bottom-2 right-6 w-3 h-3 border-r border-b rotate-45 ${
              darkMode ? "bg-zinc-900 border-zinc-700" : "bg-white border-zinc-200"
            }`}></div>
          </div>
        )}

        {/* Floating Dog Mascot Avatar Button */}
        <button
          onClick={handleDogClick}
          className={`relative w-13 h-13 rounded-full p-0.5 border-2 shadow-xl animate-float-mascot hover:scale-105 transition-all duration-300 group ${
            darkMode ? "border-zinc-700 bg-zinc-900 hover:border-blue-400 hover:shadow-blue-500/20" : "border-zinc-300 bg-white hover:border-blue-500 hover:shadow-blue-500/20"
          }`}
          title="Click to talk to Buddy the AI Dog Mascot!"
        >
          <img 
            src={baseAsset("dog_mascot.jpg")} 
            alt="Dog Mascot Helper" 
            className="w-full h-full object-cover rounded-full"
          />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full border-2 border-white dark:border-zinc-950 flex items-center justify-center text-[8px] font-bold text-white">
            💬
          </span>
        </button>
      </div>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full border transition-all duration-300 flex items-center justify-center shadow-lg group backdrop-blur-md hover:scale-105 ${
            darkMode 
              ? "bg-zinc-900/90 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800" 
              : "bg-white/90 border-zinc-300 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 shadow-md"
          }`}
          title={translations[lang].backToTop}
          aria-label={translations[lang].backToTop}
        >
          <FaArrowUp className="text-sm group-hover:-translate-y-0.5 transition-transform duration-200" />
        </button>
      )}

      {/* Footer */}
      <footer className={`text-center py-8 text-[11px] font-medium border-t ${darkMode ? "border-zinc-900 text-zinc-500" : "border-zinc-200 text-zinc-500"}`}>
        {translations[lang].footer}
      </footer>
    </div>
  );
}