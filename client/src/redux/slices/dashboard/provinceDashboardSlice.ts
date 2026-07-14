import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "../../../../api/axios";
import type { AxiosError } from "axios";
import type { IData, IProvinceDashboard } from "./types";

const initialState: IProvinceDashboard = {
  province: null,
  data: null,
  loading: false,
  error: null,
};

export const getProvinceDashboard = createAsyncThunk<
  IData,
  { provinceName: string }
>(
  "provinceDashboard/getProvinceDashboard",
  async ({ provinceName }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/dashboard/province/${provinceName}`);
      return res.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message || "مشکلی رخ داده است."
      );
    }
  }
);

const provinceDashboardSlice = createSlice({
  name: "provinceDashboard",
  initialState,
  reducers: {
    setProvince: (state, action) => {
      state.province = action.payload;
    },
    setProvDashData: (state) => {
      state.province = null;
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getProvinceDashboard
      .addCase(getProvinceDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getProvinceDashboard.fulfilled,
        (state, action: PayloadAction<IData>) => {
          state.loading = false;
          console.log(action);
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(getProvinceDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setProvince, setProvDashData } = provinceDashboardSlice.actions;
export default provinceDashboardSlice.reducer;
