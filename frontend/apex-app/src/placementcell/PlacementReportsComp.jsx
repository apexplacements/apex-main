import React from 'react';

export default function PlacementReportsComp(){
  return (
    <div style={{padding:16}}>
      <h2>Placement Reports</h2>
      <p>Generate Daily / Monthly / Course-wise / Batch-wise reports.</p>
      <div style={{display:'flex',gap:8}}>
        <button className="btn">Download Excel</button>
        <button className="btn">Download PDF</button>
      </div>
    </div>
  );
}
