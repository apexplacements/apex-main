import React, {useEffect, useState} from 'react';
import api from '../apiClient';
import PlacementLayout from './PlacementLayout';

export default function PlacementDrivesComp(){
  const [drives,setDrives] = useState([]);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    let mounted=true;
    api.get('/api/placement-drives').then(r=>{ if(mounted) setDrives(r.data.data || []); }).catch(e=>console.error(e)).finally(()=>mounted && setLoading(false));
    return ()=> mounted=false;
  },[]);

  return (
    <PlacementLayout title="Placement Drives">
      <div style={{padding:16}}>
        <h2>Placement Drives</h2>
        <button className="btn">Create Drive</button>
        <div style={{marginTop:12}}>
          {loading ? <div>Loading...</div> : (
          <table className="table">
            <thead><tr><th>ID</th><th>Drive Name</th><th>Company</th><th>Date</th><th>Location</th><th>Actions</th></tr></thead>
            <tbody>
              {drives.map(d=> (
                <tr key={d.id}><td>{d.id}</td><td>{d.drive_name||d.name}</td><td>{d.company_name||d.company}</td><td>{d.drive_date||d.interview_date}</td><td>{d.location}</td><td><button className="btn btn-sm">Edit</button> <button className="btn btn-sm">Close</button></td></tr>
              ))}
            </tbody>
          </table>)}
        </div>
      </div>
    </PlacementLayout>
  );
}
