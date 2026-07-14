import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { PaginateArgsType, EmployeeType } from "../../../../types/types";
import api from "../../../../../api/axios";
import type { AxiosError } from "axios";

export const fetchEmployee = createAsyncThunk<DataType, PaginateArgsType>(
  "person/fetchEmployee",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const res = await api.get(
        `/api/employee/get-employees?page=${page}&limit=${limit}`
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
  data: EmployeeType[];
  total: number;
  totalPages: number;
  currentPage: number;
}

interface InitialStateType {
  employeeListByPage: EmployeeType[];
  loading: string;
  error: string | null;
  total: number;
  totalPages: number;
  currentPage: number;
}

const initialState: InitialStateType = {
  employeeListByPage: [],
  loading: "loadingList",
  error: null,
  total: 0,
  totalPages: 0,
  currentPage: 0,
};

const EmployeeSlice = createSlice({
  name: "person",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //fetch employee
      .addCase(fetchEmployee.pending, (state) => {
        state.loading = "loadingList";
        state.error = null;
      })
      .addCase(
        fetchEmployee.fulfilled,
        (state, action: PayloadAction<DataType>) => {
          state.loading = "";
          state.employeeListByPage = action.payload?.data;
          console.log(action.payload?.data);
          state.total = action.payload?.total;
          state.totalPages = action.payload?.totalPages;
          state.currentPage = action.payload?.currentPage;
        }
      )
      .addCase(fetchEmployee.rejected, (state, action) => {
        state.loading = "";
        state.error = action.payload as string;
      });
  },
});

export default EmployeeSlice.reducer;
