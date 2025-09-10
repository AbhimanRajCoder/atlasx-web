import React from 'react'
import Navbar  from '../Navbar/Navbar'
import { useState,useRef,useEffect } from 'react'
import './Project.css'
import { useHref } from 'react-router'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";



function Project() {



const [logs,setLogs] = useState([])
const [error, setError] = useState(null);

const [projectdata,setData] = useState([])
const [dataerror, setDataerror] = useState(null)

// optimal windows data start

const [status,setStatus] = useState([])


// optimal windows data end


  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch("https://atlasx.onrender.com/atlas/status");
        const data = await response.json();
        setStatus(data)
      } catch (error) {
        console.error("Error fetching Status:", error);
      }
    };

    fetchStatus();
  }, []);


// Mission planning variable
const [launchDate, setLaunchDate] = useState();
const [propulsion, setPropulsion] = useState("chemical");
const [budget,setBudget] = useState(1000);
const [weight,setWeight] = useState(1000);
const [missionData, setMissionData] = useState(null);
const [trajectorydata,setTrajectorydata] = useState();


// Mission planning

const fetchMission = async (launchDate, propulsion, mass, budget) => {
const isoLaunchDate = new Date(launchDate).toISOString();

  try {
    const missionPayload = {
      launch_date: isoLaunchDate,     
      propulsion_type: propulsion, 
      spacecraft_mass_kg: mass,    
      fuel_budget_kg: budget       
    };

    const missionresponse = await fetch("https://atlasx.onrender.com/mission/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(missionPayload)
    });
    const missiondata = await missionresponse.json();
    setMissionData(missiondata);
setTrajectorydata(missiondata.trajectory);

  } catch (err) {
    console.log("Error:", err);
  }
};



const planMission = () => {

if(!launchDate){
  alert("Please Choose Date")
}
else{
    fetchMission(launchDate, propulsion, weight, budget);
}
} 


  return (

<>
<Navbar/>



<div>
<hr className='hrtag' />
<div className="statusdiv">
<h1>3I ATLAS STATUS <button className='live'>Live</button></h1>
  <div className="data-status">
    <span className="data-label2">Velocity:</span>
    <span className="data-value2">{status?.velocity}</span>
  </div>
    <div className="data-status">
    <span className="data-label2">Distance from Earth(IN AU) :</span>
    <span className="data-value2">{status?.dist_from_earth_au}</span>
  </div>
    <div className="data-status">
    <span className="data-label2">Distance from Sun (IN AU) :</span>
    <span className="data-value2">{status?.dist_from_sun_au}</span>
  </div>
    <div className="data-status">
    <span className="data-label2">Position (x, y, z):</span>
    <span className="data-value2">{status?.position?.x}, {status?.position?.y}, {status?.position?.z}</span>
  </div>
</div>
<hr className='hrtag' />



<div className="launchdiv">

  <h1 className='h1tag'>Launching the Space-Craft</h1>

  <div className="launchdate-section">
    <h5>Launch Date</h5>
    <input type="date" className="date" name="date" onChange={(e) => setLaunchDate(e.target.value)}
/>
  </div>

  <div className="props-section">
    <h5>Propulsion System</h5>
    <select className="form-control" name="propulsion" defaultValue="chemical" onChange={(e) => setPropulsion(e.target.value)}>
      <option value="chemical">Chemical Propulsion System</option>
      <option value="electric">Electric Propulsion System</option>
      <option value="nuclear">Nuclear Propulsion System</option>
      <option value="solar_sail">Solar Sail Propulsion System</option>
    </select>
  </div>

  <div className="time-section">
    <h5>Space-Craft Mass</h5>
    <input 
      type="range" 
      id="mass" 
      className="toggler" 
      name="mass" 
      min="1000" 
      max="20000" 
      value={weight}
      onChange={(e) => setWeight(e.target.value)} 
    />
    <h4>Weight: <span id="weight">{weight} KG</span></h4>
  </div>

  <div className="time-section">
    <h5> Fuel Weight  </h5>
    <input 
      type="range" 
      id="budget" 
      className="toggler" 
      name="budget" 
      min="0" 
      max="30000"
      value={budget}
      onChange={(e) => setBudget(e.target.value)} 
    />
    <h4>Mass: <span id="budget-value">{budget} KG</span></h4>
  </div>

  <button className="chase-btn" onClick={planMission} >CLICK TO CHASE</button>

</div>

<hr className='hrtag' />






<div className='project-container'>


<div className="trajectorydiv">
  <h4 className="trajectory-title">Trajectory</h4>

  {trajectorydata && trajectorydata.length > 0 ? (
    <>
      <div className="chart-container">
        <h5 className="chart-heading distance-heading">Distance vs Time</h5>
        <LineChart width={600} height={300} data={trajectorydata}>
          <Line type="monotone" dataKey="distance" stroke="#00C49F" strokeWidth={2} dot={false} />
          <CartesianGrid stroke="#444" strokeDasharray="5 5" />
          <XAxis dataKey="time" label={{ value: 'Time (s)', position: 'insideBottom', offset: -5, fill: '#aaa' }} />
          <YAxis label={{ value: 'Distance (km)', angle: -90, position: 'insideLeft', fill: '#aaa' }} />
          <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff' }} />
        </LineChart>
      </div>

      <div className="chart-container">
        <h5 className="chart-heading velocity-heading">Velocity vs Time</h5>
        <LineChart width={600} height={300} data={trajectorydata}>
          <Line type="monotone" dataKey="velocity" stroke="#FF69B4" strokeWidth={2} dot={false} />
          <CartesianGrid stroke="#444" strokeDasharray="5 5" />
          <XAxis dataKey="time" label={{ value: 'Time (s)', position: 'insideBottom', offset: -5, fill: '#aaa' }} />
          <YAxis label={{ value: 'Velocity (km/s)', angle: -90, position: 'insideLeft', fill: '#aaa' }} />
          <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff' }} />
        </LineChart>
      </div>
    </>
  ) : (
    <p className="no-data">Start Mission to See Trajectory Data.</p>
  )}
</div>






<div className="missiondiv">
  {missionData ? (
    <div className="mission-content">
      <h4 className="mission-title">Mission Results</h4>
      <hr className='hrtag' />

      <p className="mission-item"><strong>Δv Required:</strong> {missionData.delta_v_required} km/s</p>
      <p className="mission-item"><strong>Fuel Efficiency Score:</strong> {missionData.fuel_efficiency_Score}</p>
      <p className="mission-item"><strong>Intercept Distance:</strong> {missionData.intercept_distance_km} km</p>
      <p className="mission-item"><strong>Travel Time:</strong> {missionData.travel_time} sec</p>
      <p className="mission-item"><strong>Success:</strong> {missionData.success ? "Yes" : "No"}</p>
      <p className="mission-item"><strong>Message:</strong> {missionData.message}</p>
    </div>
  ) : (
    <p className="no-mission">No mission data yet. Run a mission to see results.</p>
  )}
</div>


</div> 

</div>



</>
  )
}

export default Project
