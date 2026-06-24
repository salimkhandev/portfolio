import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <section
      id="home"
      className="min-h-screen relative flex items-center justify-center overflow-hidden py-6 md:py-0"
    >
      {/* Subtle background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-2xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 py-4 md:py-8">
        <div className="relative mb-6 md:mb-8 inline-block">
          {/* Professional profile container */}
          <div className="relative w-[200px] h-[200px] md:w-[220px] md:h-[220px]">
            {/* Border for profile */}
            <div className="absolute inset-0 rounded-full border-4 border-blue-500 opacity-75"></div>

            {/* Profile image container */}
            <div className="absolute inset-[6px] rounded-full overflow-hidden">
              <img
                src="/image-prof-github.png"
                className="w-full h-full object-cover"
                alt="Salim Khan"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Name and title */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-black">
            Salim Khan
          </h1>

          <div className="flex justify-center items-center">
            <p className="text-xl md:text-2xl font-light text-gray-800">
              Full Stack Developer
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              Hi, I&apos;m{" "}
              <span className="font-semibold text-black">Salim Khan</span>,
              a professional Full Stack Developer with expertise in building scalable, modern web applications.
            </p>
          </div>

          <div className="mt-8">
            <a
              href="#projects"
              className="inline-block px-6 py-2 md:px-6 md:py-2 bg-black hover:bg-gray-800 rounded-md
                text-white font-medium transition-colors duration-300"
            >
              View My Work
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
