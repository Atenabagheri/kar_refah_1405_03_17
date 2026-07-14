import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { CountyTypeList, ProvinceType } from "../../../../types/types";
import api from "../../../../../api/axios";
import type { AxiosError } from "axios";

interface ApiCountyType {
  County: CountyTypeList;
  updatedCounty: CountyTypeList;
  message: string;
}

export const fetchCounties = createAsyncThunk<CountyTypeList[]>(
  "county/fetchCounties",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/county/get-counties");
      return res.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message || "مشکلی رخ داده است."
      );
    }
  }
);

export const fetchCountyWithProvince = createAsyncThunk<
  CountyTypeList[],
  string | null,
  { rejectValue: string }
>(
  "county/fetchCountyWithProvince",
  async (provinceName, { rejectWithValue }) => {
    try {
      const res = await api.get(
        `/api/county/get-counties-with-province/${provinceName}`
      );
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

export const fetchCountyIncludeCity = createAsyncThunk<
  CountyTypeList[],
  string | null,
  { rejectValue: string }
>(
  "county/fetchCountyIncludeCity",
  async (provinceName, { rejectWithValue }) => {
    try {
      const res = await api.get(
        `/api/county/get-counties-with-province-and-city/${provinceName}`
      );
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

export const fetchAllCountiesWithCity = createAsyncThunk<CountyTypeList[]>(
  "county/fetchCountiesWithCity",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/county/get-counties-for-cities`);
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

export const addCounty = createAsyncThunk<
  ApiCountyType,
  CountyTypeList,
  { rejectValue: string }
>("county/addCounty", async (formData, { rejectWithValue }) => {
  console.log(formData);
  try {
    const res = await api.post("/api/county/add-county", formData);
    return res.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "مشکلی رخ داده است.");
  }
});

export const editCounty = createAsyncThunk<
  ApiCountyType,
  CountyTypeList,
  { rejectValue: string }
>("county/editCounty", async (formData, { rejectWithValue }) => {
  try {
    const res = await api.put(
      `/api/county/edit-county/${formData?.name}`,
      formData
    );
    return res.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "مشکلی رخ داده است.");
  }
});

interface InitialStateType {
  countyList: CountyTypeList[];
  countyByProvince: ProvinceType[];
  countiesWithCity: CountyTypeList[];
  allCountiesWithCity: ProvinceType[];
  loading: string;
  error: string | null;
}

const initialState: InitialStateType = {
  countyList: [],
  countyByProvince: [],
  countiesWithCity: [],
  allCountiesWithCity: [],
  loading: "loadingList",
  error: null,
};

const countySlice = createSlice({
  name: "county",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch all counties
      .addCase(fetchCounties.pending, (state) => {
        state.loading = "loadingList";
        state.error = null;
      })
      .addCase(
        fetchCounties.fulfilled,
        (state, action: PayloadAction<CountyTypeList[]>) => {
          state.loading = "";
          state.countyList = action.payload;
        }
      )
      .addCase(fetchCounties.rejected, (state, action) => {
        state.loading = "";
        state.error = action.payload as string;
      })

      // fetch county With Province
      .addCase(fetchCountyWithProvince.pending, (state) => {
        state.loading = "loadingByProvince";
        state.error = null;
      })
      .addCase(
        fetchCountyWithProvince.fulfilled,
        (state, action: PayloadAction<CountyTypeList[]>) => {
          state.loading = "";
          state.countyByProvince = action.payload;
        }
      )
      .addCase(fetchCountyWithProvince.rejected, (state, action) => {
        state.loading = "";
        state.error = action.payload as string;
      })
      // fetch county include city
      .addCase(fetchCountyIncludeCity.pending, (state) => {
        state.loading = "loadingByProvince";
        state.error = null;
      })
      .addCase(
        fetchCountyIncludeCity.fulfilled,
        (state, action: PayloadAction<CountyTypeList[]>) => {
          state.loading = "";
          state.countiesWithCity = action.payload;
        }
      )
      .addCase(fetchCountyIncludeCity.rejected, (state, action) => {
        state.loading = "";
        state.error = action.payload as string;
      })

      // fetch all counties with city
      .addCase(fetchAllCountiesWithCity.pending, (state) => {
        state.loading = "loading";
        state.error = null;
      })
      .addCase(
        fetchAllCountiesWithCity.fulfilled,
        (state, action: PayloadAction<CountyTypeList[]>) => {
          state.loading = "";
          state.allCountiesWithCity = action.payload;
        }
      )
      .addCase(fetchAllCountiesWithCity.rejected, (state, action) => {
        state.loading = "";
        state.error = action.payload as string;
      })

      // add county
      .addCase(addCounty.pending, (state) => {
        state.loading = "loadingAdd";
        state.error = null;
      })
      .addCase(
        addCounty.fulfilled,
        (state, action: PayloadAction<ApiCountyType>) => {
          const county = action?.payload?.County;
          state.loading = "";
          state.countyList.push(county);
          // const hasCity = county?.city;
          // if (hasCity) {
          //   const countyWithCity: ProvinceType = {
          //     faName: county?.faName,
          //     name: county?.name,
          //   };
          //   state.allCountiesWithCity.push(countyWithCity);
          // }
        }
      )
      .addCase(addCounty.rejected, (state, action) => {
        state.loading = "";
        state.error = action.payload as string;
      })

      // edit county
      .addCase(editCounty.pending, (state) => {
        state.loading = "loadingEdit";
        state.error = null;
      })
      .addCase(
        editCounty.fulfilled,
        (state, action: PayloadAction<ApiCountyType>) => {
          const { _id, faName, name, provinceName } =
            action.payload.updatedCounty;
          const county = state.countyList.find((s) => s._id === _id);
          if (county) {
            county.faName = faName;
            county.name = name;
            county.provinceName = provinceName;
          }
          state.loading = "";
          state.error = null;
          // const hasCity = city;
          // const newCounty = state.allCountiesWithCity?.find(
          //   (c) => c?.name === name
          // );
          // if (!newCounty && hasCity) {
          //   state.allCountiesWithCity.push({ name, faName, _id });
          // } else if (newCounty && !hasCity) {
          //   state.allCountiesWithCity = state.allCountiesWithCity.filter(
          //     (c) => c?.name !== newCounty?.name
          //   );
          // }
        }
      )
      .addCase(editCounty.rejected, (state, action) => {
        state.loading = "";
        state.error = action.payload as string;
      });
  },
});

export default countySlice.reducer;
