import { useEffect, useState } from 'react';

import * as batteryApi from '@/api/battery';
import { useAuth } from '@/hooks/use-auth';
import { useVehicle } from '@/hooks/use-vehicle';
import { BatteryPassport } from '@/types/battery';

export function useBatteryPassport() {
  const { user } = useAuth();
  const { vehicle } = useVehicle();
  const [passport, setPassport] = useState<BatteryPassport | null>(null);
  const [loading, setLoading] = useState(!!vehicle);

  useEffect(() => {
    if (!vehicle) return;

    let cancelled = false;
    setLoading(true);
    batteryApi.getBatteryPassport(vehicle.id).then((data) => {
      if (cancelled) return;
      setPassport(data);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [vehicle]);

  return { user, vehicle, passport, loading };
}
