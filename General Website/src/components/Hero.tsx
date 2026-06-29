import { motion } from "motion/react";
import { ArrowRight, Star, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <div className="relative pt-24 md:pt-28 lg:pt-32 pb-4 px-4 md:px-12 lg:px-20 max-w-7xl mx-auto flex flex-col justify-center h-full">
      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-10 w-64 h-64 bg-[#F6C945]/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-[#F6C945]/10 rounded-full blur-3xl -z-10"></div>
      
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center h-full">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <h1 className="text-[36px] md:text-[48px] lg:text-[64px] leading-[1.05] font-bold text-[#111111] tracking-[-0.03em] mb-4 md:mb-6 mt-4 lg:mt-0">
            Move Better.<br />
            Recover Faster.<br />
            <span className="relative inline-block">
              Live Pain-Free.
              <svg className="absolute w-full h-2 md:h-3 -bottom-1 left-0 text-[#F6C945] -z-10" viewBox="0 0 100 20" preserveAspectRatio="none">
                 <path d="M0,10 Q50,20 100,10" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          
          <p className="text-base md:text-lg leading-relaxed text-[#666666] mb-8 max-w-xl">
            Expert physiotherapy and sports rehab to help you regain movement with confidence.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link to="/book" className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 rounded-full bg-[#F6C945] text-[#111111] text-[15px] font-bold hover:bg-[#E5B833] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
              Book Appointment
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/services" className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 rounded-full bg-white border border-[#E9E9E9] text-[#111111] text-[15px] font-bold hover:bg-[#FAFAFA] hover:border-[#111111] transition-all flex items-center justify-center">
              Explore Treatments
            </Link>
          </div>
          
          <div className="mt-8 flex items-center gap-4 text-sm font-medium text-[#666666]">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Patient" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              <div className="flex text-[#F6C945]">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 md:w-4 md:h-4 fill-current" />)}
              </div>
              <span className="text-xs md:text-sm">Trusted by 25k+ patients</span>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex items-center justify-center w-full mt-4 lg:mt-0 h-full max-h-[50vh] lg:max-h-none"
        >
          {/* Main Image Container */}
          <div className="relative w-full aspect-[4/5] max-w-[240px] sm:max-w-[280px] md:max-w-[360px] mx-auto">
             <div className="absolute inset-0 bg-[#F6C945] rounded-full translate-x-2 translate-y-2 md:translate-x-4 md:translate-y-4"></div>
             <div className="absolute inset-0 rounded-full overflow-hidden border-4 md:border-8 border-white bg-gray-100 relative">
               {/* Stand-in for doctor image */}
               <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=1000" alt="Dr. Kanaga Lakshmi" referrerPolicy="no-referrer" className="w-full h-full object-cover object-top" />
             </div>
             
             {/* Floating Badges */}
             <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-4 -left-4 md:top-10 md:-left-10 bg-white p-3 md:p-4 rounded-2xl shadow-xl flex items-center gap-2 md:gap-3 border border-black/5"
             >
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                  <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div>
                  <div className="font-bold text-[#111111] text-sm md:text-base">15+ Years</div>
                  <div className="text-[10px] md:text-xs text-[#666666]">Experience</div>
                </div>
             </motion.div>
             
             <motion.div 
               animate={{ y: [0, 15, 0] }}
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
               className="absolute bottom-10 -right-4 md:bottom-20 md:-right-8 bg-white p-3 md:p-4 rounded-2xl shadow-xl flex flex-col items-center gap-1 border border-black/5"
             >
                <div className="text-2xl md:text-3xl font-black text-[#F6C945]">27+</div>
                <div className="text-[10px] md:text-xs font-semibold text-[#111111]">Sports Clubs</div>
                <div className="text-[8px] md:text-[10px] text-[#666666]">Associated</div>
             </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
