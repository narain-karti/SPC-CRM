import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AnnouncementBar } from "./components/AnnouncementBar";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Stats } from "./components/Stats";
import { Services } from "./components/Services";
import { AboutDoctor } from "./components/AboutDoctor";
import { Gallery } from "./components/Gallery";
import { Booking } from "./components/Booking";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";
import { Treatments } from "./components/Treatments";
import { SportsShowcase } from "./components/SportsShowcase";
import { AssistedLiving } from "./components/AssistedLiving";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { Branches } from "./components/Branches";
import { WhatsAppButton } from "./components/WhatsAppButton";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function Home() {
  return (
    <>
      <div className="px-2 pt-2 md:px-4 md:pt-4 pb-0 md:pb-0">
        {/* Main Hero Container - White */}
        <div className="bg-white rounded-[32px] md:rounded-[48px] lg:rounded-[64px] overflow-hidden relative shadow-2xl h-[calc(100dvh-8px)] md:h-[calc(100vh-16px)]">
          <Hero />
        </div>
      </div>
      
      <div className="px-4 md:px-8 py-8 md:py-12">
        <Stats />
      </div>

      <div className="px-2 md:px-4 pb-4 md:pb-8">
        <div className="bg-[#FAFAFA] rounded-[40px] md:rounded-[64px] overflow-hidden py-20 md:py-32">
          <Services />
        </div>
      </div>

      <div className="bg-white rounded-[40px] md:rounded-[64px] overflow-hidden mx-2 md:mx-4 my-8">
        <Treatments />
      </div>
      
      <div className="bg-[#FAFAFA] rounded-[40px] md:rounded-[64px] overflow-hidden mx-2 md:mx-4 my-8">
        <SportsShowcase />
      </div>

      <AssistedLiving />

      <div className="bg-[#111111] overflow-hidden">
         <AboutDoctor />
      </div>

      <div className="bg-[#111111] overflow-hidden">
        <TestimonialsSection />
      </div>

      <Branches />

      <div className="px-2 md:px-4 pb-4 md:pb-8 pt-8">
        <div className="bg-white rounded-[40px] md:rounded-[64px] overflow-hidden">
          <Gallery />
          <Booking />
        </div>
      </div>

      <CTA />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="bg-[#111111] min-h-screen font-sans selection:bg-[#F6C945] selection:text-black overflow-x-hidden">
        <AnnouncementBar />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<div className="pt-32 md:pt-40"><AboutDoctor /><CTA /></div>} />
          <Route path="/services" element={<div className="pt-32 md:pt-40 bg-white min-h-screen"><Services /><Treatments /><CTA /></div>} />
          <Route path="/sports" element={<div className="pt-32 md:pt-40 bg-[#FAFAFA] min-h-screen"><SportsShowcase /><Gallery /><CTA /></div>} />
          <Route path="/testimonials" element={<div className="pt-32 md:pt-40"><TestimonialsSection /><CTA /></div>} />
          <Route path="/book" element={<div className="pt-32 md:pt-40 bg-white min-h-screen rounded-b-[40px]"><Booking /></div>} />
        </Routes>
        <WhatsAppButton />
        <Footer />
      </div>
    </BrowserRouter>
  );
}
