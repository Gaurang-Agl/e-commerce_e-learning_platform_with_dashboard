/* ============================================
   G WORKSPACE — Mock Data
   ============================================ */

export const APP_DATA = {
  announcements: [
    {
      tag: 'urgent', tagLabel: '🔴 Urgent',
      title: 'Office Relocation Update — New HQ',
      excerpt: 'Our new headquarters at Tech Park Phase III is ready! Moving date is April 15. Please review the floor plan and register your desk preference by April 1.',
      author: 'Priya Sharma', authorInitials: 'PS', time: '2 hours ago',
      gradient: 'linear-gradient(135deg, #f43f5e, #ec4899)'
    },
    {
      tag: 'new', tagLabel: '✨ New',
      title: 'Q1 All-Hands: Results & Roadmap',
      excerpt: 'Join us this Friday at 3 PM for the quarterly all-hands. CEO will share Q1 results, top wins, and the exciting Q2 roadmap ahead.',
      author: 'Rahul Mehta', authorInitials: 'RM', time: '5 hours ago',
      gradient: 'linear-gradient(135deg, #4f8cff, #6366f1)'
    },
    {
      tag: 'event', tagLabel: '🎪 Event',
      title: 'Annual Hackathon 2026 — Register Now',
      excerpt: 'Theme: "AI for Internal Productivity." Form your teams (3–5 members) and build something amazing in 48 hours. Top prizes worth ₹2L!',
      author: 'Tech Council', authorInitials: 'TC', time: '1 day ago',
      gradient: 'linear-gradient(135deg, #8b5cf6, #6366f1)'
    }
  ],

  learning: [
    { title: 'Advanced React Patterns', meta: '12 modules · 8 completed', badge: 'in-progress', badgeLabel: 'In Progress', progress: 67 },
    { title: 'Leadership Essentials 101', meta: '8 modules · New enrollment', badge: 'new', badgeLabel: 'New', progress: 0 },
    { title: 'Cloud Architecture with AWS', meta: '15 modules · 15 completed', badge: 'completed', badgeLabel: 'Completed', progress: 100 }
  ],

  tools: [
    { name: 'Timesheet', icon: '⏱️', colorClass: 'blue', route: '/timesheet' },
    { name: 'Leave', icon: '📅', colorClass: 'purple', route: '/leave' },
    { name: 'Expenses', icon: '💰', colorClass: 'amber', route: '/expenses' },
    { name: 'Meetings', icon: '📹', colorClass: 'emerald', route: '/meetings' },
    { name: 'IT Support', icon: '🛠️', colorClass: 'rose', route: '/it-support' },
    { name: 'HR Portal', icon: '🏢', colorClass: 'cyan', route: '/hr-portal' }
  ],

  celebrations: [
    { name: 'Neha Gupta', event: 'Birthday — March 28', emoji: '🎂', gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)', initials: 'NG', message: 'Join us in wishing Neha a wonderful birthday! 🎉 Her creativity and design thinking have been instrumental in shaping our product experience.' },
    { name: 'Vikram Singh', event: '3 Year Anniversary!', emoji: '🎉', gradient: 'linear-gradient(135deg, #f59e0b, #f43f5e)', initials: 'VS', message: 'Three years of backend excellence! Vikram has been the backbone of our infrastructure, leading critical deployments and mentoring junior engineers.' },
    { name: 'Aarti Patel', event: 'Birthday — April 2', emoji: '🎈', gradient: 'linear-gradient(135deg, #8b5cf6, #6366f1)', initials: 'AP', message: 'Aarti\'s marketing campaigns have driven incredible growth. Let\'s celebrate her special day! Drop her a message on the feed.' },
    { name: 'Rohan Desai', event: '5 Year Anniversary!', emoji: '🏆', gradient: 'linear-gradient(135deg, #06b6d4, #4f8cff)', initials: 'RD', message: 'Half a decade of DevOps mastery! Rohan\'s dedication to zero-downtime deployments has set the gold standard for our engineering team.' }
  ],

  milestones: [
    { title: '2000 Users Onboarded', desc: 'Platform reached 2K active users', icon: '🚀', bg: 'rgba(79, 140, 255, 0.12)', detail: 'Our internal platform has officially crossed the 2,000 active user milestone! This represents 95% adoption across all departments. Key drivers include the new mobile app launch and SSO integration.' },
    { title: 'Q1 Revenue Target Hit', desc: '112% of quarterly target achieved', icon: '📈', bg: 'rgba(16, 185, 129, 0.12)', detail: 'The sales and product teams delivered an outstanding Q1, achieving 112% of our quarterly revenue target. Top-performing segments: Enterprise (128%) and Mid-Market (115%).' },
    { title: 'Zero Downtime — 90 Days', desc: 'Infrastructure uptime streak', icon: '⚡', bg: 'rgba(245, 158, 11, 0.12)', detail: 'Our infrastructure team has maintained 100% uptime for 90 consecutive days across all production services. This achievement is a testament to our robust DevOps practices, automated failover systems, and dedicated on-call rotation.' }
  ],

  teamMembers: [
    { name: 'Priya Sharma', role: 'VP of Engineering', dept: 'engineering', initials: 'PS', gradient: 'linear-gradient(135deg, #4f8cff, #6366f1)', status: 'online' },
    { name: 'Rahul Mehta', role: 'Product Manager', dept: 'product', initials: 'RM', gradient: 'linear-gradient(135deg, #f59e0b, #f43f5e)', status: 'online' },
    { name: 'Neha Gupta', role: 'UX Design Lead', dept: 'design', initials: 'NG', gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)', status: 'online' },
    { name: 'Vikram Singh', role: 'Sr. Backend Engineer', dept: 'engineering', initials: 'VS', gradient: 'linear-gradient(135deg, #10b981, #06b6d4)', status: 'away' },
    { name: 'Aarti Patel', role: 'Marketing Manager', dept: 'marketing', initials: 'AP', gradient: 'linear-gradient(135deg, #8b5cf6, #4f8cff)', status: 'online' },
    { name: 'Rohan Desai', role: 'DevOps Engineer', dept: 'engineering', initials: 'RD', gradient: 'linear-gradient(135deg, #06b6d4, #10b981)', status: 'offline' },
    { name: 'Sneha Reddy', role: 'HR Business Partner', dept: 'hr', initials: 'SR', gradient: 'linear-gradient(135deg, #f43f5e, #ec4899)', status: 'online' },
    { name: 'Aditya Nair', role: 'Frontend Engineer', dept: 'engineering', initials: 'AN', gradient: 'linear-gradient(135deg, #f59e0b, #10b981)', status: 'online' },
    { name: 'Meera Iyer', role: 'Sales Executive', dept: 'sales', initials: 'MI', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)', status: 'away' },
    { name: 'Karan Joshi', role: 'Visual Designer', dept: 'design', initials: 'KJ', gradient: 'linear-gradient(135deg, #ec4899, #f59e0b)', status: 'online' },
    { name: 'Deepak Verma', role: 'QA Lead', dept: 'engineering', initials: 'DV', gradient: 'linear-gradient(135deg, #10b981, #4f8cff)', status: 'online' },
    { name: 'Ritu Kapoor', role: 'Content Strategist', dept: 'marketing', initials: 'RK', gradient: 'linear-gradient(135deg, #f43f5e, #f59e0b)', status: 'offline' }
  ],

  teamActivity: [
    { name: 'Priya', initials: 'PS', gradient: 'linear-gradient(135deg, #4f8cff, #6366f1)', action: 'merged PR <strong>#342</strong> into main', time: '5 min ago', detail: 'Pull Request #342: Refactored authentication middleware to support OAuth2 and SAML SSO. 47 files changed, 1,200+ lines added.' },
    { name: 'Neha', initials: 'NG', gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)', action: 'shared new <strong>Design System v3</strong> prototypes', time: '22 min ago', detail: 'Design System v3 introduces 25 new components, updated color tokens, accessibility improvements (WCAG AA), and a comprehensive Figma component library.' },
    { name: 'Rahul', initials: 'RM', gradient: 'linear-gradient(135deg, #f59e0b, #f43f5e)', action: 'updated the <strong>Q2 Roadmap</strong> document', time: '1 hr ago', detail: 'Q2 Roadmap includes 3 major feature launches: Advanced Analytics Dashboard, Mobile App v2, and AI-powered Search. Timeline: April–June 2026.' },
    { name: 'Aditya', initials: 'AN', gradient: 'linear-gradient(135deg, #f59e0b, #10b981)', action: 'completed <strong>React Advanced</strong> module', time: '2 hrs ago', detail: 'Completed Module 8: "State Machines in React" with a score of 92%. Total progress: 67% through the Advanced React Patterns course.' },
    { name: 'Sneha', initials: 'SR', gradient: 'linear-gradient(135deg, #f43f5e, #ec4899)', action: 'posted a new <strong>wellness initiative</strong> survey', time: '3 hrs ago', detail: 'New wellness survey covering mental health support, gym memberships, flexible hours, and remote work preferences. Open until April 5.' },
    { name: 'Vikram', initials: 'VS', gradient: 'linear-gradient(135deg, #10b981, #06b6d4)', action: 'deployed <strong>v2.4.1</strong> to production', time: '4 hrs ago', detail: 'Release v2.4.1 includes: performance optimizations (30% faster API response), bug fixes for notification system, and database migration for new analytics tables.' }
  ],

  feedPosts: [
    {
      id: 1, author: 'Neha Gupta', initials: 'NG', gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
      role: 'UX Design Lead · Design', time: '45 min ago',
      content: 'Just wrapped up the new <span class="highlight">#DesignSystem</span> v3 exploration! 🎨 Focused on accessibility-first components with fluid animations. Can\'t wait to share the full prototype with the team next week. Huge thanks to <span class="highlight">@Karan Joshi</span> for the icon work!',
      hasImage: true, imageLabel: '🎨 Design System v3 Preview', likes: 24, comments: 8, liked: true,
      commentList: [
        { author: 'Karan Joshi', initials: 'KJ', gradient: 'linear-gradient(135deg, #ec4899, #f59e0b)', text: 'Thanks for the shoutout! The icon library was fun to build 🎯', time: '30 min ago' },
        { author: 'Priya Sharma', initials: 'PS', gradient: 'linear-gradient(135deg, #4f8cff, #6366f1)', text: 'This looks incredible! Can we schedule a walkthrough next week?', time: '20 min ago' }
      ]
    },
    {
      id: 2, author: 'Priya Sharma', initials: 'PS', gradient: 'linear-gradient(135deg, #4f8cff, #6366f1)',
      role: 'VP of Engineering · Engineering', time: '2 hours ago',
      content: 'Proud moment! 🚀 Our engineering team just hit <span class="highlight">90 days of zero downtime</span> across all production services. This is a testament to the incredible DevOps practices and on-call discipline from the entire team. Special shoutout to <span class="highlight">@Rohan Desai</span> and the infra squad!',
      hasImage: false, likes: 56, comments: 15, liked: false,
      commentList: [
        { author: 'Rohan Desai', initials: 'RD', gradient: 'linear-gradient(135deg, #06b6d4, #10b981)', text: 'Team effort all the way! Our monitoring alerts have been a game changer 📊', time: '1 hr ago' },
        { author: 'Vikram Singh', initials: 'VS', gradient: 'linear-gradient(135deg, #10b981, #06b6d4)', text: 'Next target: 180 days! Let\'s keep the streak going 💪', time: '45 min ago' }
      ]
    },
    {
      id: 3, author: 'Rahul Mehta', initials: 'RM', gradient: 'linear-gradient(135deg, #f59e0b, #f43f5e)',
      role: 'Product Manager · Product', time: '4 hours ago',
      content: 'The <span class="highlight">#Hackathon2026</span> theme is out — "AI for Internal Productivity!" 🤖 Start brainstorming and forming your teams. Remember: interdisciplinary teams tend to win! Check the <span class="highlight">#announcements</span> channel for full details and registration link.',
      hasImage: false, likes: 38, comments: 22, liked: false,
      commentList: [
        { author: 'Aditya Nair', initials: 'AN', gradient: 'linear-gradient(135deg, #f59e0b, #10b981)', text: 'Looking for a frontend dev for my team! DM me if interested 🙋‍♂️', time: '3 hrs ago' }
      ]
    },
    {
      id: 4, author: 'Aarti Patel', initials: 'AP', gradient: 'linear-gradient(135deg, #8b5cf6, #4f8cff)',
      role: 'Marketing Manager · Marketing', time: '6 hours ago',
      content: 'Our brand refresh campaign went live today! 🎯 New messaging, updated brand kit, and a fresh visual identity. Download the assets from the <span class="highlight">#brand-resources</span> channel. Feedback welcome — let\'s make this brand sing! 🎤',
      hasImage: true, imageLabel: '🎯 Brand Refresh 2026', likes: 42, comments: 11, liked: false,
      commentList: [
        { author: 'Ritu Kapoor', initials: 'RK', gradient: 'linear-gradient(135deg, #f43f5e, #f59e0b)', text: 'The new color palette is stunning! Great work on the brand guidelines 📝', time: '5 hrs ago' }
      ]
    },
    {
      id: 5, author: 'Vikram Singh', initials: 'VS', gradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
      role: 'Sr. Backend Engineer · Engineering', time: '8 hours ago',
      content: 'Just released our new <span class="highlight">#API</span> gateway with built-in rate limiting, circuit breaker patterns, and automatic retry logic. 🔧 Performance benchmarks show 40% improvement in p99 latency. Documentation is up on Confluence — please review and adopt for all new services!',
      hasImage: true, imageLabel: '📊 API Gateway Performance Benchmarks', likes: 67, comments: 19, liked: false,
      commentList: [
        { author: 'Deepak Verma', initials: 'DV', gradient: 'linear-gradient(135deg, #10b981, #4f8cff)', text: 'Already running load tests against it. Looking solid so far! ✅', time: '7 hrs ago' },
        { author: 'Priya Sharma', initials: 'PS', gradient: 'linear-gradient(135deg, #4f8cff, #6366f1)', text: 'Excellent work Vikram! This is exactly what we needed for the microservices migration.', time: '6 hrs ago' }
      ]
    },
    {
      id: 6, author: 'Sneha Reddy', initials: 'SR', gradient: 'linear-gradient(135deg, #f43f5e, #ec4899)',
      role: 'HR Business Partner · HR', time: '10 hours ago',
      content: '🧘 Exciting news! We\'re launching a comprehensive <span class="highlight">#WellnessProgram</span> starting April 1st. Benefits include: monthly meditation sessions, subsidized gym memberships, mental health counseling, and flexible wellness days. Fill out the survey to customize the program!',
      hasImage: true, imageLabel: '🧘 Wellness Program 2026 Preview', likes: 89, comments: 31, liked: false,
      commentList: [
        { author: 'Meera Iyer', initials: 'MI', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)', text: 'This is amazing! Really appreciate the mental health support options 💜', time: '9 hrs ago' },
        { author: 'Aarti Patel', initials: 'AP', gradient: 'linear-gradient(135deg, #8b5cf6, #4f8cff)', text: 'Can we also include ergonomic desk assessments?', time: '8 hrs ago' }
      ]
    },
    {
      id: 7, author: 'Deepak Verma', initials: 'DV', gradient: 'linear-gradient(135deg, #10b981, #4f8cff)',
      role: 'QA Lead · Engineering', time: '12 hours ago',
      content: 'Automated test coverage just crossed <span class="highlight">85%</span> across all microservices! 🎯 Our new E2E testing framework reduced regression testing time from 4 hours to just 45 minutes. Special thanks to the <span class="highlight">#QA</span> guild for the amazing sprint push!',
      hasImage: false, likes: 51, comments: 14, liked: false,
      commentList: [
        { author: 'Aditya Nair', initials: 'AN', gradient: 'linear-gradient(135deg, #f59e0b, #10b981)', text: 'The E2E framework is a game changer for our CI/CD pipeline!', time: '11 hrs ago' }
      ]
    },
    {
      id: 8, author: 'Karan Joshi', initials: 'KJ', gradient: 'linear-gradient(135deg, #ec4899, #f59e0b)',
      role: 'Visual Designer · Design', time: '1 day ago',
      content: 'Sharing our updated <span class="highlight">#IconLibrary</span> — 200+ custom icons designed for G Workspace! 🖌️ All icons are available in SVG, PNG, and as React components. Consistent 24px grid, 2px stroke width. Check the Figma link in <span class="highlight">#design-resources</span>.',
      hasImage: true, imageLabel: '🖌️ G Workspace Icon Library Preview', likes: 73, comments: 16, liked: false,
      commentList: [
        { author: 'Neha Gupta', initials: 'NG', gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)', text: 'These are beautiful! Love the consistent style across all icons ❤️', time: '22 hrs ago' }
      ]
    }
  ],

  trending: [
    { tag: '#Hackathon2026', count: '147 posts' },
    { tag: '#DesignSystem', count: '89 posts' },
    { tag: '#ZeroDowntime', count: '63 posts' },
    { tag: '#Q1Results', count: '51 posts' },
    { tag: '#BrandRefresh', count: '38 posts' }
  ],

  achievements: [
    { icon: '🏆', name: 'Top Contributor', desc: 'Most active contributor across projects and code reviews this quarter. Awarded to team members with 50+ contributions.', earnedBy: 'Priya Sharma' },
    { icon: '🔥', name: '30-Day Streak', desc: 'Logged in and contributed to at least one project every day for 30 consecutive days.', earnedBy: 'Gaurang Agarwal' },
    { icon: '💡', name: 'Idea Champion', desc: 'Submitted 5+ innovative ideas through the suggestion portal that were approved for implementation.', earnedBy: 'Rahul Mehta' },
    { icon: '🤝', name: 'Team Player', desc: 'Recognized by 10+ colleagues for collaboration, mentorship, and going above and beyond to help teammates.', earnedBy: 'Neha Gupta' },
    { icon: '📚', name: 'Fast Learner', desc: 'Completed 3+ courses in the Learning Hub within a single quarter.', earnedBy: 'Aditya Nair' },
    { icon: '🎯', name: 'Goal Crusher', desc: 'Exceeded all quarterly OKR targets by 20% or more.', earnedBy: 'Vikram Singh' }
  ],

  notifications: [
    { id: 1, type: 'leave', title: 'Leave Approved', message: 'Your annual leave request (Apr 10–12) has been approved by Priya Sharma.', time: '10 min ago', read: false, icon: '✅' },
    { id: 2, type: 'mention', title: 'Mentioned in Post', message: 'Neha Gupta mentioned you in a Social Feed post about Design System v3.', time: '30 min ago', read: false, icon: '💬' },
    { id: 3, type: 'celebration', title: 'Birthday Reminder', message: 'Neha Gupta\'s birthday is coming up on March 28! Don\'t forget to wish her.', time: '1 hr ago', read: false, icon: '🎂' },
    { id: 4, type: 'system', title: 'Timesheet Reminder', message: 'You haven\'t submitted your timesheet for today. Please log your hours.', time: '2 hrs ago', read: true, icon: '⏰' },
    { id: 5, type: 'achievement', title: 'New Achievement', message: 'Congratulations! You\'ve earned the "30-Day Streak" achievement badge.', time: '5 hrs ago', read: true, icon: '🏅' },
    { id: 6, type: 'team', title: 'New Team Member', message: 'Ritu Kapoor has joined the Marketing team as Content Strategist.', time: '1 day ago', read: true, icon: '👋' },
    { id: 7, type: 'expense', title: 'Expense Approved', message: 'Your expense claim "Cab to client office" (₹850) has been approved.', time: '1 day ago', read: true, icon: '💳' }
  ],

  messages: [
    { id: 1, from: 'Priya Sharma', initials: 'PS', gradient: 'linear-gradient(135deg, #4f8cff, #6366f1)', preview: 'Hey, can we sync on the API refactoring plan?', time: '5 min ago', unread: true },
    { id: 2, from: 'Neha Gupta', initials: 'NG', gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)', preview: 'Shared the updated Figma file for Design System v3.', time: '20 min ago', unread: true },
    { id: 3, from: 'Rahul Mehta', initials: 'RM', gradient: 'linear-gradient(135deg, #f59e0b, #f43f5e)', preview: 'The hackathon registration deadline is April 5.', time: '1 hr ago', unread: false },
    { id: 4, from: 'Vikram Singh', initials: 'VS', gradient: 'linear-gradient(135deg, #10b981, #06b6d4)', preview: 'Deployment v2.4.1 is live. All tests passing ✅', time: '3 hrs ago', unread: false },
    { id: 5, from: 'Sneha Reddy', initials: 'SR', gradient: 'linear-gradient(135deg, #f43f5e, #ec4899)', preview: 'Please fill out the wellness program survey by Friday.', time: '5 hrs ago', unread: false }
  ],

  meetings: [
    { id: 1, title: 'Sprint Planning — Q2 Kick-off', time: '10:00 AM — 11:00 AM', date: '2026-03-26', participants: ['GA', 'PS', 'RM', 'AN'], status: 'in-progress', type: 'Team', link: '#' },
    { id: 2, title: 'Design System v3 Review', time: '2:00 PM — 3:00 PM', date: '2026-03-26', participants: ['NG', 'KJ', 'GA'], status: 'upcoming', type: 'Design', link: '#' },
    { id: 3, title: '1:1 with Priya', time: '4:00 PM — 4:30 PM', date: '2026-03-26', participants: ['GA', 'PS'], status: 'upcoming', type: '1:1', link: '#' },
    { id: 4, title: 'Weekly Standup', time: '9:30 AM — 10:00 AM', date: '2026-03-27', participants: ['GA', 'PS', 'AN', 'VS', 'DV'], status: 'upcoming', type: 'Team', link: '#' },
    { id: 5, title: 'Client Demo — Product Showcase', time: '11:00 AM — 12:00 PM', date: '2026-03-27', participants: ['GA', 'RM', 'NG', 'AP'], status: 'upcoming', type: 'External', link: '#' },
    { id: 6, title: 'Retrospective — March Sprint', time: '3:00 PM — 4:00 PM', date: '2026-03-25', participants: ['GA', 'PS', 'RM', 'AN', 'VS'], status: 'completed', type: 'Team', link: '#' },
  ],

  itTickets: [
    { id: 1, title: 'VPN connection dropping intermittently', priority: 'high', status: 'open', assignedTo: 'IT Team', created: '2026-03-25', category: 'Network' },
    { id: 2, title: 'Request new MacBook Pro laptop', priority: 'medium', status: 'in-progress', assignedTo: 'Raj Kumar', created: '2026-03-22', category: 'Hardware' },
    { id: 3, title: 'Figma license activation issue', priority: 'medium', status: 'resolved', assignedTo: 'IT Team', created: '2026-03-20', category: 'Software' },
    { id: 4, title: 'Email attachment size limit increase', priority: 'low', status: 'resolved', assignedTo: 'IT Team', created: '2026-03-18', category: 'Email' },
    { id: 5, title: 'Conference room display not working', priority: 'high', status: 'open', assignedTo: 'Facilities', created: '2026-03-26', category: 'Hardware' },
  ],

  hrResources: [
    { id: 1, title: 'Employee Handbook 2026', desc: 'Company policies, code of conduct, and workplace guidelines.', category: 'Policies', icon: '📋' },
    { id: 2, title: 'Health Insurance Benefits', desc: 'Medical, dental, and vision coverage details for employees and dependents.', category: 'Benefits', icon: '🏥' },
    { id: 3, title: 'Open Positions', desc: '12 open positions across Engineering, Design, and Product teams.', category: 'Careers', icon: '💼', count: 12 },
    { id: 4, title: 'Performance Review Guide', desc: 'Self-assessment templates, manager review forms, and OKR tracking.', category: 'Reviews', icon: '📊' },
    { id: 5, title: 'Onboarding Checklist', desc: 'Complete guide for new employees — IT setup, buddy program, training schedule.', category: 'Onboarding', icon: '🚀' },
    { id: 6, title: 'Wellness Programs', desc: 'Gym memberships, mental health resources, and wellness day policies.', category: 'Wellness', icon: '🧘' },
    { id: 7, title: 'Training Calendar', desc: 'Upcoming workshops, certifications, and skill development events.', category: 'Training', icon: '📚', count: 8 },
    { id: 8, title: 'Reimbursement Policy', desc: 'Travel, meals, software, and office supply expense guidelines.', category: 'Policies', icon: '💰' },
  ]
};
