import { Link } from 'react-router';
import './Landing.css';

const Landing = () => {
  return (
    <main className="landing">
      <h1>Hello, you are on the landing page for visitors.</h1>
      <p>Sign up now, or sign in to see your super secret dashboard!</p>

      <div className="landing-actions">
        <Link to="/register" className="btn btn-primary">Register as Client</Link>
        <Link to="/sign-in" className="btn btn-secondary">Sign In</Link>
      </div>
    </main>
  );
};

export default Landing;
