const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const filesToCheck = [
  'src/admin/DashboardComp.jsx',
  'src/hr/HrDashboard.jsx',
  'src/placementcell/PlacementOfficerDashboardComp.jsx',
  'src/trainer/TrainerDashboard.jsx',
  'src/student/StudentDashboard.jsx'
];

const summaryKeys = [
  'total_students', 'total_trainers', 'total_companies', 'total_placements', 'total_jobs', 'total_courses', 'total_batches', 'total_interviews', 'total_offers', 'total_customers',
  'totalStudents', 'totalTrainers', 'totalCompanies', 'totalPlacements', 'totalJobs', 'totalCourses', 'totalBatches', 'totalInterviews', 'totalOffers', 'totalCustomers'
];

let failed = false;

filesToCheck.forEach((rel) => {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) {
    console.warn(`[check] SKIP missing file: ${rel}`);
    return;
  }
  const src = fs.readFileSync(p, 'utf8');

  const usesAdminApi = src.includes("/api/dashboard/stats") || src.includes("api.get('/api/dashboard/stats") || src.includes("apiClient.get('/api/dashboard/stats") || src.includes('apiClient.get("/api/dashboard/stats")') ;
  const hasSummaryField = summaryKeys.some(k => src.includes(k));

  if (!usesAdminApi && !hasSummaryField) {
    failed = true;
    console.error(`MISMATCH: ${rel} does not reference admin dashboard summary or summary fields.`);
  } else {
    console.log(`OK: ${rel}` + (usesAdminApi ? ' (uses admin API)' : hasSummaryField ? ' (references summary fields)' : ''));
  }
});

if (failed) {
  console.error('\nOne or more dashboard components are not using the admin summary endpoint or its fields.');
  process.exit(1);
} else {
  console.log('\nAll checked dashboard components reference admin summary or summary fields.');
  process.exit(0);
}
