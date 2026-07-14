import type { ReactElement } from "react";

export type ParamsType = {
  province: string;
  topic: string;
  subtopic: string;
  id?: string;
};

export type NavSubLink = {
  title: string;
  path: string;
};

export type NavLink = {
  isAccess?: boolean;
  title: string;
  path: string;
  headline?: {
    title: string;
    sub: NavSubLink[];
  }[];
  sub?: NavSubLink[];
};

export type InputFormType = {
  name: string;
  title: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  type: string;
  min?: number;
  check?: boolean;
  disabled?: boolean;
  placeholder: string;
  children?: ReactElement;
  value: string | number;
  error?: string
};

export type TextareaFormType = {
  name: string;
  title: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  check?: boolean;
  placeholder: string;
  children?: ReactElement;
  value: string;
  className?: string
};

export type OptionsType = {
  value: string;
  name: string;
};

export type StatitcSelectFormType = {
  name: string;
  title: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  check?: boolean;
  children?: ReactElement;
  options: OptionsType[];
  value?: string;
  disabled?: boolean;
};

export type SubmitButtonType = {
  isLoading: boolean;
  className?: string;
  disabled?: boolean;
  isEdit?: boolean;
  type?: "submit" | "button" | "reset"
  onClick?: () => void
};

export interface ProvinceType {
  _id?: string;
  name: string;
  faName: string;
  population?: number;
  totalCounty?: number;
}

export interface FormProvinceType {
  data: ProvinceType | null;
}
export interface CountyType {
  _id: string;
  name: string;
  faName: string;
  provinceName?: ProvinceType;
  city?: boolean;
  isNewCounty?: boolean;
}

export interface CountyTypeList {
  _id?: string;
  name: string;
  faName: string;
  provinceName?: string;
  city: boolean;
  isNewCounty?: boolean;
}

export interface FormCityType {
  data: CityType | null;
}

export interface FormCountyType {
  data: CountyType | null;
}

export interface CityType {
  _id?: string;
  name: string;
  faName?: string;
  provinceName?: ProvinceType;
  countyName?: CountyType;
}

export interface CityTypeList {
  _id?: string;
  name: string;
  faName: string;
  provinceName?: string;
  countyName?: string;
}

export interface DateCategoryType {
  code: string;
  title: string;
  description?: string;
}
export interface FormDateCategoryType {
  data: DateCategoryType | null;
}
export interface UnitPostType {
  WithTenure: number;
  WithoutTenure: number;
  countyName: CountyType;
  cityName: CityType;
  distance: number;
  officeComplex: boolean;
  isUpdate: boolean;
  provinceName: ProvinceType;
  dateCategory: DateCategoryType;
  unitType: string;
  population: number;
  description?: string;
  updateDescription?: string;
  _id: string;
}

export interface FormUnitPostType {
  data: UnitPostType | null;
}

export interface UnitByProvinceType {
  data: UnitPostType[];
  headquarter: {
    WithTenure: number | string;
    WithoutTenure: number | string;
    total: number | string;
  };
  totalManagement: string | number;
  totalDepartment: string | number;
  totalAgency: string | number;
  totalWithTenure: string | number;
  totalWithoutTenure: string | number;
}

export interface SelectFormDataType {
  name: string;
  faName?: string;
  _id?: string;
  city?: boolean;
  isNewCounty?: boolean;
  // provinceName?: ProvinceType;
  // countyName?: CountyType;
}

export type SelectFormType = {
  label: string;
  data: SelectFormDataType[];
  selected: SelectFormDataType | undefined;
  setSelected: React.Dispatch<
    React.SetStateAction<SelectFormDataType | undefined>
  >;
  setSelectedName?: React.Dispatch<React.SetStateAction<string | null>>;
  check?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
};

export type DateCategorySelectType = {
  label: string;
  data: DateCategoryType[];
  selected: DateCategoryType | undefined;
  setSelected: React.Dispatch<
    React.SetStateAction<DateCategoryType | undefined>
  >;
  setSelectedCode: React.Dispatch<React.SetStateAction<string | null>>;
  check?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
};

export interface PositionType {
  title: string;
  code: string;
}

