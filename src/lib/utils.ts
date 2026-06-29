// Utility functions for the CRM

export function formatINR(amount: number, options: { compact?: boolean; decimals?: number } = {}): string {
  const { compact = false, decimals = 0 } = options;
  if (compact) {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: decimals })}`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString("en-IN");
}

export function formatDate(dateStr: string, opts: { withTime?: boolean } = {}): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    if (opts.withTime) {
      return d.toLocaleString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit", hour12: true,
      });
    }
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export function formatTimeAgo(dateStr: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
}



export function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

export function uid(prefix: string = "id"): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// CSV export — auto-download
export function exportToCSV(filename: string, rows: Record<string, any>[]): void {
  if (!rows.length) {
    downloadTextFile(filename.replace(/\.\w+$/, "") + ".csv", "No data available");
    return;
  }
  const headers = Object.keys(rows[0]);
  const csvLines = [
    headers.join(","),
    ...rows.map(row =>
      headers.map(h => {
        const val = row[h];
        if (val === null || val === undefined) return "";
        const str = typeof val === "object" ? JSON.stringify(val) : String(val);
        // Escape quotes & wrap in quotes if contains comma/newline/quote
        if (str.includes(",") || str.includes("\n") || str.includes('"')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      }).join(",")
    ),
  ];
  downloadTextFile(filename, csvLines.join("\n"), "text/csv;charset=utf-8;");
}

// Generic text file download
export function downloadTextFile(filename: string, content: string, mime: string = "text/plain;charset=utf-8;"): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

// HTML-based "PDF" export — opens a printable HTML window which the browser converts to PDF.
// Generates an HTML file and auto-downloads it (then user can print to PDF if needed).
export function exportToHTMLPDF(opts: {
  filename: string;
  title: string;
  subtitle?: string;
  meta?: { label: string; value: string }[];
  columns: { key: string; label: string; align?: "left" | "right" | "center" }[];
  rows: Record<string, any>[];
  summary?: { label: string; value: string; accent?: "lime" | "purple" | "rose" | "emerald" | "blue" }[];
}): void {
  const { filename, title, subtitle, meta = [], columns, rows, summary = [] } = opts;

  const accentColors: Record<string, string> = {
    lime: "#D6F04C",
    purple: "#B79AFB",
    rose: "#F87171",
    emerald: "#34D399",
    blue: "#60A5FA",
  };

  const totalRow = columns.some(c => c.key === "total") ? rows.reduce((s, r) => s + (Number(r.total) || 0), 0) : null;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, sans-serif; background: #fff; color: #0F1117; padding: 32px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 24px; border-bottom: 2px solid #0F1117; margin-bottom: 24px; }
  .brand { display: flex; align-items: center; gap: 12px; }
  .logo { width: 44px; height: 44px; background: linear-gradient(135deg, #D6F04C 0%, #B79AFB 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #0F1117; font-weight: 800; font-size: 18px; }
  .brand-name { font-size: 18px; font-weight: 700; color: #0F1117; }
  .brand-tag { font-size: 11px; color: #666; letter-spacing: 0.5px; text-transform: uppercase; }
  .doc-title { text-align: right; }
  .doc-title h1 { font-size: 22px; font-weight: 700; }
  .doc-title .subtitle { font-size: 12px; color: #666; margin-top: 4px; }
  .meta-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 20px; }
  .meta-item { padding: 10px 14px; background: #F8F9FB; border-radius: 8px; border-left: 3px solid #D6F04C; }
  .meta-label { font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 0.6px; }
  .meta-value { font-size: 13px; font-weight: 600; margin-top: 2px; }
  .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin-bottom: 24px; }
  .summary-item { padding: 14px 16px; border-radius: 10px; background: #FAFAFA; border: 1px solid #EEE; }
  .summary-label { font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 0.6px; }
  .summary-value { font-size: 18px; font-weight: 700; margin-top: 4px; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  thead th { background: #0F1117; color: #fff; padding: 10px 12px; text-align: left; font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.4px; }
  thead th.right { text-align: right; }
  thead th.center { text-align: center; }
  tbody td { padding: 10px 12px; border-bottom: 1px solid #EEE; }
  tbody td.right { text-align: right; font-variant-numeric: tabular-nums; }
  tbody td.center { text-align: center; }
  tbody tr:nth-child(even) { background: #FAFBFC; }
  tbody tr:hover { background: #F0F4FF; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 10px; font-weight: 600; }
  .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #EEE; display: flex; justify-content: space-between; font-size: 10px; color: #888; }
  @media print {
    body { padding: 0; }
    .header { page-break-after: avoid; }
    table { page-break-inside: auto; }
    tr { page-break-inside: avoid; }
  }
</style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <div class="logo">SP</div>
      <div>
        <div class="brand-name">Stability Physio Care</div>
        <div class="brand-tag">Clinic Management CRM</div>
      </div>
    </div>
    <div class="doc-title">
      <h1>${title}</h1>
      ${subtitle ? `<div class="subtitle">${subtitle}</div>` : ""}
      <div class="subtitle">Generated: ${new Date().toLocaleString("en-IN")}</div>
    </div>
  </div>

  ${meta.length ? `
  <div class="meta-grid">
    ${meta.map(m => `<div class="meta-item"><div class="meta-label">${m.label}</div><div class="meta-value">${m.value}</div></div>`).join("")}
  </div>
  ` : ""}

  ${summary.length ? `
  <div class="summary-grid">
    ${summary.map(s => `<div class="summary-item" style="border-left: 4px solid ${accentColors[s.accent || "lime"]}"><div class="summary-label">${s.label}</div><div class="summary-value">${s.value}</div></div>`).join("")}
  </div>
  ` : ""}

  <table>
    <thead>
      <tr>
        ${columns.map(c => `<th class="${c.align || "left"}">${c.label}</th>`).join("")}
      </tr>
    </thead>
    <tbody>
      ${rows.map(r => `<tr>${columns.map(c => `<td class="${c.align || "left"}">${formatCell(r[c.key], c.key)}</td>`).join("")}</tr>`).join("")}
      ${totalRow !== null ? `<tr style="background:#0F1117;color:#fff;font-weight:700;"><td colspan="${columns.length - 1}" class="right">TOTAL</td><td class="right">${formatINR(totalRow)}</td></tr>` : ""}
    </tbody>
  </table>

  <div class="footer">
    <div>Stability Physio Care · Confidential</div>
    <div>Generated by Clinic CRM · ${new Date().toLocaleDateString("en-IN")}</div>
  </div>

  <script>
    window.onload = function() { setTimeout(function() { window.print(); }, 300); };
  </script>
</body>
</html>`;

  downloadTextFile(filename, html, "text/html;charset=utf-8;");
}

