import { useContext } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router";

// Components
import NavBar from "./components/NavBar/NavBar";
import ClientSignUpForm from "./components/ClientSignUpForm/ClientSignUpForm";
import SignInForm from "./components/SignInForm/SignInForm";
import Landing from "./components/Landing/Landing";
import AdminUserManagement from "./components/AdminUserManagement/AdminUserManagement";
import NewCampaignRequest from "./components/NewCampaignRequest/NewCampaignRequest";
import CampaignRequests from "./components/CampaignRequests/CampaignRequests";
import MyCampaignRequests from "./components/MyCampaignRequests/MyCampaignRequests";
import CampaignRequestDetails from "./components/CampaignRequestDetails/CampaignRequestDetails";
import UpdateCampaignRequest from "./components/UpdateCampaignRequest/UpdateCampaignRequest";
import MyCampaignsPage from "./components/MyCampaignsPage/MyCampaignsPage";
import CampaignDetails from "./components/CampaignDetails/CampaignDetails";
import ClientProfilePage from "./components/ClientProfilePage/ClientProfilePage";
import ClientDashboard from "./components/ClientDashboard/ClientDashboard";
import Tasks from "./components/Tasks/Tasks";
import AgencyDashboard from "./components/Dashboard/AgencyDashboard";
import NotFoundPage from "./components/NotFoundPage/NotFoundPage";
import AgencyClients from "./components/AgencyClients/AgencyClients";
import AgencyCampaignRequestDetails from "./components/AgencyCampaignRequestDetails/AgencyCampaignRequestDetails";
import OutsourceDashboard from "./components/Dashboard/OutsourceDashboard/OutsourceDashboard";
import OutsourceProfile from "./components/OutsourceProfile/OutsourceProfile";
import OutsourceAllTasks from "./components/OutsourceTasksAll/OutsourceAllTasks";
import OutsourceCreateTask from "./components/OutsourceCreateTask/OutsourceCreateTask";

// Context
import { UserContext } from "./contexts/UserContext";

const App = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();

  const NO_SIDEBAR_PATHS = ["/", "/register", "/sign-in"];
  const hideSidebar = !user && NO_SIDEBAR_PATHS.includes(location.pathname);

  return (
    <div className="app-layout">
      {!hideSidebar && <NavBar />}

      <div className="app-content">
        <Routes>
          {/* Home */}
          <Route
            path="/"
            element={
              !user ? (
                <Landing />
              ) : user.role === "admin" ? (
                <Navigate to="/admin/users" replace />
              ) : user.role === "client" ? (
                <ClientDashboard />
              ) : user.role === "staff" ? (
                <AgencyDashboard />
              ) : user.role === "outsource" ? (
                <OutsourceDashboard />
              ) : (
                <main>
                  <p>Welcome, {user.username}!</p>
                </main>
              )
            }
          />

          {/* Authentication */}
          <Route path="/register" element={<ClientSignUpForm />} />
          <Route path="/sign-in" element={<SignInForm />} />

          {/* Admin */}
          <Route
            path="/admin/users"
            element={
              user?.role === "admin" ? (
                <AdminUserManagement />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Client */}
          <Route
            path="/requests/new"
            element={
              user?.role === "client" ? (
                <NewCampaignRequest />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/requests/:id/edit"
            element={
              user?.role === "client" ? (
                <UpdateCampaignRequest />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/requests/:id"
            element={
              user?.role === "client" ? (
                <CampaignRequestDetails />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/requests"
            element={
              user?.role === "client" ? (
                <MyCampaignRequests />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/campaigns/:id"
            element={
              user?.role === "client" ? (
                <CampaignDetails />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/campaigns"
            element={
              user?.role === "client" ? (
                <MyCampaignsPage />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/profile"
            element={
              user?.role === "client" ? (
                <ClientProfilePage />
              ) : user?.role === "outsource" ? (
                <OutsourceProfile />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Staff / Agency */}
          <Route
            path="/campaign-requests"
            element={
              user?.role === "staff" ? (
                <CampaignRequests />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/campaign-requests/:id"
            element={
              user?.role === "staff" ? (
                <AgencyCampaignRequestDetails />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/tasks"
            element={
              user?.role === "staff" ? (
                <Tasks />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/clients"
            element={
              user?.role === "staff" ? (
                <AgencyClients />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/outsource-tasks/new"
            element={
              user?.role === "staff" ? (
                <OutsourceCreateTask />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Outsource */}
          <Route
            path="/outsource-dashboard"
            element={
              user?.role === "outsource" ? (
                <OutsourceDashboard />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/outsource/profile"
            element={
              user?.role === "outsource" ? (
                <OutsourceProfile />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/outsource-tasks"
            element={
              user?.role === "outsource" ? (
                <OutsourceAllTasks />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/outsource/tasks"
            element={
              user?.role === "outsource" ? (
                <OutsourceAllTasks />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;