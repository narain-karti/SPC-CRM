import type {
  Branch, Patient, Therapist, Employee, Appointment, Invoice, Lead,
  AttendanceRecord, NotificationItem, TimelineEvent, MedicalRecord, KPIData
} from "./types";

// Chennai branches for Stability Physio Care
export const branches: Branch[] = [
  { id: "br1", name: "Kodambakkam", location: "Arcot Road", city: "Chennai", phone: "+91 44 4567 8901", revenue: 1845000, patients: 342, staff: 18, growth: 24, color: "#D6F04C" },
  { id: "br2", name: "Pallikaranai", location: "Velachery Main Road", city: "Chennai", phone: "+91 44 4678 9012", revenue: 1428000, patients: 287, staff: 14, growth: 18, color: "#B79AFB" },
  { id: "br3", name: "Sholinganallur", location: "OMR", city: "Chennai", phone: "+91 44 4789 0123", revenue: 986000, patients: 198, staff: 11, growth: 32, color: "#5EEAD4" },
  { id: "br4", name: "Nerkundram", location: "Poonamallee High Road", city: "Chennai", phone: "+91 44 4890 1234", revenue: 1240000, patients: 241, staff: 13, growth: 15, color: "#FBBF24" },
  { id: "br5", name: "Ponneri", location: "Chennai Tirupati Highway", city: "Chennai", phone: "+91 44 4901 2345", revenue: 762000, patients: 156, staff: 9, growth: 9, color: "#F472B6" },
];

const avatarColors = ["#D6F04C", "#B79AFB", "#5EEAD4", "#FBBF24", "#F472B6", "#60A5FA", "#34D399", "#FB923C", "#A78BFA", "#2DD4BF"];
const firstNames = ["Arjun", "Priya", "Rohan", "Ananya", "Vikram", "Sneha", "Karthik", "Divya", "Aditya", "Meera", "Sanjay", "Kavya", "Rahul", "Pooja", "Arnav", "Ishita", "Manish", "Ritu", "Varun", "Nisha", "Gaurav", "Tanvi", "Suresh", "Anjali", "Nikhil", "Riya", "Akash", "Shreya", "Deepak", "Anita"];
const lastNames = ["Sharma", "Reddy", "Nair", "Iyer", "Gupta", "Patel", "Rao", "Menon", "Pillai", "Desai", "Kapoor", "Mehta", "Joshi", "Bhat", "Shetty", "Kulkarni", "Verma", "Singh", "Murthy", "Prasad"];
const conditions = ["Lower Back Pain", "Cervical Spondylosis", "Frozen Shoulder", "Knee Osteoarthritis", "Post-Stroke Rehab", "Sciatica", "Tennis Elbow", "Plantar Fasciitis", "Rotator Cuff Tear", "Lumbar Disc Herniation"];
const treatments = ["Manual Therapy", "Dry Needling", "Ultrasound Therapy", "TENS", "Exercise Therapy", "Mobility Training", "Posture Correction", "Strength Training", "Sports Rehab", "Neurological Rehab"];
const allergies = ["Penicillin", "Sulfa", "Latex", "Aspirin", "None"];
const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

function pick<T>(arr: T[], i: number): T { return arr[i % arr.length]; }
function rand(seed: number, max: number): number { return Math.floor((seed * 9301 + 49297) % 233280 / 233280 * max); }

