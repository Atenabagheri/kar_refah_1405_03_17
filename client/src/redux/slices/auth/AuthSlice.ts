import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import api from "../../../../api/axios";
import type { EmployeeType } from "../../../types/types";

interface ApiGetTokenType {
  ac_token: string;
}

export const submitLogin = createAsyncThunk(
  "auth/submitLogin",
  async (
    { nationalId, password }: { nationalId: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post("/api/auth/signing", { nationalId, password });
      return res.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message || "مشکلی رخ داده است."
      );
    }
  }
);

export const getAccess = createAsyncThunk(
  "auth/getAccess",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/auth/access");
      return res.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      localStorage.removeItem("_appSignging");

      return rejectWithValue(
        err.response?.data?.message || "مشکلی رخ داده است."
      );
    }
  }
);

export const getMeInfo = createAsyncThunk(
  "auth/getMeInfo",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/auth/me", {
        // headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message || "مشکلی رخ داده است."
      );
    }
  }
);

export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (
    { oldPassword, newPassword }: { oldPassword: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.patch(
        "/api/auth/update-password",
        {
          oldPassword,
          newPassword,
        }
        // {
        //   headers: { Authorization: `Bearer ${token}` },
        // }
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

export const signout = createAsyncThunk(
  "auth/singout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/auth/signout");
      return res.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message || "مشکلی رخ داده است."
      );
    }
  }
);

interface InitialStateType {
  isLoggedIn: boolean;
  token: string | null;
  user: EmployeeType | null;
  loadingUser: boolean;
  loadingLogin: boolean;
  loadingToken: boolean;
  loadingUpdatePass: boolean;
  loadingSignOut: boolean;
  error: string | null;
}

const initialState: InitialStateType = {
  isLoggedIn: false,
  token: null,
  user: null,
  loadingUser: false,
  loadingLogin: false,
  loadingToken: false,
  loadingUpdatePass: false,
  loadingSignOut: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      state.isLoggedIn = true;
    },
    logout(state) {
      state.loadingSignOut = false;
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("_appSignging");
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(submitLogin.pending, (state) => {
        state.loadingLogin = true;
        state.error = null;
        state.isLoggedIn = false;
      })
      .addCase(
        submitLogin.fulfilled,
        (state, action: PayloadAction<ApiGetTokenType>) => {
          state.loadingLogin = false;
          state.token = action?.payload?.ac_token;
          localStorage.setItem("_appSignging", "true");
          state.error = null;
          state.isLoggedIn = true;
        }
      )
      .addCase(submitLogin.rejected, (state, action) => {
        state.loadingLogin = false;
        state.error = action.payload as string;
        state.isLoggedIn = false;
      })
      // get access token
      .addCase(getAccess.pending, (state) => {
        state.loadingToken = true;
        state.error = null;
      })
      .addCase(
        getAccess.fulfilled,
        (state, action: PayloadAction<ApiGetTokenType>) => {
          state.loadingToken = false;
          state.token = action.payload.ac_token;
          state.error = null;
        }
      )
      .addCase(getAccess.rejected, (state, action) => {
        state.loadingToken = false;
        state.error = action.payload as string;
      })
      // get me info
      .addCase(getMeInfo.pending, (state) => {
        state.loadingUser = true;
        state.error = null;
      })
      .addCase(
        getMeInfo.fulfilled,
        (state, action: PayloadAction<EmployeeType>) => {
          state.loadingUser = false;
          state.user = action.payload;
          state.error = null;
          state.isLoggedIn = true;
        }
      )
      .addCase(getMeInfo.rejected, (state, action) => {
        state.loadingUser = false;
        state.error = action.payload as string;
      })
      // sign out
      .addCase(signout.pending, (state) => {
        state.loadingSignOut = true;
        state.error = null;
      })
      .addCase(signout.fulfilled, (state) => {
        state.loadingSignOut = false;
        state.user = null;
        state.token = null;
        state.error = null;
        localStorage.removeItem("_appSignging");
      })
      .addCase(signout.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loadingSignOut = false;
      })

      // updatePassword
      .addCase(updatePassword.pending, (state) => {
        state.error = null;
        state.loadingUpdatePass = true;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.loadingUpdatePass = false;
        state.error = null;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loadingUpdatePass = false;
        state.error = action.payload as string;
      });
  },
});

export default authSlice.reducer;
export const { setAccessToken, logout } = authSlice.actions;
