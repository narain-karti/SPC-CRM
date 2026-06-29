import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export function Navbar() {
  const location = useLocation();
  const isDarkNav = location.pathname !== "/" && location.pathname !== "/book" && location.pathname !== "/services" && location.pathname !== "/sports";
  
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });
  
  return (
    <div className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl">
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`flex items-center justify-between px-4 md:px-6 py-3 rounded-full border shadow-sm backdrop-blur-md transition-all duration-300 ${
          isScrolled || isDarkNav
            ? isDarkNav ? 'bg-[#111111]/90 border-white/10 shadow-lg' : 'bg-white/95 border-black/5 shadow-md' 
            : 'bg-white/60 border-black/5 shadow-sm'
        }`}
      >
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Stability Logo" className="h-8 md:h-9 w-auto object-contain" />
          <span className={`font-bold text-xl tracking-tight transition-colors ${isDarkNav ? 'text-white' : 'text-[#111111]'}`}>Stability.</span>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {[
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
            { name: "Services", path: "/services" },
            { name: "Sports", path: "/sports" },
            { name: "Testimonials", path: "/testimonials" }
          ].map((item) => (
            <Link 
              key={item.name} 
              to={item.path} 
              className={`text-[14px] font-medium transition-colors ${
                location.pathname === item.path 
                  ? (isDarkNav ? 'text-white' : 'text-[#111111]')
                  : (isDarkNav ? 'text-white/60 hover:text-white' : 'text-[#666666] hover:text-[#111111]')
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <Link to="/book" className={`hidden md:flex items-center justify-center px-5 py-2.5 rounded-full text-[14px] font-bold transition-all hover:scale-105 active:scale-95 ${isDarkNav ? 'bg-white text-[#111111] hover:bg-[#F6C945]' : 'bg-[#111111] text-white hover:bg-[#222222]'}`}>
            Book Appointment
          </Link>
          <button className={`lg:hidden w-10 h-10 flex items-center justify-center rounded-full transition-colors ${isDarkNav ? 'bg-white/10 text-white' : 'bg-black/5 text-[#111111]'}`}>
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </motion.nav>
    </div>
  );
}
