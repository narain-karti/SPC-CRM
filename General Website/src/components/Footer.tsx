import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-[#111111] text-white pt-20 pb-10 border-t border-white/10">
      <div className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img src="/logo.png" alt="Stability Logo" className="h-12 w-auto object-contain" />
              <span className="font-bold text-2xl tracking-tight text-white">Stability.</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-sm">
              Premium physiotherapy and sports rehabilitation center in Chennai, dedicated to restoring your movement and enhancing your life.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Quick Links</h4>
            <ul className="space-y-4">
              {[
                { name: 'Home', path: '/' }, 
                { name: 'About Dr Kanaga', path: '/about' }, 
                { name: 'Services', path: '/services' }, 
                { name: 'Sports Rehab', path: '/sports' }, 
                { name: 'Testimonials', path: '/testimonials' }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-white/60 hover:text-[#F6C945] transition-colors text-sm font-medium">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Branches</h4>
            <ul className="space-y-4">
              {['Kodambakkam', 'Pallikaranai', 'Sholinganallur', 'Nerkundram', 'Ponneri'].map((branch) => (
                <li key={branch}>
                  <Link to="/book" className="text-white/60 hover:text-white transition-colors text-sm font-medium">{branch}</Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Contact</h4>
            <ul className="space-y-4 text-sm font-medium text-white/60">
              <li>Emergency: <a href="tel:+919876543210" className="hover:text-white">+91 98765 43210</a></li>
              <li>General: <a href="tel:+919876543211" className="hover:text-white">+91 98765 43211</a></li>
              <li>Email: <a href="mailto:care@stabilityphysio.com" className="hover:text-white">care@stabilityphysio.com</a></li>
              <li className="pt-4">
                <div className="flex items-center gap-4">
                  {/* Social Icons placeholers */}
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F6C945] hover:text-black transition-colors cursor-pointer">In</div>
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F6C945] hover:text-black transition-colors cursor-pointer">Fb</div>
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F6C945] hover:text-black transition-colors cursor-pointer">Ig</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-white/40">
          <p>© {new Date().getFullYear()} Stability Physio Care. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
