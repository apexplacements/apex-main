import React, { Suspense, lazy } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
const LogInComp = lazy(() => import("./admin/LogInComp"));
const RegisterComp = lazy(() => import("./admin/RegisterComp"));
const ForgotPasswordComp = lazy(() => import("./admin/ForgotPasswordComp"));
const PasswordResetComp = lazy(() => import("./admin/PasswordResetComp"));
const DashboardComp = lazy(() => import("./admin/DashboardComp"));
const HrDashboard = lazy(() => import("./hr/HrDashboard"));
const TrainerDashboardComp = lazy(() => import("./trainer/TrainerDashboardComp"));
const StudentDashboardComp = lazy(() => import("./student/StudentDashboardComp"));
const PlacementOfficerDashboardComp = lazy(() => import("./placementcell/PlacementOfficerDashboardComp"));
const PlacementStudentsComp = lazy(() => import("./placementcell/PlacementStudentsComp"));
const PlacementDrivesCellComp = lazy(() => import("./placementcell/PlacementDrivesComp"));
const CompaniesComp = lazy(() => import("./placementcell/CompaniesComp"));
const PlacementReportsComp = lazy(() => import("./placementcell/PlacementReportsComp"));
const ManageCompaniesComp = lazy(() => import("./admin/ManageCompaniesComp"));
const ManageStudentsComp = lazy(() => import("./admin/ManageStudentsComp"));
const ManageCustomersComp = lazy(() => import("./admin/ManageCustomersComp"));
const PlacementDrivesComp = lazy(() => import("./admin/PlacementDrivesComp"));
const CreateBatchesComp = lazy(() => import("./admin/CreateBatchesComp"));
const UploadDataComp = lazy(() => import("./admin/UploadDataComp"));
const ManageCoursesComp = lazy(() => import("./admin/ManageCoursesComp"));
const ManageTrainersComp = lazy(() => import("./admin/ManageTrainersComp"));
const ViewReportsComp = lazy(() => import("./admin/ViewReportsComp"));
const SettingsComp = lazy(() => import("./admin/SettingsComp"));
const AuditLogsComp = lazy(() => import("./admin/AuditLogsComp"));
const NotificationsComp = lazy(() => import("./admin/NotificationsComp"));
const EmailCreationComp = lazy(() => import("./admin/EmailCreationComp"));
const IdentityManagementComp = lazy(() => import("./admin/IdentityManagementComp"));
const LmsStudentDashboard = lazy(() => import("./student/StudentDashboard"));
const LmsTrainerDashboard = lazy(() => import("./trainer/TrainerDashboard"));
const HomeComp = lazy(() => import("./home/HomeComp"));
const AboutComp = lazy(() => import("./home/AboutComp"));
const CourseComp = lazy(() => import("./home/CourseComp"));
const ItSupportComp = lazy(() => import("./home/ItsupportComp"));
const ReviewsComp = lazy(() => import("./home/ReviewsComp"));
const InterviewQuestionsComp = lazy(() => import("./home/InterviewQuestionsComp"));
const BlogsComp = lazy(() => import("./home/BlogsComp"));
const ContactusComp = lazy(() => import("./home/ContactusComp"));
const NewbatchComp = lazy(() => import("./home/NewbatchComp"));

