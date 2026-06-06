const express = require('express');
const router = express.Router();
const db = require('../config/db');

const ensurePlacedTable = async ()=>{
  await db.query(`
    CREATE TABLE IF NOT EXISTS placed_students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT,
      company_id INT,
      role VARCHAR(255),
      package VARCHAR(100),
      joining_date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

ensurePlacedTable().catch(e=>console.error('placed_students init failed',e));

router.get('/', async (req,res)=>{
  try{
    const [rows] = await db.query('SELECT p.*, s.name as student_name, c.company_name FROM placed_students p LEFT JOIN students s ON p.student_id = s.id LEFT JOIN companies c ON p.company_id = c.id ORDER BY p.created_at DESC');
    res.json({success:true,data:rows});
  }catch(err){console.error(err);res.status(500).json({success:false,message:'Unable to fetch placed students'});} 
});

router.post('/', async (req,res)=>{
  try{
    const {student_id,company_id,role,package:pkg,joining_date} = req.body;
    const [result] = await db.query('INSERT INTO placed_students (student_id,company_id,role,package,joining_date) VALUES (?,?,?,?,?)',[student_id||null,company_id||null,role||null,pkg||null,joining_date||null]);
    res.json({success:true,id:result.insertId});
  }catch(err){console.error(err);res.status(500).json({success:false,message:'Unable to create placed student record'});} 
});

module.exports = router;
