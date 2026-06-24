const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { connectDB } = require('./config/db');
const Skill = require('./models/Skill');

// Map existing skill IDs to their correct FA iconKey
const iconUpdates = {
  '690576566690e30e5e4f151a': 'faReact',      // React.js
  '69057cdff2470fdfcad021f3': 'faJs',          // JavaScript
  '69057cf3f2470fdfcad021f6': 'faDatabase',    // MongoDB (no official FA icon, use Database)
  '69057d09f2470fdfcad021f9': 'faCss3Alt',     // CSS3
  '69057d3bf2470fdfcad02200': 'faCode',        // TypeScript (no FA icon, use Code)
  '6906ed83bf389aa834cd83bc': 'faMobileAlt',  // Mobile app
};

async function run() {
  try {
    await connectDB();
    for (const [id, iconKey] of Object.entries(iconUpdates)) {
      await Skill.findByIdAndUpdate(id, { iconKey, imageUrl: '', cloudinaryImagePublicId: '' });
      console.log(`Set ${id} -> ${iconKey}`);
    }
    console.log('All iconKeys seeded successfully.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
