import './Navbar.css'
import logo from '../images/logo.png'
import { NavLink } from 'react-router-dom'



const Navbar = () => {
  return (
<div className="header">
<nav>
<NavLink to="/"> <img src={logo} className="logoimg" alt="logo" /></NavLink>

<div className='menu'>
<NavLink to="/"  className="menu-item" ><span>Home</span></NavLink>
<NavLink   to="/project" className="menu-item" id="project" ><span>Run Simulation </span></NavLink>
<NavLink   to="/optimal" className="menu-item" id="project" > <span>Optimal Windows </span></NavLink>
</div>

</nav>

</div>
  )
}

export default Navbar