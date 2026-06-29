import { motion } from "motion/react";
import { Heart, Activity, Coffee, Shield } from "lucide-react";
import { Link } from "react-router-dom";

export function AssistedLiving() {
  const features = [
    { title: "Daily Physio", icon: <Activity className="w-5 h-5" /> },
    { title: "24x7 Care", icon: <Heart className="w-5 h-5" /> },
    { title: "Mobility Support", icon: <Shield className="w-5 h-5" /> },
    { title: "Wellness Focus", icon: <Coffee className="w-5 h-5" /> }
  ];

  return (
    <div className="bg-[#FAFAFA] rounded-[40px] md:rounded-[64px] py-20 md:py-32 overflow-hidden mx-4 my-8">
      <div className="px-4 md:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-[40px] overflow-hidden max-w-md mx-auto lg:mx-0">
               <img src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=2004&auto=format&fit=crop" alt="Elderly Care" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-8 -right-4 md:-right-8 bg-white p-6 md:p-8 rounded-[32px] shadow-xl border border-[#E9E9E9]">
              <div className="text-4xl font-black text-[#F6C945] mb-2">100%</div>
              <div className="font-bold text-[#111111]">Safe Living</div>
              <div className="text-sm text-[#666666]">Compassionate care</div>
            </div>
          </motion.div>

          <div>
            <h2 className="text-[36px] md:text-[56px] leading-[1.1] font-bold text-[#111111] tracking-tight mb-6">
              Assisted <span className="text-[#F6C945]">Living.</span>
            </h2>
            <p className="text-lg text-[#666666] mb-10 leading-relaxed">
              We provide a safe, supportive environment for post-operative recovery and geriatric care. Experience professional physiotherapy integrated into daily life.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-10">
              {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#E9E9E9]">
                  <div className="w-12 h-12 rounded-full bg-[#FAFAFA] text-[#111111] flex items-center justify-center shrink-0">
                    {feature.icon}
                  </div>
                  <span className="font-bold text-[#111111]">{feature.title}</span>
                </div>
              ))}
            </div>

            <Link to="/book" className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#111111] text-white font-bold hover:bg-[#222222] transition-colors">
              Enquire Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
