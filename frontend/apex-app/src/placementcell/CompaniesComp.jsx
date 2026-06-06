import React, {useEffect, useState} from 'react';
import api from '../apiClient';

export default function CompaniesComp(){
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    let mounted = true;
    api.get('/companies').then(r=>{ if(mounted) setCompanies(r.data.data || []); }).catch(e=>console.error(e)).finally(()=>mounted && setLoading(false));
    return ()=> mounted = false;
  },[]);

  return (
    <div style={{padding:16}}>
      <h2>Companies</h2>
      <button className="btn">Add Company</button>
      <div style={{marginTop:12}}>
        {loading ? <div>Loading...</div> : (
        <table className="table">
          <thead><tr><th>ID</th><th>Company</th><th>HR</th><th>Email</th><th>Phone</th><th>Location</th></tr></thead>
          <tbody>
            {companies.map(c=> (
              <tr key={c.id}><td>{c.id}</td><td>{c.company_name}</td><td>{c.hr_name||c.hr_name}</td><td>{c.hr_email||c.email}</td><td>{c.hr_mobile||c.phone}</td><td>{c.location}</td></tr>
            ))}
          </tbody>
        </table>)}
      </div>
    </div>
  );
}
