import { clsx } from "clsx";
import { format, parseISO, startOfMonth, isValid } from "date-fns";

// Class name merger
export function cn(...inputs) {
  return clsx(inputs);
}

// Format currency in BDT
export function formatCurrency(amount) {
  if (amount == null) return "৳0";
  return `৳${Number(amount).toLocaleString("en-BD")}`;
}

// Format date
export function formatDate(date, pattern = "dd MMM yyyy") {
  if (!date) return "—";
  try {
    const d = typeof date === "string" ? parseISO(date) : date;
    return isValid(d) ? format(d, pattern) : "—";
  } catch {
    return "—";
  }
}

// Format billing month for display
export function formatBillingMonth(date) {
  return formatDate(date, "MMMM yyyy");
}

// Get first day of month as ISO string (for billing_month)
export function getBillingMonthDate(year, month) {
  return format(new Date(year, month - 1, 1), "yyyy-MM-dd");
}

// Get current billing month
export function getCurrentBillingMonth() {
  return format(startOfMonth(new Date()), "yyyy-MM-dd");
}

// Status badge config
export const STATUS_CONFIG = {
  // Apartment
  vacant: { label: "Vacant", color: "success" },
  occupied: { label: "Occupied", color: "info" },
  maintenance: { label: "Maintenance", color: "warning" },
  reserved: { label: "Reserved", color: "neutral" },

  // Cottage
  available: { label: "Available", color: "success" },
  full: { label: "Full", color: "danger" },

  // Payment
  paid: { label: "Paid", color: "success" },
  partial: { label: "Partial", color: "warning" },
  due: { label: "Due", color: "info" },
  overdue: { label: "Overdue", color: "danger" },
  waived: { label: "Waived", color: "neutral" },

  // Notification
  pending: { label: "Pending", color: "warning" },
  sent: { label: "Sent", color: "success" },
  failed: { label: "Failed", color: "danger" },
  cancelled: { label: "Cancelled", color: "neutral" },
};

// Renter type labels
export const RENTER_TYPE_LABELS = {
  student: "Student",
  job_holder: "Job Holder",
  other: "Other",
};

// Payment method labels
export const PAYMENT_METHOD_LABELS = {
  cash: "Cash",
  bkash: "bKash",
  nagad: "Nagad",
  rocket: "Rocket",
  bank: "Bank Transfer",
  other: "Other",
};

// Building type labels
export const BUILDING_TYPE_LABELS = {
  apartment: "Apartment",
  cottage: "Cottage",
  mixed: "Mixed",
};

// Truncate text
export function truncate(str, len = 30) {
  if (!str) return "";
  return str.length > len ? str.slice(0, len) + "…" : str;
}

// Get initials from name
export function getInitials(name = "") {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

// Build WhatsApp message URL
export function buildWhatsAppUrl(phone, message) {
  const cleaned = phone.replace(/\D/g, "");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleaned}?text=${encoded}`;
}

// Replace template variables
export function renderTemplate(template, vars = {}) {
  return template.replace(
    /\{\{(\w+)\}\}/g,
    (_, key) => vars[key] ?? `{{${key}}}`,
  );
}
