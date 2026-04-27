require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connect } = require('./db/connection');

(async () => {
  const db = await connect();

  await db.collection('users').deleteMany({});
  await db.collection('projects').deleteMany({});
  await db.collection('tasks').deleteMany({});
  await db.collection('notes').deleteMany({});

  await db.collection('users').createIndex({ email: 1 }, { unique: true });

  const hash1 = await bcrypt.hash('password123', 10);
  const hash2 = await bcrypt.hash('securepass456', 10);

  const u1 = await db.collection('users').insertOne({
    email: 'ghouri@example.com',
    passwordHash: hash1,
    name: 'Muhammad Bin Asghar Ghouri',
    createdAt: new Date('2024-01-10')
  });

  const u2 = await db.collection('users').insertOne({
    email: 'bob@example.com',
    passwordHash: hash2,
    name: 'Bob Malik',
    createdAt: new Date('2024-02-05')
  });

  const ghouriId = u1.insertedId;
  const bobId = u2.insertedId;

  const p1 = await db.collection('projects').insertOne({
    ownerId: ghouriId,
    name: 'Final Year Project',
    description: 'Research and implementation of distributed systems.',
    archived: false,
    createdAt: new Date('2024-02-01')
  });

  const p2 = await db.collection('projects').insertOne({
    ownerId: ghouriId,
    name: 'Personal Portfolio',
    description: 'Design and build personal website.',
    archived: false,
    createdAt: new Date('2024-03-15')
  });

  const p3 = await db.collection('projects').insertOne({
    ownerId: bobId,
    name: 'E-Commerce App',
    description: 'Build a full-stack shopping platform.',
    archived: false,
    createdAt: new Date('2024-03-01')
  });

  const p4 = await db.collection('projects').insertOne({
    ownerId: bobId,
    name: 'Old Blog',
    description: 'Archived personal blog project.',
    archived: true,
    createdAt: new Date('2023-11-01')
  });

  const fyp = p1.insertedId;
  const port = p2.insertedId;
  const ecom = p3.insertedId;

  await db.collection('tasks').insertMany([
    {
      ownerId: ghouriId,
      projectId: fyp,
      title: 'Write literature review',
      status: 'in-progress',
      priority: 3,
      tags: ['writing', 'research'],
      subtasks: [
        { title: 'Find 10 papers', done: true },
        { title: 'Summarise each paper', done: false },
        { title: 'Write review section', done: false }
      ],
      dueDate: new Date('2024-05-01'),
      createdAt: new Date('2024-02-10')
    },
    {
      ownerId: ghouriId,
      projectId: fyp,
      title: 'Set up project repository',
      status: 'done',
      priority: 2,
      tags: ['setup', 'git'],
      subtasks: [
        { title: 'Create GitHub repo', done: true },
        { title: 'Add README', done: true }
      ],
      createdAt: new Date('2024-02-05')
    },
    {
      ownerId: ghouriId,
      projectId: port,
      title: 'Design homepage layout',
      status: 'todo',
      priority: 2,
      tags: ['design', 'ui'],
      subtasks: [
        { title: 'Sketch wireframe', done: false },
        { title: 'Choose colour palette', done: false }
      ],
      createdAt: new Date('2024-03-20')
    },
    {
      ownerId: bobId,
      projectId: ecom,
      title: 'Build product listing page',
      status: 'in-progress',
      priority: 3,
      tags: ['frontend', 'react'],
      subtasks: [
        { title: 'Create ProductCard component', done: true },
        { title: 'Fetch products from API', done: false }
      ],
      dueDate: new Date('2024-06-01'),
      createdAt: new Date('2024-03-05')
    },
    {
      ownerId: bobId,
      projectId: ecom,
      title: 'Set up payment integration',
      status: 'todo',
      priority: 1,
      tags: ['backend', 'stripe'],
      subtasks: [
        { title: 'Read Stripe docs', done: false },
        { title: 'Implement checkout endpoint', done: false }
      ],
      createdAt: new Date('2024-03-10')
    }
  ]);

  await db.collection('notes').insertMany([
    {
      ownerId: ghouriId,
      projectId: fyp,
      title: 'Meeting notes — supervisor',
      content: 'Focus on evaluation metrics. Deadline extended to May.',
      tags: ['meeting', 'research'],
      createdAt: new Date('2024-02-15')
    },
    {
      ownerId: ghouriId,
      projectId: port,
      title: 'Font ideas',
      content: 'Inter for body, Playfair Display for headings.',
      tags: ['design', 'typography'],
      createdAt: new Date('2024-03-22')
    },
    {
      ownerId: ghouriId,
      title: 'Books to read',
      content: 'Designing Data-Intensive Applications, Clean Code.',
      tags: ['personal', 'reading'],
      createdAt: new Date('2024-04-01')
    },
    {
      ownerId: bobId,
      projectId: ecom,
      title: 'API design decisions',
      content: 'Use REST for public API. JWT for auth tokens.',
      tags: ['backend', 'api'],
      createdAt: new Date('2024-03-07')
    },
    {
      ownerId: bobId,
      title: 'Learning resources',
      content: 'MongoDB University free courses are great for NoSQL.',
      tags: ['learning', 'nosql'],
      createdAt: new Date('2024-03-12')
    }
  ]);

  console.log('✅ Database seeded successfully.');
  process.exit(0);
})();