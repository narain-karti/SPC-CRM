import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";

async function startServer() {
  const app = express();
  const PORT = 3001;

  // Parse JSON bodies
  app.use(express.json());

  // Initialize Supabase Client
  // Using environment variables, or fallback to the provided values from the prompt for testing
  const supabaseUrl = process.env.SUPABASE_URL || "https://fhtpwhnmtrssbwatvbco.supabase.co";
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZodHB3aG5tdHJzc2J3YXR2YmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MzkyMTYsImV4cCI6MjA5ODMxNTIxNn0.-nL2XEn3jdoXN05H_wwdmPG3EpVf5aXA2m7aN_tplZE";
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Create Booking
  app.post("/api/bookings", async (req, res) => {
    try {
      const { 
        patient_name, 
        phone,
        date, 
        time, 
        duration, 
        type, 
        notes 
      } = req.body;

      if (!patient_name || !phone || !date || !time) {
        return res.status(400).json({ error: "Missing required fields (patient_name, phone, date, time)" });
      }

      // We format the time slightly if it's missing seconds (Supabase usually expects full time string)
      let timeStr = time;
      if (timeStr && timeStr.length === 5) {
        timeStr = `${timeStr}:00`;
      }

      const validTypes = ['consultation', 'therapy', 'follow_up', 'assessment'];
      const finalType = type && validTypes.includes(type.toLowerCase()) ? type.toLowerCase() : 'consultation';

      // Call the RPC function to bypass RLS securely and auto-assign organization/branch/therapist
      const { data, error } = await supabase.rpc('create_website_booking', {
        p_patient_name: patient_name,
        p_phone: phone,
        p_date: date,
        p_time: timeStr,
        p_duration: duration ? parseInt(duration) : 30,
        p_type: finalType,
        p_notes: notes || ''
      });

      if (error) {
        console.error("Supabase RPC error details:", JSON.stringify(error));
        return res.status(500).json({ 
          error: "Database error occurred while saving the booking.",
          details: error 
        });
      }

      if (data && data.success === false) {
        console.error("RPC returned logic error:", data.error);
        return res.status(400).json({ error: data.error });
      }

      res.status(201).json({ success: true });
    } catch (err) {
      console.error("Server error during booking:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
