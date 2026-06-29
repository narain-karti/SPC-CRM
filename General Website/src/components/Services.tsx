import { motion } from "motion/react";
import { ArrowUpRight, Activity, Bone, HeartPulse, Stethoscope, Dumbbell, UserCheck, Laptop, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const services = [
  {
    title: "Manual Therapy",
    description: "Hands-on techniques to mobilize joints and soft tissues.",
    icon: <Activity className="w-6 h-6" />,
    color: "bg-[#F6C945]",
    textColor: "text-[#111111]",
    path: "/services"
  },
  {
    title: "Sports Physiotherapy",
    description: "Specialized care for sports injuries and performance.",
    icon: <Dumbbell className="w-6 h-6" />,
    color: "bg-white",
    textColor: "text-[#111111]",
    path: "/sports"
  },
  {
    title: "Orthopaedic Rehab",
    description: "Post-surgery recovery and joint pain management.",
    icon: <Bone className="w-6 h-6" />,
    color: "bg-[#111111]",
    textColor: "text-white",
    path: "/services"
  },
  {
    title: "Advanced Therapies",
    description: "Dry needling, cupping, and K-taping solutions.",
    icon: <HeartPulse className="w-6 h-6" />,
    color: "bg-white",
    textColor: "text-[#111111]",
    path: "/services"
  },
  {
    title: "Home Care",
    description: "Professional physiotherapy at your doorstep.",
    icon: <Home className="w-6 h-6" />,
    color: "bg-white",
    textColor: "text-[#111111]",
    path: "/book"
  },
  {
    title: "Digital Consultation",
    description: "Expert advice online from anywhere in the world.",
    icon: <Laptop className="w-6 h-6" />,
    color: "bg-white",
    textColor: "text-[#111111]",
    path: "/book"
  }
];

export function Services() {
  const navigate = useNavigate();

  return (
    <div id="services" className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-6 md:gap-8">
        <div className="max-w-2xl">
          <h2 className="text-[36px] md:text-[56px] leading-[1.1] font-bold text-[#111111] tracking-tight mb-4 md:mb-6">
            Comprehensive <br />
            <span className="text-[#666666]">Treatment Plans.</span>
          </h2>
          <p className="text-base md:text-lg text-[#666666]">
            From sports injuries to post-operative care, we offer a wide range of specialized physiotherapy services designed to provide peace of mind in every aspect of your recovery.
          </p>
        </div>
        <Link to="/services" className="hidden md:flex px-8 py-4 rounded-full bg-[#F6C945] text-[#111111] text-[16px] font-bold hover:bg-[#E5B833] transition-all items-center justify-center whitespace-nowrap">
          View All Services
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <motion.div
            key={index}
            onClick={() => navigate(service.path)}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`group rounded-[32px] p-8 md:p-10 flex flex-col justify-between min-h-[320px] transition-all hover:scale-[1.02] cursor-pointer shadow-sm hover:shadow-xl border border-black/5 ${service.color} ${service.textColor}`}
          >
            <div>
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-8 
                ${service.color === 'bg-[#111111]' ? 'bg-white/10 text-white' : 
                  service.color === 'bg-[#F6C945]' ? 'bg-white/40 text-[#111111]' : 
                  'bg-[#FAFAFA] text-[#111111] group-hover:bg-[#F6C945]/20'}`}>
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
              <p className={`text-base leading-relaxed ${service.color === 'bg-[#111111]' ? 'text-white/70' : 'text-[#666666]'}`}>
                {service.description}
              </p>
            </div>
            
            <div className="mt-8 flex items-center gap-3 font-semibold text-sm group-hover:gap-5 transition-all">
              Learn more 
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors
                ${service.color === 'bg-[#111111]' ? 'border-white/20 group-hover:bg-white group-hover:text-black' : 'border-black/10 group-hover:bg-[#111111] group-hover:text-white group-hover:border-[#111111]'}`}>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <Link to="/services" className="md:hidden mt-10 w-full px-8 py-4 rounded-full bg-[#F6C945] text-[#111111] text-[16px] font-bold hover:bg-[#E5B833] transition-all flex items-center justify-center whitespace-nowrap">
         View All Services
      </Link>
    </div>
  );
}
