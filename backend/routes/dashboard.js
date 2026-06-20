const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET dashboard statistics from all related tables
router.get("/stats", async (req, res) => {
  try {
    console.log("[DASHBOARD] Fetching dashboard statistics...");

    // Fetch all stats in parallel
    const [
      companies,
      courses,
      trainers,
      batches,
      students,
      placedStudents,
      placementDrives,
      jobPostings,
      interviews,
      offers,
    ] = await Promise.all([
      db.query("SELECT COUNT(*) as count FROM companies"),
      db.query("SELECT COUNT(*) as count FROM courses"),
      db.query("SELECT COUNT(*) as count FROM trainers WHERE is_active = TRUE"),
      db.query("SELECT COUNT(*) as count FROM batches"),
      db.query("SELECT COUNT(*) as count FROM generated_emails WHERE role = 'student'"),
      db.query("SELECT COUNT(*) as count FROM placed_students"),
      db.query("SELECT COUNT(*) as count FROM placement_drives WHERE status = 'Open'"),
      db.query("SELECT COUNT(*) as count FROM job_postings"),
      db.query("SELECT COUNT(*) as count FROM interviews WHERE status IN ('Scheduled', 'Completed')"),
      db.query("SELECT COUNT(*) as count FROM offers WHERE status = 'Offered'"),
    ]);

    const stats = {
      companies: companies[0][0]?.count || 0,
      courses: courses[0][0]?.count || 0,
      activeTrainers: trainers[0][0]?.count || 0,
      batches: batches[0][0]?.count || 0,
      totalStudents: students[0][0]?.count || 0,
      placedStudents: placedStudents[0][0]?.count || 0,
      activePlacementDrives: placementDrives[0][0]?.count || 0,
      jobPostings: jobPostings[0][0]?.count || 0,
      interviews: interviews[0][0]?.count || 0,
      pendingOffers: offers[0][0]?.count || 0,
    };

    console.log("[DASHBOARD] Stats fetched successfully:", stats);
    res.json({ success: true, data: stats });
  } catch (err) {
    console.error("[DASHBOARD] Error fetching stats:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch dashboard statistics." });
  }
});

// GET recent placements with company details
router.get("/recent-placements", async (req, res) => {
  try {
    console.log("[DASHBOARD] Fetching recent placements...");
    
    const [placements] = await db.query(`
      SELECT 
        ps.id,
        ps.student_id,
        ps.role,
        ps.package,
        ps.joining_date,
        c.company_name,
        c.location
      FROM placed_students ps
      JOIN companies c ON ps.company_id = c.id
      ORDER BY ps.created_at DESC
      LIMIT 10
    `);

    console.log("[DASHBOARD] Recent placements fetched:", placements.length);
    res.json({ success: true, data: placements });
  } catch (err) {
    console.error("[DASHBOARD] Error fetching placements:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch placements." });
  }
});

// GET active batches with course and trainer details
router.get("/active-batches", async (req, res) => {
  try {
    console.log("[DASHBOARD] Fetching active batches...");
    
    const [batches] = await db.query(`
      SELECT 
        b.id,
        b.batch_name,
        c.course_name,
        t.trainer_name,
        b.start_date,
        b.end_date,
        b.status,
        (SELECT COUNT(*) FROM batch_students WHERE batch_id = b.id) as enrolled_students
      FROM batches b
      JOIN courses c ON b.course_id = c.id
      JOIN trainers t ON b.trainer_id = t.id
      WHERE b.status IN ('Ongoing', 'Scheduled')
      ORDER BY b.start_date DESC
      LIMIT 5
    `);

    console.log("[DASHBOARD] Active batches fetched:", batches.length);
    res.json({ success: true, data: batches });
  } catch (err) {
    console.error("[DASHBOARD] Error fetching batches:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch batches." });
  }
});

// GET upcoming placement drives
router.get("/upcoming-drives", async (req, res) => {
  try {
    console.log("[DASHBOARD] Fetching upcoming drives...");
    
    const [drives] = await db.query(`
      SELECT 
        pd.id,
        pd.drive_name,
        c.company_name,
        pd.role,
        pd.package,
        pd.drive_date,
        pd.status
      FROM placement_drives pd
      JOIN companies c ON pd.company_id = c.id
      WHERE pd.status = 'Open' AND pd.drive_date >= CURDATE()
      ORDER BY pd.drive_date ASC
      LIMIT 5
    `);

    console.log("[DASHBOARD] Upcoming drives fetched:", drives.length);
    res.json({ success: true, data: drives });
  } catch (err) {
    console.error("[DASHBOARD] Error fetching drives:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch drives." });
  }
});

// GET placement funnel data
router.get("/placement-funnel", async (req, res) => {
  try {
    console.log("[DASHBOARD] Fetching placement funnel...");
    
    const [funnel] = await db.query(`
      SELECT 
        (SELECT COUNT(DISTINCT student_id) FROM interviews) as total_interviewed,
        (SELECT COUNT(DISTINCT student_id) FROM offers WHERE status = 'Offered') as offers_received,
        (SELECT COUNT(*) FROM placed_students) as placed,
        (SELECT COUNT(DISTINCT s.id) FROM generated_emails s WHERE s.role = 'student') as total_students
    `);

    console.log("[DASHBOARD] Placement funnel fetched");
    res.json({ success: true, data: funnel[0] });
  } catch (err) {
    console.error("[DASHBOARD] Error fetching funnel:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch placement funnel." });
  }
});

module.exports = router;
