import React from 'react';

export default function PlacementStudentsComp(){
  // Placeholder table; will wire search/filter and API
  const students = [
    {id:1,name:'Alice',email:'alice@example.com',phone:'9000000000',course:'Full Stack',batch:'Feb 2026',status:'Shortlisted'},
    {id:2,name:'Bob',email:'bob@example.com',phone:'9000000001',course:'Data Science',batch:'Mar 2026',status:'Pending'},
  ];

  return (
    <div style={{padding:16}}>
      <h2>Students</h2>
      <div style={{overflowX:'auto'}}>
        <table className="table">
          <thead>
            <tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Course</th><th>Batch</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {students.map(s=> (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.phone}</td>
                <td>{s.course}</td>
                <td>{s.batch}</td>
                <td>{s.status}</td>
                <td><button className="btn btn-sm">View</button> <button className="btn btn-sm">Shortlist</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
