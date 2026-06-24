const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const { connectDB } = require('./config/db');
const Skill = require('./models/Skill');

const topicMap = {
  "React": ["Hooks", "Context API", "Component Lifecycle", "Redux", "React Router", "Custom Hooks"],
  "Node.js": ["Express.js", "REST APIs", "Middleware", "Authentication", "Event Loop"],
  "Node": ["Express.js", "REST APIs", "Middleware", "Authentication", "Event Loop"],
  "Express": ["Routing", "Middleware", "Error Handling", "RESTful APIs", "Integration"],
  "MongoDB": ["Aggregation", "Indexing", "Mongoose", "CRUD Operations", "Data Modeling"],
  "JavaScript": ["ES6+", "Promises/Async", "DOM Manipulation", "Closures", "Event Loop"],
  "Tailwind CSS": ["Utility Classes", "Responsive Design", "Custom Themes", "Flexbox/Grid", "Animations"],
  "HTML": ["Semantic HTML", "Accessibility", "Forms", "SEO", "Web Storage"],
  "CSS": ["Flexbox", "Grid", "Responsive Design", "Animations", "Variables"],
  "Git": ["Branching", "Merging", "Rebasing", "Conflict Resolution", "Collaboration"],
  "Next.js": ["Server Components", "App Router", "API Routes", "Data Fetching", "Static Generation"],
  "TypeScript": ["Interfaces", "Generics", "Type Inference", "Utility Types", "Decorators"],
};

const defaultTopics = ["Fundamentals", "Advanced Concepts", "Best Practices", "Architecture", "Performance Optimization"];

async function seedTopics() {
  try {
    console.log("Connecting to Database...");
    await connectDB();
    console.log("Database connected successfully.");

    const skills = await Skill.find({});
    console.log(`Found ${skills.length} skills in the database.`);

    for (const skill of skills) {
      // Find matching topics by name (case-insensitive partial match)
      let topicsToAssign = defaultTopics;
      for (const [key, topics] of Object.entries(topicMap)) {
        if (skill.name.toLowerCase().includes(key.toLowerCase())) {
          topicsToAssign = topics;
          break;
        }
      }

      skill.topics = topicsToAssign;
      await skill.save();
      console.log(`Updated skill "${skill.name}" with topics: ${topicsToAssign.join(', ')}`);
    }

    console.log("All skills updated successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding topics:", error);
    process.exit(1);
  }
}

seedTopics();