export type RolesType = "MHQO" | "EHQO" | "MPO" | "EPO";
export interface EmployeeType {
  firstName: string;
  lastName: string;
  nationalId: string;
  phone: string;
  positionCode: PositionType | null;
  province: ProvinceType;
  roomNumber: RoomsType;
  address: string;
  password: string;
  roles: RolesType;
  isAdmin: boolean;
  access: string[];
  county: CountyType;
  vehicle: VehicleType[];
  image: string
  gallery: string[]
  assetsCategory: { name: string; code: string; assets: AssetsType[] }[];
}

export interface PositionType {
  title: string;
  code: string;
  description: string;
  maxEmployees: number;
  employee: EmployeeType[];
}
// export interface PositionProfileType extends PositionType {
//   employee: EmployeeType[];
// }

export interface PaginateArgsType {
  page: number | string;
  limit: number | string;
}

export interface TotalPageType {
  total: number;
  totalPages: number;
  currentPage?: number;
}

// export interface EmployeeArgsType {
//   page: number | string;
//   limit: number | string;
// }

export interface DivisionType {
  faName: string;
  code: string;
}

export interface FloorType {
  name: string;
  number: string;
}

export interface AssetsCategoryType {
  name: string;
  code: string;
  description?: string;
}

export interface AssetsType {
  name: string;
  code: string;
  description: string;
  category: AssetsCategoryType;
  serialNumber: number;
  employee: EmployeeType;
  roomNumber: RoomsType;
}

export interface RoomsType extends FloorType {
  floor: string;
  employees?: EmployeeType[];
}

export interface RoomsProfileType extends FloorType {
  floor: FloorType;
  description: string;
  building: BuildingType;
  employees: EmployeeType[];
  image: string;
  gallery: [];
  assetsCategory: {
    name: string;
    code: string;
    assets: AssetsType[];
  }[];
}

export interface ElectricityMetersType {
  building: BuildingType;
  buildingsCover: BuildingType[];
  serialNumber: string;
  billIdentifier: string;
  creator: string;
}

export interface WaterMetersType {
  building: BuildingType;
  buildingsCover: BuildingType[];
  serialNumber: string;
  billIdentifier: string;
  creator: string;
}

export interface GasMetersType {
  building: BuildingType;
  buildingsCover: BuildingType[];
  serialNumber: string;
  billIdentifier: string;
  creator: string;
}

export interface SiteType {
  postalCode: string;
  name: string;
  province: ProvinceType;
  county: CountyType;
  city: CityType;
  address: string;
}

export type BasicType = "hqs" | "province";

export interface MeterListType {
  type: BasicType;
  serialNumber: string;
  billIdentifier: string;
  building: BuildingType;
  site: SiteType;
}

export type UsageBildinhType = [
  "administrative",
  "educational",
  "sports",
  "welfare",
  "cultural",
  "other",
];
export interface BuildingType {
  name: string;
  number?: string;
  postalCode: string;
  address: string;
  description?: string;
  division?: DivisionType | null;
  type: BasicType;
  province: ProvinceType | null;
  county: CountyType | null;
  city: CityType | null;
  usage: UsageBildinhType;
  rooms: RoomsType[];
  electricityMeters: ElectricityMetersType[];
  waterMeters: ElectricityMetersType[];
  gasMeters: ElectricityMetersType[];
  meterage?: number;
  landArea?: number;
  builtArea?: number;
  site: SiteType;
  floors: number;
  ownership: "other" | "owner" | "leased";
  image: string | null;
  gallery: string[];
}

export interface ElectricityBillType2 {
  currentReading: string;
  paymentIdentifier: string;
  previousReading: string;
  period: string;
  billIdentifier: string;
  creator: EmployeeType;
  serialNumber: { serialNumber: string; building: BuildingType };
  totalBillDebt: number;
  totalDays: number;
  totalPeriod: number;
  averageThirtyDay: number;
}

export interface ElectricityBillType {
  _id: string;
  billIdentifier: string;
  creator: EmployeeType;
  updatedAt: string;

  avgCost: number;
  billAmt: number;
  billType: string;
  energyAmt: number;
  grossAmt: number;
  insuranceAmt: number;
  issueDate: string;
  lowCons: number;
  normalCons: number;
  patternMessage: string;
  peakCons: number;
  powerPaytollAmt: number;
  prevReadingDate: string;
  previousEnergyDebit: number;
  processStatus: string;
  readingDate: string;
  salePrd: number;
  saleYear: number;
  taxAmt: number;
  totalDays: number;
}

