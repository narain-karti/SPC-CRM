import { motion } from "motion/react";
import { Link } from "react-router-dom";

const works = [
  {
    title: "Football Rehab",
    category: "Sports Recovery",
    image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Post-Op Knee",
    category: "Orthopaedic",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Corporate Wellness",
    category: "Ergonomics",
    image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Spine Alignment",
    category: "Manual Therapy",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2069&auto=format&fit=crop"
  }
];

export function Gallery() {
  return (
    <div className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto py-20 md:py-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-6 md:gap-8">
        <div>
          <h2 className="text-[36px] md:text-[56px] leading-[1.1] font-bold text-[#111111] tracking-tight mb-4 md:mb-6">
            Recovery in <br />
            <span className="text-[#F6C945]">Motion.</span>
          </h2>
        </div>
        <Link to="/sports" className="hidden md:flex px-8 py-4 rounded-full border-2 border-[#111111] text-[#111111] text-[16px] font-bold hover:bg-[#111111] hover:text-white transition-all items-center justify-center whitespace-nowrap">
          View Full Gallery
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {works.map((work, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`group relative rounded-[32px] overflow-hidden ${index === 0 || index === 3 ? 'md:aspect-[4/3]' : 'md:aspect-[4/4]'} aspect-[4/3]`}
          >
            <img 
              src={work.image} 
              alt={work.title} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform">
              <div className="inline-block px-4 py-2 rounded-full bg-[#F6C945] text-[#111111] text-xs font-bold uppercase tracking-wider mb-4">
                {work.category}
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white">{work.title}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
