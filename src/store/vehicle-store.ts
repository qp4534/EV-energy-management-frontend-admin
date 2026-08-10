import { create } from 'zustand';

import { Vehicle } from '@/types/vehicle';

type VehicleState = {
  vehicles: Vehicle[];
  primaryVehicleId: string | null;
  /** 대표 차량. 다른 화면들이 여전히 단일 차량으로 조회할 수 있도록 vehicles/primaryVehicleId와 함께 갱신된다. */
  vehicle: Vehicle | null;
  isRegistered: boolean;
  setVehicles: (vehicles: Vehicle[]) => void;
  addVehicle: (vehicle: Vehicle) => void;
  removeVehicle: (id: string) => void;
  setPrimaryVehicle: (id: string) => void;
};

function deriveState(vehicles: Vehicle[], primaryVehicleId: string | null) {
  const vehicle = vehicles.find((v) => v.id === primaryVehicleId) ?? vehicles[0] ?? null;
  return {
    vehicles,
    primaryVehicleId: vehicle?.id ?? null,
    vehicle,
    isRegistered: vehicles.length > 0,
  };
}

export const useVehicleStore = create<VehicleState>()((set) => ({
  ...deriveState([], null),
  setVehicles: (vehicles) =>
    set((state) => deriveState(vehicles, state.primaryVehicleId)),
  addVehicle: (vehicle) =>
    set((state) => deriveState([...state.vehicles, vehicle], state.primaryVehicleId ?? vehicle.id)),
  removeVehicle: (id) =>
    set((state) => {
      const vehicles = state.vehicles.filter((v) => v.id !== id);
      const primaryVehicleId = state.primaryVehicleId === id ? null : state.primaryVehicleId;
      return deriveState(vehicles, primaryVehicleId);
    }),
  setPrimaryVehicle: (id) => set((state) => deriveState(state.vehicles, id)),
}));
