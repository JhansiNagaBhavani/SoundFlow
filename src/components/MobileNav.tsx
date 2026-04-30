import { NavLink, useLocation } from "react-router-dom";
import { Home, Search, Library, Clock, UserCircle, Heart, ListMusic } from "lucide-react";
import { motion } from "framer-motion";

const links = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/search", icon: Search, label: "Search" },
  { to: "/library", icon: Library, label: "Library" },
  { to: "/playlists", icon: ListMusic, label: "Lists" },
  { to: "/favorites", icon: Heart, label: "Liked" },
  { to: "/history", icon: Clock, label: "History" },
  { to: "/profile", icon: UserCircle, label: "Profile" },
];

const MobileNav = () => {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-border">
      <div className="flex justify-around py-2">
        {links.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <NavLink key={to} to={to} className="flex flex-col items-center gap-0.5 py-1 px-2">
              <div className="relative">
                {isActive && (
                  <motion.div
                    layoutId="mobile-active"
                    className="absolute -inset-1.5 bg-primary/20 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <Icon size={20} className={`relative z-10 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <span className={`text-[10px] ${isActive ? "text-primary font-medium" : "text-muted-foreground"}`}>
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
