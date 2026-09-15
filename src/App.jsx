import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router";

// Components
import NavBar from "./components/NavBar/NavBar";
import SignUpForm from "./components/SignUpForm/SignUpForm";
import SignInForm from "./components/SignInForm/SignInForm";
import Dashboard from "./components/Dashboard/Dashboard";
import Landing from "./components/Landing/Landing";
import AdminUserManagement from "./components/AdminUserManagement/AdminUserManagement";
import CampaignRequests from "./components/CampaignRequests/CampaignRequests";

// Context
import { UserContext } from "./contexts/UserContext";

const App = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Landing />} />
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="/sign-in" element={<SignInForm />} />
        <Route
          path="/admin/users"
          element={
            user?.role === "admin" ? (
              <AdminUserManagement />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route path = '/campaign-requests' element={<CampaignRequests/>}/>
      </Routes>
    </>
  );
};

export default App;
