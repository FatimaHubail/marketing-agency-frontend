import { useContext } from "react";
import { Route, Routes, useLocation } from "react-router";

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


// Context
import { UserContext } from "./contexts/UserContext";

const App = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const NO_SIDEBAR_PATHS = ['/', '/register', '/sign-in'];
  const hideSidebar = !user && NO_SIDEBAR_PATHS.includes(location.pathname);

  return (
    <div className="app-layout">
      {!hideSidebar && <NavBar />}

      <div className="app-content">
        <Routes>
          <Route path='/' element={
            !user
              ? <Landing />
              : user.role === 'client'
                ? <ClientDashboard />
                : (user.role === 'staff' || user.role === 'admin')
                  ? <AgencyDashboard />
                  : (user.role === "outsource")
                    ? <OutsourceDashboard />
                    : <main><p>Welcome, {user.username}!</p></main>
          } />
          <Route path="/outsource-dashboard" element={<OutsourceDashboard />} />
          <Route path='/register' element={<ClientSignUpForm />} />
          <Route path='/sign-in' element={<SignInForm />} />
          <Route path='/admin/users' element={<AdminUserManagement />} />
          <Route path='/requests/new' element={<NewCampaignRequest />} />
          <Route path='/requests/:id/edit' element={<UpdateCampaignRequest />} />
          <Route path='/requests/:id' element={<CampaignRequestDetails />} />
          <Route path='/requests' element={<MyCampaignRequests />} />
          <Route path='/campaign-requests/:id' element={<AgencyCampaignRequestDetails />} />
          <Route path='/campaign-requests' element={<CampaignRequests />} />
          <Route path='/campaigns/:id' element={<CampaignDetails />} />
          <Route path='/campaigns' element={<MyCampaignsPage />} />
          <Route path='/profile' element={<ClientProfilePage />} />
          <Route path='/tasks' element={<Tasks />} />
          <Route path='/clients' element={<AgencyClients />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
