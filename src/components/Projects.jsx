import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import Project from "./Project";

const Projects = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
  }, []);

  const projectList = [
    {
      title: "School Management System (still working on it...)",
      description: "",
      link: "https://ghss-management.vercel.app",
      githubLink: "https://github.com/salimkhandev/GHSS-Management",
      technologies: ["React", "Node.js", "Material-UI", "Tailwind CSS", "JWT", "Bcryptjs", "Postgresql", "Redis", "Storage Bucket (supabase)","Skeletion Loaders", "Formik", "Yup","Piechart.js"],
      image: "/techIcons/projectScreenshot/schoolmng.png"
    },
    {
      title: "All Talk (not online but you can use it on localhost as this require serverfull server)",
      description: "All Talk is a real-time chat and calling (Video/Audio) app built with React, Socket.IO, WebRTC, Express, Supabase, and Redis. It supports private and group messaging with online presence and typing indicators, one-to-one audio/video calls (TURN/STUN), secure JWT auth with httpOnly cookies and auto‑login, push notifications via FCM, media uploads and profile photos, and an installable PWA for mobile. The backend enforces CORS and rate limiting, uses Redis to route live events reliably, and persists users and tokens in Supabase (Postgres)",
      link: "https://chatters-socket-frontend.vercel.app",
      githubLink: "https://github.com/salimkhandev/ChattersSocket",
      technologies : [
        "React (Vite)",
        "Socket.IO",
        "Express",
        "Supabase (Postgres)",
        "Redis",
        "WebRTC",
        "Firebase Admin FCM",
        "Cloudinary / Multer for media",
        "JWT auth with httpOnly cookies"
      ],
      image: "/techIcons/projectScreenshot/alltalk.jpg"
    },
    {
      title: "TuneFlow",
      description: "TuneFlow is a modern, responsive music web app built with Next.js. It features fast search, playlists, theming, a mobile-friendly player, and offline-friendly PWA capabilities. The app leverages a clean UI with Radix UI components and Tailwind CSS, global state via Redux Toolkit, and optional auth with NextAuth..",
      link: "https://tune-flow-a-music-app.vercel.app",
      githubLink: "https://github.com/salimkhandev/TuneFlow-a-Music-PWA",
      technologies: ["Next.js", "PostgreSQL", "Tailwind CSS", "Google Auth","IndexDB","Cache Storage","Saavn API"],
      image: "/techIcons/projectScreenshot/songs.jpg"

    },
    {
      title: "Khalil Studio",
      description: "Khalil Studio is a fully responsive website with chatbot integration for Khalil, a video editor. It allows users to showcase skills and upload videos either from local storage or via YouTube links. The platform includes a functional admin panel and is built as a full-stack application using Next.js, MongoDB, and Cloudinary for video storage.",
      link: "https://khalil-studio.vercel.app",

      githubLink: "https://github.com/salimkhandev/khalil-studio",
      technologies: ["Next.js", "MongoDB", "Cloudinary", "Tailwind CSS" ],
      image: "/techIcons/projectScreenshot/khalil.jpg"

    },
    {
      title: "TaskTame",
      description: "Use and install it offline on any OS",
      link: "https://salimnote.vercel.app",
      githubLink: "https://github.com/salimkhandev/ReactToDo",
      technologies: ["React", "Tailwind CSS", "PWA", "localStorage"],
      // correct the path of the image
      image: "/techIcons/projectScreenshot/tasktame.png.png"


    },
    {
      title: "SITI Networks UI Clone (Pure HTML/CSS)",
      description: "",
      link: "https://siti-networks.vercel.app/",
      githubLink: "https://github.com/salimkhandev/SITI-Networks",
      technologies: ["HTML", "CSS", "Responsive Design"],
      image: "/techIcons/projectScreenshot/siti.png"
    },
    {
      title: "SeatGeek",
      description: "",
      link: "https://seatgreek.vercel.app",
      githubLink: "https://github.com/salimkhandev/seatgreek",
      technologies: ["Next.js"],
      image: "/techIcons/projectScreenshot/geek.png"
    },
    {
      title: "Background Remover",
      description: "",
      link: "https://backgroundremover-eta.vercel.app/",
      githubLink: "https://github.com/salimkhandev/BackgroundRemoverFrontend",
      technologies: ["React", "Image Processing", "API Integration"],
      image: "/techIcons/projectScreenshot/bgRemove.png"
    },
    
    {
      title: "Offline Snake Game 🐍 (PWA)",
      description: "install & play it offline on any OS",
      link: "https://snake-game-pwa.vercel.app",
      githubLink: "https://github.com/salimkhandev/offline-snake-game",
      technologies: ["JavaScript", "PWA", "HTML5 Canvas"],
      image: "/techIcons/projectScreenshot/snake.png"
    },
  ];

  return (
    <section
      id="projects"
      className="min-h-screen py-20 relative bg-gradient-to-b from-black via-[#0a1122] to-black"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div
          className="max-w-6xl mx-auto md:bg-[#1a2544]/40 md:backdrop-blur-xl rounded-2xl md:border md:border-white/10 md:shadow-2xl"
          data-aos="fade-up"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center p-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Projects
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 p-6">
            {projectList.map((proj, index) => (
              <Project
                key={index}
                title={proj.title}
                description={proj.description}
                link={proj.link}
                githubLink={proj.githubLink}
                technologies={proj.technologies}
                image={proj.image}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
