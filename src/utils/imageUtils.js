/**
 * Utility functions for image optimization
 */

/**
 * Attempts to load the WebP version of an image if available
 * Falls back to the original image if WebP is not found or not supported
 *
 * @param {string} src - Original image source (png, jpg, etc.)
 * @returns {Promise<string>} - Promise resolving to path to use (either WebP or original)
 */
export const getOptimizedImagePath = async (src) => {
  // Don't process if src is not provided or doesn't match common image formats
  if (!src || !src.match(/\.(jpe?g|png|gif)$/i)) {
    return src;
  }

  // Generate WebP path from original
  const webpPath = src.replace(/\.(jpe?g|png|gif)$/i, ".webp");

  // Check if WebP version exists
  try {
    const webpExists = await checkImageExists(webpPath);
    return webpExists ? webpPath : src;
  } catch (error) {
    console.log("Error checking WebP existence:", error);
    return src;
  }
};

/**
 * Generates different size versions of an image path for responsive loading
 *
 * @param {string} src - Original image source
 * @param {Object} sizes - Object with size keys and width values (e.g., {sm: 300, md: 600})
 * @returns {Object} - Object with paths for different sizes
 */
export const getResponsiveImagePaths = (
  src,
  sizes = { sm: 300, md: 600, lg: 900 },
) => {
  // Don't process if src is not provided or doesn't match common image formats
  if (!src || !src.match(/\.(jpe?g|png|gif|webp)$/i)) {
    return { original: src };
  }

  const result = { original: src };

  // Generate paths for different sizes
  Object.entries(sizes).forEach(([size, width]) => {
    const sizedPath = src.replace(/\.(jpe?g|png|gif|webp)$/i, `-${size}.$1`);
    result[size] = sizedPath;
  });

  return result;
};

/**
 * Generates a srcSet string for responsive images
 *
 * @param {string} src - Original image source
 * @param {Object} sizes - Object with size keys and width values
 * @returns {string} - srcSet attribute value
 */
export const generateSrcSet = (
  src,
  sizes = { sm: "300w", md: "600w", lg: "900w" },
) => {
  // Don't process if src is not provided
  if (!src) return "";

  const paths = getResponsiveImagePaths(src, sizes);

  return Object.entries(sizes)
    .map(([size, width]) => `${paths[size]} ${width}`)
    .join(", ");
};

/**
 * A simple custom hook for lazily loading images
 *
 * Import and use in a component:
 * const imgRef = useProgressiveImg('/path/to/image.jpg');
 *
 * Then in your JSX:
 * <img ref={imgRef} src="/path/to/image.jpg" alt="..." />
 *
 * This will automatically:
 * 1. Add loading="lazy" to the image
 * 2. Attempt to use WebP version if available
 * 3. Add a fade-in effect when the image loads
 */
export const useProgressiveImg = (src) => {
  return (imgElement) => {
    if (!imgElement) return;

    // Add native lazy loading
    imgElement.loading = "lazy";

    // Try WebP version if possible
    const webpSrc = getOptimizedImagePath(src);

    // Create a test image to see if WebP version exists
    const testImg = new Image();
    testImg.onload = () => {
      // WebP version exists, use it
      imgElement.src = webpSrc;
    };
    testImg.onerror = () => {
      // WebP version doesn't exist, keep original
      imgElement.src = src;
    };
    testImg.src = webpSrc;

    // Add fade-in effect
    imgElement.style.opacity = "0";
    imgElement.style.transition = "opacity 0.3s ease";

    imgElement.onload = () => {
      imgElement.style.opacity = "1";
    };
  };

  /**
   * Checks if an image exists at the given path
   *
   * @param {string} imagePath - Path to check
   * @returns {Promise<boolean>} - Promise resolving to true if image exists
   */
  export const checkImageExists = (imagePath) => {
    return new Promise((resolve) => {
      const img = new Image();

      img.onload = () => {
        resolve(true);
      };

      img.onerror = () => {
        resolve(false);
      };

      // Use absolute path if relative
      if (imagePath.startsWith("/")) {
        img.src = window.location.origin + imagePath;
      } else {
        img.src = imagePath;
      }
    });
  };

  /**
   * Simple function to determine if the browser supports WebP
   *
   * @returns {boolean} - True if browser supports WebP
   */
  export const supportsWebP = () => {
    const elem = document.createElement("canvas");

    if (elem.getContext && elem.getContext("2d")) {
      // Firefox will throw an error if WebP is not supported
      // Chrome will return 'image/webp' data URI if WebP is supported
      return elem.toDataURL("image/webp").indexOf("data:image/webp") === 0;
    }

    // WebP not supported
    return false;
  };
};
