import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { MapPin, Calendar, Clock, User, CheckCircle2, Loader2 } from "lucide-react";

export function Booking() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("Pending");
  const [notes, setNotes] = useState("");
  
  const handleBooking = async () => {
    if (!patientName || !phone || !date || !time) {
      setError("Please fill in all required fields (Name, Phone, Date, Time)");
      return;
    }
    setError("");
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patient_name: patientName,
          phone,
          date,
          time,
          duration,
          type,
          status,
          notes
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to book session");
      }
      
      setStep(3);
    } catch (err) {
      setError("There was an error saving your booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div id="booking" className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto py-20 md:py-32">
       <div className="text-center mb-16">
          <h2 className="text-[40px] md:text-[56px] leading-[1.1] font-bold text-[#111111] tracking-tight mb-6">
            Book Your <span className="text-[#F6C945]">Session.</span>
          </h2>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto">
            Experience premium care at a branch near you. Easy two-step booking process.
          </p>
       </div>

       <div className="max-w-4xl mx-auto bg-white border border-[#E9E9E9] rounded-[40px] shadow-sm p-8 md:p-12 relative overflow-hidden">
          {/* Progress Bar */}
          <div className="flex items-center justify-between relative mb-12">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[#E9E9E9] -z-10 rounded-full"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#111111] -z-10 rounded-full transition-all duration-500"
              style={{ width: step === 1 ? '50%' : '100%' }}
            ></div>
            
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 1 ? 'bg-[#111111] text-white' : 'bg-[#E9E9E9] text-[#666666]'}`}>
              1
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 2 ? 'bg-[#111111] text-white' : 'bg-[#E9E9E9] text-[#666666]'}`}>
              2
            </div>
          </div>

          <div className="min-h-[400px]">
             <AnimatePresence mode="wait">
               {step === 1 && (
                 <motion.div
                   key="step1"
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: 20 }}
                   className="space-y-8"
                 >
                   <div className="grid md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                       <label className="font-semibold text-[#111111]">Patient Name *</label>
                       <input 
                         type="text" 
                         value={patientName}
                         onChange={(e) => setPatientName(e.target.value)}
                         placeholder="John Doe" 
                         className="w-full p-4 rounded-2xl border border-[#E9E9E9] focus:border-[#111111] outline-none transition-colors" 
                       />
                     </div>
                     <div className="space-y-2">
                       <label className="font-semibold text-[#111111]">Phone Number *</label>
                       <input 
                         type="tel" 
                         value={phone}
                         onChange={(e) => setPhone(e.target.value)}
                         placeholder="+91 98765 43210" 
                         className="w-full p-4 rounded-2xl border border-[#E9E9E9] focus:border-[#111111] outline-none transition-colors" 
                       />
                     </div>
                   </div>

                   <div className="pt-6 flex justify-end">
                      <button 
                        onClick={() => setStep(2)}
                        disabled={!patientName || !phone}
                        className="px-8 py-4 rounded-full bg-[#111111] text-white text-[16px] font-bold hover:bg-[#222222] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Continue to Details
                      </button>
                   </div>
                 </motion.div>
               )}

               {step === 2 && (
                 <motion.div
                   key="step2"
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: 20 }}
                   className="space-y-6"
                 >
                   <div className="grid md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                       <label className="font-semibold text-[#111111]">Date *</label>
                       <input 
                         type="date" 
                         value={date}
                         onChange={(e) => setDate(e.target.value)}
                         className="w-full p-4 rounded-2xl border border-[#E9E9E9] focus:border-[#111111] outline-none transition-colors" 
                       />
                     </div>
                     <div className="space-y-2">
                       <label className="font-semibold text-[#111111]">Time *</label>
                       <input 
                         type="time" 
                         value={time}
                         onChange={(e) => setTime(e.target.value)}
                         className="w-full p-4 rounded-2xl border border-[#E9E9E9] focus:border-[#111111] outline-none transition-colors" 
                       />
                     </div>
                     <div className="space-y-2">
                       <label className="font-semibold text-[#111111]">Duration (minutes)</label>
                       <input 
                         type="number" 
                         value={duration}
                         onChange={(e) => setDuration(e.target.value)}
                         placeholder="60" 
                         className="w-full p-4 rounded-2xl border border-[#E9E9E9] focus:border-[#111111] outline-none transition-colors" 
                       />
                     </div>
                     <div className="space-y-2">
                       <label className="font-semibold text-[#111111]">Type</label>
                       <input 
                         type="text" 
                         value={type}
                         onChange={(e) => setType(e.target.value)}
                         placeholder="Consultation" 
                         className="w-full p-4 rounded-2xl border border-[#E9E9E9] focus:border-[#111111] outline-none transition-colors" 
                       />
                     </div>
                     <div className="space-y-2">
                       <label className="font-semibold text-[#111111]">Status</label>
                       <input 
                         type="text" 
                         value={status}
                         onChange={(e) => setStatus(e.target.value)}
                         placeholder="Pending" 
                         className="w-full p-4 rounded-2xl border border-[#E9E9E9] focus:border-[#111111] outline-none transition-colors" 
                       />
                     </div>
                     <div className="space-y-2 md:col-span-2">
                       <label className="font-semibold text-[#111111]">Notes</label>
                       <textarea 
                         value={notes}
                         onChange={(e) => setNotes(e.target.value)}
                         placeholder="Any additional notes..." 
                         rows={3} 
                         className="w-full p-4 rounded-2xl border border-[#E9E9E9] focus:border-[#111111] outline-none transition-colors resize-none"
                       ></textarea>
                     </div>
                   </div>

                   {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

                   <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <button 
                        onClick={() => setStep(1)}
                        className="w-full sm:w-auto px-8 py-4 rounded-full border border-[#E9E9E9] text-[#111111] text-[16px] font-bold hover:bg-[#FAFAFA] transition-all"
                      >
                        Back
                      </button>
                      <button 
                        onClick={handleBooking}
                        disabled={isSubmitting}
                        className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#F6C945] text-[#111111] text-[16px] font-bold hover:bg-[#E5B833] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>Processing <Loader2 className="w-5 h-5 animate-spin" /></>
                        ) : (
                          <>Confirm Booking <CheckCircle2 className="w-5 h-5" /></>
                        )}
                      </button>
                   </div>
                 </motion.div>
               )}

               {step === 3 && (
                 <motion.div
                   key="step3"
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="flex flex-col items-center justify-center text-center py-12"
                 >
                   <div className="w-20 h-20 rounded-full bg-green-100 text-green-500 flex items-center justify-center mb-6">
                     <CheckCircle2 className="w-10 h-10" />
                   </div>
                   <h3 className="text-3xl font-bold text-[#111111] mb-4">Booking Confirmed!</h3>
                   <p className="text-[#666666] max-w-md mx-auto mb-8">
                     Thank you for choosing Stability Physio Care. We have sent the confirmation details to your phone via SMS and WhatsApp.
                   </p>
                   <button 
                      onClick={() => setStep(1)}
                      className="px-8 py-4 rounded-full border border-[#E9E9E9] text-[#111111] text-[16px] font-bold hover:bg-[#FAFAFA] transition-all"
                   >
                     Book Another Session
                   </button>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
       </div>
    </div>
  );
}
