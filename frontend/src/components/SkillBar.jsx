import {
  faReact, faJs, faNodeJs, faHtml5, faCss3Alt, faPython,
  faGit, faDocker, faSass, faAngular, faVuejs, faPhp,
  faAndroid, faAws, faGithub, faLinux, faSwift, faRust
} from '@fortawesome/free-brands-svg-icons';
import { HiChevronDown, HiChevronUp, HiCode } from 'react-icons/hi';
import {
  faCode, faDatabase, faMobileAlt, faServer, faShieldAlt, faBolt
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useRef, useState } from "react";
import { useSkills } from "../context/SkillsContext";

// Add CSS animations
const styles = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Map iconKey string to FA icon object
const ICON_MAP = {
  faReact, faJs, faNodeJs, faHtml5, faCss3Alt, faPython,
  faGit, faDocker, faSass, faAngular, faVuejs, faPhp,
  faAndroid, faAws, faGithub, faLinux, faSwift, faRust,
  faCode, faDatabase, faMobileAlt, faServer, faShieldAlt, faBolt,
};

// Default color per icon key
const ICON_COLORS = {
  faReact:     '#61DAFB',
  faJs:        '#F7DF1E',
  faNodeJs:    '#339933',
  faHtml5:     '#E34F26',
  faCss3Alt:   '#1572B6',
  faPython:    '#3776AB',
  faGit:       '#F05032',
  faDocker:    '#2496ED',
  faSass:      '#CC6699',
  faAngular:   '#DD0031',
  faVuejs:     '#4FC08D',
  faPhp:       '#777BB4',
  faAndroid:   '#3DDC84',
  faAws:       '#FF9900',
  faGithub:    '#181717',
  faLinux:     '#FCC624',
  faSwift:     '#FA7343',
  faRust:      '#CE422B',
  faCode:      '#0ea5e9',   // Next.js — sky blue
  faDatabase:  '#22c55e',
  faMobileAlt: '#8b5cf6',
  faServer:    '#6366f1',   // PostgreSQL — indigo
  faShieldAlt: '#f59e0b',
  faBolt:      '#ef4444',   // Redis — red
};

const SkillIcon = ({ skill }) => {
  const iconDef = skill.iconKey && ICON_MAP[skill.iconKey];
  if (iconDef) {
    // Use a uniform dark color for a professional look
    const color = '#1f2937';
    return (
      <FontAwesomeIcon
        icon={iconDef}
        style={{ color, fontSize: '100%', width: '100%', height: '100%' }}
      />
    );
  }
  // Fallback to imageUrl for legacy entries
  if (skill.imageUrl) {
    return (
      <img
        src={skill.imageUrl}
        alt={`${skill.name} icon`}
        className="w-full h-full object-contain"
        style={{ pointerEvents: 'none' }}
      />
    );
  }
  // Ultimate fallback
  return <HiCode style={{ color: '#1f2937', width: '100%', height: '100%' }} />;
};

