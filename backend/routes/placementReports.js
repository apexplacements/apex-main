const express = require('express');
const router = express.Router();
const db = require('../config/db');

const ensureReportsTable = async ()=>{
  await db.query(`
    CREATE TABLE IF NOT EXISTS placement_reports (
      id INT AUTO_INCREMENT PRIMARY KEY,
      report_type VARCHAR(50),
      report_date DATE,
      payload JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

ensureReportsTable().catch(e=>console.error('placement_reports init failed',e));

router.get('/', async (req,res)=>{
  try{
    const [rows] = await db.query('SELECT * FROM placement_reports ORDER BY created_at DESC');
    res.json({success:true,data:rows});
  }catch(err){console.error(err);res.status(500).json({success:false,message:'Unable to fetch placement reports'});} 
});

router.post('/', async (req,res)=>{
  try{
    const {report_type,report_date,payload} = req.body;
    const [result] = await db.query('INSERT INTO placement_reports (report_type,report_date,payload) VALUES (?,?,?)',[report_type||null,report_date||null,JSON.stringify(payload)||null]);
    res.json({success:true,id:result.insertId});
  }catch(err){console.error(err);res.status(500).json({success:false,message:'Unable to create placement report'});} 
});

module.exports = router;