export const patients: Patient[] = Array.from({ length: 48 }).map((_, i) => {
  const name = `${pick(firstNames, i)} ${pick(lastNames, i * 3 + 1)}`;
  const age = 22 + rand(i + 7, 55);
  const gender = i % 3 === 0 ? "Female" : i % 5 === 0 ? "Other" : "Male";
  const status = (["active", "in_consultation", "in_therapy", "follow_up", "discharged"] as const)[rand(i + 3, 5)];
  const branchId = pick(branches, i).id;
  const completed = 4 + rand(i + 11, 20);
  const total = completed + rand(i + 5, 12);
  return {
    id: `pt${i + 1}`,
    patientId: `SPC-${String(2024000 + i + 1)}`,
    name,
    age,
    gender,
    dob: `${1965 + rand(i, 40)}-${String(1 + rand(i + 2, 12)).padStart(2, "0")}-${String(1 + rand(i + 9, 28)).padStart(2, "0")}`,
    phone: `+91 ${String(98000 + rand(i, 19999))} ${String(10000 + rand(i * 3, 89999))}`,
    email: `${name.toLowerCase().replace(/\s/g, ".")}@email.com`,
    address: `${10 + rand(i, 200)}, ${pick(["2nd Cross", "4th Main", "Park Road", "Temple Street", "MG Road"], i)}, ${pick(branches, i).name}, Chennai`,
    emergencyContact: `+91 ${String(99000 + rand(i, 999))} ${String(10000 + rand(i * 7, 89999))}`,
    branchId,
    bloodGroup: pick(bloodGroups, i + 2),
    allergies: i % 4 === 0 ? [pick(allergies, i)] : ["None"],
    conditions: [pick(conditions, i), ...(i % 3 === 0 ? [pick(conditions, i + 3)] : [])],
    previousTreatments: i % 2 === 0 ? [pick(treatments, i + 1), pick(treatments, i + 4)] : [],
    currentTreatment: pick(treatments, i + 2),
    status,
    therapistId: `th${(i % 8) + 1}`,
    tags: i % 3 === 0 ? ["VIP"] : i % 4 === 0 ? ["Post-Surgery"] : i % 5 === 0 ? ["Sports"] : ["Regular"],
    avatarColor: pick(avatarColors, i),
    registeredOn: `2024-${String(1 + rand(i, 12)).padStart(2, "0")}-${String(1 + rand(i, 28)).padStart(2, "0")}`,
    lastVisit: `2025-0${1 + rand(i, 5)}-${String(1 + rand(i, 28)).padStart(2, "0")}`,
    nextAppointment: i % 3 === 0 ? `2026-06-${String(26 + rand(i, 4)).padStart(2, "0")}` : undefined,
    progress: 20 + rand(i + 3, 75),
    totalSessions: total,
    completedSessions: completed,
    balance: i % 4 === 0 ? 500 + rand(i, 4500) : 0,
  };
});

export const therapists: Therapist[] = [
  { id: "th1", name: "Dr. Ananya Krishnan", specialization: "Orthopedic & Sports Rehab", branchId: "br1", patients: 42, rating: 4.9, experience: 8, sessionsToday: 9, revenue: 285000, avatarColor: "#D6F04C", status: "busy", certifications: ["MPT Ortho", "Cert. Dry Needling", "IASTM"] },
  { id: "th2", name: "Dr. Vikram Shetty", specialization: "Neurological Rehab", branchId: "br1", patients: 35, rating: 4.8, experience: 11, sessionsToday: 7, revenue: 312000, avatarColor: "#B79AFB", status: "available", certifications: ["MPT Neuro", "Bobath Certified", "NDT"] },
  { id: "th3", name: "Dr. Priya Nair", specialization: "Geriatric Physiotherapy", branchId: "br2", patients: 38, rating: 4.7, experience: 6, sessionsToday: 8, revenue: 198000, avatarColor: "#5EEAD4", status: "available", certifications: ["MPT Geriatric", "Fall Prevention"] },
  { id: "th4", name: "Dr. Karthik Reddy", specialization: "Sports Injury & Performance", branchId: "br2", patients: 45, rating: 4.9, experience: 9, sessionsToday: 10, revenue: 356000, avatarColor: "#FBBF24", status: "busy", certifications: ["MPT Sports", "FMS L2", "Kinesio Taping"] },
  { id: "th5", name: "Dr. Sneha Patel", specialization: "Women's Health & Pelvic Floor", branchId: "br3", patients: 28, rating: 4.8, experience: 5, sessionsToday: 6, revenue: 168000, avatarColor: "#F472B6", status: "available", certifications: ["MPT OBS", "Pelvic Floor Rehab"] },
  { id: "th6", name: "Dr. Aditya Menon", specialization: "Spine & Posture Correction", branchId: "br3", patients: 41, rating: 4.6, experience: 7, sessionsToday: 8, revenue: 234000, avatarColor: "#60A5FA", status: "off", certifications: ["MPT Ortho", "McKenzie Method"] },
  { id: "th7", name: "Dr. Meera Joshi", specialization: "Pediatric Physiotherapy", branchId: "br4", patients: 32, rating: 4.9, experience: 10, sessionsToday: 7, revenue: 212000, avatarColor: "#34D399", status: "available", certifications: ["MPT Pedo", "CIMT Certified"] },
  { id: "th8", name: "Dr. Sanjay Kulkarni", specialization: "Manual Therapy & Pain Mgmt", branchId: "br4", patients: 39, rating: 4.7, experience: 12, sessionsToday: 9, revenue: 298000, avatarColor: "#FB923C", status: "busy", certifications: ["MPT Ortho", "OMT Certified", "Cupping Therapy"] },
];

