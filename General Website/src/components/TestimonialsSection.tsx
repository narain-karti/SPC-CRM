import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Rajesh K.",
    role: "Marathon Runner",
    text: "Dr. Kanaga's sports rehab protocol got me back on the track in record time after a severe ACL tear. Her manual therapy techniques are world-class.",
    rating: 5
  },
  {
    name: "Priya M.",
    role: "Corporate Executive",
    text: "Chronic back pain made sitting impossible. Stability Physio Care diagnosed the root cause and provided a treatment plan that actually worked.",
    rating: 5
  },
  {
    name: "Suresh",
    role: "Post-Op Patient",
    text: "The home care service was a blessing after my knee replacement. The therapists are punctual, professional, and incredibly encouraging.",
    rating: 5
  }
];

export function TestimonialsSection() {
  return (
    <div className="px-4 md:px-12 lg:px-20 max-w-7xl mx-auto py-20 md:py-32">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-[36px] md:text-[56px] leading-[1.1] font-bold text-white tracking-tight mb-6">
          Patient <span className="text-[#F6C945]">Stories.</span>
        </h2>
        <p className="text-lg text-white/70">
          Don't just take our word for it. Read how we've helped others regain their movement and confidence.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {reviews.map((review, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[32px] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors relative"
          >
            <Quote className="absolute top-8 right-8 w-8 h-8 text-white/10" />
            <div className="flex text-[#F6C945] mb-6">
              {[...Array(review.rating)].map((_, j) => <Star key={j} className="w-5 h-5 fill-current" />)}
            </div>
            <p className="text-white/80 leading-relaxed mb-8">"{review.text}"</p>
            <div>
              <div className="font-bold text-white">{review.name}</div>
              <div className="text-sm text-[#F6C945]">{review.role}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
