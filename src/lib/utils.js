import { clsx } from "clsx";
import { format, parseISO } from "date-fns";

export function cn(...inputs) {
  return clsx(inputs);
}

export function formatCurrency(amount) {
  if (amount == null) return "৳0";
  return `৳${Number(amount).toLocaleString("en-BD")}`;
}

export function formatDate(date) {
  if (!date) return "—";
  try {
    return format(
      typeof date === "string" ? parseISO(date) : date,
      "dd MMM yyyy",
    );
  } catch {
    return date;
  }
}

export function formatMonth(date) {
  if (!date) return "—";
  try {
    return format(
      typeof date === "string" ? parseISO(date) : date,
      "MMMM yyyy",
    );
  } catch {
    return date;
  }
}

export function getStatusColor(status) {
  const map = {
    vacant: "status-green",
    available: "status-green",
    occupied: "status-blue",
    full: "status-blue",
    maintenance: "status-yellow",
    reserved: "status-purple",
    paid: "status-green",
    partial: "status-yellow",
    due: "status-red",
    overdue: "status-red",
    waived: "status-gray",
    pending: "status-yellow",
    sent: "status-green",
    failed: "status-red",
    cancelled: "status-gray",
  };
  return map[status] || "status-gray";
}

export function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, " ");
}
