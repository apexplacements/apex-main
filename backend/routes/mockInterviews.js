const express = require('express');
const router = express.Router();
const db = require('../config/db');

const ensureMockTable = async ()=>{
  await db.query(`
    CREATE TABLE IF NOT EXISTS mock_interviews (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT,
      trainer_id INT,
      date_time DATETIME,
      feedback TEXT,
      score INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

ensureMockTable().catch(e=>console.error('mock_interviews init failed',e));

router.get('/', async (req,res)=>{
  try{
    const [rows] = await db.query('SELECT m.*, s.name as student_name FROM mock_interviews m LEFT JOIN students s ON m.student_id = s.id ORDER BY m.date_time DESC');
    res.json({success:true,data:rows});
  }catch(err){console.error(err);res.status(500).json({success:false,message:'Unable to fetch mock interviews'});} 
});

router.post('/', async (req,res)=>{
  try{
    const {student_id,trainer_id,date_time,feedback,score} = req.body;
    const [result] = await db.query('INSERT INTO mock_interviews (student_id,trainer_id,date_time,feedback,score) VALUES (?,?,?,?,?)',[student_id||null,trainer_id||null,date_time||null,feedback||null,score||null]);
    res.json({success:true,id:result.insertId});
  }catch(err){console.error(err);res.status(500).json({success:false,message:'Unable to create mock interview'});} 
});

module.exports = router;
