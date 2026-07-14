import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import api from "../../../../../api/axios";
import type {
  InsuranceType,
  MaintenanceType,
  VehicleType,
} from "../../../../types/types";

interface PropsType {
  id: string | null;
  token: string | null;
}

interface DataType {
  vehicle: VehicleType | null;
  insurance: InsuranceType[] | null;
  maintenance: MaintenanceType[] | null;
}
interface InitialStateType {
  data: DataType | null;
  loading: boolean;
  error: string | null;
}

const initialState: InitialStateType = {
  data: null,
  loading: false,
  error: null,
};

export const fetchVehicle = createAsyncThunk<DataType, PropsType>(
  "person/fetchVehicle",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/vehicle/get-vehicle-with-vin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log(res?.data);;
      return res.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message || "مشکلی رخ داده است."
      );
    }
  }
);

const vehicleSlice = createSlice({
  name: "vehicle",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //fetch vehicle
      .addCase(fetchVehicle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchVehicle.fulfilled,
        (state, action: PayloadAction<DataType>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(fetchVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default vehicleSlice.reducer;
