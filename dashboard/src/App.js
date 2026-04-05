import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './AppContext';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Dashboard from './Dashboard';
import TeamSpace from './TeamSpace';
import SocialFeed from './SocialFeed';
import Timesheet from './Timesheet';
import LeaveManager from './LeaveManager';
import Expenses from './Expenses';
import LearningHub from './LearningHub';
import Settings from './Settings';
import Meetings from './Meetings';
import ITSupport from './ITSupport';
import HRPortal from './HRPortal';
import StocksAvailability from './StocksAvailability';
import InvoiceGenerated from './InvoiceGenerated';
import EmailNotified from './EmailNotified';
import './App.css';
import './Modal.css';

const routes = [
  { path: '/', breadcrumb: 'Dashboard', search: 'Search people, tools, announcements...', element: <Dashboard /> },
  { path: '/team', breadcrumb: 'Team Space', search: 'Search team members...', element: <TeamSpace /> },
  { path: '/feed', breadcrumb: 'Social Feed', search: 'Search posts, hashtags, people...', element: <SocialFeed /> },
  { path: '/timesheet', breadcrumb: 'Timesheet', search: 'Search timesheet entries...', element: <Timesheet /> },
  { path: '/leave', breadcrumb: 'Leave Manager', search: 'Search leave requests...', element: <LeaveManager /> },
  { path: '/expenses', breadcrumb: 'Expenses', search: 'Search expenses...', element: <Expenses /> },
  { path: '/meetings', breadcrumb: 'Meetings', search: 'Search meetings...', element: <Meetings /> },
  { path: '/it-support', breadcrumb: 'IT Support', search: 'Search tickets...', element: <ITSupport /> },
  { path: '/hr-portal', breadcrumb: 'HR Portal', search: 'Search HR resources...', element: <HRPortal /> },
  { path: '/learning', breadcrumb: 'Learning Hub', search: 'Search courses...', element: <LearningHub /> },
  { path: '/settings', breadcrumb: 'Settings', search: 'Search settings...', element: <Settings /> },
  { path: '/stocks', breadcrumb: 'Stocks Availability', search: 'Search products...', element: <StocksAvailability /> },
  { path: '/invoices', breadcrumb: 'Invoice Generated', search: 'Search invoices...', element: <InvoiceGenerated /> },
  { path: '/emails', breadcrumb: 'Email Notified', search: 'Search emails...', element: <EmailNotified /> },
];

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AppProvider>
      <Router>
        <div className="app-layout">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="main-content">
            <Routes>
              {routes.map(r => (
                <Route key={r.path} path={r.path} element={
                  <>
                    <TopBar
                      breadcrumb={r.breadcrumb}
                      searchPlaceholder={r.search}
                      onMenuClick={() => setSidebarOpen(true)}
                    />
                    {r.element}
                  </>
                } />
              ))}
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
