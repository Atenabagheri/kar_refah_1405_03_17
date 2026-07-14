import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth/AuthSlice";
import provinceReducer from "./slices/subtopics/province/provinceSlice";
import countyReducer from "./slices/subtopics/county/countySlice";
import cityReducer from "./slices/subtopics/city/citySlice";
import unitPostReducer from "./slices/subtopics/unitPost/unitPostSlice";
import dateCategoryReducer from "./slices/subtopics/date-category/dateCategorySlice";
import employeeReducer from "./slices/subtopics/employee/employeeSliece";
import buildingReducer from "./slices/subtopics/building/buildingSlice";
import vehicleReducer from "./slices/subtopics/vehicle/vehicleSlice";
import provinceDashboardReducer from "./slices/dashboard/provinceDashboardSlice";
import uiReducer from "./slices/ui/uiSlices";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    province: provinceReducer,
    county: countyReducer,
    city: cityReducer,
    unitPost: unitPostReducer,
    dateCategory: dateCategoryReducer,
    employee: employeeReducer,
    building: buildingReducer,
    vehicle: vehicleReducer,
    provinceDashboard: provinceDashboardReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
