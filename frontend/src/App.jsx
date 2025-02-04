import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Navbar from './navbar.jsx';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) setIsLoggedIn(true);
  }, []);

  return (
    <>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', }}>
        <Navbar />
        <div className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
          <div className="row text-center">
            <div className="col-md-12">
              <h1>Welcome to Rolx</h1>
              <p>An E-Commerce platform with smooth user experience</p>
              {!isLoggedIn && (
                <div className="links btn-group" style={{ width: '60%' }}>
                  <NavLink to='/login' className='btn btn-primary'>Login</NavLink>
                  <NavLink to='/signup' className='btn btn-secondary'>Signup</NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="bg-dark text-white text-center p-3 pb-1 mt-auto">
          <p>
            <NavLink to="/" style={{ color: "ivory", borderRadius: "5px" }}>
              <i className="fas fa-medal"> Raghav Grover 2025 </i>
            </NavLink>
          </p>
        </div>
      </div>
    </>
  );
}

export default App;
