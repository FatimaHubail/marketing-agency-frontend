import { Link } from 'react-router';
import './Landing.css';

const TRUST_PILLS = ['Campaign Requests', 'Real-Time Tracking', 'Client Collaboration', 'Outsource Network'];

const Landing = () => {
  return (
    <main className="landing-page">
      <div className="landing-blob landing-blob-1" />
      <div className="landing-blob landing-blob-2" />
      <div className="landing-blob landing-blob-3" />

      <section className="landing-hero">
        <div className="landing-brand">
          <span className="logo-dots"><i></i><i></i><i></i><i></i></span>
          MarkAura
        </div>

        <h1 className="landing-headline">
          Campaigns that go
          <span className="landing-headline-accent"> from idea </span>
          to <span className="landing-headline-accent">impact</span>
        </h1>

        <p className="landing-subtext">
          MarkAura is where you brief us, we build it, and you watch it come to life,
          one clear, trackable step at a time.
        </p>

        <div className="landing-trust">
          {TRUST_PILLS.map((pill) => (
            <span className="landing-trust-pill" key={pill}>{pill}</span>
          ))}
        </div>
      </section>

      <section className="landing-banner">
        <div className="landing-banner-text">
          <h2>Ready to launch your next campaign?</h2>
          <p>Create your client account in minutes and send your first request today.</p>
        </div>
        <div className="landing-banner-actions">
          <Link to="/register" className="landing-cta landing-cta-primary">Get Started</Link>
          <Link to="/sign-in" className="landing-cta landing-cta-secondary">Sign In</Link>
        </div>
      </section>
    </main>
  );
};

export default Landing;
