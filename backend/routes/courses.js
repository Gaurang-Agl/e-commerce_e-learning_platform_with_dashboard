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
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    images: ['https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800'],
    color: '#3b82f6',
    modules: ['HTML & CSS Fundamentals', 'JavaScript ES6+', 'React Basics', 'State Management', 'Node.js & Express', 'REST API Design', 'Database Design', 'Authentication & JWT', 'File Uploads', 'Deployment & DevOps'],
    enrollments: 156,
    rating: 4.8,
    reviews: [],
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
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    images: ['https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800'],
    color: '#ec4899',
    modules: ['Design Thinking', 'User Research', 'Wireframing', 'Visual Design', 'Typography & Color', 'Figma Advanced', 'Design Systems', 'Prototyping', 'Usability Testing', 'Portfolio Building'],
    enrollments: 203,
    rating: 4.9,
    reviews: [],
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
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
    images: ['https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800'],
    color: '#06b6d4',
    modules: ['Cloud Fundamentals', 'AWS Core Services', 'Networking & VPC', 'Storage Solutions', 'Serverless Computing', 'Containers & Docker', 'Kubernetes', 'CI/CD Pipelines', 'Security & IAM', 'Cost Optimization'],
    enrollments: 89,
    rating: 4.7,
    reviews: [],
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
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'],
    color: '#8b5cf6',
    modules: ['Python for Data Science', 'NumPy & Pandas', 'Data Visualization', 'Statistical Analysis', 'Machine Learning Basics', 'Supervised Learning', 'Unsupervised Learning', 'Deep Learning Intro', 'NLP Fundamentals', 'Capstone Project'],
    enrollments: 312,
    rating: 4.9,
    reviews: [],
    badge: 'bestseller',
    badgeLabel: 'Bestseller'
  },
  {
    id: 'course-005',
    title: 'Mobile App Dev with React Native',
    description: 'Build native iOS & Android apps using React Native. Learn Expo, Navigation, Animations, Context API and publish to App Stores.',
    instructor: 'Kevin Park',
    duration: '32 hours',
    price: 3999,
    category: 'Development',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
    images: ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800'],
    color: '#10b981',
    modules: ['React Native Basics', 'Expo SDK', 'React Navigation', 'Styling & Layouts', 'State Management', 'Animations', 'Native Device Features', 'API Integration', 'Testing', 'App Store Publishing'],
    enrollments: 124,
    rating: 4.6,
    reviews: [],
    badge: 'new',
    badgeLabel: 'New'
  },
  {
    id: 'course-006',
    title: 'Cybersecurity for Beginners',
    description: 'Learn ethical hacking, network security, cryptography, and penetration testing tools like Kali Linux and Wireshark.',
    instructor: 'Alex Mercer',
    duration: '45 hours',
    price: 4500,
    category: 'Security',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
    images: ['https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800'],
    color: '#ef4444',
    modules: ['Security Principles', 'Network Security', 'Cryptography', 'Ethical Hacking', 'Kali Linux', 'Penetration Testing', 'Web App Security', 'Malware Analysis', 'Incident Response', 'Security Policies'],
    enrollments: 201,
    rating: 4.8,
    reviews: [],
    badge: 'popular',
    badgeLabel: 'Popular'
  },
  {
    id: 'course-007',
    title: 'Digital Marketing Mastery',
    description: 'Master SEO, Google Ads, Facebook Ads, content marketing, and email marketing. Drive traffic and boost sales efficiently.',
    instructor: 'Rachel Adams',
    duration: '22 hours',
    price: 2499,
    category: 'Marketing',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'],
    color: '#f59e0b',
    modules: ['Marketing Strategy', 'SEO Fundamentals', 'Google Analytics', 'Google Ads', 'Social Media Ads', 'Content Marketing', 'Email Marketing', 'Copywriting', 'Conversion Rate Optimization', 'Marketing Automation'],
    enrollments: 415,
    rating: 4.7,
    reviews: [],
    badge: 'bestseller',
    badgeLabel: 'Bestseller'
  },
  {
    id: 'course-008',
    title: 'AI & Machine Learning Engineering',
    description: 'Deep dive into neural networks, PyTorch, generative AI, LLMs, and building real-world artificial intelligence models.',
    instructor: 'Dr. John Miller',
    duration: '60 hours',
    price: 6999,
    category: 'Data Science',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800',
    images: ['https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800'],
    color: '#6366f1',
    modules: ['Math for ML', 'PyTorch Framework', 'Neural Networks', 'CNNs & Vision', 'RNNs & NLP', 'Transformers', 'Generative AI', 'Deploying Models', 'MLOps', 'Ethical AI'],
    enrollments: 95,
    rating: 4.9,
    reviews: [],
    badge: 'new',
    badgeLabel: 'New'
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
    images: req.body.images || [image || '📚'],
    reviews: req.body.reviews || [],
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

// Add review to course
router.post('/:id/reviews', (req, res) => {
  const course = db.findById('courses', req.params.id);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  
  const { rating, comment, userName, email } = req.body;
  if (!rating || !comment || !userName || !email) {
    return res.status(400).json({ error: 'Rating, comment, userName, and email are required' });
  }

  // Check if they purchased
  const orders = db.findAll('orders');
  const hasPurchased = orders.some(o => 
    o.userEmail === email && 
    (o.status === 'confirmed' || o.paymentStatus === 'paid') && 
    o.items.some(i => i.courseId === req.params.id)
  );

  if (!hasPurchased) {
    return res.status(403).json({ error: 'You can only review courses you have purchased.' });
  }

  const review = {
    rating: Number(rating),
    comment,
    userName,
    date: new Date().toISOString()
  };

  const reviews = course.reviews || [];
  reviews.push(review);
  
  // Calculate new average rating
  const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  
  const updated = db.update('courses', req.params.id, { 
    reviews,
    rating: parseFloat(avgRating.toFixed(1))
  });
  
  res.status(201).json(updated);
});

module.exports = router;
