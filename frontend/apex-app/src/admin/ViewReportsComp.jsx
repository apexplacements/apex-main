import React, { useEffect, useState } from 'react';
import './DashboardComp.css';
import { NavLink, useNavigate } from 'react-router-dom';
import apiClient from '../apiClient';

export default function ViewReportsComp() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [check, setCheck] = useState(null);
  const [error, setError] = useState('');
  const [running, setRunning] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Manage Companies', path: '/manage-companies' },
    { name: 'Manage Students', path: '/manage-students' },
    { name: 'Manage Customers', path: '/manage-customers' },
    { name: 'Create New Batches', path: '/create-batches' },
    { name: 'Upload Data', path: '/upload-data' },
    { name: 'Manage Courses', path: '/manage-courses' },
    { name: 'Manage Trainers', path: '/manage-trainers' },
    { name: 'Placement Drives', path: '/placement-drives' },
    { name: 'View Reports', path: '/view-reports' },
    
    { name: 'Notifications', path: '/notifications' },
  ];

  async function fetchAll() {
    setLoading(true);
    setError('');
    try {
      const [sRes, cRes] = await Promise.all([
        apiClient.get('/api/dashboard/stats'),
        apiClient.get('/api/admin/reports/components-check'),
      ]);
      setStats(sRes.data?.data || null);
      setCheck(cRes.data || null);
    } catch (e) {
      console.error('ViewReports fetch error', e);
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  }

  async function runCheck() {
    setRunning(true);
    setError('');
    try {
      const cRes = await apiClient.get('/api/admin/reports/components-check');
      setCheck(cRes.data || null);
    } catch (e) {
      console.error('Run check error', e);
      setError('Failed to run components check');
    } finally {
      setRunning(false);
    }
  }

  useEffect(() => { fetchAll(); }, []);

  function parsePaths(output) {
    if (!output) return [];
    // Match absolute or relative paths ending with .js/.jsx/.ts/.tsx
    const re = /([A-Za-z0-9_:\\\/\.-]+\.(?:jsx?|tsx?))/g;
    const matches = new Set();
    let m;
    while ((m = re.exec(output)) !== null) {
      let p = m[1];
      // normalize windows backslashes
      p = p.replace(/\\/g, '/');
      // trim to repo-relative if possible
      const idx = p.indexOf('frontend/');
      if (idx !== -1) p = p.slice(idx);
      matches.add(p);
    }
    return Array.from(matches);
  }

  function downloadRaw() {
    const text = (check?.stdout || '') + '\n' + (check?.stderr || '');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'components-check.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  const flagged = parsePaths(check?.stdout || '');

  return (
    <div className="dashboard-page">
      <header className="header">
        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        <h1>Admin Dashboard</h1>
        <button className="logout-btn" onClick={() => { localStorage.removeItem('token'); navigate('/'); }}>Logout</button>
      </header>

      <div className="main-layout">
        <aside className={`sidebar-menu ${menuOpen ? 'show' : ''}`}>
          {menuItems.map((item) => (
            <NavLink key={item.path} to={item.path} onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              {item.name}
            </NavLink>
          ))}
        </aside>

        <main className="dashboard-content">
          {loading ? (
            <div style={{ padding: 20 }}>Loading reports...</div>
          ) : (
            <>
              {error && <div style={{ color: 'red' }}>{error}</div>}

              <section style={{ marginBottom: 16 }}>
                <h2>Admin Summary</h2>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {stats?.summary && Object.entries(stats.summary).map(([k, v]) => (
                    <div key={k} style={{ background: '#fff', padding: 12, minWidth: 140 }}>{k.replace(/_/g, ' ')}: <strong>{v}</strong></div>
                  ))}
                </div>
              </section>

              <section style={{ marginBottom: 16 }}>
                <h2>Components Check</h2>
                <div style={{ marginBottom: 8 }}>
                  <button onClick={runCheck} disabled={running}>{running ? 'Running...' : 'Run Check'}</button>
                  <button onClick={fetchAll} style={{ marginLeft: 8 }}>Refresh All</button>
                  <button onClick={downloadRaw} style={{ marginLeft: 8 }}>Download Raw</button>
                </div>

                <div style={{ background: '#fff', padding: 12 }}>
                  <div><strong>Exit Code:</strong> {check?.exitCode ?? 'n/a'}</div>
                  <div style={{ marginTop: 8 }}><strong>Flagged files:</strong> {flagged.length}</div>
                  {flagged.length > 0 && (
                    <ul style={{ maxHeight: 200, overflow: 'auto', marginTop: 8 }}>
                      {flagged.map((p) => <li key={p}><code>{p}</code></li>)}
                    </ul>
                  )}

                  <details style={{ marginTop: 8 }}>
                    <summary>Stdout</summary>
                    <pre style={{ whiteSpace: 'pre-wrap' }}>{check?.stdout}</pre>
                  </details>
                  <details style={{ marginTop: 8 }}>
                    <summary>Stderr</summary>
                    <pre style={{ whiteSpace: 'pre-wrap' }}>{check?.stderr}</pre>
                  </details>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}