import { motion } from "motion/react";
import { Link } from "react-router-dom";

export function CTA() {
  return (
    <div className="px-4 md:px-12 lg:px-20 max-w-7xl mx-auto py-16 md:py-32">
      <div className="bg-[#111111] rounded-[32px] md:rounded-[80px] p-8 md:p-20 text-center relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#F6C945]/20 rounded-full blur-[60px] md:blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-white/5 rounded-full blur-[40px] md:blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[32px] md:text-[64px] leading-[1.1] font-bold text-white tracking-tight mb-6 md:mb-8"
          >
            Ready to live a <br className="hidden md:block" />
            <span className="text-[#F6C945]">pain-free</span> life?
          </motion.h2>
          
          <motion.p 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="text-lg md:text-xl text-white/70 mb-12 max-w-2xl mx-auto"
          >
            Book your consultation today and take the first step towards perfect movement and stability.
          </motion.p>
          
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/book" className="w-full sm:w-auto px-10 py-5 rounded-full bg-[#F6C945] text-[#111111] text-[18px] font-bold hover:bg-[#E5B833] transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(246,201,69,0.3)] flex items-center justify-center">
              Book Appointment Now
            </Link>
            <a href="tel:+919876543210" className="w-full sm:w-auto px-10 py-5 rounded-full bg-white/10 text-white text-[18px] font-bold hover:bg-white/20 transition-all backdrop-blur-sm flex items-center justify-center">
              Call Us: +91 98765 43210
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
