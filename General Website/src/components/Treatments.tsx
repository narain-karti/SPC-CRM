import { motion } from "motion/react";
import { ArrowRight, Activity, Bone, Brain, Baby, HeartPulse, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  { name: "Orthopaedic", icon: <Bone className="w-6 h-6" /> },
  { name: "Sports Injury", icon: <Activity className="w-6 h-6" /> },
  { name: "Neurology", icon: <Brain className="w-6 h-6" /> },
  { name: "Pediatrics", icon: <Baby className="w-6 h-6" /> },
  { name: "Gynecology", icon: <HeartPulse className="w-6 h-6" /> },
  { name: "Geriatrics", icon: <UserCheck className="w-6 h-6" /> },
];

const painAreas = ["Neck Pain", "Back Pain", "Shoulder", "Knee", "Ankle", "Elbow"];

export function Treatments() {
  return (
    <div className="px-4 md:px-12 lg:px-20 max-w-7xl mx-auto py-20 md:py-32">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-[36px] md:text-[56px] leading-[1.1] font-bold text-[#111111] tracking-tight mb-6">
          Specialized <span className="text-[#F6C945]">Treatments.</span>
        </h2>
        <p className="text-lg text-[#666666]">
          Targeted therapies for specific conditions and pain areas, ensuring a personalized path to recovery.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
        {categories.map((cat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group p-8 rounded-[32px] bg-white border border-[#E9E9E9] hover:border-[#111111] transition-all cursor-pointer hover:shadow-xl flex items-center gap-6"
          >
            <div className="w-16 h-16 rounded-full bg-[#FAFAFA] group-hover:bg-[#F6C945] flex items-center justify-center text-[#111111] transition-colors">
              {cat.icon}
            </div>
            <h3 className="text-xl font-bold text-[#111111] group-hover:translate-x-2 transition-transform">{cat.name}</h3>
          </motion.div>
        ))}
      </div>

      <div className="bg-[#111111] rounded-[40px] p-10 md:p-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#F6C945]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-md">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Where does it hurt?</h3>
            <p className="text-white/60 mb-8">Select your pain area for a customized pain management plan.</p>
            <Link to="/book" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#F6C945] text-[#111111] font-bold hover:bg-[#E5B833] transition-all">
              Consult Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex flex-wrap gap-3 justify-center md:justify-end">
            {painAreas.map((area, i) => (
              <motion.button 
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white hover:text-black transition-all backdrop-blur-sm"
              >
                {area}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
