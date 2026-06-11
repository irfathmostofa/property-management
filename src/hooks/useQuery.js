import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

export function useQuery(table, options = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    select = "*",
    filters = [],
    orderBy = { column: "created_at", ascending: false },
    limit,
    enabled = true,
  } = options;

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      let query = supabase.from(table).select(select);

      // Apply filters
      filters.forEach((filter) => {
        query = query[filter.method](filter.column, filter.value);
      });

      // Apply ordering
      if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending });
      }

      // Apply limit
      if (limit) {
        query = query.limit(limit);
      }

      const { data: result, error: queryError } = await query;

      if (queryError) throw queryError;

      setData(result || []);
    } catch (err) {
      console.error(`Error fetching ${table}:`, err);
      setError(err.message);
      toast.error(`Failed to load ${table}`);
    } finally {
      setLoading(false);
    }
  }, [table, select, filters, orderBy, limit, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}
