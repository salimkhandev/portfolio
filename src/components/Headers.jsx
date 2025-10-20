import {
  faBars,
  faHome,
  faProjectDiagram,
  faTimes,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300`}>
      {/* Semi-transparent header background */}
      <div
        className={`absolute inset-0 transition-all duration-300 ${
          scrolled
            ? "bg-[#0a0a12]/60 backdrop-blur-lg"
            : "bg-gradient-to-b from-[#0a0a12]/40 to-transparent backdrop-blur-sm"
        }`}
      />

      <nav className="container mx-auto flex justify-between items-center px-4 py-4 relative z-10">
        {/* Logo */}
        <a href="#home" className="flex items-center group z-50">
          <span className="text-xl font-['Great_Vibes'] bg-gradient-to-r from-[#60A5FA] to-[#93C5FD] bg-clip-text text-transparent">
            <img
              src="/profilePic.webp"
              alt="logo"
              className="w-10 h-10 rounded-full"
            />
          </span>
        </a>

        {/* Mobile Hamburger Button - Enhanced visibility */}
        <button
          className={`md:hidden z-50 w-12 h-12 flex items-center justify-center rounded-xl
                    ${
                      isOpen
                        ? "bg-white/10 backdrop-blur-xl shadow-lg border border-white/20"
                        : "bg-[#1a2544] shadow-lg border border-blue-500/30"
                    }
                    transition-all duration-300 hover:scale-105 active:scale-95`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <FontAwesomeIcon
            icon={isOpen ? faTimes : faBars}
            className={`text-xl transition-all duration-300
                        ${
                          isOpen
                            ? "text-white rotate-90 scale-110"
                            : "text-blue-400 rotate-0"
                        }`}
          />
        </button>

        {/* Mobile Menu - Enhanced blur and layout */}
        <div
          className={`fixed inset-0 transition-all duration-300 md:hidden
                        ${
                          isOpen
                            ? "opacity-100 translate-x-0 backdrop-blur-xl"
                            : "opacity-0 translate-x-full pointer-events-none"
                        }`}
        >
          {/* Enhanced blur background with gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#050507]/90 to-[#0a0a12]/95 backdrop-blur-xl" />

          {/* Content Layer with improved spacing */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            <ul className="flex flex-col items-center space-y-8 p-6 w-full max-w-sm mx-auto">
              {[
                { href: "#home", text: "Home", icon: faHome },
                { href: "#about", text: "About", icon: faUser },
                { href: "#projects", text: "Projects", icon: faProjectDiagram },
              ].map((item, index) => (
                <li
                  key={index}
                  className={`w-full transform transition-all duration-300 ${
                    isOpen
                      ? "translate-x-0 opacity-100"
                      : "translate-x-8 opacity-0"
                  }`}
                >
                  <a
                    href={item.href}
                    className="flex items-center justify-center group w-full px-6 py-4 rounded-xl
                                        bg-[#131320]/40 backdrop-blur-xl border border-white/10 hover:bg-white/10
                                        transition-all duration-300 hover:scale-105 hover:border-blue-400/30"
                    onClick={() => setIsOpen(false)}
                  >
                    <FontAwesomeIcon
                      icon={item.icon}
                      className="mr-3 text-blue-400 text-xl group-hover:text-blue-300"
                    />
                    <span
                      className="bg-gradient-to-r  from-[#60A5FA] to-[#93C5FD] bg-clip-text text-transparent
                                            text-2xl font-['Great_Vibes']"
                    >
                      {item.text}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center space-x-8">
          {[
            { href: "#home", text: "Home", icon: faHome },
            { href: "#about", text: "About", icon: faUser },
            { href: "#projects", text: "Projects", icon: faProjectDiagram },
          ].map((item, index) => (
            <li key={index}>
              {
                <a
                  href={item.href}
                  className="relative handDrag px-3 py-2 group font-['Great_Vibes'] text-2xl shimmer-effect"
                >
                  <span className="relative z-10 bg-gradient-to-r from-[#60A5FA] to-[#93C5FD] bg-clip-text text-transparent group-hover:from-[#ff4d4d] group-hover:to-[#A64DDA] group-hover:text-shadow-[0_0_12px_rgba(166,77,218,0.6),0_0_20px_rgba(166,77,218,0.4)] transition-all duration-300">
                    {item.text}
                  </span>
                </a>
              }
            </li>
          ))}
        </ul>
      </nav>

      <style jsx>{`
        .shimmer-effect::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(166, 77, 218, 0.6),
            transparent
          );
          transition: width 0.4s ease;
          pointer-events: none;
        }

        .shimmer-effect:hover::before {
          width: 100%;
        }

        @keyframes magneticGlowPurple {
          0% {
            box-shadow:
              0 0 35px rgba(166, 77, 218, 0.6),
              0 0 70px rgba(166, 77, 218, 0.3);
          }
          50% {
            box-shadow:
              0 0 50px rgba(166, 77, 218, 0.8),
              0 0 100px rgba(166, 77, 218, 0.5);
          }
          100% {
            box-shadow:
              0 0 35px rgba(166, 77, 218, 0.6),
              0 0 70px rgba(166, 77, 218, 0.3);
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
