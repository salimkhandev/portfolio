import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * OptimizedImage component for better image loading performance
 * Features:
 * - Native lazy loading
 * - WebP format support with fallback
 * - Loading animation
 * - Fade-in effect
 */
const OptimizedImage = ({
  src,
  alt,
  className = "",
  style = {},
  width,
  height,
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);
  const [webpSupported, setWebpSupported] = useState(true);

  // Check if browser supports WebP
  useEffect(() => {
    const checkWebPSupport = () => {
      const canvas = document.createElement("canvas");
      if (canvas.getContext && canvas.getContext("2d")) {
        // Check WebP support by trying to encode a WebP image
        return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
      }
      return false;
    };

    setWebpSupported(checkWebPSupport());
  }, []);

  // Generate WebP version path if the source is PNG or JPG
  const webpSrc =
    src && webpSupported ? src.replace(/\.(png|jpe?g)$/i, ".webp") : null;

  // Handle image load event
  const handleImageLoaded = () => {
    setIsLoaded(true);
  };

  // Create shimmer effect during loading
  const renderPlaceholder = () => (
    <div
      className="absolute inset-0 bg-gray-800"
      style={{
        backgroundImage:
          "linear-gradient(110deg, #18181b 8%, #27272a 18%, #18181b 33%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s linear infinite",
        opacity: isLoaded ? 0 : 1,
        transition: "opacity 0.3s ease",
      }}
    />
  );

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        ...style,
        width: width || "100%",
        height: height || "auto",
      }}
    >
      {/* Loading placeholder */}
      {renderPlaceholder()}

      <picture>
        {/* WebP format for supporting browsers */}
        {webpSrc && (
          <source
            srcSet={webpSrc}
            type="image/webp"
            onError={() => setWebpSupported(false)}
          />
        )}

        {/* Original format fallback */}
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={handleImageLoaded}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: "opacity 0.3s ease",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transformOrigin: "center",
          }}
          {...rest}
        />
      </picture>

      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
};

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default OptimizedImage;