function formatCell(val: any, key: string): string {
  if (val === null || val === undefined || val === "") return "—";
  if (typeof val === "number") {
    if (key === "total" || key === "paid" || key === "balance" || key === "subtotal" || key === "tax" || key === "discount" || key === "rate" || key === "amount" || key === "revenue" || key === "value" || key === "salary") {
      return formatINR(val);
    }
    return val.toLocaleString("en-IN");
  }
  if (typeof val === "boolean") return val ? "Yes" : "No";
  return String(val);
}

// Excel (xlsx-compatible) export — generates an HTML table with .xls extension that Excel opens natively.
export function exportToExcel(opts: {
  filename: string;
  sheetName: string;
  columns: { key: string; label: string }[];
  rows: Record<string, any>[];
}): void {
  const { filename, sheetName, columns, rows } = opts;
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>${sheetName}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>
<body>
<table border="1">
<thead><tr>${columns.map(c => `<th style="background:#0F1117;color:#fff;font-weight:bold;padding:6px;">${c.label}</th>`).join("")}</tr></thead>
<tbody>
${rows.map(r => `<tr>${columns.map(c => `<td style="padding:6px;">${formatCell(r[c.key], c.key)}</td>`).join("")}</tr>`).join("")}
</tbody>
</table>
</body>
</html>`;
  downloadTextFile(filename, html, "application/vnd.ms-excel;charset=utf-8;");
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function mapPatient(p: any): import("./types").Patient {
  return {
    id: p.id,
    patientId: p.patient_id_code,
    name: p.name,
    age: p.age,
    gender: p.gender,
    dob: "1990-01-01",
    phone: p.phone,
    email: p.email || "",
    address: "",
    emergencyContact: "",
    branchId: p.branch_id,
    bloodGroup: "O+",
    allergies: [],
    conditions: p.tags || [],
    previousTreatments: [],
    currentTreatment: "General Therapy",
    status: p.status,
    therapistId: p.therapist_id || "",
    tags: p.tags || [],
    avatarColor: "#D6F04C",
    registeredOn: p.created_at,
    lastVisit: p.last_visit || p.created_at,
    nextAppointment: p.next_appointment,
    progress: p.progress,
    totalSessions: 12,
    completedSessions: 0,
    balance: Number(p.balance_due),
  };
}

export function mapAppointment(a: any): import("./types").Appointment {
  return {
    id: a.id,
    patientId: a.patient_id,
    patientName: a.patient_name,
    therapistId: a.therapist_id,
    therapistName: a.therapist_name,
    branchId: a.branch_id,
    date: a.date,
    time: a.time,
    duration: a.duration,
    type: a.type,
    status: a.status,
    notes: a.notes,
  };
}

export function mapLead(l: any): import("./types").Lead {
  return {
    id: l.id,
    name: l.name,
    phone: l.phone,
    email: l.email || "",
    source: l.source,
    stage: l.stage,
    branchId: l.branch_id,
    interest: l.interest || "",
    value: Number(l.value),
    notes: l.notes || "",
    avatarColor: l.avatar_color,
    createdAt: l.created_at,
  };
}

export function mapInvoice(i: any): import("./types").Invoice {
  return {
    id: i.id,
    invoiceNo: i.invoice_no,
    patientId: i.patient_id,
    patientName: i.patient_name,
    branchId: i.branch_id,
    date: i.date,
    dueDate: i.due_date,
    items: i.invoice_items?.map((item: any) => ({
      id: item.id,
      description: item.description,
      qty: item.qty,
      rate: Number(item.rate),
      amount: Number(item.amount),
    })) || [],
    subtotal: Number(i.subtotal),
    tax: Number(i.tax),
    discount: Number(i.discount),
    total: Number(i.total),
    paid: Number(i.paid),
    status: i.status,
    paymentMethod: i.payment_method,
  };
}

export function mapNotification(n: any): import("./types").Notification {
  return {
    id: n.id,
    type: n.type,
    title: n.title,
    message: n.message,
    time: formatTimeAgo(n.created_at),
    read: n.read,
    priority: n.priority,
  };
}

export function mapEmployee(e: any): import("./types").Employee {
  return {
    id: e.id,
    name: e.name,
    role: e.role,
    department: e.department,
    branchId: e.branch_id,
    phone: e.phone,
    email: e.email,
    status: e.status,
    shift: e.shift,
    joinedOn: e.joined_on,
    avatarColor: e.avatar_color,
    salary: Number(e.salary),
  };
}

export function mapTherapist(t: any): import("./types").Therapist {
  return {
    id: t.id,
    name: t.name,
    specialization: t.specialization,
    branchId: t.branch_id,
    patientsCount: t.patients_count,
    rating: Number(t.rating),
    experience: t.experience,
    sessionsToday: t.sessions_today,
    revenue: Number(t.revenue),
    avatarColor: t.avatar_color,
    status: t.status,
    certifications: t.certifications || [],
  };
}

export function mapAttendanceRecord(a: any): import("./types").AttendanceRecord {
  return {
    id: a.id,
    employeeId: a.employee_id,
    employeeName: a.employee_name,
    date: a.date,
    checkIn: a.check_in,
    checkOut: a.check_out,
    status: a.status,
    method: a.method,
  };
}
