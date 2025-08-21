import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  user: any | null;
  menu: any[];
}

const initialState: UserState = {
  user: null,
  menu: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (
      state,
      action: PayloadAction<{ user: any; menu: any[] }>
    ) => {
      state.user = action.payload.user;
      state.menu = action.payload.menu;
    },
    clearUserData: (state) => {
      state.user = null;
      state.menu = [];
    },
  },
});

export const { setUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer;
