// src/components/SignInForm/SignInForm.jsx

import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router";

import { signIn } from "../../services/authService";

import { UserContext } from "../../contexts/UserContext";
import "../../styles/CampaignRequestForm.css";
import "../../styles/AuthForm.css";

const SignInForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (evt) => {
    setMessage("");
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      // This function doesn't exist yet, but we'll create it soon.
      // It will cause an error right now
      const signedInUser = await signIn(formData);

      setUser(signedInUser);

      if (signedInUser.role === "admin") {
        navigate("/admin/users");
      } else {
        navigate("/");
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-back-link">← Back to Home</Link>
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to manage your campaigns.</p>

        {message && <p role="alert">{message}</p>}

        <form autoComplete="off" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              autoComplete="off"
              id="email"
              value={formData.email}
              name="email"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              autoComplete="off"
              id="password"
              value={formData.password}
              name="password"
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-actions">
            <button type="submit" className="btn-primary-action">Sign In</button>
            <button type="button" className="btn-secondary-action" onClick={() => navigate("/")}>Cancel</button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default SignInForm;