export const employees: Employee[] = [
  { id: "em1", name: "Rajesh Kumar", role: "Branch Manager", department: "Operations", branchId: "br1", phone: "+91 98000 11111", email: "rajesh@stabilityphysio.com", status: "active", shift: "9:00 AM - 6:00 PM", joinedOn: "2023-04-12", avatarColor: "#D6F04C", salary: 75000 },
  { id: "em2", name: "Lakshmi Iyer", role: "Receptionist", department: "Front Office", branchId: "br1", phone: "+91 98000 22222", email: "lakshmi@stabilityphysio.com", status: "active", shift: "8:00 AM - 4:00 PM", joinedOn: "2024-01-15", avatarColor: "#B79AFB", salary: 32000 },
  { id: "em3", name: "Deepak Sharma", role: "Receptionist", department: "Front Office", branchId: "br1", phone: "+91 98000 33333", email: "deepak@stabilityphysio.com", status: "on_leave", shift: "12:00 PM - 9:00 PM", joinedOn: "2024-06-20", avatarColor: "#5EEAD4", salary: 32000 },
  { id: "em4", name: "Sunita Rao", role: "Accounts Executive", department: "Finance", branchId: "br2", phone: "+91 98000 44444", email: "sunita@stabilityphysio.com", status: "active", shift: "10:00 AM - 7:00 PM", joinedOn: "2023-08-11", avatarColor: "#FBBF24", salary: 48000 },
  { id: "em5", name: "Arjun Mehta", role: "Marketing Lead", department: "Marketing", branchId: "br2", phone: "+91 98000 55555", email: "arjun@stabilityphysio.com", status: "active", shift: "10:00 AM - 7:00 PM", joinedOn: "2023-11-02", avatarColor: "#F472B6", salary: 62000 },
  { id: "em6", name: "Pooja Desai", role: "HR Coordinator", department: "Human Resources", branchId: "br3", phone: "+91 98000 66666", email: "pooja@stabilityphysio.com", status: "active", shift: "9:00 AM - 6:00 PM", joinedOn: "2024-02-18", avatarColor: "#60A5FA", salary: 52000 },
  { id: "em7", name: "Nikhil Bhat", role: "Operations Executive", department: "Operations", branchId: "br3", phone: "+91 98000 77777", email: "nikhil@stabilityphysio.com", status: "active", shift: "9:00 AM - 6:00 PM", joinedOn: "2024-03-22", avatarColor: "#34D399", salary: 38000 },
  { id: "em8", name: "Riya Kapoor", role: "Receptionist", department: "Front Office", branchId: "br4", phone: "+91 98000 88888", email: "riya@stabilityphysio.com", status: "active", shift: "8:00 AM - 4:00 PM", joinedOn: "2024-05-09", avatarColor: "#FB923C", salary: 32000 },
  { id: "em9", name: "Manish Verma", role: "Branch Manager", department: "Operations", branchId: "br4", phone: "+91 98000 99999", email: "manish@stabilityphysio.com", status: "active", shift: "9:00 AM - 6:00 PM", joinedOn: "2023-05-17", avatarColor: "#A78BFA", salary: 78000 },
  { id: "em10", name: "Tanvi Pillai", role: "Receptionist", department: "Front Office", branchId: "br5", phone: "+91 98011 00001", email: "tanvi@stabilityphysio.com", status: "active", shift: "9:00 AM - 6:00 PM", joinedOn: "2024-07-30", avatarColor: "#2DD4BF", salary: 34000 },
];

