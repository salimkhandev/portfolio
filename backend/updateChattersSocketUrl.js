const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { connectDB } = require('./config/db');
const Project = require('./models/Project');

async function run() {
  try {
    await connectDB();
    const result = await Project.updateOne(
      { title: { $regex: /ChattersSocket/i } },
      { $set: { deployedUrl: 'https://chatters-socket-frontend.vercel.app' } }
    );
    console.log('Update result:', result);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