const Skills = () => {
  const { skills: skillsData, loading, error } = useSkills();
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [expandedSkill, setExpandedSkill] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const tooltipRef = useRef(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });

    // Check if screen is mobile size
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add listener for resize
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (hoveredSkill) {
      AOS.refresh();
    }
  }, [hoveredSkill]);

  // Close expanded skill when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If clicking on a skill icon or expand button, don't close
      const isSkillElement = event.target.closest('.skill-item');
      if (!isSkillElement && expandedSkill) {
        setExpandedSkill(null);
      }
    };

    if (expandedSkill) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [expandedSkill]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-blue-400 text-xl">Loading skills...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-red-400 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-8 sm:py-10 md:py-12 overflow-visible" style={{ position: 'relative' }}>
      <style>{styles}</style>
      <section className="w-full relative py-4 sm:py-8 md:py-12 overflow-visible" style={{ position: 'relative', zIndex: 1 }}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-52 md:w-64 h-52 md:h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-52 md:w-64 h-52 md:h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-3 sm:px-4 md:px-6 relative z-10">
          <div className="text-center mb-3 sm:mb-6 md:mb-12" data-aos="fade-down">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-1 sm:mb-2 md:mb-4">
              Technical Skills
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm md:text-base max-w-2xl mx-auto px-2">
              Technologies I&apos;ve worked with in web development projects
            </p>
          </div>


          {skillsData.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              No skills available
            </div>
          )}

          {skillsData.length > 0 && (
            <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 md:p-8 relative z-0">
              <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-6 md:gap-8 relative">
                {skillsData.map((skill, index) => {
                  return (
                    <div
                      key={skill._id || index}
                      data-aos="fade-up"
                      data-aos-delay={index * 50}
                      className="skill-item flex flex-col items-center min-w-0"
                      style={{
                        position: 'relative',
                        zIndex: expandedSkill === skill._id ? 10000 : 'auto'
                      }}
                    >
                      {/* Title above icon */}
                      <p className="text-[10px] sm:text-sm md:text-base font-medium text-black/90 hover:text-black text-center mb-1 sm:mb-1 md:mb-2 w-full truncate px-1">
                        {skill.name}
                      </p>

                      {/* Icon and Button Container - static position */}
                      <div
                        className="relative w-full flex flex-col items-center"
                        onMouseEnter={() => !isMobile && setHoveredSkill(skill._id)}
                        onMouseLeave={() => !isMobile && setHoveredSkill(null)}
                      >
                        {/* Icon */}
                        <div
                          className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => {
                            setExpandedSkill(expandedSkill === skill._id ? null : skill._id);
                          }}
                        >
                          <SkillIcon skill={skill} />
                        </div>

                        {/* Expand Icon Button - only show if topics exist */}
                        {skill.topics?.length > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedSkill(expandedSkill === skill._id ? null : skill._id);
                            }}
                            className="mt-1 w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 bg-gray-500 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors border border-gray-400"
                            title={expandedSkill === skill._id ? "Hide topics" : "Show topics"}
                          >
                            {expandedSkill === skill._id
                              ? <HiChevronUp className="text-white text-[10px] sm:text-xs md:text-sm" />
                              : <HiChevronDown className="text-white text-[10px] sm:text-xs md:text-sm" />
                            }
                          </button>
                        )}

                        {/* Desktop tooltip - only shown on desktop when not expanded */}
                        {!isMobile && hoveredSkill === skill._id && expandedSkill !== skill._id && (
                          <div
                            ref={tooltipRef}
                            className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-48 bg-white/95 backdrop-blur-md text-black text-xs rounded-lg p-3 border border-gray-200 pointer-events-none"
                            style={{ zIndex: 100 }}
                          >
                            <div
                              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-white/95 border-b border-r border-gray-200"
                            ></div>
                            {skill.topics?.length > 0 ? (
                              <div>
                                <p className="font-semibold mb-1">Click to view topics</p>
                              </div>
                            ) : (
                              <p>No topics available</p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Topics List - centered below each item */}
                      {expandedSkill === skill._id && skill.topics?.length > 0 && (
                        <div
                          className="absolute w-44 sm:w-72 md:w-80 px-2 pointer-events-auto transition-all duration-300 ease-out left-1/2 transform -translate-x-1/2"
                          style={{
                            position: 'absolute',
                            top: '100%',
                            marginTop: '0.5rem',
                            zIndex: 999999,
                            isolation: 'isolate',
                            animation: 'slideDown 0.3s ease-out',
                            maxHeight: isMobile ? '38vh' : '42vh',
                            overflowY: 'auto'
                          }}
                        >
                          <div className="space-y-1 bg-white/95 backdrop-blur-md rounded-lg p-2 sm:p-3 border border-gray-200" style={{ width: '100%' }}>
                            {skill.topics.map((topic, idx) => (
                              <div
                                key={idx}
                                onClick={() => {
                                  window.dispatchEvent(new CustomEvent('openChatTopic', { detail: { topic } }));
                                }}
                                className="text-[9px] sm:text-xs md:text-sm text-gray-800 text-left px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-100 rounded transition-all duration-200 break-words flex items-center gap-1 sm:gap-2 hover:bg-gray-200 cursor-pointer"
                                style={{
                                  animation: `fadeIn 0.3s ease-out ${Math.min(idx * 0.05, 1)}s both`,
                                  wordBreak: 'break-word',
                                  overflowWrap: 'break-word',
                                  hyphens: 'auto'
                                }}
                                title={topic}
                              >
                                <span className="text-gray-500 text-[8px] sm:text-[10px] md:text-xs font-mono flex-shrink-0">
                                  {(idx + 1).toString().padStart(2, '0')}
                                </span>
                                <span className="flex-1 text-left">{topic}</span>
                              </div>
                            ))}
                          </div>
                          {/* Arrow pointing up */}
                          <div
                            className="absolute w-2 h-2 bg-white/95 border-t border-l border-gray-200 left-1/2 transform -translate-x-1/2"
                            style={{
                              top: '-4px',
                              transform: 'translateX(-50%) rotate(45deg)'
                            }}
                          ></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </section>
    </div>
  );
};

export default Skills;