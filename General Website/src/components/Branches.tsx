import { motion } from "motion/react";
import { MapPin, Phone, MessageCircle, Navigation } from "lucide-react";

const branches = [
  { name: "Kodambakkam", address: "123 Main Road, Kodambakkam, Chennai 600024" },
  { name: "Pallikaranai", address: "45 OMR Link Road, Pallikaranai, Chennai 600100" },
  { name: "Sholinganallur", address: "IT Expressway, Sholinganallur, Chennai 600119" },
  { name: "Nerkundram", address: "78 High Road, Nerkundram, Chennai 600107" },
  { name: "Ponneri", address: "Bazaar Street, Ponneri 601204" }
];

export function Branches() {
  return (
    <div className="bg-white rounded-[40px] md:rounded-[64px] py-20 md:py-32 overflow-hidden mx-4 my-8">
      <div className="px-4 md:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-[36px] md:text-[56px] leading-[1.1] font-bold text-[#111111] tracking-tight mb-6">
            Find Us <span className="text-[#F6C945]">Near You.</span>
          </h2>
          <p className="text-lg text-[#666666]">
            With five world-class clinics across Chennai, expert physiotherapy is never far away.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[32px] border border-[#E9E9E9] hover:border-[#111111] hover:shadow-xl transition-all group"
            >
              <div className="w-14 h-14 rounded-full bg-[#FAFAFA] group-hover:bg-[#F6C945] flex items-center justify-center text-[#111111] mb-6 transition-colors">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[#111111] mb-3">{branch.name}</h3>
              <p className="text-[#666666] mb-8 min-h-[48px]">{branch.address}</p>
              
              <div className="flex flex-col gap-3">
                <button className="w-full py-3 rounded-full border border-[#E9E9E9] text-[#111111] font-bold hover:bg-[#FAFAFA] flex items-center justify-center gap-2 transition-colors">
                  <Navigation className="w-4 h-4" /> Directions
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button className="py-3 rounded-full bg-[#111111] text-white font-bold hover:bg-[#222222] flex items-center justify-center gap-2 transition-colors">
                    <Phone className="w-4 h-4" /> Call
                  </button>
                  <button className="py-3 rounded-full bg-green-500 text-white font-bold hover:bg-green-600 flex items-center justify-center gap-2 transition-colors">
                    <MessageCircle className="w-4 h-4" /> WA
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
