import { BrowserRouter, Routes, Route } from "react-router-dom";
import LogInComp from "./admin/LogInComp";
import RegisterComp from "./admin/RegisterComp";
import ForgotPasswordComp from "./admin/ForgotPasswordComp";
import PasswordResetComp from "./admin/PasswordResetComp";
import DashboardComp from "./admin/DashboardComp";
import HrDashboard from "./hr/HrDashboard";
import TrainerDashboardComp from "./trainer/TrainerDashboardComp";
import StudentDashboardComp from "./student/StudentDashboardComp";
import PlacementOfficerDashboardComp from "./placementcell/PlacementOfficerDashboardComp";
import ManageUsersComp from "./admin/ManageUsersComp";
import ManageStudentsComp from "./admin/ManageStudentsComp";
import ManageCustomersComp from "./admin/ManageCustomersComp";
import PlacementDrivesComp from "./admin/PlacementDrivesComp";
import CreateBatchesComp from "./admin/CreateBatchesComp";
import UploadDataComp from "./admin/UploadDataComp";
import ManageCoursesComp from "./admin/ManageCoursesComp";
import ManageTrainersComp from "./admin/ManageTrainersComp";
import ViewReportsComp from "./admin/ViewReportsComp";
import SettingsComp from "./admin/SettingsComp";
import AuditLogsComp from "./admin/AuditLogsComp";
import NotificationsComp from "./admin/NotificationsComp";
import EmailCreationComp from "./admin/EmailCreationComp";
import IdentityManagementComp from "./admin/IdentityManagementComp";
import HomeComp from "./home/HomeComp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeComp />} />
        <Route path="/home" element={<HomeComp />} />
        <Route path="/login" element={<LogInComp />} />
        
        <Route path="/register" element={<RegisterComp />} />
        <Route path="/forgot-password" element={<ForgotPasswordComp />} />
        <Route path="/password-reset" element={<PasswordResetComp />} />
        <Route path="/dashboard" element={<DashboardComp />} />
        <Route path="/admin" element={<DashboardComp />} />
        <Route path="/admin/dashboard" element={<DashboardComp />} />
        <Route path="/hr-dashboard" element={<HrDashboard />} />
        <Route path="/hr/dashboard" element={<HrDashboard />} />
        <Route path="/trainer-dashboard" element={<TrainerDashboardComp />} />
        <Route path="/trainer/dashboard" element={<TrainerDashboardComp />} />
        <Route path="/student-dashboard" element={<StudentDashboardComp />} />
        <Route path="/student/dashboard" element={<StudentDashboardComp />} />
        <Route path="/placement-dashboard" element={<PlacementOfficerDashboardComp />} />
        <Route path="/placement/dashboard" element={<PlacementOfficerDashboardComp />} />
        <Route path="/hr" element={<HrDashboard />} />
        <Route path="/trainer" element={<TrainerDashboardComp />} />
        <Route path="/student" element={<StudentDashboardComp />} />
        <Route path="/placement" element={<PlacementOfficerDashboardComp />} />
        <Route path="/manage-users" element={<ManageUsersComp />} />
        <Route path="/admin/manage-users" element={<ManageUsersComp />} />
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
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;