import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useRef, useState } from "react";

const Skills = () => {
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
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

  const skills = [
    {
      name: "React",
      color: "bg-[#61DAFB]",
      icon: "react.png",
      textColor: "text-black",
      description: "Built interactive UIs and SPAs",
    },
    {
      name: "Next.js",
      color: "bg-[#333333]",
      icon: "next.png",
      textColor: "text-white",
      iconClass: "invert",
      description: "Developed SSR and SSG websites",
    },
    {
      name: "JavaScript",
      color: "bg-[#F7DF1E]",
      icon: "javascript.png",
      textColor: "text-black",
      description: "Strong ES6+ experience",
    },
    {
      name: "TypeScript",
      color: "bg-[#3178C6]",
      icon: "ts.png",
      textColor: "text-white",
      description: "Type-safe development and scalable applications",
    },
    {
      name: "HTML",
      color: "bg-[#E44D26]",
      icon: "html.png",
      textColor: "text-white",
      description: "Semantic HTML and accessibility",
    },
    {
      name: "CSS",
      color: "bg-[#264DE4]",
      icon: "css.png",
      textColor: "text-white",
      description: "Responsive layouts with Flexbox/Grid",
    },
    {
      name: "Tailwind CSS",
      color: "bg-blue-900",
      icon: "twcss.png",
      textColor: "text-white",
      iconClass: "contrast-125",
      description: "Utility-first styling for rapid UI",
    },
    {
      name: "Node.js",
      color: "bg-[#ffff]",
      icon: "node.png",
      textColor: "text-white",
      description: "Built RESTful APIs and backends",
    },
    {
      name: "PostgreSQL",
      color: "bg-[#336791]",
      icon: "pg.png",
      textColor: "text-white",
      description: "Complex SQL queries and DB design",
    },
    {
      name: "MongoDB",
      color: "bg-blue-900",
      icon: "mongo.png",
      textColor: "text-white",
      description: "NoSQL database for flexible models",
    },
    {
      name: "PWA",
      color: "bg-[#C8EDE6]",
      icon: "pwa.png",
      textColor: "text-white",
      description: "Offline-first applications",
    },
    {
      name: "git",
      color: "bg-[#F05032]",
      icon: "git.png",
      textColor: "text-white",
      description: "Version control and collaboration",
    },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen -mb-12 sm:-mb-8 md:-mb-4">
      <section className="max-h-screen relative max-md:bg-none bg-gradient-to-b from-black via-[#0a1122] to-black py-8 md:py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-52 md:w-64 h-52 md:h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-52 md:w-64 h-52 md:h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-4 md:mb-12" data-aos="fade-down">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1 md:mb-4">
              Technical Skills
            </h2>
            <p className="text-white/70 text-sm md:text-base max-w-2xl mx-auto px-2">
              Technologies I've worked with in web development projects
            </p>
          </div>

          {/* Mobile description section - only shown on mobile */}
          {isMobile && selectedSkill && (
            <div className="max-w-4xl mx-auto mb-2 text-center bg-gray-900/80 backdrop-blur-md text-white text-xs md:text-sm rounded-lg p-2 md:p-3 border border-white/10">
              <p className="font-medium text-blue-400">{selectedSkill.name}:</p>
              <p className="text-xs md:text-sm">{selectedSkill.description}</p>
            </div>
          )}

          <div className="max-w-4xl mx-auto max-md:w-80 bg-[#0a1122]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-2 md:p-8">
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-8">
              {skills.map((skill, index) => (
                <div
                  key={skill.name}
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                  className="flex flex-col items-center relative"
                  onClick={() =>
                    isMobile &&
                    setSelectedSkill(
                      selectedSkill?.name === skill.name ? null : skill,
                    )
                  }
                  onMouseEnter={() => !isMobile && setHoveredSkill(skill.name)}
                  onMouseLeave={() => !isMobile && setHoveredSkill(null)}
                >
                  {/* Title above icon */}
                  <p className="text-xs sm:text-sm md:text-base font-medium text-white/90 hover:text-white text-center mb-1 md:mb-2">
                    {skill.name}
                  </p>

                  {/* Icon */}
                  <div
                    className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full
                                        ${skill.color} transition-transform duration-300
                                        ${isMobile && selectedSkill?.name === skill.name ? "ring-2 ring-white scale-110" : ""}
                                        hover:scale-105 shadow-lg overflow-hidden cursor-pointer`}
                  >
                    <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center">
                      <img
                        src={`/techIcons/${skill.icon}`}
                        alt={`${skill.name} icon`}
                        className={`w-full h-full object-contain ${skill.iconClass || ""}`}
                      />
                    </div>
                  </div>

                  {/* Desktop tooltip - only shown on desktop */}
                  {!isMobile && hoveredSkill === skill.name && (
                    <div
                      ref={tooltipRef}
                      className="absolute -top-16 left-1/2 transform -translate-x-1/2
                                                      w-48 bg-gray-900/95 backdrop-blur-md text-white text-xs rounded-lg
                                                      p-3 shadow-xl z-30 border border-white/10 pointer-events-none"
                    >
                      <div
                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2
                                                           rotate-45 w-3 h-3 bg-gray-900/95 border-b border-r border-white/10"
                      ></div>
                      {skill.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Skills;
