import { Outlet } from "react-router-dom";
import { Nav } from "./nav/nav";

const Layout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
