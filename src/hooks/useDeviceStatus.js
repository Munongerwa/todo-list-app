import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../api/supabase';

export function useDeviceStatus() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchDevices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('devices')
        .select('*')
        .order('last_updated', { ascending: false });

      if (error) throw error;
      
      setDevices(data || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching devices:', err);
      setError('Failed to fetch device status. Check console for details.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
    // Set up interval to fetch every 5 minutes (300,000 ms)
    const intervalId = setInterval(fetchDevices, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [fetchDevices]);

  return { devices, loading, error, lastUpdated, refresh: fetchDevices };
}