import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import LoadingModal from './components/common/LoadingModal';



function App() {
  const [currentView, setCurrentView] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);


  if (isLoggedIn) {
    return <Dashboard setIsLoggedIn={setIsLoggedIn}
                      setIsDashboardLoading={setIsDashboardLoading} />;

  }

  let ComponentToRender;
  let backgroundClass = '';

  if (currentView === 'login') {
    ComponentToRender = <Login 
                          setCurrentView={setCurrentView} 
                          setIsLoggedIn={setIsLoggedIn} 
                          setIsDashboardLoading={setIsDashboardLoading}
                        />;
                        backgroundClass = 'bg-login';
  } else if (currentView === 'register') {
    ComponentToRender = <Register 
                          setCurrentView={setCurrentView} 
                        />;
                        backgroundClass = 'bg-register';
  } else {
    ComponentToRender = <div>Halaman Tidak Ditemukan. <button onClick={() => setCurrentView('login')}>Ke Login</button></div>;
    backgroundClass = 'bg-login';
  }

  return (
    <>
    {isDashboardLoading && <LoadingModal />}
    <div className={`app-container ${backgroundClass}`}>
      {ComponentToRender}
    </div>
    </>
  );
}

export default App;