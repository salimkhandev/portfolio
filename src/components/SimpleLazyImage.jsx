import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

/**
 * A simplified lazy loading image component
 *
 * @param {Object} props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Image alt text
 * @param {string} props.className - Optional CSS class names
 * @param {Object} props.style - Optional inline styles
 */
function SimpleLazyImage({ src, alt, className = "", style = {}, ...rest }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(true); // Start with true to show images immediately
  const imgRef = useRef(null);

  // Use Intersection Observer to detect when image is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Already set to true initially, but this handles any future changes
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" }, // Start loading when image is 100px from viewport
    );

    // Start observing the image element
    // Skip the observation since we're setting isInView to true initially
    // This ensures images always show up regardless of observer behavior
    // if (imgRef.current) {
    //   observer.observe(imgRef.current);
    // }

    // Clean up
    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  // Handle image load event
  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div
      ref={imgRef}
      className={`lazy-image-container ${className}`}
      style={{
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Placeholder while loading */}
      {!isLoaded && (
        <div
          className="lazy-image-placeholder"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#1E1E1E",
            backgroundImage:
              "linear-gradient(90deg, #1E1E1E 0%, #2A2A2A 50%, #1E1E1E 100%)",
            backgroundSize: "200% 100%",
            animation: "1.5s placeholder-shine linear infinite",
          }}
        />
      )}

      {/* Always render the image since isInView is true */}
      {
        <img
          src={src}
          alt={alt}
          onLoad={handleImageLoad}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: isLoaded ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
          loading="lazy"
          {...rest}
        />
      }

      <style>{`
        @keyframes placeholder-shine {
          from { background-position: -200% 0; }
          to { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}

SimpleLazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default SimpleLazyImage;
