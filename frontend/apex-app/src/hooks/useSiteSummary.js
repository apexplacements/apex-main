import { useEffect, useState } from 'react';
import apiClient from '../apiClient';

let cache = null;
let inflight = null;

async function fetchSummary() {
  try {
    const res = await apiClient.get('/api/dashboard/stats');
    const s = res?.data?.data?.summary || null;
    cache = s;
    return s;
  } catch (e) {
    return null;
  } finally {
    inflight = null;
  }
}

export function setSiteSummaryCache(val) {
  cache = val;
  // clear any inflight so future calls may refresh normally
  inflight = null;
}

export default function useSiteSummary() {
  const [summary, setSummary] = useState(cache);
  const [loading, setLoading] = useState(cache === null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (cache) {
      setSummary(cache);
      setLoading(false);
      return;
    }
    if (!inflight) {
      inflight = fetchSummary();
    }
    inflight.then((s) => {
      if (!mounted) return;
      setSummary(s);
      setLoading(false);
    }).catch((e) => {
      if (!mounted) return;
      setError(e);
      setLoading(false);
    });

    return () => { mounted = false; };
  }, []);

  const refresh = async () => {
    setLoading(true);
    try {
      const s = await fetchSummary();
      setSummary(s);
      return s;
    } catch (e) {
      setError(e);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { summary, loading, error, refresh };
}