const today = new Date();
const todayStr = today.toISOString().split("T")[0];

export const appointments: Appointment[] = Array.from({ length: 24 }).map((_, i) => {
  const p = patients[i];
  const t = therapists[i % therapists.length];
  const hours = [9, 10, 11, 12, 14, 15, 16, 17, 18];
  const h = hours[i % hours.length];
  const m = i % 2 === 0 ? "00" : "30";
  const dayOffset = i < 16 ? 0 : (i - 15);
  const d = new Date(today);
  d.setDate(d.getDate() + dayOffset);
  const statuses: Appointment["status"][] = i < 6 ? ["waiting", "consultation", "therapy", "completed", "completed", "scheduled"] : i < 12 ? ["scheduled", "scheduled", "waiting", "scheduled", "cancelled", "scheduled"] : "scheduled";
  return {
    id: `ap${i + 1}`,
    patientId: p.id,
    patientName: p.name,
    therapistId: t.id,
    therapistName: t.name,
    branchId: p.branchId,
    date: d.toISOString().split("T")[0],
    time: `${String(h).padStart(2, "0")}:${m}`,
    duration: 30 + (i % 3) * 15,
    type: (["consultation", "therapy", "follow_up", "assessment"] as const)[i % 4],
    status: typeof statuses === "string" ? "scheduled" : statuses[i % statuses.length],
    notes: i % 3 === 0 ? "Focus on lumbar mobility exercises" : undefined,
  };
});

export const invoices: Invoice[] = Array.from({ length: 20 }).map((_, i) => {
  const p = patients[i * 2];
  const subtotal = 1500 + rand(i, 8500);
  const tax = Math.round(subtotal * 0.05);
  const discount = i % 4 === 0 ? 500 : 0;
  const total = subtotal + tax - discount;
  const paid = i % 3 === 0 ? 0 : i % 4 === 0 ? Math.round(total * 0.5) : total;
  const status: Invoice["status"] = paid === 0 ? "pending" : paid < total ? "partial" : "paid";
  const d = new Date(today);
  d.setDate(d.getDate() - rand(i, 20));
  const due = new Date(d);
  due.setDate(due.getDate() + 15);
  return {
    id: `inv${i + 1}`,
    invoiceNo: `INV-2026-${String(1000 + i)}`,
    patientId: p.id,
    patientName: p.name,
    branchId: p.branchId,
    date: d.toISOString().split("T")[0],
    dueDate: due.toISOString().split("T")[0],
    items: [
      { description: pick(treatments, i) + " Session", qty: 4 + rand(i, 8), rate: 800, amount: 0 },
      { description: "Consultation Fee", qty: 1, rate: 600, amount: 600 },
    ].map(it => ({ ...it, amount: it.qty * it.rate })),
    subtotal,
    tax,
    discount,
    total,
    paid,
    status: i % 7 === 0 ? "refunded" : status,
    paymentMethod: (["cash", "upi", "card", "insurance"] as const)[i % 4],
  };
});

