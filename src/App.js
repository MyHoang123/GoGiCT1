import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {publicRoutes,mobileRoutes} from './Routes';
import { isBrowser } from 'react-device-detect';
import { useSelector } from 'react-redux';
function App() {
  const loading = useSelector((state) => state.products.Loading)
  console.log(loading)
  if (isBrowser) {
    return (
      <Router>
              <div className="App">
              <div className={loading ? 'loading_client unactive' : 'loading_client'}>
                  <div className='loading_container'>
                      <div className='loader'>
                      <div className='panWrapper'>
                          <div className='pan'>
                          <div className='food'></div>
                          <div className='panBase'></div>
                          <div className='panHandle'></div>
                          </div>
                          <div className='panShadow'></div>
                      </div>
                  </div>
              </div>
              </div>
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