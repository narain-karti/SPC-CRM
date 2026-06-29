import { motion } from "motion/react";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";

export function AboutDoctor() {
  return (
    <div id="about" className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto py-20 md:py-32">
      <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-[400px] md:max-w-full mx-auto"
        >
          <div className="w-full aspect-[4/5] rounded-[32px] md:rounded-[40px] overflow-hidden bg-white/5 relative">
            <img 
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=1000" 
              alt="Dr Kanaga Lakshmi" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="absolute -bottom-6 left-4 right-4 md:left-auto md:right-[-3rem] md:bottom-10 bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-8 shadow-2xl border border-[#E9E9E9] md:max-w-[280px]"
          >
            <div className="font-bold text-lg md:text-xl mb-1 text-[#111111]">Dr Kanaga Lakshmi</div>
            <div className="text-[#F6C945] font-semibold text-xs md:text-sm mb-3 md:mb-4">Chief Physiotherapist</div>
            <p className="text-xs md:text-sm text-[#666666] leading-relaxed">
              Specialist in sports injuries and manual therapy with a track record of treating elite athletes.
            </p>
          </motion.div>
          
          <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-[#F6C945] hover:text-black transition-colors hover:scale-110">
            <Play className="w-6 h-6 md:w-8 md:h-8 ml-1" />
          </button>
        </motion.div>
        
        <div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[36px] md:text-[56px] leading-[1.1] font-bold text-white tracking-tight mb-6 md:mb-8 mt-12 md:mt-0"
          >
            Meet the Expert Behind the <span className="text-[#F6C945]">Recovery.</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/70 mb-12 leading-relaxed"
          >
            With over 15 years of clinical excellence, Dr. Kanaga Lakshmi has redefined rehabilitation. Her evidence-based approach and advanced manual therapy techniques have helped thousands recover faster and return to peak performance.
          </motion.p>
          
          <div className="space-y-8">
            {[
              { year: "2023", title: "Indian Women's League", desc: "Official Physiotherapist for senior national football." },
              { year: "2021", title: "Corporate Sports Tournaments", desc: "Led recovery for 300+ major corporate sports events." },
              { year: "2019", title: "Celebrity Rehab", desc: "On-set physiotherapist for movies like Bigil & Jawan." }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + (index * 0.1) }}
                className="flex gap-6 items-start group"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#F6C945] font-bold shrink-0 group-hover:bg-[#F6C945] group-hover:text-black transition-colors">
                  {item.year}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.5 }}
          >
            <Link to="/about" className="mt-12 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-[#111111] text-[16px] font-bold hover:bg-[#F6C945] transition-all justify-center">
              Read Full Profile
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
