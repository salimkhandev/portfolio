import { faExternalLinkAlt, faCode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { useState } from "react";
import OptimizedImage from "./OptimizedImage";

const Project = ({
  title,
  description,
  link,
  githubLink,
  index,
  technologies = [],
  image,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      data-aos="fade-up"
      data-aos-delay={index * 100}
      className="group relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-500 hover:bg-white/10 hover:scale-[1.02] hover:shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Optional project image */}
      {image && (
        <div className="w-[100%] px-2 sm:px-4 pt-2 sm:pt-4 overflow-hidden">
          <OptimizedImage
            src={image}
            alt={title}
            className="transform transition-transform duration-700"
            style={{
              aspectRatio: "16/9",
            }}
          />
        </div>
      )}

      <div className="relative p-3 sm:p-6 space-y-2 sm:space-y-4">
        {/* Title with animated gradient on hover */}
        <h3
          className={`text-xl font-bold tracking-tight transition-all duration-500 ${
            isHovered
              ? "bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent bg-size-200 bg-pos-0 group-hover:bg-pos-100"
              : "text-[#8594FB]"
          }`}
        >
          {title}
        </h3>

        {/* Description with fade-in effect */}
        <p className="text-gray-400 text-sm leading-relaxed transform transition-all duration-500 group-hover:text-gray-300">
          {description}
        </p>

        {/* Technologies used tags */}
        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-1 sm:gap-2 pt-1 sm:pt-2">
            {technologies.map((tech, i) => (
              <span
                key={i}
                className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs rounded-full bg-white/5 text-blue-300 border border-blue-500/20"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3 pt-1 sm:pt-2">
          {/* Live project button */}
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 sm:py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 transition-all duration-300 group/link"
          >
            <span className="text-xs sm:text-sm font-semibold whitespace-nowrap ">
              Visit Project
            </span>
            <FontAwesomeIcon
              icon={faExternalLinkAlt}
              className="w-3 h-3 transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform duration-300"
            />
          </a>

          {/* GitHub link */}
          {githubLink && (
            <a
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 sm:py-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 hover:text-purple-300 transition-all duration-300 group/github"
            >
              <FontAwesomeIcon
                icon={faCode}
                className="w-2.5 h-2.5 sm:w-3 sm:h-3"
              />
              <span className="text-xs sm:text-sm font-semibold">Code</span>
            </a>
          )}
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 transform rotate-45 translate-x-12 -translate-y-12 group-hover:translate-x-6 group-hover:-translate-y-6 transition-transform duration-500"></div>

        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-purple-500/10 to-blue-500/10 transform -rotate-45 -translate-x-8 translate-y-8 opacity-0 group-hover:opacity-100 group-hover:-translate-x-4 group-hover:translate-y-4 transition-all duration-500"></div>
      </div>
    </div>
  );
};

Project.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  githubLink: PropTypes.string,
  index: PropTypes.number.isRequired,
  technologies: PropTypes.arrayOf(PropTypes.string),
  image: PropTypes.string,
};

export default Project;
