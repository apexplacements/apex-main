const express = require('express');
const router = express.Router();
const db = require('../config/db');

const ensureOffersTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS offers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT,
      company_id INT,
      role VARCHAR(255),
      ctc VARCHAR(100),
      offer_date DATE,
      joining_date DATE,
      offer_letter_url TEXT,
      status VARCHAR(50) DEFAULT 'Offered',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

ensureOffersTable().catch(e=>console.error('offers table init failed',e));

router.get('/', async (req,res)=>{
  try{
    const [rows] = await db.query('SELECT o.*, s.name AS student_name, c.company_name FROM offers o LEFT JOIN students s ON o.student_id = s.id LEFT JOIN companies c ON o.company_id = c.id ORDER BY o.created_at DESC');
    res.json({success:true,data:rows});
  }catch(err){console.error(err);res.status(500).json({success:false,message:'Unable to fetch offers'});} 
});

router.post('/', async (req,res)=>{
  try{
    const {student_id,company_id,role,ctc,offer_date,joining_date,offer_letter_url,status} = req.body;
    const [result] = await db.query(`INSERT INTO offers (student_id,company_id,role,ctc,offer_date,joining_date,offer_letter_url,status) VALUES (?,?,?,?,?,?,?,?)`,[student_id||null,company_id||null,role||null,ctc||null,offer_date||null,joining_date||null,offer_letter_url||null,status||'Offered']);
    res.json({success:true,id:result.insertId});
  }catch(err){console.error(err);res.status(500).json({success:false,message:'Unable to create offer'});} 
});

router.put('/:id', async (req,res)=>{
  try{
    const {status,offer_letter_url,joining_date} = req.body;
    const [result] = await db.query('UPDATE offers SET status = ?, offer_letter_url = ?, joining_date = ? WHERE id = ?',[status||null,offer_letter_url||null,joining_date||null,req.params.id]);
    if(result.affectedRows===0) return res.status(404).json({success:false,message:'Offer not found'});
    res.json({success:true});
  }catch(err){console.error(err);res.status(500).json({success:false,message:'Unable to update offer'});} 
});

module.exports = router;