export const leads: Lead[] = [
  { id: "ld1", name: "Ramesh Gupta", phone: "+91 98111 22222", email: "ramesh.g@email.com", source: "walk_in", stage: "new", branchId: "br1", interest: "Knee Pain Consultation", value: 4500, createdAt: "2026-06-25", notes: "Walked in for info, will decide tomorrow", avatarColor: "#D6F04C" },
  { id: "ld2", name: "Sneha Reddy", phone: "+91 98111 33333", email: "sneha.r@email.com", source: "instagram", stage: "new", branchId: "br2", interest: "Sports Rehab Package", value: 18000, createdAt: "2026-06-25", notes: "DM'd on Instagram, sent brochure", avatarColor: "#B79AFB" },
  { id: "ld3", name: "Anil Joshi", phone: "+91 98111 44444", email: "anil.j@email.com", source: "whatsapp", stage: "contacted", branchId: "br1", interest: "Post-Stroke Rehab", value: 32000, createdAt: "2026-06-24", notes: "Called twice, interested in home visits", avatarColor: "#5EEAD4" },
  { id: "ld4", name: "Kavita Nair", phone: "+91 98111 55555", email: "kavita.n@email.com", source: "doctor_referral", stage: "contacted", branchId: "br3", interest: "Cervical Spondylosis Treatment", value: 12000, createdAt: "2026-06-23", notes: "Referred by Dr. Agarwal, awaiting reports", avatarColor: "#FBBF24" },
  { id: "ld5", name: "Harish Pillai", phone: "+91 98111 66666", email: "harish.p@email.com", source: "website", stage: "consultation", branchId: "br2", interest: "Frozen Shoulder Therapy", value: 15000, createdAt: "2026-06-22", notes: "Booked consultation for Friday", avatarColor: "#F472B6" },
  { id: "ld6", name: "Madhuri Rao", phone: "+91 98111 77777", email: "madhuri.r@email.com", source: "phone", stage: "consultation", branchId: "br4", interest: "Lower Back Pain Program", value: 22000, createdAt: "2026-06-21", notes: "Visited clinic, took trial session", avatarColor: "#60A5FA" },
  { id: "ld7", name: "Ganesh Iyer", phone: "+91 98111 88888", email: "ganesh.i@email.com", source: "walk_in", stage: "converted", branchId: "br1", interest: "Post-Op Knee Rehab", value: 28000, createdAt: "2026-06-18", notes: "Converted! Started 12-session plan", avatarColor: "#34D399" },
  { id: "ld8", name: "Latha Shetty", phone: "+91 98111 99999", email: "latha.s@email.com", source: "instagram", stage: "converted", branchId: "br2", interest: "Sports Performance Package", value: 35000, createdAt: "2026-06-17", notes: "Paid in full, started sessions", avatarColor: "#FB923C" },
  { id: "ld9", name: "Prakash Naik", phone: "+91 98222 11111", email: "prakash.n@email.com", source: "website", stage: "lost", branchId: "br3", interest: "General Physiotherapy", value: 8000, createdAt: "2026-06-15", notes: "Went with competitor due to location", avatarColor: "#A78BFA" },
  { id: "ld10", name: "Geeta Bhat", phone: "+91 98222 22222", email: "geeta.b@email.com", source: "whatsapp", stage: "lost", branchId: "br4", interest: "Geriatric Care", value: 18000, createdAt: "2026-06-14", notes: "Budget constraints, will revisit in Q3", avatarColor: "#2DD4BF" },
];

