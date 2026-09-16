import { useContext } from "react";
import { Link } from "react-router";
import { UserContext } from "../../contexts/UserContext";

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const agencyRoles = ["admin", "campaign-manager", "staff"];
  const isAgency = agencyRoles.includes(user?.role);

  return (
    <nav>
      <ul>
        {user ? (
          <>
            <li>Hello {user.username}</li>

            {/* Agency Dashboard */}
            {isAgency && (
              <li>
                <Link to="/agency-dashboard">Dashboard</Link>
              </li>
            )}

            {/* Client Dashboard */}
            {user.role === "client" && (
              <li>
                <Link to="/">Dashboard</Link>
              </li>
            )}

            {/* Agency Campaign Requests */}
            {isAgency && (
              <li>
                <Link to="/campaign-requests">
                  Campaign Requests
                </Link>
              </li>
            )}

            {/* Client Campaign Requests */}
            {user.role === "client" && (
              <li>
                <Link to="/requests">
                  Campaign Requests
                </Link>
              </li>
            )}

            {/* Tasks */}
            {isAgency && (
              <li>
                <Link to="/tasks">Tasks</Link>
              </li>
            )}

            {/* Admin User Management */}
            {user.role === "admin" && (
              <li>
                <Link to="/admin/users">
                  User Management
                </Link>
              </li>
            )}

            {/* Client New Campaign Request */}
            {user.role === "client" && (
              <li>
                <Link to="/requests/new">
                  New Campaign Request
                </Link>
              </li>
            )}

            {/* Client Campaigns */}
            {user.role === "client" && (
              <li>
                <Link to="/campaigns">
                  My Campaigns
                </Link>
              </li>
            )}

            {/* Client Profile */}
            {user.role === "client" && (
              <li>
                <Link to="/profile">
                  My Profile
                </Link>
              </li>
            )}

            {/* Sign Out */}
            <li>
              <Link to="/" onClick={handleSignOut}>
                Sign Out
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/">Dashboard</Link>
            </li>

            <li>
              <Link to="/register">
                Register as Client
              </Link>
            </li>

            <li>
              <Link to="/sign-up">
                Sign Up
              </Link>
            </li>

            <li>
              <Link to="/sign-in">
                Sign In
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;