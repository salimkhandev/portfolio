import {
  faGithub,
  faLinkedin,
  faTwitter,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const FloatingContact = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const email = "salimkhandev@gmail.com"; // Your email address

  const emailLink = isMobile
    ? `mailto:${email}` // 📱 Mobile → opens default email app
    : `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`; // 💻 Desktop → opens Gmail web

  const socialLinks = [
    {
      icon: faEnvelope,
      href: emailLink,
      color: "hover:text-green-400",
      label: "Email",
    },
    {
      icon: faWhatsapp,
      href: "https://wa.me/923201970649",
      color: "hover:text-green-400",
      label: "WhatsApp",
    },
    {
      icon: faGithub,
      href: "http://github.com/salimkhandev",
      color: "hover:text-gray-400",
      label: "GitHub",
    },
    {
      icon: faLinkedin,
      href: "https://www.linkedin.com/in/salimkhandev",
      color: "hover:text-blue-400",
      label: "LinkedIn",
    },
    {
      icon: faTwitter,
      href: "https://x.com/SalimKhandev",
      color: "hover:text-blue-400",
      label: "Twitter",
    },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {/* Floating Contact Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 md:bottom-6 md:left-6 pointer-events-auto w-12 h-12 md:w-14 md:h-14 bg-black/90 backdrop-blur-md border border-white/20 hover:bg-gray-900 text-white rounded-full shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 focus:outline-none flex items-center justify-center group"
        aria-label={isOpen ? "Close contact options" : "Open contact options"}
        style={{ zIndex: 9000 }}
      >
        {isOpen ? (
          <svg
            className="w-5 h-5 md:w-6 md:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <FontAwesomeIcon icon={faPhone} className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-12 transition-transform duration-300" />
        )}
      </button>

      {/* Contact Options Panel */}
      {isOpen && (
        <div
          className="fixed bottom-20 left-4 md:bottom-24 md:left-6 pointer-events-auto bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl border border-gray-200 p-4 min-w-[200px]"
          style={{ zIndex: 8999 }}
        >
          <div className="text-center mb-3">
            <h3 className="text-gray-800 font-semibold text-sm">Get in Touch</h3>
          </div>

          <div className="flex flex-col space-y-3">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center space-x-3 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-300 ${social.color} group`}
                onClick={() => setIsOpen(false)}
              >
                <FontAwesomeIcon
                  icon={social.icon}
                  className="text-xl text-gray-700 group-hover:scale-110 transition-transform duration-300"
                />
                <span className="text-gray-800 text-sm font-medium">
                  {social.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingContact;
