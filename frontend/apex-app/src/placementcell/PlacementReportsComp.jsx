import React, { useState, useEffect } from 'react';
import api from '../apiClient';

export default function PlacementReportsComp(){
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    const fetchReports = async () => {
      try {
        const [studentsRes, placedRes, drivesRes] = await Promise.all([
          api.get('/students').catch(e => ({data: {data: []}})),
          api.get('/placed-students').catch(e => ({data: {data: []}})),
          api.get('/placement-drives').catch(e => ({data: {data: []}}))
        ]);
        
        if (mounted) {
          const totalStudents = studentsRes.data?.data?.length || 0;
          const placedStudents = placedRes.data?.data?.length || 0;
          const activeDrives = drivesRes.data?.data?.length || 0;
          const placementRate = totalStudents ? Math.round((placedStudents / totalStudents) * 100) : 0;
          
          setStats({
            totalStudents,
            placedStudents,
            activeDrives,
            placementRate,
            timestamp: new Date().toLocaleString()
          });
        }
      } catch (err) {
        console.error('Error fetching reports:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    
    fetchReports();
    return () => { mounted = false; };
  }, []);

  const downloadReport = (format) => {
    const reportData = [
      ['Placement Report', stats.timestamp],
      [],
      ['Metric', 'Value'],
      ['Total Students', stats.totalStudents],
      ['Placed Students', stats.placedStudents],
      ['Active Drives', stats.activeDrives],
      ['Placement Rate (%)', stats.placementRate]
    ];
    
    if (format === 'csv') {
      const csv = reportData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'placement_report.csv';
      a.click();
    }
  };

  return (
    <div style={{padding:16}}>
      <h2>Placement Reports</h2>
      {loading ? (
        <div>Loading report data...</div>
      ) : (
        <>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:12, marginBottom:20}}>
            <div style={{padding:12, background:'#e3f2fd', borderRadius:8}}>
              <div style={{fontSize:28, fontWeight:900, color:'#1976d2'}}>{stats.totalStudents}</div>
              <div style={{fontSize:14, color:'#555'}}>Total Students</div>
            </div>
            <div style={{padding:12, background:'#f3e5f5', borderRadius:8}}>
              <div style={{fontSize:28, fontWeight:900, color:'#7b1fa2'}}>{stats.placedStudents}</div>
              <div style={{fontSize:14, color:'#555'}}>Placed Students</div>
            </div>
            <div style={{padding:12, background:'#e8f5e9', borderRadius:8}}>
              <div style={{fontSize:28, fontWeight:900, color:'#388e3c'}}>{stats.placementRate}%</div>
              <div style={{fontSize:14, color:'#555'}}>Placement Rate</div>
            </div>
            <div style={{padding:12, background:'#fff3e0', borderRadius:8}}>
              <div style={{fontSize:28, fontWeight:900, color:'#f57c00'}}>{stats.activeDrives}</div>
              <div style={{fontSize:14, color:'#555'}}>Active Drives</div>
            </div>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button className="btn" onClick={() => downloadReport('csv')}>Download CSV</button>
            <button className="btn" onClick={() => alert('PDF export coming soon!')}>Download PDF</button>
          </div>
          <p style={{marginTop:16, fontSize:12, color:'#999'}}>Last updated: {stats.timestamp}</p>
        </>
      )}
    </div>
  );
}