export const attendanceRecords: AttendanceRecord[] = employees.flatMap((e, i) => {
  return Array.from({ length: 7 }).map((_, d) => {
    const date = new Date(today);
    date.setDate(date.getDate() - d);
    const status: AttendanceRecord["status"] = i % 9 === 0 && d === 1 ? "leave" : i % 7 === 0 && d === 2 ? "absent" : i % 5 === 0 && d === 3 ? "late" : "present";
    return {
      id: `at${e.id}_${d}`,
      employeeId: e.id,
      employeeName: e.name,
      date: date.toISOString().split("T")[0],
      checkIn: status === "absent" || status === "leave" ? "—" : status === "late" ? `${9 + (i % 2)}:${30 + (i % 30)} AM` : `${8 + (i % 2)}:${(i * 7) % 60 < 10 ? "0" + ((i * 7) % 60) : (i * 7) % 60} AM`,
      checkOut: d === 0 ? undefined : "6:0" + (i % 9) + " PM",
      status,
      method: (["qr", "gps", "manual"] as const)[i % 3],
      branchId: e.branchId,
    };
  });
});

export const notifications: NotificationItem[] = [
  { id: "n1", type: "appointment", title: "New appointment booked", message: "Arjun Sharma booked a consultation at 4:30 PM with Dr. Ananya", time: "2 min ago", read: false, priority: "high" },
  { id: "n2", type: "payment", title: "Payment received", message: "₹4,500 UPI payment from Priya Reddy for INV-2026-1003", time: "12 min ago", read: false, priority: "high" },
  { id: "n3", type: "follow_up", title: "Follow-up due", message: "Rohan Nair's 6-week follow-up is due tomorrow", time: "1 hour ago", read: false, priority: "medium" },
  { id: "n4", type: "registration", title: "New patient registered", message: "Ananya Iyer registered at Kodambakkam branch", time: "2 hours ago", read: true, priority: "low" },
  { id: "n5", type: "attendance", title: "Late check-in", message: "Deepak Sharma checked in 45 min late at Pallikaranai", time: "3 hours ago", read: true, priority: "medium" },
  { id: "n6", type: "report", title: "MRI report uploaded", message: "Dr. Vikram uploaded an MRI report for Karthik Reddy", time: "5 hours ago", read: true, priority: "low" },
  { id: "n7", type: "leave", title: "Leave request", message: "Sunita Rao requested leave for 28 Jun - 30 Jun", time: "Yesterday", read: true, priority: "medium" },
  { id: "n8", type: "appointment", title: "Appointment cancelled", message: "Sneha Patel cancelled her 11 AM session", time: "Yesterday", read: true, priority: "medium" },
];

export const timelineEvents: TimelineEvent[] = [
  { id: "t1", type: "registration", title: "Patient Registered", description: "Registered at Kodambakkam branch with cervical spondylosis complaint", date: "2026-04-15 10:30 AM", actor: "Lakshmi Iyer" },
  { id: "t2", type: "consultation", title: "Initial Consultation", description: "Assessed by Dr. Ananya Krishnan. Recommended 12-session manual therapy plan", date: "2026-04-15 11:45 AM", actor: "Dr. Ananya Krishnan" },
  { id: "t3", type: "report", title: "X-Ray Uploaded", description: "Cervical spine X-Ray uploaded by reception", date: "2026-04-16 09:15 AM", actor: "Lakshmi Iyer" },
  { id: "t4", type: "prescription", title: "Digital Prescription Issued", description: "Prescribed NSAIDs + 12 sessions of cervical traction & manual therapy", date: "2026-04-16 11:00 AM", actor: "Dr. Ananya Krishnan" },
  { id: "t5", type: "treatment", title: "Session 1 — Manual Therapy", description: "Cervical traction + soft tissue mobilization. Pain reduced from 7/10 to 5/10", date: "2026-04-18 04:00 PM", actor: "Dr. Ananya Krishnan" },
  { id: "t6", type: "payment", title: "Payment — ₹6,400", description: "UPI payment for 8 sessions package (INV-2026-1003)", date: "2026-04-18 04:30 PM", actor: "System" },
  { id: "t7", type: "treatment", title: "Session 2 — Dry Needling", description: "Upper trapezius dry needling + posture correction exercises", date: "2026-04-22 04:00 PM", actor: "Dr. Ananya Krishnan" },
  { id: "t8", type: "note", title: "Therapist Note", description: "Patient responding well. Increase intensity next session. Add thoracic mobility drills.", date: "2026-04-22 05:00 PM", actor: "Dr. Ananya Krishnan" },
  { id: "t9", type: "follow_up", title: "Follow-up Scheduled", description: "6-week follow-up scheduled for 3 June 2026", date: "2026-05-15 03:30 PM", actor: "Lakshmi Iyer" },
  { id: "t10", type: "treatment", title: "Session 8 — Progress Review", description: "Pain reduced to 2/10. Cervical ROM improved by 40%. Recommend 2 more sessions.", date: "2026-06-12 04:00 PM", actor: "Dr. Ananya Krishnan" },
];

