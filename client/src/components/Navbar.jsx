import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, User, LogOut, Menu, X, Code2 } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <Code2 size={24} />
          <span>FreelanceHub</span>
        </Link>

        {/* Desktop Nav */}
        <div className="navbar-links">
          <Link to="/companies" className="nav-link nav-link--highlight">🏢 1,000 Companies</Link>
          <Link to="/jobs" className="nav-link">Find Work</Link>
          <Link to="/connect" className="nav-link">🤝 Networking</Link>
          <Link to="/freelancers" className="nav-link">Find Talent</Link>
          <Link to="/pricing" className="nav-link">💎 Pricing</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              {user.role === 'client' && (
                <Link to="/post-job" className="btn btn-outline">Post a Job</Link>
              )}
              <div className="nav-user-menu">
                <span className="nav-user-name">Hi, {user.name.split(' ')[0]}</span>
                <button onClick={handleLogout} className="btn-icon" title="Logout">
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="nav-auth-links">
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/jobs" onClick={() => setMenuOpen(false)}>Find Work</Link>
          <Link to="/freelancers" onClick={() => setMenuOpen(false)}>Find Talent</Link>
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              {user.role === 'client' && (
                <Link to="/post-job" onClick={() => setMenuOpen(false)}>Post a Job</Link>
              )}
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
