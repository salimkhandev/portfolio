# Salim Khan's Portfolio

A modern, responsive portfolio website built with React, featuring a 3D background, animated sections, and an interactive AI assistant.

## Features

- **3D Background**: Dynamic, interactive background with Three.js
- **Responsive Design**: Optimized for all devices from mobile to desktop
- **Interactive Sections**: Home, About, Projects, and Contact sections with animations
- **AI Assistant**: Floating chat assistant powered by Botpress
- **Optimized Images**: Lazy loading, WebP format, and responsive sizing

## Technologies Used

- **Frontend**: React, Vite
- **UI/UX**: Tailwind CSS, Framer Motion, AOS, Animate.css
- **3D Graphics**: Three.js, React Three Fiber
- **Chat Integration**: Botpress Webchat
- **Performance Optimizations**: Image lazy loading, WebP conversion

## Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/salimkhandev/portfolio.git
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Run development server
   ```bash
   npm run dev
   ```

## Image Optimization

This project implements several image optimization techniques:

### Features
- **Lazy Loading**: Images load only when they come into view
- **WebP Support**: Modern WebP format with PNG/JPG fallbacks
- **Responsive Images**: Different sizes loaded based on device viewport
- **Loading Placeholders**: Smooth animations while images load

### Usage
Replace standard `<img>` tags with the `<LazyImage>` component:

```jsx
import LazyImage from './components/LazyImage';

<LazyImage
  src="/path/to/image.png"
  alt="Description"
  sizes={{
    sm: "300w",  // Small screens
    md: "600w",  // Medium screens
    lg: "900w"   // Large screens
  }}
/>
```

To convert existing images to optimized formats:
```bash
npm run convert-images
```

See [IMAGE_OPTIMIZATION.md](./IMAGE_OPTIMIZATION.md) for detailed documentation.

## Project Structure

```
portfolio/
├── public/               # Static assets
├── src/
│   ├── components/       # React components
│   │   ├── LazyImage.jsx # Image optimization component
│   │   ├── My3DBackground/ # 3D background components
│   │   └── ...          # Other components
│   ├── CSS/             # Stylesheets
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Entry point
├── scripts/
│   └── convertToWebp.js  # Image conversion utility
└── ...
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Salim Khan - [salimkhandev@gmail.com](mailto:salimkhandev@gmail.com)

Project Link: [https://github.com/salimkhandev/portfolio](https://github.com/salimkhandev/portfolio)