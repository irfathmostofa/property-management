import { useState, useEffect, useCallback } from "react";

import toast from "react-hot-toast";
import { supabase } from "../utils/supabase";

export function useQuery(table, options = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase.from(table).select(options.select || "*");

      if (options.eq) {
        Object.entries(options.eq).forEach(([col, val]) => {
          query = query.eq(col, val);
        });
      }
      if (options.order) {
        query = query.order(options.order.column, {
          ascending: options.order.ascending ?? true,
        });
      }

      const { data: rows, error: err } = await query;
      if (err) throw err;
      setData(rows || []);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [table, JSON.stringify(options)]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

export function useMutation(table) {
  const [loading, setLoading] = useState(false);

  const insert = async (payload) => {
    setLoading(true);
    const { data, error } = await supabase
      .from(table)
      .insert(payload)
      .select()
      .single();
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return { data: null, error };
    }
    toast.success("Created successfully");
    return { data, error: null };
  };

  const update = async (id, payload) => {
    setLoading(true);
    const { data, error } = await supabase
      .from(table)
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return { data: null, error };
    }
    toast.success("Updated successfully");
    return { data, error: null };
  };

  const remove = async (id) => {
    setLoading(true);
    const { error } = await supabase.from(table).delete().eq("id", id);
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return { error };
    }
    toast.success("Deleted successfully");
    return { error: null };
  };

  return { insert, update, remove, loading };
}
