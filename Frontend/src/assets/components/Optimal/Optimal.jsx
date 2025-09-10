import React, { useState, useEffect } from 'react'
import Navbar from '../Navbar/Navbar'
import './Optimal.css'

const Optimal = () => {
  const [optimalwindows, setOptimalWindows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOptimal = async () => {
      try {
        const response = await fetch("https://atlasx.onrender.com/mission/optimal-windows")
        const data = await response.json()
        setOptimalWindows(data)
      } catch (error) {
        console.error("Error fetching mission:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOptimal()
  }, [])

  return (
    <div>
      <Navbar />
      <div className="optimal-section">
        <h1 className="h3tag">OPTIMAL WINDOWS FOR LAUNCH</h1>

        {loading ? (
          <div className="loading-space">
            <div className="planet-spinner"></div>
            <p className="loading-text">Please wait... Aligning with the stars</p>
          </div>
        ) : (
          <div className="data-container">
            {optimalwindows.map((data, index) => (
              <div className="data-entry" key={index}>
                <div className="data-row">
                  <span className="data-label">Date:</span>
                  <span className="data-value">{data.date}</span>
                </div>

                <div className="data-row">
                  <span className="data-label">Score:</span>
                  <span className="data-value">{data.score}</span>
                </div>

                <div className="data-row">
                  <span className="data-label">Atlas Distance AU:</span>
                  <span className="data-value">{data.atlas_distance_au}</span>
                </div>

                <div className="data-row">
                  <span className="data-label">Description:</span>
                  <span className="data-value">{data.description}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Optimal
