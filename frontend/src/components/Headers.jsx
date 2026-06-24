import {
  faHome,
  faProjectDiagram,
  faLaptopCode,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

const Header = () => {
  const [activeSection, setActiveSection] = useState("home");

  // no mobile overlay menu; keep scrolling enabled

  useEffect(() => {
    const handleScroll = () => {
      // Get all sections
      const sections = ["home", "skills", "projects"];

      // Find which section is currently in view
      let current = "home";
      let currentDistance = Infinity;

      // Check if we're at the top of the page
      if (window.scrollY < 100) {
        setActiveSection("home");
        return;
      }

      // Find the section closest to the viewport center
      const viewportCenter = window.innerHeight / 2;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top;
          const elementBottom = rect.bottom;
          const elementCenter = rect.top + rect.height / 2;
          
          // Check if section is visible in viewport
          if (elementTop < window.innerHeight && elementBottom > 0) {
            // Calculate distance from viewport center to section center
            const distance = Math.abs(viewportCenter - elementCenter);
            if (distance < currentDistance) {
              currentDistance = distance;
              current = section;
            }
          }
        }
      }

      setActiveSection(current);
    };

    // Initial check
    handleScroll();

    // Add scroll listener with throttling for better performance
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    
    
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header className={`fixed w-full top-6 z-50 transition-all duration-300`}>
      {/* Semi-transparent header background */}
      <div
        className="absolute inset-0 transition-all duration-300"
      />

      <nav className="container mx-auto flex justify-between items-center px-4 py-3 relative z-10">
        {/* Logo */}
        <a href="#home" className="flex items-center group z-50">
          <span className="text-xl font-['Great_Vibes'] bg-gradient-to-r from-[#60A5FA] to-[#93C5FD] bg-clip-text text-transparent">
          </span>
        </a>

        {/* Compact mobile nav (no hamburger) - always centered */}
        <ul className="md:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 z-40">
          {[
            { href: "#home", text: "Home", icon: faHome, id: "home" },
            { href: "#skills", text: "Skills", icon: faLaptopCode, id: "skills" },
            { href: "#projects", text: "Projects", icon: faProjectDiagram, id: "projects" },
          ].map((item, index) => {
            const isActive = activeSection === item.id;
            return (
              <li key={index}>
                <a
                  href={item.href}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs border backdrop-blur-sm transition-colors
                    ${isActive ? "bg-gray-100 border-blue-400/50 text-blue-800" : "bg-white/90 border-gray-200 text-blue-600"}`}
                >
                  <FontAwesomeIcon icon={item.icon} className="text-[12px]" />
                  <span>{item.text}</span>
                </a>
              </li>
            );
          })}
        </ul>

        {/* Removed full-screen mobile menu */}

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center space-x-1">
          {[
            { href: "#home", text: "Home", icon: faHome, id: "home" },
            { href: "#skills", text: "Skills", icon: faLaptopCode, id: "skills" },
            { href: "#projects", text: "Projects", icon: faProjectDiagram, id: "projects" },
          ].map((item, index) => {
            const isActive = activeSection === item.id;
            return (
              <li key={index}>
                <a
                  href={item.href}
                  className={`relative px-2 py-2 font-['Great_Vibes'] text-2xl transition-all duration-300 ${
                    isActive ? "active-tab" : ""
                  }`}
                >
                  <span
                    className={`relative z-10 transition-all duration-300 inline-block py-1 ${
                      isActive
                        ? "text-black font-semibold"
                        : "text-gray-500 hover:text-black"
                    }`}
                  >
                    {item.text}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black rounded-full"></span>
                    )}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <style>{`
        @keyframes magneticGlowBlack {
          0%   { box-shadow: 0 0 20px rgba(0,0,0,0.15); }
          50%  { box-shadow: 0 0 35px rgba(0,0,0,0.3); }
          100% { box-shadow: 0 0 20px rgba(0,0,0,0.15); }
        }
      `}</style>
    </header>
  );
};

export default Header;
