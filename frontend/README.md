# Portfolio Website with Admin Dashboard

A modern, interactive portfolio website built with React and Express.js, featuring a dynamic 3D background, project showcase, skills display, and a comprehensive admin dashboard for content management.

## 🌟 Features

### Public Portfolio
- **Home Section**: Interactive landing page with animated typing effect and 3D background
- **About Section**: Personal bio and skills display with visual skill bars
- **Projects Section**: Showcase of projects with:
  - Video demonstrations and thumbnail images
  - Project descriptions, features, and technologies used
  - GitHub and deployment links
  - Duration and challenges information
- **Skills Section**: Interactive display of technical skills with topics
- **Interactive Elements**:
  - 3D animated background using Three.js
  - Smooth scroll animations (AOS)
  - Floating chat widget
  - Floating contact form
  - Custom cursor trail effect

### Admin Dashboard
- **Authentication**: Secure JWT-based login system
- **Project Management**: Full CRUD operations for projects
  - Add, edit, and delete projects
  - Upload project videos and thumbnail images
  - Manage project features, tools, and links
- **Skills Management**: Full CRUD operations for skills
  - Add, edit, and delete skills
  - Upload skill icons
  - Manage skill topics
- **Media Management**: Cloudinary integration for video and image storage

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and development server
- **React Router** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **AOS (Animate On Scroll)** - Scroll animations
- **Axios** - HTTP client
- **SweetAlert2** - Beautiful alert modals
- **FontAwesome** - Icon library
- **Framer Motion** - Animation library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Cloudinary** - Media storage and CDN
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
- **Cookie Parser** - Cookie parsing middleware

## 📁 Project Structure

```
salimkhandev/
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── UnifiedDashboard.jsx
│   │   │   └── ...
│   │   ├── context/           # React context providers
│   │   ├── utils/             # Utility functions
│   │   └── App.jsx            # Main app component
│   ├── public/                # Static assets
│   └── package.json
├── backend/
│   ├── controllers/           # Route controllers
│   ├── models/                # Mongoose models
│   ├── routes/                # Express routes
│   ├── middleware/            # Custom middleware
│   ├── config/                # Configuration files
│   ├── utils/                 # Utility functions
│   └── server.js              # Entry point
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database (local or MongoDB Atlas)
- Cloudinary account (for media storage)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd salimkhandev
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Variables

#### Backend (.env)
Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=3000
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/portfolio
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### Frontend (.env)
Create a `.env` file in the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   The server will run on `http://localhost:3000`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

3. **Build for production**
   ```bash
   cd frontend
   npm run build
   ```

## 📝 Usage

### Accessing the Admin Dashboard

1. Navigate to `/login` in your browser
2. Login with your admin credentials
3. Once authenticated, you'll be redirected to `/dashboard`
4. Use the dashboard to:
   - Manage projects (add, edit, delete)
   - Upload project videos and thumbnails
   - Manage skills and topics
   - Upload skill icons

### Creating Admin User

To create an admin user, you'll need to manually add it to the MongoDB database or create a script. The user model should include:
- `username`: Admin username
- `password`: Hashed password (use bcrypt)
- `role`: Should be set to "admin"

## 🔒 Authentication

The application uses JWT (JSON Web Tokens) for authentication:
- Tokens are stored in HTTP-only cookies for security
- Protected routes require valid authentication
- Tokens expire after a set duration (configured in backend)

## 📦 Key Components

### Frontend Components
- **Home**: Landing page with profile and animated typing
- **About**: Bio and skills section
- **Projects**: Project showcase with media
- **UnifiedDashboard**: Admin panel for managing content
- **My3DBackground**: 3D animated background
- **SkillBar**: Interactive skill visualization
- **FloatingChat**: Chat widget integration
- **FloatingContact**: Contact form widget

### Backend Routes
- `/api/users/login` - Admin login
- `/api/projects` - CRUD operations for projects
- `/api/skills` - CRUD operations for skills

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` for theme customization
- Update colors in component files for brand colors
- Adjust animations in `My3DBackground/index.jsx`

### Content
- Update profile information in `Home.jsx` and `About.jsx`
- Manage all dynamic content through the admin dashboard

## 🚢 Deployment

### Frontend Deployment (Vercel recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Configure build command: `npm run build`
4. Set output directory: `dist`

### Backend Deployment
1. Deploy to platforms like Heroku, Railway, or Render
2. Set environment variables
3. Ensure MongoDB connection is accessible
4. Update CORS settings for production domain

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

**Muhammad Khalil**
- Software Engineering student at Islamia College University Peshawar
- Portfolio: [Your Portfolio URL]
- GitHub: [Your GitHub URL]

## 🙏 Acknowledgments

- Three.js community for excellent 3D graphics library
- React and Vite teams for excellent developer experience
- All open-source contributors whose packages made this project possible

---

Built with ❤️ using React and Express.js