function App() {
  return (
    <HashRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomeComp />} />
          <Route path="/home" element={<HomeComp />} />
        <Route path="/login" element={<LogInComp />} />
        <Route path="/admin/login" element={<LogInComp />} />
        <Route path="/register" element={<RegisterComp />} />
        <Route path="/forgot-password" element={<ForgotPasswordComp />} />
        <Route path="/password-reset" element={<PasswordResetComp />} />
        <Route path="/dashboard" element={<DashboardComp />} />
        <Route path="/admin" element={<DashboardComp />} />
        <Route path="/admin/dashboard" element={<DashboardComp />} />
        <Route path="/hr-dashboard" element={<HrDashboard />} />
        <Route path="/hr/dashboard" element={<HrDashboard />} />
        <Route path="/trainer-dashboard" element={<LmsTrainerDashboard />} />
        <Route path="/trainer/dashboard" element={<LmsTrainerDashboard />} />
        <Route path="/student-dashboard" element={<LmsStudentDashboard />} />
        <Route path="/student/dashboard" element={<LmsStudentDashboard />} />
        <Route path="/placement-dashboard" element={<PlacementOfficerDashboardComp />} />
        <Route path="/placement/dashboard" element={<PlacementOfficerDashboardComp />} />
        <Route path="/placement-students" element={<PlacementStudentsComp />} />
        <Route path="/placement/drives" element={<PlacementDrivesCellComp />} />
        <Route path="/companies" element={<CompaniesComp />} />
        <Route path="/placement-reports" element={<PlacementReportsComp />} />
        <Route path="/hr" element={<HrDashboard />} />
        <Route path="/trainer" element={<LmsTrainerDashboard />} />
        <Route path="/student" element={<LmsStudentDashboard />} />
        <Route path="/placement" element={<PlacementOfficerDashboardComp />} />
        <Route path="/manage-companies" element={<ManageCompaniesComp />} />
        <Route path="/admin/manage-companies" element={<ManageCompaniesComp />} />
        <Route path="/manage-students" element={<ManageStudentsComp />} />
        <Route path="/admin/manage-students" element={<ManageStudentsComp />} />
        <Route path="/manage-customers" element={<ManageCustomersComp />} />
        <Route path="/admin/manage-customers" element={<ManageCustomersComp />} />
        <Route path="/create-batches" element={<CreateBatchesComp />} />
        <Route path="/admin/create-batches" element={<CreateBatchesComp />} />
        <Route path="/upload-data" element={<UploadDataComp />} />
        <Route path="/admin/upload-data" element={<UploadDataComp />} />
        <Route path="/manage-courses" element={<ManageCoursesComp />} />
        <Route path="/admin/manage-courses" element={<ManageCoursesComp />} />
        <Route path="/manage-trainers" element={<ManageTrainersComp />} />
        <Route path="/admin/manage-trainers" element={<ManageTrainersComp />} />
        <Route path="/placement-drives" element={<PlacementDrivesComp />} />
        <Route path="/admin/placement-drives" element={<PlacementDrivesComp />} />
        <Route path="/jobs" element={<PlacementDrivesCellComp />} />
        <Route path="/view-reports" element={<ViewReportsComp />} />
        <Route path="/admin/view-reports" element={<ViewReportsComp />} />
        <Route path="/settings" element={<SettingsComp />} />
        <Route path="/admin/settings" element={<SettingsComp />} />
        <Route path="/audit-logs" element={<AuditLogsComp />} />
        <Route path="/admin/audit-logs" element={<AuditLogsComp />} />
        <Route path="/notifications" element={<NotificationsComp />} />
        <Route path="/admin/notifications" element={<NotificationsComp />} />
        <Route path="/email-creation" element={<EmailCreationComp />} />
        <Route path="/admin/email-creation" element={<EmailCreationComp />} />
        <Route path="/identity-management" element={<IdentityManagementComp />} />
        <Route path="/admin/identity-management" element={<IdentityManagementComp />} />
        <Route path="/about" element={<AboutComp />} />
        <Route path="/courses" element={<CourseComp />} />
        <Route path="/newbatches" element={<NewbatchComp />} />
        <Route path="/it-support" element={<ItSupportComp />} />
        <Route path="/contactus" element={<ContactusComp />} />
        <Route path="/reviews" element={<ReviewsComp />} />
        <Route path="/interview-questions" element={<InterviewQuestionsComp />} />
        <Route path="/blogs" element={<BlogsComp />} />
        
        {/* LMS Routes */}
        <Route path="/lms/student" element={<LmsStudentDashboard />} />
        <Route path="/lms/student/dashboard" element={<LmsStudentDashboard />} />
        <Route path="/lms/trainer" element={<LmsTrainerDashboard />} />
        <Route path="/lms/trainer/dashboard" element={<LmsTrainerDashboard />} />
      </Routes>
      </Suspense>
    </HashRouter>
  );
}

export default App;