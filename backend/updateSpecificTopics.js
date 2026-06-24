const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { connectDB } = require('./config/db');
const Skill = require('./models/Skill');

const updates = {
  '690576566690e30e5e4f151a': ["Hooks", "Context API", "Component Lifecycle", "Redux", "React Router", "Custom Hooks"], // React.js
  '69057cdff2470fdfcad021f3': ["ES6+", "Promises/Async", "DOM Manipulation", "Closures", "Event Loop"], // Salim Khan (JS)
  '69057cf3f2470fdfcad021f6': ["Aggregation", "Indexing", "Mongoose", "CRUD Operations", "Data Modeling"], // dfsdo (MongoDB)
  '69057d09f2470fdfcad021f9': ["Semantic HTML", "Accessibility", "Forms", "SEO", "Web Storage", "Responsive Design"], // ghss-profile-pics (HTML)
  '69057d3bf2470fdfcad02200': ["Interfaces", "Generics", "Type Inference", "Utility Types", "Decorators"], // Salim Khan (TS)
  '6906ed83bf389aa834cd83bc': ["React Native", "Expo", "Mobile UI", "Navigation", "App State"] // Hdhd
};

async function run() {
  try {
    await connectDB();
    for(let id of Object.keys(updates)) {
       await Skill.findByIdAndUpdate(id, { topics: updates[id] });
       console.log(`Updated ID ${id}`);
    }
    console.log("All specific topics updated.");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
run();
