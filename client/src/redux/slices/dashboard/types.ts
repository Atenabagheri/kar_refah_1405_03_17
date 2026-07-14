import type {
  BuildingType,
  ProvinceType,
  VehicleTypeType,
} from "../../../types/types";

export interface IBuildingDashboard {
  total: number;
  owner: number;
  leased: number;
  other: number;
}

export interface IVehicleDashboard {
  total: number;
  general: number;
  special: number;
  byType: (VehicleTypeType & { count: number })[];
}

export interface IMetersDashboard {
  total: number;
  totalElectric: number;
  totalGas: number;
  totalWater: number;
}

export interface IData {
  info: ProvinceType;
  buildings: IBuildingDashboard;
  vehicles: IVehicleDashboard;
  meters: IMetersDashboard;
  sportsBuildings: BuildingType[];
}

export interface IProvinceDashboard {
  data: IData | null;
  province: ProvinceType | null;
  loading: boolean;
  error: string | null;
}