export interface ProfileElectricityBillType {
  electricityMeter: ElectricityMetersType;
  electricityBill: ElectricityBillType;
}

export interface WaterBillType {
  currentReading: string;
  paymentIdentifier: string;
  previousReading: string;
  period: string;
  billIdentifier: string;
  creator: EmployeeType;
  serialNumber: { serialNumber: string; building: BuildingType };
  totalBillDebt: number;
  totalDays: number;
  totalPeriod: number;
  averageThirtyDay: number;
}

export interface ProfileWaterBillType extends WaterBillType {
  paymentDeadLine: string;
  createdAt: string;
  updatedAt: string;
  averageThirtyDay: number;
}

export interface GasBillType {
  currentReading: string;
  paymentIdentifier: string;
  previousReading: string;
  period: string;
  billIdentifier: string;
  creator: EmployeeType;
  serialNumber: { serialNumber: string; building: BuildingType };
  totalBillDebt: number;
  totalDays: number;
  totalPeriod: number;
  averageThirtyDay: number;
}

export interface ProfileGasBillType extends GasBillType {
  paymentDeadLine: string;
  createdAt: string;
  updatedAt: string;
  averageThirtyDay: number;
}

export interface GreenBillType {
  _id: string;
  currentReading: string;
  previousReading: string;
  period: string;
  averageThirtyDay: number;
  billIdentifier: string;
  creator: EmployeeType;
  serialNumber: { serialNumber: string; building: BuildingType };
  totalDays: number;
  totalPeriod: number;
}

export interface ProfileGreenBillType extends GreenBillType {
  createdAt: string;
  updatedAt: string;

}

export interface DieselType {
  building: BuildingType;
  site: SiteType;
  province: ProvinceType;
  county: CountyType;
  city: CityType;
  description: string;
  creator: EmployeeType;
  type: "hqs" | "province";
  invoiceNumber: string;
  documentNumber: string;
  purchaseDate: string;
  amount: string;
  quantity: number;
  buyer: EmployeeType;
}

export interface HeadquarterSectionsType {
  sectionDeputy: number;
  sectionCenter: number;
  sectionGeneral: number;
  sectionOffice: number;
  sectionManagement: number;
  sectionDepartment: number;
}

export interface HeadquarterType extends HeadquarterSectionsType {
  dateCategory: string;
  creator: string;
  divisionCode: DivisionType;
  sectionCode: DivisionType;
}

export interface FilterDataType {
  name: string;
  code: string;
}

export interface AuthStateType {
  token: string | null;
  user: EmployeeType | null;
  loadingUser: boolean;
  loadingLogin: boolean;
  loadingToken: boolean;
  error: string | null;
}

export interface VehicleBrandType {
  creator: EmployeeType;
  name: string;
  faName: string;
  country: string;
  foundedYear: string;
  logo?: string;
  description?: string;
  isActive: boolean;
}
export interface VehicleTypeType {
  creator: EmployeeType;
  name: string;
  faName: string;
  description?: string;
}
export interface VehicleType {
  type: BasicType;
  operatorType: "special" | "general";
  operatorSpecial: EmployeeType;
  operatorGeneral: DivisionType;
  wheelman: EmployeeType;
  vehicleType: VehicleTypeType;
  brand: VehicleBrandType;
  model: string;
  year: string;
  licensePlate: string;
  color: string;
  vin: string;
  engineNumber: string;
  fuelType: string;
  status: string;
  description: string;
  transmission: string;
  seats: number;
  horsepower: number;
  doors: number;
  image: string;
  gallery: string[];
  engineCapacity: number;
  mileage: number;
  price: number;
  updatedAt: string;
}

export interface InsuranceType {
  creator: EmployeeType;
  description: string;
  insuranceCompany: string;
  insuranceCode: string;
  thirdPartyNumber: string;
  thirdPartyExpire: string;
  bodyNumber: string;
  bodyExpire: string;
  inspectionSerial: string;
  inspectionExpire: string;
  vehicle: VehicleType;
  image: string
  gallery: [string]
}

export interface MaintenanceType {
  createdAt: string;
  financialDocumentNumber: string;
  laborPayment: number;
  partsPayment: number;
  repairDate: string;
  repairShop: string;
  repairType: string;
  updatedAt: string;
  vehicle: VehicleType;
  description: string;
}
