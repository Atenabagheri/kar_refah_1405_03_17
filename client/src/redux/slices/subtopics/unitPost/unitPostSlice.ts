import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { UnitByProvinceType, UnitPostType } from "../../../../types/types";
import type { AxiosError } from "axios";
import api from "../../../../../api/axios";

interface APiUnitPostType {
  UnitPosition: UnitPostType;
  updatedUnitPosition: UnitPostType;
  message: string;
}

export interface FormDataType {
  WithTenure: number | string;
  WithoutTenure: number | string;
  countyName: string | null;
  cityName: string | null;
  distance: number | string;
  officeComplex: boolean;
  isUpdate: boolean;
  provinceName: string | null;
  unitType: string | null;
  population: number | string;
  description?: string;
  updateDescription?: string;
}

export interface EditUnitPositionArgs {
  formData: FormDataType;
  url: string;
}

export interface FetchUnitPositionArgs {
  dateCategory: string | undefined;
  province: string | undefined;
}

export const fetchUnitPosts = createAsyncThunk<UnitPostType[]>(
  "unitPost/fetchUnitPosts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/unit-position/get-unit-positions");
      return res.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message || "مشکلی رخ داده است."
      );
    }
  }
);

export const fetchUnitPostsByProvince = createAsyncThunk<
  UnitByProvinceType,
  FetchUnitPositionArgs,
  { rejectValue: string }
>(
  "unitPost/fetchUnitPostsByProvince",
  async ({ dateCategory, province }, { rejectWithValue }) => {
    try {
      const res = await api.get(
        `/api/unit-position/get-unit-positions-with-province/${dateCategory}/${province}`
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

export const addUnitPost = createAsyncThunk<
  APiUnitPostType,
  FormDataType,
  { rejectValue: string }
>("unitPost/UnitPost", async (formData, { rejectWithValue }) => {
  console.log(formData);
  try {
    const res = await api.post(
      "/api/unit-position/add-unit-position",
      formData
    );
    return res.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "مشکلی رخ داده است.");
  }
});

export const editUnitPost = createAsyncThunk<
  APiUnitPostType,
  EditUnitPositionArgs,
  { rejectValue: string }
>("unitPost/editUnitPost", async ({ formData, url }, { rejectWithValue }) => {
  try {
    const res = await api.put(url, formData);
    return res.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "مشکلی رخ داده است.");
  }
});

interface InitialStateType {
  unitPostList: UnitPostType[];
  unitPostByProvinceList: UnitByProvinceType | null;
  loading: string;
  error: string | null;
}

const initialState: InitialStateType = {
  unitPostList: [],
  unitPostByProvinceList: null,
  loading: "loadingList",
  error: null,
};

const unitPostSlice = createSlice({
  name: "unitPost",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //fetch cities
      .addCase(fetchUnitPosts.pending, (state) => {
        state.loading = "loadingList";
        state.error = null;
      })
      .addCase(
        fetchUnitPosts.fulfilled,
        (state, action: PayloadAction<UnitPostType[]>) => {
          state.loading = "";
          state.unitPostList = action.payload;
        }
      )
      .addCase(fetchUnitPosts.rejected, (state, action) => {
        state.loading = "";
        state.error = action.payload as string;
      })
      //fetch fetch UnitPosts By Province
      .addCase(fetchUnitPostsByProvince.pending, (state) => {
        state.loading = "loadingUnitByProvince";
        state.error = null;
        state.unitPostByProvinceList = null;
      })
      .addCase(
        fetchUnitPostsByProvince.fulfilled,
        (state, action: PayloadAction<UnitByProvinceType>) => {
          state.loading = "";
          state.unitPostByProvinceList = action.payload;
        }
      )
      .addCase(fetchUnitPostsByProvince.rejected, (state, action) => {
        state.loading = "";
        state.error = action.payload as string;
      })
      // add UnitPosition
      .addCase(addUnitPost.pending, (state) => {
        state.loading = "loadingAdd";
        state.error = null;
      })
      .addCase(
        addUnitPost.fulfilled,
        (state, action: PayloadAction<APiUnitPostType>) => {
          state.loading = "";
          state.unitPostList.push(action?.payload?.UnitPosition);
        }
      )
      .addCase(addUnitPost.rejected, (state, action) => {
        state.loading = "";
        state.error = action.payload as string;
      })
      // edit unitpost
      .addCase(editUnitPost.pending, (state) => {
        state.loading = "loadingEdit";
        state.error = null;
      })
      .addCase(
        editUnitPost.fulfilled,
        (state, action: PayloadAction<APiUnitPostType>) => {
          state.unitPostList = state.unitPostList.map((unit) =>
            unit._id === action.payload.updatedUnitPosition._id
              ? action.payload.updatedUnitPosition
              : unit
          );
          state.loading = "";
          state.error = null;
        }
      )
      .addCase(editUnitPost.rejected, (state, action) => {
        state.loading = "";
        state.error = action.payload as string;
      });
  },
});

export default unitPostSlice.reducer;
