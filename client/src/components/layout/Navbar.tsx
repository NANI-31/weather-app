import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, History, Settings, Cloud, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/history", label: "History", icon: History },
  { path: "/settings", label: "Settings", icon: Settings },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsOpen(false), 0);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, isOpen]);

  return (
    <>
      {/* Spacer to prevent content overlap since navbar is fixed/absolute - optional if we want overlap, but better for layout stability */}
      {/* We'll handle layout spacing in Layout.tsx or allow overlap styles if preferred. 
          For a true glass effect, we want overlap, so we won't put a block spacer here. */}

      <div className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-center pointer-events-none">
        <nav className="pointer-events-auto w-full max-w-7xl bg-card/60 backdrop-blur-xl border border-white/10 shadow-lg rounded-2xl px-4 py-3 flex items-center justify-between transition-all duration-300">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
              <Cloud className="w-6 h-6 text-primary" />
            </div>
            <span className="text-lg font-bold font-space-grotesk bg-linear-to-r from-primary to-orange-400 bg-clip-text text-transparent">
              WeatherPro
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 bg-secondary/5 p-1 rounded-xl border border-white/5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 flex items-center gap-2 ${
                    isActive
                      ? "text-white"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-primary rounded-lg shadow-sm"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl bg-secondary/5 hover:bg-secondary/10 text-foreground transition-colors border border-white/5"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-4 top-24 z-50 md:hidden bg-card/90 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-2xl p-4 overflow-hidden"
            >
              <div className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`p-4 rounded-xl flex items-center gap-4 transition-all ${
                        isActive
                          ? "bg-primary text-white shadow-lg shadow-primary/20"
                          : "bg-secondary/5 hover:bg-secondary/10 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                      {isActive && (
                        <div className="ml-auto w-2 h-2 rounded-full bg-white" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
