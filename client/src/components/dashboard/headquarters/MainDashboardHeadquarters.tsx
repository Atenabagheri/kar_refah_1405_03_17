import MainVehicleDashboard from "./vehicle/MainVehicleDashboard";
import MainEnergyDashboard from "./energy/MainEnergyDashboard";
// import MainAssetDashboard from "./asset/MainAssetDashboard";
import MainBuildingDashboard from "./building/MainBuildingDashboard";
import { useEffect, useState } from "react";
import api from "../../../../api/axios";
import SkeletonHqsDashboard from "./SkeletonHqsDashboard";

export type BuildingDashbordType = {
  hqs: number;
  province: number;
  owner: number;
  leased: number;
  other: number;
  total: number;
} | null;

export type EnergyDashbordType = {
  total: number;
  electric: number;
  water: number;
  gas: number;
  hqs: number;
  province: number;
} | null;

export type VehicleDashbordType = {
  total: number;
  general: number;
  special: number;
  province: number;
  hqs: number;
  byType: [{ name: string; faName: string; count: number }];
} | null;

export type AssetDashbordType = {
  totalCategory: number;
  total: number;
  active: number;
  deactive: number;
  hqs: number;
  province: number;
} | null;
export type DashboardType = {
  vehicles: VehicleDashbordType;
  buildings: BuildingDashbordType;
  meters: EnergyDashbordType;
  assets: AssetDashbordType;
} | null;
const MainDashboardHeadquarters = () => {
  const [data, setData] = useState<DashboardType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await api.get<DashboardType>(`/api/dashboard`);
        // console.log(res?.data);;
        setData(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);
  return (
    <main className="flex items-center justify-center w-full overflow-y-auto">
      {loading ? (
        <SkeletonHqsDashboard />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full h-full">
          <MainVehicleDashboard data={data && data.vehicles} />
          <MainBuildingDashboard data={data && data.buildings} />
          <MainEnergyDashboard data={data && data.meters} />
          {/* <MainAssetDashboard data={data && data.assets} /> */}
        </div>
      )}
    </main>
  );
};

export default MainDashboardHeadquarters;
