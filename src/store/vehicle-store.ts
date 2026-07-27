import { create } from 'zustand';

import { Vehicle } from '@/types/vehicle';

type VehicleState = {
  vehicle: Vehicle | null;
  isRegistered: boolean;
  setVehicle: (vehicle: Vehicle) => void;
  clearVehicle: () => void;
};

export const useVehicleStore = create<VehicleState>()((set) => ({
  vehicle: null,
  isRegistered: false,
  setVehicle: (vehicle) => set({ vehicle, isRegistered: true }),
  clearVehicle: () => set({ vehicle: null, isRegistered: false }),
}));
