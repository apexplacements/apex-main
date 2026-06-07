import React, { useState, useEffect } from 'react';
import api from '../apiClient';

export default function PlacementStudentsComp(){
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    
    const fetchStudents = async () => {
      try {
        const response = await api.get('/students');
        if (mounted && response.data && response.data.data) {
          setStudents(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching students:', err);
        if (mounted) setError('Failed to load students');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    
    fetchStudents();
    return () => { mounted = false; };
  }, []);

  return (
    <div style={{padding:16}}>
      <h2>Students for Placement</h2>
      {error && <div style={{color:'red',marginBottom:12}}>{error}</div>}
      {loading ? (
        <div>Loading students...</div>
      ) : (
        <div style={{overflowX:'auto'}}>
          <table className="table">
            <thead>
              <tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Course</th><th>Batch</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {students.length > 0 ? students.map(s=> (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.name || s.student_name || 'N/A'}</td>
                  <td>{s.email}</td>
                  <td>{s.phone}</td>
                  <td>{s.course || 'N/A'}</td>
                  <td>{s.batch || 'N/A'}</td>
                  <td><button className="btn btn-sm" onClick={() => alert('View: ' + (s.name || s.student_name))}>View</button></td>
                </tr>
              )) : (
                <tr><td colSpan="7" style={{textAlign:'center'}}>No students found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
