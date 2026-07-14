import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type {  CityTypeList } from "../../../../types/types";
import type { AxiosError } from "axios";
import api from "../../../../../api/axios";

interface ApiCityType {
  City: CityTypeList;
  updatedCity: CityTypeList;
  message: string;
}

export const fetchCities = createAsyncThunk<
  CityTypeList[]
>("city/fetchCities", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/api/city/get-cities");
    return res.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "مشکلی رخ داده است.");
  }
});

export const fetchCityWithCounty = createAsyncThunk<
  CityTypeList[],
  string | null,
  { rejectValue: string }
>("county/fetchCityWithProvince", async (countyName, { rejectWithValue }) => {
  try {
    const res = await api.get(`/api/city/get-cities-with-county/${countyName}`);
    return res.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "مشکلی رخ داده است.");
  }
});

export const addCity = createAsyncThunk<
  ApiCityType,
  CityTypeList,
  { rejectValue: string }
>("city/addcity", async (formData, { rejectWithValue }) => {
  console.log(formData);
  try {
    const res = await api.post("/api/city/add-city", formData);
    return res.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "مشکلی رخ داده است.");
  }
});

export const editCity = createAsyncThunk<
  ApiCityType,
  CityTypeList,
  { rejectValue: string }
>("city/editCity", async (formData, { rejectWithValue }) => {
  try {
    const res = await api.put(
      `/api/city/edit-city/${formData?.name}`,
      formData
    );
    return res.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "مشکلی رخ داده است.");
  }
});

interface InitialStateType {
  cityList: CityTypeList[];
  cityByCounty: CityTypeList[];
  loading: string;
  error: string | null;
}

const initialState: InitialStateType = {
  cityList: [],
  cityByCounty: [],
  loading: "loadingList",
  error: null,
};

const citySlice = createSlice({
  name: "city",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //fetch cities
      .addCase(fetchCities.pending, (state) => {
        state.loading = "loadingList";
        state.error = null;
      })
      .addCase(
        fetchCities.fulfilled,
        (state, action: PayloadAction<CityTypeList[]>) => {
          state.loading = "";
          state.cityList = action.payload;
        }
      )
      .addCase(fetchCities.rejected, (state, action) => {
        state.loading = "";
        state.error = action.payload as string;
      })

      // fetch city With county
      .addCase(fetchCityWithCounty.pending, (state) => {
        state.loading = "loadingByCounty";
        state.error = null;
        state.cityByCounty=[];
      })
      .addCase(
        fetchCityWithCounty.fulfilled,
        (state, action: PayloadAction<CityTypeList[]>) => {
          state.loading = "";
          state.cityByCounty = action.payload;
        }
      )
      .addCase(fetchCityWithCounty.rejected, (state, action) => {
        state.loading = "";
        state.error = action.payload as string;
      })

      // add city
      .addCase(addCity.pending, (state) => {
        state.loading = "loadingAdd";
        state.error = null;
      })
      .addCase(
        addCity.fulfilled,
        (state, action: PayloadAction<ApiCityType>) => {
          state.loading = "";
          state.cityList.push(action?.payload?.City);
        }
      )
      .addCase(addCity.rejected, (state, action) => {
        state.loading = "";
        state.error = action.payload as string;
      })
      // edit city
      .addCase(editCity.pending, (state) => {
        state.loading = "loadingEdit";
        state.error = null;
      })
      .addCase(
        editCity.fulfilled,
        (state, action: PayloadAction<ApiCityType>) => {
          const { _id, faName, name, provinceName, countyName } =
            action.payload.updatedCity;
          const city = state.cityList.find((s) => s._id === _id);
          if (city) {
            city.faName = faName;
            city.name = name;
            city.provinceName = provinceName;
            city.countyName = countyName;
          }
          state.loading = "";
          state.error = null;
        }
      )
      .addCase(editCity.rejected, (state, action) => {
        state.loading = "";
        state.error = action.payload as string;
      });
  },
});

export default citySlice.reducer;
