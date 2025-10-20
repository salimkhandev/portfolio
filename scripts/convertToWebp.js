/**
 * This script automatically converts PNG and JPG images to WebP format
 * It also creates responsive versions of the images with different sizes
 *
 * To use this script:
 * 1. Install sharp: npm install sharp
 * 2. Run: node scripts/convertToWebp.js
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const config = {
  inputDirs: ['public', 'public/techIcons', 'public/techIcons/projectScreenshot'],
  sizes: {
    sm: 300,  // Small devices
    md: 600,  // Medium devices
    lg: 900   // Large devices
  },
  quality: 85, // WebP quality (0-100)
};

// Function to recursively find all image files in a directory
async function findImageFiles(dir) {
  const files = await fs.readdir(dir);
  let imageFiles = [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = await fs.stat(filePath);

    if (stats.isDirectory()) {
      const nestedFiles = await findImageFiles(filePath);
      imageFiles = [...imageFiles, ...nestedFiles];
    } else if (/\.(png|jpe?g)$/i.test(file)) {
      imageFiles.push(filePath);
    }
  }

  return imageFiles;
}

// Function to convert an image to WebP format with different sizes
async function convertToWebP(imagePath) {
  console.log(`Processing: ${imagePath}`);

  const parsedPath = path.parse(imagePath);
  const webpPath = path.join(parsedPath.dir, `${parsedPath.name}.webp`);

  try {
    // Create base WebP version
    await sharp(imagePath)
      .webp({ quality: config.quality })
      .toFile(webpPath);
    console.log(`Created: ${webpPath}`);

    // Create responsive sizes
    for (const [size, width] of Object.entries(config.sizes)) {
      const responsiveWebpPath = path.join(
        parsedPath.dir,
        `${parsedPath.name}-${size}.webp`
      );

      // Create responsive WebP version
      await sharp(imagePath)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: config.quality })
        .toFile(responsiveWebpPath);
      console.log(`Created: ${responsiveWebpPath}`);

      // Also create responsive original format for fallback
      const responsiveOrigPath = path.join(
        parsedPath.dir,
        `${parsedPath.name}-${size}${parsedPath.ext}`
      );

      await sharp(imagePath)
        .resize({ width, withoutEnlargement: true })
        .toFile(responsiveOrigPath);
      console.log(`Created: ${responsiveOrigPath}`);
    }
  } catch (error) {
    console.error(`Error processing ${imagePath}:`, error);
  }
}

// Main function to run the script
async function main() {
  try {
    let allImages = [];

    for (const dir of config.inputDirs) {
      console.log(`Searching for images in ${dir}...`);
      const images = await findImageFiles(dir);
      allImages = [...allImages, ...images];
    }

    console.log(`Found ${allImages.length} images to process.`);

    // Process all images
    for (const image of allImages) {
      await convertToWebP(image);
    }

    console.log('All images have been processed successfully!');
    console.log('\nTo use these optimized images in your React app:');
    console.log('1. Import and use the LazyImage component');
    console.log('2. The component will automatically use WebP when supported');
    console.log('3. Responsive images will be loaded based on screen size');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the script
main();
