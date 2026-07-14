import type { ProvinceType } from "react-iran-provinces-map/dist/esm/interfaces";
import type { CityType, CountyType, UsageBildinhType } from "../../../types/types";

export interface IFormBuilding {
    name: string;
    number?: string;
    postalCode: string;
    address: string;
    description?: string;
    type: "hqs" | "province";
    province: ProvinceType | null;
    county: CountyType | null;
    city: CityType | null;
    usage: UsageBildinhType;
    meterage?: string;
    landArea?: string;
    builtArea?: string;
    site: string;
    floors: number;
    ownership: "other" | "owner" | "leased";
    image: string | null;
    gallery: string[];
}