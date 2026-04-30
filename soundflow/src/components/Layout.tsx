import React from "react";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import PlayerBar from "./PlayerBar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto scrollbar-hide p-4 md:p-8">
        {children}
      </main>
      <PlayerBar />
      <MobileNav />
    </div>
  );
};

export default Layout;
