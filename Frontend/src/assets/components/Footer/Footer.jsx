import React from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../images/logo.png'
import './Footer.css'

function Footer() {
  return (
<div className="footercontainer">

<div className="footerdiv">
<div className="footerbrand">
<NavLink to="/"> <img src={logo} className="logoimg" alt="logo" /></NavLink>
</div>

<div className="navdiv">
  
<div className="footernavgroup">
  <NavLink to="/"  className="footer-item" >Home</NavLink>
  <NavLink   to="/project" className="footer-item" id="project" ><span>Run Simulation </span></NavLink>
<NavLink   to="/optimal" className="footer-item" id="optimal" > <span>Optimal Windows </span></NavLink>
</div>

</div>

</div>

<div className="cptext-div">
<h4 className='copyright-text'>Copyright © 2025 ATLAX</h4>
</div>


</div>
  )
}

export default Footer

