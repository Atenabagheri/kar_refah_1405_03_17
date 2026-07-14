import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import api from "../../../../../api/axios";
import type { BuildingType, PaginateArgsType } from "../../../../types/types";

interface PropsType extends PaginateArgsType {
  province?: string | null;
}
export const fetchBuilding = createAsyncThunk<DataType, PropsType>(
  "person/fetchBuilding",
  async ({ province, page, limit }, { rejectWithValue }) => {
    try {
      const res = await api.get(
        `/api/building/get-buildings-with-province/${province}?page=${page}&limit=${limit}`
      );
      return res.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message || "مشکلی رخ داده است."
      );
    }
  }
);

interface DataType {
  data: BuildingType[];
  total: number;
  totalPages: number;
  currentPage: number;
}

interface InitialStateType {
  buildingListByPage: BuildingType[];
  loading: boolean;
  error: string | null;
  total: number;
  totalPages: number;
  currentPage: number;
}

const initialState: InitialStateType = {
  buildingListByPage: [],
  loading: false,
  error: null,
  total: 0,
  totalPages: 0,
  currentPage: 0,
};

const buildingSlice = createSlice({
  name: "person",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //fetch building
      .addCase(fetchBuilding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchBuilding.fulfilled,
        (state, action: PayloadAction<DataType>) => {
          state.loading = false;
          state.buildingListByPage = action.payload?.data;
          console.log(action.payload?.data);
          state.total = action.payload?.total;
          state.totalPages = action.payload?.totalPages;
          state.currentPage = action.payload?.currentPage;
        }
      )
      .addCase(fetchBuilding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default buildingSlice.reducer;
