import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { AuthStateType, ProvinceType } from "../../../../types/types";
import api from "../../../../../api/axios";
import type { AxiosError } from "axios";

export const fetchProvinces = createAsyncThunk<ProvinceType[]>(
  "province/fetchProvinces",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/province/get-provinces");
      return res.data as ProvinceType[];
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message || "مشکلی رخ داده است."
      );
    }
  }
);

interface ApiType {
  Province: ProvinceType;
  updatedProvince: ProvinceType;
  message: string;
}

export const addProvince = createAsyncThunk<
  ApiType,
  ProvinceType,
  { rejectValue: string }
>("province/addProvince", async (formData, { rejectWithValue, getState }) => {
  console.log(formData);
  const state = getState() as { auth: AuthStateType };
  const token = state.auth.token;
  try {
    const res = await api.post("/api/province/add-province", formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.log(error);
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "مشکلی رخ داده است.");
  }
});

export const editProvince = createAsyncThunk<
  ApiType,
  ProvinceType,
  { rejectValue: string }
>("province/editProvince", async (formData, { rejectWithValue, getState }) => {
  const state = getState() as { auth: AuthStateType };
  const token = state.auth.token;
  try {
    const res = await api.put(
      `/api/province/edit-province/${formData?.name}`,
      formData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "مشکلی رخ داده است.");
  }
});

interface ProvinceStateType {
  provinceList: ProvinceType[];
  loading: string;
  error: string | null;
}
const initialState: ProvinceStateType = {
  provinceList: [],
  loading: "loadingList",
  error: null,
};
const provinceSlice = createSlice({
  name: "province",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch all provinces
      .addCase(fetchProvinces.pending, (state) => {
        state.loading = "loadingList";
        state.error = null;
      })
      .addCase(
        fetchProvinces.fulfilled,
        (state, action: PayloadAction<ProvinceType[]>) => {
          state.loading = "";
          state.provinceList = action.payload;
        }
      )
      .addCase(fetchProvinces.rejected, (state, action) => {
        state.loading = "";
        state.error = action.payload as string;
      })

      // add province
      .addCase(addProvince.pending, (state) => {
        state.loading = "loadingAdd";
        state.error = null;
      })
      .addCase(
        addProvince.fulfilled,
        (state, action: PayloadAction<ApiType>) => {
          state.loading = "";
          state.provinceList.push(action.payload.Province);
        }
      )
      .addCase(addProvince.rejected, (state, action) => {
        state.loading = "";
        state.error = action.payload as string;
      })

      // edit province
      .addCase(editProvince.pending, (state) => {
        state.loading = "loadingEdit";
        state.error = null;
      })
      .addCase(
        editProvince.fulfilled,
        (state, action: PayloadAction<ApiType>) => {
          const { _id, faName, name } = action.payload.updatedProvince;
          const province = state.provinceList.find((s) => s._id === _id);
          if (province) {
            province.faName = faName;
            province.name = name;
          }
          state.loading = "";
          state.error = null;
        }
      )
      .addCase(editProvince.rejected, (state, action) => {
        state.loading = "";
        state.error = action.payload as string;
      });
  },
});

export default provinceSlice.reducer;
