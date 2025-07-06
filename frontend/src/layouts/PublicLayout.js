import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DashboardHeader from '../components/DashboardHeader';

const PublicLayout = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('users');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  const isDashboardRoute = location.pathname.startsWith('/dashboard');
  const hideHeaderFooterRoutes = ['/login', '/register'];

  const shouldHideHeaderFooter = hideHeaderFooterRoutes.includes(location.pathname);

  return (
    <>
      {isDashboardRoute && user ? (
        <DashboardHeader userType={user.accountType} userName={user.name} />
      ) : (
        !isDashboardRoute && !shouldHideHeaderFooter && <Header />
      )}

      <section>
        <Outlet />
      </section>

      {!isDashboardRoute && !shouldHideHeaderFooter && <Footer />}
    </>
  );
};

export default PublicLayout;
