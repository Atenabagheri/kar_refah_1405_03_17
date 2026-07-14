import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { DateCategoryType } from "../../../../types/types";
import api from "../../../../../api/axios";
import type { AxiosError } from "axios";

interface ApiDateCategory {
  dateCategory: DateCategoryType;
  updatedDateCategory: DateCategoryType;
  message: string;
}

export const fetchDateCategories = createAsyncThunk<
  DateCategoryType[]
>("dateCategory/fetchDateCategories", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/api/date-category/get-date-categories");
    return res.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "مشکلی رخ داده است.");
  }
});

export const addDateCategory = createAsyncThunk<
  ApiDateCategory,
  DateCategoryType,
  { rejectValue: string }
>("dateCategory/addDateCategory", async (formData, { rejectWithValue }) => {
  console.log(formData);
  try {
    const res = await api.post(
      "/api/date-category/add-date-category",
      formData
    );
    return res.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "مشکلی رخ داده است.");
  }
});

export const editDateCategory = createAsyncThunk<
  ApiDateCategory,
  DateCategoryType,
  { rejectValue: string }
>("dateCategory/editDateCategory", async (formData, { rejectWithValue }) => {
  try {
    const res = await api.put(
      `/api/date-category/edit-date-category/${formData?.code}`,
      formData
    );
    return res.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "مشکلی رخ داده است.");
  }
});

interface InitialStateType {
  dateCategoryList: DateCategoryType[];
  loading: string;
  error: string | null;
}

const initialState: InitialStateType = {
  dateCategoryList: [],
  loading: "loadingList",
  error: null,
};

const dateCategorySlice = createSlice({
  name: "dateCategory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch all date categories
      .addCase(fetchDateCategories.pending, (state) => {
        state.loading = "loadingList";
        state.error = null;
      })
      .addCase(
        fetchDateCategories.fulfilled,
        (state, action: PayloadAction<DateCategoryType[]>) => {
          state.loading = "";
          state.dateCategoryList = action.payload;
        }
      )
      .addCase(fetchDateCategories.rejected, (state, action) => {
        state.loading = "";
        state.error = action.payload as string;
      })

      // add date category
      .addCase(addDateCategory.pending, (state) => {
        state.loading = "loadingAdd";
        state.error = null;
      })
      .addCase(
        addDateCategory.fulfilled,
        (state, action: PayloadAction<ApiDateCategory>) => {
          state.loading = "";
          state.dateCategoryList.push(action?.payload?.dateCategory);
        }
      )
      .addCase(addDateCategory.rejected, (state, action) => {
        state.loading = "";
        state.error = action.payload as string;
      })
      // edit date category
      .addCase(editDateCategory.pending, (state) => {
        state.loading = "loadingEdit";
        state.error = null;
      })
      .addCase(
        editDateCategory.fulfilled,
        (state, action: PayloadAction<ApiDateCategory>) => {
          state.dateCategoryList = state.dateCategoryList.map((date) =>
            date.code === action.payload.updatedDateCategory.code
              ? action.payload.updatedDateCategory
              : date
          );
          state.loading = "";
          state.error = null;
        }
      )
      .addCase(editDateCategory.rejected, (state, action) => {
        state.loading = "";
        state.error = action.payload as string;
      });
  },
});

export default dateCategorySlice.reducer;
