import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PlacementOfficerStyles.css';

export default function PlacementLayout({ title, children }){
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(() => { try { return window.innerWidth > 1024; } catch (e) { return true; } });
  const [rotatedHidden, setRotatedHidden] = useState(false);
  const [activeMain, setActiveMain] = useState(null);

  const menu = [
    { key: 'students', label: 'Students', path: '/placement-students', children: [
      { label: 'All Students', path: '/placement-students' },
      { label: 'Add Student', path: '/students/add' }
    ] },
    { key: 'drives', label: 'Placement Drives', path: '/placement/drives', children: [
      { label: 'All Drives', path: '/placement/drives' },
      { label: 'Create Drive', path: '/placement/drives/new' }
    ] },
    { key: 'companies', label: 'Companies', path: '/companies', children: [
      { label: 'All Companies', path: '/companies' },
      { label: 'Add Company', path: '/companies/new' }
    ] },
    { key: 'interviews', label: 'Interviews', path: '/interviews', children: [
      { label: 'Schedule', path: '/interviews' }
    ] },
    { key: 'jobs', label: 'Job Postings', path: '/jobs', children: [
      { label: 'All Jobs', path: '/jobs' }
    ] },
    { key: 'reports', label: 'Reports', path: '/placement-reports', children: [
      { label: 'Placement Reports', path: '/placement-reports' }
    ] }
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    try {
      if (sidebarOpen && window.innerWidth <= 1024) document.body.classList.add('no-scroll');
      else document.body.classList.remove('no-scroll');
    } catch (e) {}
  }, [sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen((s) => {
      const next = !s;
      if (next === true) setRotatedHidden(false);
      else setRotatedHidden(true);
      return next;
    });
  };

  const handleLogout = () => {
    sessionStorage.removeItem('currentUser');
    navigate('/');
  };

  const handleNavClick = (path, key) => {
    // if a key is provided, set active main to show submenu
    if (key) setActiveMain(key);
    navigate(path);
    if (window.innerWidth <= 1024) {
      setSidebarOpen(false);
      setRotatedHidden(true);
    }
  };

  const sidebarWidth = 260;
  const submenuWidth = 220;
  const isDesktop = typeof window !== 'undefined' ? window.innerWidth > 1024 : true;
  const mainMarginLeft = (sidebarOpen && isDesktop) ? (activeMain ? (sidebarWidth + submenuWidth) : sidebarWidth) : 0;

  return (
    <div className="po-container">
      <header className="po-header">
        <div style={{ width: "60px" }}>
          <button className="po-menu-btn" onClick={toggleSidebar}>☰</button>
        </div>

        <h1>{title || 'Placement'}</h1>

        <div style={{ width: "100px", textAlign: "right" }}>
          <button className="po-logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <aside className={`po-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <nav className="po-sidebar-nav">
          {menu.map(m => (
            <button key={m.key} className="po-nav-item" onClick={() => handleNavClick(m.path, m.key)}>{m.label}</button>
          ))}
        </nav>
      </aside>

      {/* Submenu panel to the right of sidebar */}
      {activeMain && sidebarOpen && (
        (() => {
          const main = menu.find(mi => mi.key === activeMain);
          if (!main || !main.children) return null;
          return (
            <div className="po-submenu">
              {main.children.map((c, idx) => (
                <button key={idx} className="po-submenu-item" onClick={() => handleNavClick(c.path)}>{c.label}</button>
              ))}
            </div>
          );
        })()
      )}

      <div className={`po-rotated-bar ${sidebarOpen || rotatedHidden ? 'hidden' : ''}`}>
        <button className="po-rotated-btn" onClick={() => handleNavClick('/placement-students')}>Students</button>
        <button className="po-rotated-btn" onClick={() => handleNavClick('/placement/drives')}>Drives</button>
        <button className="po-rotated-btn" onClick={() => handleNavClick('/companies')}>Companies</button>
        <button className="po-rotated-btn" onClick={() => handleNavClick('/interviews')}>Interviews</button>
        <button className="po-rotated-btn" onClick={() => handleNavClick('/jobs')}>Jobs</button>
        <button className="po-rotated-btn" onClick={() => handleNavClick('/placement-reports')}>Reports</button>
      </div>

      <main style={{ paddingTop: 20, marginLeft: mainMarginLeft }}>
        {children}
      </main>
    </div>
  );
}
