import { useEffect, useState } from 'react';

import * as batteryApi from '@/api/battery';
import { getBatteryStatus } from '@/utils/format-battery';

export function useVehicleBatteryStatus(vehicleId: string | undefined) {
  const [soh, setSoh] = useState<number | null>(null);
  const [rul, setRul] = useState<number | null>(null);
  const [loading, setLoading] = useState(!!vehicleId);

  useEffect(() => {
    if (!vehicleId) return;

    let cancelled = false;
    setLoading(true);
    batteryApi
      .getBatteryPassport(vehicleId)
      .then((data) => {
        if (cancelled) return;
        setSoh(data?.soh ?? null);
        setRul(data?.rul ?? null);
      })
      .catch(() => {
        if (cancelled) return;
        setSoh(null);
        setRul(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [vehicleId]);

  const status = rul !== null ? getBatteryStatus(rul) : null;

  return { soh, rul, status, loading };
}
