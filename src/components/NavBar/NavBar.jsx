import { useContext } from "react";
import { Link } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import "./NavBar.css";

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <aside className="sidebar">
      <h2 className="sidebar-logo">MarkAura</h2>

      <nav>
        <ul>
          {user ? (
            <>
              <li>
                <Link to="/">Dashboard</Link>
              </li>

              {(user.role === "staff" || user.role === "admin") && (
                <li>
                  <Link to="/campaign-requests">Campaign Requests</Link>
                </li>
              )}
              {user.role === "client" && (
                <li>
                  <Link to="/requests">Campaign Requests</Link>
                </li>
              )}

              {["admin", "staff"].includes(user.role) && (
                <li>
                  <Link to="/tasks">Tasks</Link>
                </li>
              )}

              {user.role === "admin" && (
                <li>
                  <Link to="/admin/users">User Management</Link>
                </li>
              )}
              {user.role === "client" && (
                <li>
                  <Link to="/requests/new">New Campaign Request</Link>
                </li>
              )}
              {user.role === "client" && (
                <li>
                  <Link to="/campaigns">My Campaigns</Link>
                </li>
              )}
              {user.role === "client" && (
                <li>
                  <Link to="/profile">My Profile</Link>
                </li>
              )}
              <li className="sidebar-signout">
                <Link to="/" onClick={handleSignOut}>
                  Sign Out
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/register">Register</Link>
              </li>

              <li>
                <Link to="/sign-in">Sign In</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default NavBar;
