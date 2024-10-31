import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {publicRoutes,mobileRoutes} from '~/Routes';
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';
import React, { useState, useEffect } from 'react';
function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);
  if (isBrowser) {
    return (
      <Router>
              <div className="App">
                <Routes>
                {publicRoutes.map((route,index) => {
                    const Layout = route.layout;
                    const Page = route.component;
                    return <Route key = {index} path = {route.path} element = {
                    <Layout Children = {<Page />}>
                    </Layout>
                  } 
                  />
                })}
                </Routes>
              </div>
      </Router>
    );
  }
  else {
    return ( <Router> 
      <div className="App">
        <Routes>
        {mobileRoutes.map((route,index) => {
            const Layout = route.layout;
            const Page = route.component;
            return <Route key = {index} path = {route.path} element = {
            <Layout Children = {<Page />}>
            </Layout>
          } 
          />
        })}
        </Routes>
      </div>
    </Router>);
  }
}
export default App;