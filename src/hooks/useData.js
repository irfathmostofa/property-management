import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

/* ============================================================
   Generic hook factory
   ============================================================ */
function useSupabaseQuery(queryFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await queryFn();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

/* ============================================================
   Buildings
   ============================================================ */
export function useBuildings() {
  const { user, isAdmin } = useAuth();
  return useSupabaseQuery(async () => {
    let q = supabase
      .from("buildings")
      .select("*, profiles(full_name, phone)")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    if (!isAdmin) q = q.eq("owner_id", user.id);
    const { data, error } = await q;
    if (error) throw error;
    return data;
  }, [user?.id, isAdmin]);
}

export function useBuilding(id) {
  return useSupabaseQuery(async () => {
    if (!id) return null;
    const { data, error } = await supabase
      .from("buildings")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  }, [id]);
}

/* ============================================================
   Apartments
   ============================================================ */
export function useApartments(buildingId = null) {
  const { user, isAdmin } = useAuth();
  return useSupabaseQuery(async () => {
    let q = supabase
      .from("apartments")
      .select("*, buildings(name, owner_id, type)")
      .order("unit_number");
    if (buildingId) q = q.eq("building_id", buildingId);
    if (!isAdmin) q = q.eq("buildings.owner_id", user.id);
    const { data, error } = await q;
    if (error) throw error;
    return isAdmin
      ? data
      : data?.filter((a) => a.buildings?.owner_id === user.id);
  }, [user?.id, isAdmin, buildingId]);
}

/* ============================================================
   Cottage Rooms
   ============================================================ */
export function useCottageRooms(buildingId = null) {
  const { user, isAdmin } = useAuth();
  return useSupabaseQuery(async () => {
    let q = supabase
      .from("cottage_rooms")
      .select("*, buildings(name, owner_id)")
      .order("room_number");
    if (buildingId) q = q.eq("building_id", buildingId);
    const { data, error } = await q;
    if (error) throw error;
    return isAdmin
      ? data
      : data?.filter((r) => r.buildings?.owner_id === user.id);
  }, [user?.id, isAdmin, buildingId]);
}

/* ============================================================
   Apartment Renters
   ============================================================ */
export function useApartmentRenters(apartmentId = null) {
  const { user, isAdmin } = useAuth();
  return useSupabaseQuery(async () => {
    let q = supabase
      .from("apartment_renters")
      .select(
        "*, apartments(unit_number, monthly_rent, buildings(name, owner_id))",
      )
      .order("full_name");
    if (apartmentId) q = q.eq("apartment_id", apartmentId);
    const { data, error } = await q;
    if (error) throw error;
    return isAdmin
      ? data
      : data?.filter((r) => r.apartments?.buildings?.owner_id === user.id);
  }, [user?.id, isAdmin, apartmentId]);
}

/* ============================================================
   Cottage Renters
   ============================================================ */
export function useCottageRenters(roomId = null) {
  const { user, isAdmin } = useAuth();
  return useSupabaseQuery(async () => {
    let q = supabase
      .from("cottage_renters")
      .select(
        "*, cottage_rooms(room_number, cost_per_seat, buildings(name, owner_id))",
      )
      .order("full_name");
    if (roomId) q = q.eq("room_id", roomId);
    const { data, error } = await q;
    if (error) throw error;
    return isAdmin
      ? data
      : data?.filter((r) => r.cottage_rooms?.buildings?.owner_id === user.id);
  }, [user?.id, isAdmin, roomId]);
}

/* ============================================================
   Monthly Payments
   ============================================================ */
export function useMonthlyPayments({
  renterId,
  renterType,
  status,
  month,
} = {}) {
  const { user, isAdmin } = useAuth();
  return useSupabaseQuery(async () => {
    let q = supabase
      .from("monthly_payments")
      .select(
        `
        *,
        apartment_renters(full_name, phone, apartments(unit_number, buildings(name, owner_id))),
        cottage_renters(full_name, phone, cottage_rooms(room_number, buildings(name, owner_id)))
      `,
      )
      .order("billing_month", { ascending: false });
    if (status) q = q.eq("status", status);
    if (month) q = q.eq("billing_month", month);
    if (renterId && renterType === "apartment")
      q = q.eq("apartment_renter_id", renterId);
    if (renterId && renterType === "cottage")
      q = q.eq("cottage_renter_id", renterId);
    const { data, error } = await q;
    if (error) throw error;
    if (isAdmin) return data;
    return data?.filter(
      (p) =>
        p.apartment_renters?.apartments?.buildings?.owner_id === user.id ||
        p.cottage_renters?.cottage_rooms?.buildings?.owner_id === user.id,
    );
  }, [user?.id, isAdmin, renterId, renterType, status, month]);
}

/* ============================================================
   Advance Payments
   ============================================================ */
export function useAdvancePayments(renterId = null, renterType = null) {
  const { user, isAdmin } = useAuth();
  return useSupabaseQuery(async () => {
    let q = supabase
      .from("advance_payments")
      .select("*")
      .order("paid_date", { ascending: false });
    if (renterId && renterType === "apartment")
      q = q.eq("apartment_renter_id", renterId);
    if (renterId && renterType === "cottage")
      q = q.eq("cottage_renter_id", renterId);
    const { data, error } = await q;
    if (error) throw error;
    return data;
  }, [user?.id, renterId, renterType]);
}

/* ============================================================
   Notifications
   ============================================================ */
export function useNotifications() {
  const { user, isAdmin } = useAuth();
  return useSupabaseQuery(async () => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*, apartment_renters(full_name), cottage_renters(full_name)")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw error;
    return data;
  }, [user?.id, isAdmin]);
}

/* ============================================================
   Notification Templates
   ============================================================ */
export function useNotificationTemplates() {
  const { user } = useAuth();
  return useSupabaseQuery(async () => {
    const { data, error } = await supabase
      .from("notification_templates")
      .select("*")
      .or(`owner_id.eq.${user.id},owner_id.is.null`)
      .order("is_default", { ascending: false });
    if (error) throw error;
    return data;
  }, [user?.id]);
}

/* ============================================================
   Dashboard stats
   ============================================================ */
export function useDashboardStats() {
  const { user, isAdmin } = useAuth();
  return useSupabaseQuery(async () => {
    // Buildings
    let bq = supabase.from("buildings").select("id", { count: "exact" });
    if (!isAdmin) bq = bq.eq("owner_id", user.id);
    const { count: buildings } = await bq;

    // Active apartment renters
    const { count: aptRenters } = await supabase
      .from("apartment_renters")
      .select("id", { count: "exact" })
      .eq("is_active", true);

    // Active cottage renters
    const { count: cotRenters } = await supabase
      .from("cottage_renters")
      .select("id", { count: "exact" })
      .eq("is_active", true);

    // Overdue payments
    const { count: overdue } = await supabase
      .from("monthly_payments")
      .select("id", { count: "exact" })
      .eq("status", "overdue");

    // This month collected
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
    const { data: collected } = await supabase
      .from("monthly_payments")
      .select("paid_amount")
      .eq("billing_month", thisMonth)
      .eq("status", "paid");

    const collectedTotal = (collected || []).reduce(
      (s, r) => s + Number(r.paid_amount),
      0,
    );

    return {
      buildings: buildings || 0,
      totalRenters: (aptRenters || 0) + (cotRenters || 0),
      overdue: overdue || 0,
      collectedThisMonth: collectedTotal,
    };
  }, [user?.id, isAdmin]);
}

/* ============================================================
   Profiles (admin only)
   ============================================================ */
export function useOwners() {
  return useSupabaseQuery(async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "owner")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  }, []);
}
