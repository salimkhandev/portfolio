const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { connectDB } = require('./config/db');
const Skill = require('./models/Skill');

const newSkills = [
  {
    name: 'JavaScript',
    iconKey: 'faJs',
    iconColor: '#F7DF1E',
    topics: ['ES6+', 'Promises/Async', 'DOM Manipulation', 'Closures', 'Event Loop', 'Prototypes'],
    order: 1
  },
  {
    name: 'TypeScript',
    iconKey: 'faJs',
    iconColor: '#3178C6',
    topics: ['Interfaces', 'Generics', 'Type Inference', 'Utility Types', 'Decorators', 'Enums'],
    order: 2
  },
  {
    name: 'React.js',
    iconKey: 'faReact',
    iconColor: '#61DAFB',
    topics: ['Hooks', 'Context API', 'Component Lifecycle', 'Redux', 'React Router', 'Custom Hooks'],
    order: 3
  },
  {
    name: 'Next.js',
    iconKey: 'faCode',
    iconColor: '#000000',
    topics: ['SSR', 'SSG', 'App Router', 'API Routes', 'Middleware', 'ISR'],
    order: 4
  },
  {
    name: 'Angular.js',
    iconKey: 'faAngular',
    iconColor: '#DD0031',
    topics: ['Components', 'Services', 'RxJS', 'Dependency Injection', 'NgRx', 'Routing'],
    order: 5
  },
  {
    name: 'Node.js',
    iconKey: 'faNodeJs',
    iconColor: '#339933',
    topics: ['Express', 'REST APIs', 'Middleware', 'File System', 'Streams', 'Event Loop'],
    order: 6
  },
  {
    name: 'MongoDB',
    iconKey: 'faDatabase',
    iconColor: '#47A248',
    topics: ['Aggregation', 'Indexing', 'Mongoose', 'CRUD Operations', 'Data Modeling', 'Transactions'],
    order: 7
  },
  {
    name: 'PostgreSQL',
    iconKey: 'faServer',
    iconColor: '#336791',
    topics: ['SQL Queries', 'Joins', 'Indexing', 'Transactions', 'Stored Procedures', 'ORM'],
    order: 8
  },
  {
    name: 'Redis',
    iconKey: 'faBolt',
    iconColor: '#DC382D',
    topics: ['Caching', 'Pub/Sub', 'Data Structures', 'Session Store', 'Rate Limiting', 'Pipelines'],
    order: 9
  },
  {
    name: 'Docker',
    iconKey: 'faDocker',
    iconColor: '#2496ED',
    topics: ['Containers', 'Docker Compose', 'Images', 'Volumes', 'Networking', 'Dockerfile'],
    order: 10
  },
  {
    name: 'PWA',
    iconKey: 'faMobileAlt',
    iconColor: '#5A0FC8',
    topics: ['Service Workers', 'Web Manifest', 'Push Notifications', 'Offline Support', 'Installability'],
    order: 11
  }
];

async function run() {
  try {
    await connectDB();

    // Delete all existing skills
    const deleted = await Skill.deleteMany({});
    console.log(`Deleted ${deleted.deletedCount} existing skills`);

    // Insert the new skills
    const inserted = await Skill.insertMany(newSkills);
    console.log(`Inserted ${inserted.length} new skills in order:`);
    inserted.sort((a, b) => a.order - b.order).forEach(s => console.log(`  ${s.order}. ${s.name} (${s.iconKey})`));

    console.log('\nDone!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
