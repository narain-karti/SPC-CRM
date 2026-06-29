import { motion } from "motion/react";
import { ArrowRight, Trophy, Users, Shield } from "lucide-react";

const stats = [
  { label: "Elite Athletes", value: "500+" },
  { label: "Clubs Associated", value: "27" },
  { label: "Tournaments", value: "100+" }
];

export function SportsShowcase() {
  return (
    <div className="px-4 md:px-12 lg:px-20 max-w-7xl mx-auto py-20 md:py-32">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#111111] text-white mb-8 text-sm font-bold">
            <span className="text-[#F6C945]"><Trophy className="w-4 h-4" /></span>
            Sports Excellence
          </div>
          <h2 className="text-[36px] md:text-[56px] leading-[1.1] font-bold text-[#111111] tracking-tight mb-6">
            Peak Performance.<br />
            <span className="text-[#666666]">Zero Limits.</span>
          </h2>
          <p className="text-lg text-[#666666] mb-10 leading-relaxed">
            Trusted by national football teams, corporate leagues, and elite athletes. We specialize in rapid recovery and performance enhancement.
          </p>
          
          <div className="flex gap-8 mb-12">
            {stats.map((stat, i) => (
              <div key={i}>
                <div className="text-3xl font-black text-[#F6C945] mb-1">{stat.value}</div>
                <div className="text-sm font-semibold text-[#111111] uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
             {["Football", "Cricket", "Volleyball", "Corporate Events", "Movie Sets"].map((tag, i) => (
                <div key={i} className="px-5 py-2.5 rounded-full border border-[#E9E9E9] text-[#111111] text-sm font-semibold hover:border-[#111111] cursor-pointer transition-colors">
                  {tag}
                </div>
             ))}
          </div>
        </div>
        
        <div className="relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="aspect-[4/5] rounded-[40px] overflow-hidden relative"
          >
            <img src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop" alt="Sports Rehab" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            
            <div className="absolute bottom-10 left-10 right-10 text-white">
              <h3 className="text-2xl font-bold mb-2">On-Field Support</h3>
              <p className="text-white/80 text-sm">Immediate care and injury prevention strategies for teams during tournaments.</p>
            </div>
          </motion.div>
          
          <motion.div 
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.3 }}
             className="absolute top-10 -left-10 bg-white p-6 rounded-3xl shadow-2xl border border-black/5 max-w-[200px]"
          >
             <div className="w-12 h-12 rounded-full bg-[#111111] text-[#F6C945] flex items-center justify-center mb-4">
               <Shield className="w-6 h-6" />
             </div>
             <div className="font-bold text-[#111111] mb-1">Injury Prevention</div>
             <p className="text-xs text-[#666666]">Biomechanics & screening</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
