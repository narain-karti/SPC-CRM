import { Phone, Clock, MapPin } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="bg-[#111111] text-[#F6C945] py-3 px-4 md:px-8 text-xs md:text-sm font-medium flex flex-col sm:flex-row justify-between items-center gap-2 md:gap-4 text-center sm:text-left">
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#F6C945] animate-pulse shrink-0"></span>
          <span>Emergency Physiotherapy 24/7</span>
        </div>
      </div>
      <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
        <a href="tel:+919876543210" className="flex items-center gap-2 hover:text-white transition-colors">
          <Phone className="w-4 h-4" />
          <span>+91 98765 43210</span>
        </a>
        <div className="hidden md:flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>Mon-Sat: 8AM - 8PM</span>
        </div>
      </div>
    </div>
  );
}
