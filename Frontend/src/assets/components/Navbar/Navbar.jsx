import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../images/logo.png';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="header">
      <nav>
        <NavLink to="/">
          <img src={logo} className="logoimg" alt="logo" />
        </NavLink>

        {/* Menu */}
        <div className={`menu ${isOpen ? 'active' : ''}`}>
          <NavLink to="/" className="menu-item" onClick={() => setIsOpen(false)}>
            <span>Home</span>
          </NavLink>
          <NavLink to="/project" className="menu-item" onClick={() => setIsOpen(false)}>
            <span>Run Simulation</span>
          </NavLink>
          <NavLink to="/optimal" className="menu-item" onClick={() => setIsOpen(false)}>
            <span>Optimal Windows</span>
          </NavLink>
        </div>

        {/* Hamburger button (only visible on mobile) */}
        <button
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          ☰
        </button>
      </nav>
    </div>
  );
};

export default Navbar;
