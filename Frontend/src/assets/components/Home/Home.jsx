import React from 'react'

import './Home.css'
import Navbar  from '../Navbar/Navbar'
import bg from '../images/bg.mp4'
import { useEffect,useRef } from 'react'
import cardimg1 from '../images/aithreat.png'
import promoimage from '../images/promo-image.png'
import Footer from '../Footer/Footer'
import Spline from '@splinetool/react-spline';
import cards1 from '../images/cards1.png'
import cards2 from '../images/cards2.png'
import cards3 from '../images/cards3.png'

function Home() {

  
  return (
<>
< Navbar />
<div className="home-container">

<div className="hero-section">
{/* <video className="hero-background-video" autoPlay loop muted>
<source src={bgvideo} type="video/mp4" />
</video> */}

<Spline scene="https://prod.spline.design/8Dz4sSlBUZHJ19vy/scene.splinecode" />


<div className="hero-overlay">
<h1 className="hero-title">ATLASX</h1>
<h3 className="hero-subtitle">Mapping the Unknown, Beyond the Stars</h3>
</div>

</div>


<div className="cardcontainer">
<div className="cards">
  <img src={cards1} alt="Launch Prediction" className="cardimg" />
  <h1>Optimal Launch Window</h1>
  <p>Find the most efficient timeframes for a smooth and successful mission launch.</p>
</div>

<div className="cards">
  <img src={cards2} alt="Mission Planning" className="cardimg" />
  <h1>Mission Planning</h1>
  <p>Design and optimize each mission phase from launch to navigation.</p>
</div>

<div className="cards">
  <img src={cards3} alt="Atlas Tracking" className="cardimg" />
  <h1>3I-ATLAS Tracking</h1>
  <p>Monitor the spacecraft’s real-time position with live trajectory updates.</p>
</div>


<div className="cards">
  <img src="https://framerusercontent.com/images/6l9XB9uCbOA51jpRzSgokQmWw.svg" alt="Intercept Mission" className="cardimg" />
  <h1>Intercept Missions</h1>
  <p>Plan precision maneuvers to intercept objects with accuracy.</p>
</div>


</div>



<div className="promotional-image-container">


<div
  className="parallax-strip"
  style={{ backgroundImage: `url(${promoimage})` }}>
</div>

<div className="promo-text-container">


<Spline scene="https://prod.spline.design/0WN2IO3a2kghAZEP/scene.splinecode" style={{ pointerEvents: 'none' }} />

<div className="hero-overlay">
<h3 className="overlay-text">Mapping the Unknown, Beyond the Stars</h3>
</div>
</div>


</div>




</div>

<Footer/>
</>
  )
}

export default Home
