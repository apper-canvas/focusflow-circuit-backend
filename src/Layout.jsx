import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="h-screen overflow-hidden">
      <main className="h-full overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;