export const medicalRecords: MedicalRecord[] = [
  { id: "mr1", patientId: "pt1", name: "Cervical_Spine_XRay.pdf", type: "xray", size: "2.4 MB", uploadedOn: "2026-04-16", uploadedBy: "Lakshmi Iyer", version: 1 },
  { id: "mr2", patientId: "pt1", name: "MRI_Cervical_Region.pdf", type: "mri", size: "8.1 MB", uploadedOn: "2026-04-20", uploadedBy: "Dr. Ananya Krishnan", version: 2 },
  { id: "mr3", patientId: "pt1", name: "Blood_Report_CBC.pdf", type: "blood_report", size: "1.2 MB", uploadedOn: "2026-04-15", uploadedBy: "Lakshmi Iyer", version: 1 },
  { id: "mr4", patientId: "pt1", name: "Prescription_April.pdf", type: "pdf", size: "640 KB", uploadedOn: "2026-04-16", uploadedBy: "Dr. Ananya Krishnan", version: 1 },
  { id: "mr5", patientId: "pt1", name: "Insurance_Card.jpg", type: "document", size: "1.8 MB", uploadedOn: "2026-04-15", uploadedBy: "Lakshmi Iyer", version: 1 },
];

export const kpiData: KPIData[] = [
  { label: "Today's Patients", value: 28, change: 12, trend: "up", icon: "Users", accent: "lime" },
  { label: "Appointments", value: 34, change: 8, trend: "up", icon: "Calendar", accent: "purple" },
  { label: "Active Treatments", value: 142, change: 5, trend: "up", icon: "Activity", accent: "blue" },
  { label: "Revenue Today", value: 48600, prefix: "₹", change: 18, trend: "up", icon: "IndianRupee", accent: "emerald" },
  { label: "Revenue (Month)", value: 1248000, prefix: "₹", change: 24, trend: "up", icon: "TrendingUp", accent: "lime" },
  { label: "Pending Bills", value: 9, change: -3, trend: "down", icon: "FileText", accent: "rose" },
  { label: "Staff Present", value: 58, suffix: "/65", change: 4, trend: "up", icon: "UserCheck", accent: "purple" },
  { label: "Patients Waiting", value: 4, change: -2, trend: "down", icon: "Clock", accent: "amber" },
  { label: "Consultations", value: 16, change: 6, trend: "up", icon: "Stethoscope", accent: "blue" },
  { label: "Follow-ups Due", value: 12, change: 2, trend: "up", icon: "Bell", accent: "purple" },
  { label: "Lead Conversion", value: 38, suffix: "%", change: 5, trend: "up", icon: "Target", accent: "lime" },
  { label: "Cancelled", value: 3, change: -1, trend: "down", icon: "XCircle", accent: "rose" },
];

