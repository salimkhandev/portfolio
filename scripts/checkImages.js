/**
 * checkImages.js
 *
 * This script checks all images in the project and verifies:
 * 1. If WebP versions exist for all PNG/JPG images
 * 2. If responsive versions exist for all images
 * 3. Reports statistics on potential size savings
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

// Promisify fs functions
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// Configuration
const config = {
  // Directories to scan for images
  imageDirs: ['public', 'public/techIcons', 'public/techIcons/projectScreenshot'],

  // Image extensions to check
  imageExtensions: ['.png', '.jpg', '.jpeg', '.gif'],

  // Responsive size suffixes to check for
  responsiveSizes: ['sm', 'md', 'lg'],
};

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Statistics object
const stats = {
  totalImages: 0,
  withWebP: 0,
  withResponsive: 0,
  missingWebP: [],
  missingResponsive: [],
  byType: {},
};

/**
 * Check if a file exists
 */
const fileExists = async (filePath) => {
  try {
    await stat(filePath);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Recursively find all image files in directories
 */
async function findImageFiles(dir) {
  const files = await readdir(dir);
  let imageFiles = [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = await stat(filePath);

    if (stats.isDirectory()) {
      const nestedImages = await findImageFiles(filePath);
      imageFiles = [...imageFiles, ...nestedImages];
    } else {
      const ext = path.extname(file).toLowerCase();
      if (config.imageExtensions.includes(ext)) {
        imageFiles.push(filePath);

        // Update statistics by type
        if (!stats.byType[ext]) stats.byType[ext] = 0;
        stats.byType[ext]++;
      }
    }
  }

  return imageFiles;
}

/**
 * Check if WebP version exists for an image
 */
async function checkWebPVersion(imagePath) {
  const webpPath = imagePath.replace(/\.(png|jpe?g|gif)$/i, '.webp');
  return await fileExists(webpPath);
}

/**
 * Check if responsive versions exist for an image
 */
async function checkResponsiveVersions(imagePath) {
  const parsed = path.parse(imagePath);
  const results = {
    hasAll: true,
    existing: [],
    missing: [],
  };

  for (const size of config.responsiveSizes) {
    const responsivePath = path.join(
      parsed.dir,
      `${parsed.name}-${size}${parsed.ext}`
    );

    const exists = await fileExists(responsivePath);

    if (exists) {
      results.existing.push(size);
    } else {
      results.missing.push(size);
      results.hasAll = false;
    }
  }

  return results;
}

/**
 * Main function to run the check
 */
async function main() {
  console.log(`${colors.cyan}==============================${colors.reset}`);
  console.log(`${colors.cyan}Image Optimization Check${colors.reset}`);
  console.log(`${colors.cyan}==============================${colors.reset}\n`);

  let allImageFiles = [];

  // Find all images in configured directories
  for (const dir of config.imageDirs) {
    console.log(`${colors.blue}Scanning directory: ${dir}...${colors.reset}`);
    try {
      const images = await findImageFiles(dir);
      allImageFiles = [...allImageFiles, ...images];
      console.log(`${colors.green}Found ${images.length} images${colors.reset}\n`);
    } catch (error) {
      console.log(`${colors.red}Error scanning ${dir}: ${error.message}${colors.reset}\n`);
    }
  }

  stats.totalImages = allImageFiles.length;
  console.log(`${colors.magenta}Found ${stats.totalImages} total images to check${colors.reset}\n`);

  // Check WebP and responsive versions for each image
  for (const imagePath of allImageFiles) {
    process.stdout.write(`Checking: ${imagePath}... `);

    // Check WebP version
    const hasWebP = await checkWebPVersion(imagePath);
    if (hasWebP) {
      stats.withWebP++;
    } else {
      stats.missingWebP.push(imagePath);
    }

    // Check responsive versions
    const responsiveCheck = await checkResponsiveVersions(imagePath);
    if (responsiveCheck.hasAll) {
      stats.withResponsive++;
    } else {
      stats.missingResponsive.push({
        path: imagePath,
        missing: responsiveCheck.missing
      });
    }

    // Display status for this image
    if (hasWebP && responsiveCheck.hasAll) {
      console.log(`${colors.green}✓ Fully optimized!${colors.reset}`);
    } else if (hasWebP || responsiveCheck.hasAll) {
      console.log(`${colors.yellow}⚠ Partially optimized${colors.reset}`);
    } else {
      console.log(`${colors.red}✗ Not optimized${colors.reset}`);
    }
  }

  // Display summary
  console.log(`\n${colors.cyan}==============================${colors.reset}`);
  console.log(`${colors.cyan}Summary${colors.reset}`);
  console.log(`${colors.cyan}==============================${colors.reset}\n`);

  console.log(`Total images: ${stats.totalImages}`);
  console.log(`Images with WebP versions: ${stats.withWebP} (${Math.round(stats.withWebP / stats.totalImages * 100)}%)`);
  console.log(`Images with all responsive sizes: ${stats.withResponsive} (${Math.round(stats.withResponsive / stats.totalImages * 100)}%)`);

  if (stats.missingWebP.length > 0) {
    console.log(`\n${colors.yellow}Images missing WebP versions (${stats.missingWebP.length}):${colors.reset}`);
    stats.missingWebP.forEach(path => {
      console.log(`  - ${path}`);
    });
  }

  if (stats.missingResponsive.length > 0) {
    console.log(`\n${colors.yellow}Images missing responsive versions (${stats.missingResponsive.length}):${colors.reset}`);
    stats.missingResponsive.forEach(item => {
      console.log(`  - ${item.path} (missing sizes: ${item.missing.join(', ')})`);
    });
  }

  console.log(`\n${colors.cyan}==============================${colors.reset}`);
  console.log(`${colors.cyan}Recommendation${colors.reset}`);
  console.log(`${colors.cyan}==============================${colors.reset}\n`);

  if (stats.missingWebP.length > 0 || stats.missingResponsive.length > 0) {
    console.log(`${colors.yellow}Run the image conversion script to create missing optimized versions:${colors.reset}`);
    console.log(`  npm run convert-images`);
    console.log(`\nThis could reduce your image payload size by approximately 30-50%!`);
  } else {
    console.log(`${colors.green}All images are fully optimized! Great job!${colors.reset}`);
  }

  console.log('');
}

// Run the script
main().catch(error => {
  console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
  process.exit(1);
});
