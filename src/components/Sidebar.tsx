import { NavLink, useLocation } from "react-router-dom";
import { Home, Search, Library, Clock, UserCircle, Heart, ListMusic } from "lucide-react";
import { motion } from "framer-motion";

const links = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/search", icon: Search, label: "Search" },
  { to: "/library", icon: Library, label: "Library" },
  { to: "/playlists", icon: ListMusic, label: "Playlists" },
  { to: "/favorites", icon: Heart, label: "Liked Songs" },
  { to: "/history", icon: Clock, label: "History" },
  { to: "/profile", icon: UserCircle, label: "Profile" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-60 bg-sidebar border-r border-border h-full py-6 px-4 gap-2">
      <nav className="flex flex-col gap-1">
        {links.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <NavLink key={to} to={to} className="relative">
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-sidebar-accent rounded-lg"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <div className={`relative z-10 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "text-sidebar-accent-foreground" : "text-sidebar-foreground hover:text-sidebar-accent-foreground"
              }`}>
                <Icon size={18} />
                {label}
              </div>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
