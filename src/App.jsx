import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router";

// Components
import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import ClientSignUpForm from './components/ClientSignUpForm/ClientSignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Dashboard from './components/Dashboard/Dashboard'
import Landing from './components/Landing/Landing'
import AdminUserManagement from './components/AdminUserManagement/AdminUserManagement';
import NewCampaignRequest from './components/NewCampaignRequest/NewCampaignRequest';
import CampaignRequests from './components/CampaignRequests/CampaignRequests';
import MyCampaignRequests from './components/MyCampaignRequests/MyCampaignRequests';
import CampaignRequestDetails from './components/CampaignRequestDetails/CampaignRequestDetails';
import Tasks from "./components/Tasks/Tasks";
import AgencyDashboard from "./components/Dashboard/AgencyDashboard";

// Context
import { UserContext } from "./contexts/UserContext";

const App = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <NavBar />

      <Routes>
        <Route path='/' element={user ? <Dashboard /> : <Landing/> } />
        <Route path='/sign-up' element={<SignUpForm />} />
        <Route path='/register' element={<ClientSignUpForm />} />
        <Route path='/sign-in' element={<SignInForm />} />
        <Route path='/admin/users' element={<AdminUserManagement />} />
        <Route path='/requests/new' element={<NewCampaignRequest />} />
        <Route path='/requests/:id' element={<CampaignRequestDetails />} />
        <Route path='/requests' element={<MyCampaignRequests />} />
        <Route path='/campaign-requests' element={<CampaignRequests />} />
        <Route path='/requests' element={<MyCampaignRequests />} />
        <Route path='/tasks' element={<Tasks/>}/>
        <Route path="/agency-dashboard" element={<AgencyDashboard />} />
        
      </Routes>
    </>
  );
};

export default App;