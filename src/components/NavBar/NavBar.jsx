import { useContext } from "react";
import { NavLink, useNavigate } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import "./NavBar.css";

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const initials = user?.username
    ? user.username
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-dots">
          <i></i><i></i><i></i><i></i>
        </span>
        MarkAura
      </div>

      {user && (
        <div className="sidebar-profile">
          <span className="sidebar-avatar">{initials}</span>
          <p className="sidebar-username">{user.username}</p>
          <p className="sidebar-role">{user.role}</p>
        </div>
      )}

      <nav>
        <ul>
          {user ? (
            <>
              {/* Admin */}
              {user.role === "admin" && (
                <li>
                  <NavLink to="/admin/users">User Management</NavLink>
                </li>
              )}

              {/* Staff */}
              {user.role === "staff" && (
                <>
                  <li>
                    <NavLink to="/" end>Dashboard</NavLink>
                  </li>
                  <li>
                    <NavLink to="/campaign-requests">Campaign Requests</NavLink>
                  </li>
                  <li>
                    <NavLink to="/tasks">Tasks</NavLink>
                  </li>
                </>
              )}

              {/* Client */}
              {user.role === "client" && (
                <>
                  <li>
                    <NavLink to="/" end>Dashboard</NavLink>
                  </li>
                  <li>
                    <NavLink to="/requests" end>Campaign Requests</NavLink>
                  </li>
                  <li>
                    <NavLink to="/requests/new">New Campaign Request</NavLink>
                  </li>
                  <li>
                    <NavLink to="/campaigns">My Campaigns</NavLink>
                  </li>
                  <li>
                    <NavLink to="/profile">My Profile</NavLink>
                  </li>
                </>
              )}
            </>
          ) : (
            <>
              <li>
                <NavLink to="/register">Register</NavLink>
              </li>

              <li>
                <NavLink to="/sign-in">Sign In</NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>

      {user && (
        <button className="sidebar-logout" onClick={handleSignOut}>
          <span className="sidebar-logout-icon">⏻</span>
          Log out
        </button>
      )}
    </aside>
  );
};

export default NavBar;
