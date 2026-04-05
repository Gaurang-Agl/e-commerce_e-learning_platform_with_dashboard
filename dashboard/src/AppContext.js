import React, { createContext, useContext, useState, useEffect } from 'react';
import { APP_DATA } from './data';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const AppContext = createContext();

export function AppProvider({ children }) {
  // Current user
  const [currentUser] = useState({
    name: 'Gaurang Agarwal',
    initials: 'GA',
    role: 'Admin. Engineering Lead',
    gradient: 'linear-gradient(135deg, #f59e0b, #f43f5e)',
    dept: 'engineering',
    status: 'online',
    email: 'gaurang.agarwal@gworkspace.com',
    phone: '+91 98765 43210',
    joined: 'Jan 2022'
  });

  // Team members state (CRUD) — start with hardcoded, merge backend users
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 'ga-001',
      name: 'Gaurang Agarwal',
      role: 'Admin. Engineering Lead',
      dept: 'engineering',
      initials: 'GA',
      gradient: 'linear-gradient(135deg, #f59e0b, #f43f5e)',
      status: 'online',
      email: 'gaurang.agarwal@gworkspace.com',
      phone: '+91 98765 43210',
      joined: 'Jan 2022',
      source: 'local'
    },
    ...APP_DATA.teamMembers.map((m, i) => ({
      ...m,
      id: `tm-${i}`,
      email: `${m.name.toLowerCase().replace(/\s/g, '.')}@gworkspace.com`,
      phone: '+91 99999 00000',
      joined: 'Mar 2023',
      source: 'local'
    }))
  ]);

  // Fetch backend users and merge
  const [backendUsers, setBackendUsers] = useState([]);
  const [backendUsersLoaded, setBackendUsersLoaded] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/users`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(users => {
        const mapped = users.map(u => ({
          ...u,
          source: 'backend',
          role: u.role || 'G Store Customer',
          dept: u.dept || 'customer',
          gradient: u.gradient || 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          initials: u.initials || u.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
          status: u.status || 'online',
          phone: u.phone || '',
          joined: u.joined || 'Apr 2026'
        }));
        setBackendUsers(mapped);
        setBackendUsersLoaded(true);
      })
      .catch(() => { setBackendUsersLoaded(true); });
  }, []);

  // Merge local + backend, avoiding duplicates by email
  const allTeamMembers = React.useMemo(() => {
    if (!backendUsersLoaded) return teamMembers;
    const localEmails = teamMembers.map(m => m.email?.toLowerCase());
    const newBackendUsers = backendUsers.filter(u => !localEmails.includes(u.email?.toLowerCase()));
    return [...teamMembers, ...newBackendUsers];
  }, [teamMembers, backendUsers, backendUsersLoaded]);

  // E-commerce badge counts
  const [ecomBadges, setEcomBadges] = useState({ invoices: 0, emails: 0 });

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/invoices`).then(r => r.ok ? r.json() : []).catch(() => []),
      fetch(`${API_BASE}/emails`).then(r => r.ok ? r.json() : []).catch(() => []),
    ]).then(([invoices, emails]) => {
      setEcomBadges({ invoices: invoices.length, emails: emails.length });
    });
  }, []);

  const addMember = (member) => {
    const id = `tm-${Date.now()}`;
    const initials = member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const gradients = [
      'linear-gradient(135deg, #4f8cff, #6366f1)',
      'linear-gradient(135deg, #f59e0b, #f43f5e)',
      'linear-gradient(135deg, #ec4899, #8b5cf6)',
      'linear-gradient(135deg, #10b981, #06b6d4)',
      'linear-gradient(135deg, #8b5cf6, #4f8cff)',
      'linear-gradient(135deg, #06b6d4, #10b981)',
    ];
    setTeamMembers(prev => [...prev, {
      ...member,
      id,
      initials,
      gradient: gradients[Math.floor(Math.random() * gradients.length)],
      status: 'online',
      source: 'local'
    }]);
  };

  // Roles state
  const defaultRoles = [
    'Admin. Engineering Lead', 'VP of Engineering', 'Product Manager',
    'UX Design Lead', 'Sr. Backend Engineer', 'Marketing Manager',
    'DevOps Engineer', 'HR Business Partner', 'Frontend Engineer',
    'Sales Executive', 'Visual Designer', 'QA Lead', 'Content Strategist',
    'Software Engineer', 'Data Analyst', 'Project Manager', 'Technical Writer',
    'Customer', 'G Store Customer'
  ];
  const [roles, setRoles] = useState(defaultRoles);

  const addRole = (role) => {
    if (role && !roles.includes(role)) {
      setRoles(prev => [...prev, role]);
    }
  };

  const updateMember = (id, updates) => {
    setTeamMembers(prev => prev.map(m => {
      if (m.id === id) {
        const updated = { ...m, ...updates };
        if (updates.name) {
          updated.initials = updates.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        }
        return updated;
      }
      return m;
    }));
    // Also update backend users if it came from backend
    setBackendUsers(prev => prev.map(m => {
      if (m.id === id) {
        const updated = { ...m, ...updates };
        if (updates.name) {
          updated.initials = updates.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        }
        return updated;
      }
      return m;
    }));
  };

  const deleteMember = (id) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
    setBackendUsers(prev => prev.filter(m => m.id !== id));
  };

  // Feed posts state
  const [feedPosts, setFeedPosts] = useState(APP_DATA.feedPosts);

  const addPost = (content) => {
    const newPost = {
      id: Date.now(),
      author: currentUser.name,
      initials: currentUser.initials,
      gradient: currentUser.gradient,
      role: `${currentUser.role} · Engineering`,
      time: 'Just now',
      content: content.replace(/\n/g, '<br/>'),
      hasImage: false,
      likes: 0,
      comments: 0,
      liked: false
    };
    setFeedPosts(prev => [newPost, ...prev]);
  };

  // Timesheet state
  const [timesheetEntries, setTimesheetEntries] = useState([
    { id: 1, date: '2026-03-26', project: 'G Workspace Redesign', hours: 6, task: 'Frontend development', status: 'submitted' },
    { id: 2, date: '2026-03-25', project: 'API Infrastructure', hours: 8, task: 'Code review & deployment', status: 'approved' },
    { id: 3, date: '2026-03-24', project: 'G Workspace Redesign', hours: 7, task: 'Component library', status: 'approved' },
    { id: 4, date: '2026-03-23', project: 'Team Training', hours: 3, task: 'React workshop facilitation', status: 'approved' },
    { id: 5, date: '2026-03-22', project: 'G Workspace Redesign', hours: 8, task: 'Design system implementation', status: 'approved' },
  ]);

  const addTimesheetEntry = (entry) => {
    setTimesheetEntries(prev => [{ ...entry, id: Date.now(), status: 'submitted' }, ...prev]);
  };

  const deleteTimesheetEntry = (id) => {
    setTimesheetEntries(prev => prev.filter(e => e.id !== id));
  };

  // Leave state
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, type: 'Annual Leave', from: '2026-04-10', to: '2026-04-12', days: 3, reason: 'Family vacation', status: 'approved' },
    { id: 2, type: 'Sick Leave', from: '2026-03-15', to: '2026-03-15', days: 1, reason: 'Not feeling well', status: 'approved' },
    { id: 3, type: 'Work From Home', from: '2026-04-01', to: '2026-04-02', days: 2, reason: 'Internet installation at new apartment', status: 'pending' },
  ]);

  const addLeaveRequest = (leave) => {
    setLeaveRequests(prev => [{ ...leave, id: Date.now(), status: 'pending' }, ...prev]);
  };

  const deleteLeaveRequest = (id) => {
    setLeaveRequests(prev => prev.filter(l => l.id !== id));
  };

  // Expenses state
  const [expenses, setExpenses] = useState([
    { id: 1, date: '2026-03-20', category: 'Travel', description: 'Cab to client office', amount: 850, status: 'approved', receipt: true },
    { id: 2, date: '2026-03-18', category: 'Meals', description: 'Team lunch — quarterly review', amount: 3200, status: 'approved', receipt: true },
    { id: 3, date: '2026-03-15', category: 'Software', description: 'Figma annual subscription', amount: 12000, status: 'pending', receipt: true },
    { id: 4, date: '2026-03-10', category: 'Office Supplies', description: 'Ergonomic keyboard', amount: 4500, status: 'reimbursed', receipt: true },
  ]);

  const addExpense = (expense) => {
    setExpenses(prev => [{ ...expense, id: Date.now(), status: 'pending', receipt: true }, ...prev]);
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  // Learning state
  const [learningCourses, setLearningCourses] = useState([
    { id: 1, title: 'Advanced React Patterns', meta: '12 modules', badge: 'in-progress', badgeLabel: 'In Progress', progress: 67, description: 'Master advanced React patterns including compound components, render props, custom hooks, and state machines. Build production-ready components with TypeScript.', instructor: 'Sarah Chen', duration: '24 hours', modules: ['Compound Components', 'Render Props', 'Custom Hooks', 'State Machines', 'Performance Patterns', 'Testing Strategies', 'TypeScript Integration', 'Error Boundaries', 'Suspense & Transitions', 'Server Components', 'Design Patterns', 'Final Project'] },
    { id: 2, title: 'Leadership Essentials 101', meta: '8 modules', badge: 'new', badgeLabel: 'New', progress: 0, description: 'Develop core leadership skills — communication, delegation, conflict resolution, and team motivation. Designed for new and aspiring engineering managers.', instructor: 'Dr. Meera Joshi', duration: '16 hours', modules: ['Leadership Foundations', 'Effective Communication', 'Delegation Mastery', 'Conflict Resolution', 'Team Motivation', '1:1 Best Practices', 'Performance Reviews', 'Building Culture'] },
    { id: 3, title: 'Cloud Architecture with AWS', meta: '15 modules', badge: 'completed', badgeLabel: 'Completed', progress: 100, description: 'End-to-end AWS cloud architecture — from EC2 and S3 to serverless Lambda, DynamoDB, and infrastructure as code with CloudFormation and Terraform.', instructor: 'James Wilson', duration: '40 hours', modules: ['AWS Fundamentals', 'EC2 & Networking', 'S3 & Storage', 'RDS & Databases', 'Lambda & Serverless', 'API Gateway', 'DynamoDB', 'CloudFormation', 'Terraform', 'CI/CD Pipelines', 'Monitoring', 'Security', 'Cost Optimization', 'Well-Architected', 'Capstone Project'] },
    { id: 4, title: 'System Design Interview Prep', meta: '10 modules', badge: 'new', badgeLabel: 'New', progress: 0, description: 'Prepare for system design interviews with real-world case studies — URL shortener, chat systems, social feeds, and distributed storage.', instructor: 'Alex Xu', duration: '20 hours', modules: ['Scaling Basics', 'Load Balancers', 'Caching', 'Databases', 'Message Queues', 'URL Shortener', 'Chat System', 'News Feed', 'Search Engine', 'Video Streaming'] },
  ]);

  const value = {
    currentUser,
    teamMembers: allTeamMembers, addMember, updateMember, deleteMember,
    roles, addRole,
    feedPosts, setFeedPosts, addPost,
    timesheetEntries, addTimesheetEntry, deleteTimesheetEntry,
    leaveRequests, addLeaveRequest, deleteLeaveRequest,
    expenses, addExpense, deleteExpense,
    learningCourses, setLearningCourses,
    ecomBadges,
    announcements: APP_DATA.announcements,
    celebrations: APP_DATA.celebrations,
    milestones: APP_DATA.milestones,
    tools: APP_DATA.tools,
    trending: APP_DATA.trending,
    achievements: APP_DATA.achievements,
    teamActivity: APP_DATA.teamActivity,
    notifications: APP_DATA.notifications,
    messages: APP_DATA.messages,
    meetings: APP_DATA.meetings,
    itTickets: APP_DATA.itTickets,
    hrResources: APP_DATA.hrResources,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