// Chart data
export const revenueData = [
  { name: "Mon", revenue: 38200, target: 40000, patients: 24 },
  { name: "Tue", revenue: 42100, target: 40000, patients: 28 },
  { name: "Wed", revenue: 51800, target: 45000, patients: 32 },
  { name: "Thu", revenue: 39400, target: 40000, patients: 26 },
  { name: "Fri", revenue: 48600, target: 45000, patients: 34 },
  { name: "Sat", revenue: 62300, target: 55000, patients: 42 },
  { name: "Sun", revenue: 28700, target: 30000, patients: 18 },
];

export const monthlyRevenueData = [
  { name: "Jan", revenue: 845000, expenses: 520000, patients: 812 },
  { name: "Feb", revenue: 928000, expenses: 540000, patients: 898 },
  { name: "Mar", revenue: 1042000, expenses: 580000, patients: 1014 },
  { name: "Apr", revenue: 988000, expenses: 560000, patients: 962 },
  { name: "May", revenue: 1156000, expenses: 620000, patients: 1108 },
  { name: "Jun", revenue: 1248000, expenses: 660000, patients: 1224 },
];

export const branchComparisonData = branches.map(b => ({
  name: b.name,
  revenue: b.revenue,
  patients: b.patients,
  growth: b.growth,
}));

export const leadSourceData = [
  { name: "Walk-in", value: 32, color: "#D6F04C" },
  { name: "WhatsApp", value: 24, color: "#5EEAD4" },
  { name: "Instagram", value: 18, color: "#F472B6" },
  { name: "Doctor Referral", value: 14, color: "#B79AFB" },
  { name: "Website", value: 8, color: "#60A5FA" },
  { name: "Phone", value: 4, color: "#FBBF24" },
];

export const appointmentStatusData = [
  { name: "Completed", value: 142, color: "#34D399" },
  { name: "Scheduled", value: 86, color: "#60A5FA" },
  { name: "Waiting", value: 12, color: "#FBBF24" },
  { name: "Cancelled", value: 18, color: "#F87171" },
  { name: "No Show", value: 6, color: "#A78BFA" },
];

export const patientGrowthData = [
  { name: "Week 1", new: 42, active: 280, discharged: 18 },
  { name: "Week 2", new: 56, active: 312, discharged: 24 },
  { name: "Week 3", new: 48, active: 338, discharged: 22 },
  { name: "Week 4", new: 64, active: 378, discharged: 28 },
];

export const therapistPerformanceData = therapists.map(t => ({
  name: t.name.replace("Dr. ", "").split(" ")[0],
  sessions: t.sessionsToday * 4 + 18,
  revenue: t.revenue / 1000,
  rating: t.rating,
}));

export const revenueForecastData = [
  { name: "Jul", actual: 1248000, forecast: 0 },
  { name: "Aug", actual: 0, forecast: 1380000 },
  { name: "Sep", actual: 0, forecast: 1452000 },
  { name: "Oct", actual: 0, forecast: 1528000 },
  { name: "Nov", actual: 0, forecast: 1610000 },
  { name: "Dec", actual: 0, forecast: 1742000 },
];

// Treatment packages offered by the clinic
export const treatmentPackages = [
  { id: "pkg1", name: "Single Consultation", sessions: 1, price: 800, duration: "45 min", description: "Initial assessment + consultation" },
  { id: "pkg2", name: "Therapy Session", sessions: 1, price: 1200, duration: "60 min", description: "Single physiotherapy session" },
  { id: "pkg3", name: "Recovery Pack (8 sessions)", sessions: 8, price: 8800, duration: "8 weeks", description: "Standard treatment plan" },
  { id: "pkg4", name: "Premium Rehab (12 sessions)", sessions: 12, price: 14400, duration: "12 weeks", description: "Comprehensive rehab program" },
  { id: "pkg5", name: "Sports Performance (16 sessions)", sessions: 16, price: 22400, duration: "8 weeks", description: "Athlete-focused intensive program" },
  { id: "pkg6", name: "Post-Op Rehab (20 sessions)", sessions: 20, price: 28000, duration: "16 weeks", description: "Surgical recovery program" },
];
