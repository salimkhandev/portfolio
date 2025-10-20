import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * LazyImage component with lazy loading, WebP support, and responsive image sizes
 *
 * @param {Object} props - Component props
 * @param {string} props.src - Primary image source (PNG or JPG format)
 * @param {string} props.webpSrc - WebP version of the image (optional, will use src with .webp extension if not provided)
 * @param {string} props.alt - Alt text for the image
 * @param {string} props.className - Optional CSS classes
 * @param {Object} props.style - Optional inline styles
 * @param {Object} props.sizes - Optional responsive sizes (e.g., {sm: "300w", md: "500w", lg: "800w"})
 * @param {string} props.defaultSize - Default size to use if sizes is provided (default: "md")
 * @param {function} props.onLoad - Optional callback when image is loaded
 * @param {function} props.onError - Optional callback when image fails to load
 */
const LazyImage = ({
  src,
  webpSrc,
  alt,
  className = "",
  style = {},
  sizes,
  defaultSize = "md",
  onLoad,
  onError,
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(true);

  // Generate WebP source if not provided
  const webpSource =
    webpSrc || (src ? src.replace(/\.(png|jpe?g)$/i, ".webp") : "");

  // Generate srcSet if sizes are provided
  const generateSrcSet = (imageSrc) => {
    if (!sizes) return undefined;

    return Object.entries(sizes)
      .map(
        ([size, width]) =>
          `${imageSrc.replace(/\.(png|jpe?g|webp)$/i, `-${size}.$1`)} ${width}`,
      )
      .join(", ");
  };

  // Create ref for the image element
  const imgRef = React.useRef(null);

  // Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }, // Start loading when image is 200px from viewport
    );

    // For now, we'll just set isInView to true immediately
    // without using the observer to ensure images show up
    setIsInView(true);

    return () => {
      // Cleanup function
    };
  }, []);

  // Handle image load event
  const handleImageLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  // Handle image error event
  const handleImageError = (e) => {
    console.error("Failed to load image:", src);
    if (onError) onError(e);
  };

  return (
    <div
      ref={imgRef}
      className={`lazy-image-container ${isLoaded ? "loaded" : "loading"} ${className}`}
      style={{
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Placeholder/loading state */}
      {!isLoaded && (
        <div
          className="lazy-image-placeholder"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(110deg, #1a1a1a 8%, #222222 18%, #1a1a1a 33%)",
            backgroundSize: "200% 100%",
            animation: "1.5s shine linear infinite",
            opacity: isLoaded ? 0 : 1,
            transition: "opacity 0.3s ease",
          }}
        />
      )}

      {/* Only render the actual image when it comes into view */}
      {
        <picture>
          {/* WebP format for browsers that support it */}
          {webpSource && (
            <source
              type="image/webp"
              srcSet={generateSrcSet(webpSource)}
              src={webpSource}
            />
          )}

          {/* Fallback for browsers that don't support WebP */}
          <img
            src={src}
            srcSet={generateSrcSet(src)}
            alt={alt}
            loading="lazy"
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "opacity 0.3s ease",
              opacity: isLoaded ? 1 : 0,
            }}
            {...rest}
          />
        </picture>
      }

      {/* CSS for the loading animation */}
      <style>{`
        @keyframes shine {
          to {
            background-position-x: -200%;
          }
        }
      `}</style>
    </div>
  );
};

LazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  webpSrc: PropTypes.string,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  sizes: PropTypes.object,
  defaultSize: PropTypes.string,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
};

export default LazyImage;
