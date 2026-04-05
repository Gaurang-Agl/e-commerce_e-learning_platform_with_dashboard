const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');

const router = express.Router();

// Seed courses
const SEED_COURSES = [
  {
    id: 'course-001',
    title: 'Full-Stack Web Development',
    description: 'Master modern web development from frontend to backend. Learn React, Node.js, Express, databases, authentication, and deployment. Build 5 real-world projects.',
    instructor: 'Sarah Chen',
    duration: '40 hours',
    price: 4999,
    category: 'Development',
    image: '💻',
    color: '#3b82f6',
    modules: ['HTML & CSS Fundamentals', 'JavaScript ES6+', 'React Basics', 'State Management', 'Node.js & Express', 'REST API Design', 'Database Design', 'Authentication & JWT', 'File Uploads', 'Deployment & DevOps'],
    enrollments: 156,
    rating: 4.8,
    badge: 'popular',
    badgeLabel: 'Popular'
  },
  {
    id: 'course-002',
    title: 'UI/UX Design Masterclass',
    description: 'Learn user-centered design from research to high-fidelity prototypes. Master Figma, design systems, accessibility, and portfolio-ready case studies.',
    instructor: 'Neha Gupta',
    duration: '28 hours',
    price: 3499,
    category: 'Design',
    image: '🎨',
    color: '#ec4899',
    modules: ['Design Thinking', 'User Research', 'Wireframing', 'Visual Design', 'Typography & Color', 'Figma Advanced', 'Design Systems', 'Prototyping', 'Usability Testing', 'Portfolio Building'],
    enrollments: 203,
    rating: 4.9,
    badge: 'bestseller',
    badgeLabel: 'Bestseller'
  },
  {
    id: 'course-003',
    title: 'Cloud Computing Essentials',
    description: 'Get certified-ready with hands-on AWS, Azure, and GCP training. Learn cloud architecture, serverless, containers, and infrastructure as code.',
    instructor: 'James Wilson',
    duration: '35 hours',
    price: 2999,
    category: 'Cloud',
    image: '☁️',
    color: '#06b6d4',
    modules: ['Cloud Fundamentals', 'AWS Core Services', 'Networking & VPC', 'Storage Solutions', 'Serverless Computing', 'Containers & Docker', 'Kubernetes', 'CI/CD Pipelines', 'Security & IAM', 'Cost Optimization'],
    enrollments: 89,
    rating: 4.7,
    badge: 'new',
    badgeLabel: 'New'
  },
  {
    id: 'course-004',
    title: 'Data Science with Python',
    description: 'From Python basics to machine learning. Learn pandas, NumPy, matplotlib, scikit-learn, and TensorFlow. Includes 10 industry datasets and capstone project.',
    instructor: 'Dr. Meera Joshi',
    duration: '50 hours',
    price: 5499,
    category: 'Data Science',
    image: '📊',
    color: '#8b5cf6',
    modules: ['Python for Data Science', 'NumPy & Pandas', 'Data Visualization', 'Statistical Analysis', 'Machine Learning Basics', 'Supervised Learning', 'Unsupervised Learning', 'Deep Learning Intro', 'NLP Fundamentals', 'Capstone Project'],
    enrollments: 312,
    rating: 4.9,
    badge: 'bestseller',
    badgeLabel: 'Bestseller'
  }
];

db.seedIfEmpty('courses', SEED_COURSES);

// Get all courses (public)
router.get('/', (req, res) => {
  const courses = db.findAll('courses');
  res.json(courses);
});

// Get course by ID
router.get('/:id', (req, res) => {
  const course = db.findById('courses', req.params.id);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json(course);
});

// Add course
router.post('/', (req, res) => {
  const { title, description, instructor, duration, price, category, image, color, modules } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  const course = {
    id: `course-${uuidv4().slice(0, 8)}`,
    title,
    description: description || '',
    instructor: instructor || 'TBA',
    duration: duration || '0 hours',
    price: Number(price) || 0,
    category: category || 'General',
    image: image || '📚',
    color: color || '#3b82f6',
    modules: modules || [],
    enrollments: 0,
    rating: 0,
    badge: 'new',
    badgeLabel: 'New',
    createdAt: new Date().toISOString()
  };

  db.insert('courses', course);
  res.status(201).json(course);
});

// Update course
router.put('/:id', (req, res) => {
  const updates = {};
  const fields = ['title', 'description', 'instructor', 'duration', 'price', 'category', 'image', 'color', 'modules', 'badge', 'badgeLabel'];
  fields.forEach(f => {
    if (req.body[f] !== undefined) updates[f] = req.body[f];
  });
  if (updates.price) updates.price = Number(updates.price);

  const updated = db.update('courses', req.params.id, updates);
  if (!updated) return res.status(404).json({ error: 'Course not found' });
  res.json(updated);
});

// Delete course
router.delete('/:id', (req, res) => {
  const deleted = db.delete('courses', req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Course not found' });
  res.json({ success: true });
});

module.exports = router;
