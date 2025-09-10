import './App.css'


import { useEffect } from 'react'
import Home from './assets/components/Home/Home'
import Navbar from './assets/components/Navbar/Navbar'
import Footer from './assets/components/Footer/Footer'
import Project from './assets/components/Project/Project'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import Optimal from './assets/components/Optimal/Optimal'
import Three from './assets/components/Optimal/Three'
import Cesium from './assets/components/Project/Cesium'
function App() {
  const router = createBrowserRouter([
{
  path: '/',
  element: <> <Home/> </>
},
{
  path: '/project',
  element: <> <Project/> </>
},
{
  path: '/optimal',
  element: <> <Optimal/> </>
},
{
  path: '/cesium',
  element: <> <Cesium/> </>
},
])
  return(

  <div className="app-container">
<RouterProvider router={router} />
  </div>
  );
}

export default App
