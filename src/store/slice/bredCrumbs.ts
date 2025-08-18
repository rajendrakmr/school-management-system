import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BreadcrumbState {
  crumbs: string[];
}

const initialState: BreadcrumbState = {
  crumbs: [],
};

const breadcrumbSlice = createSlice({
  name: "breadcrumb",
  initialState,
  reducers: {
    setBreadcrumbs: (state, action: PayloadAction<string[]>) => {
      state.crumbs = action.payload;
    },
  },
});

export const { setBreadcrumbs } = breadcrumbSlice.actions;
export default breadcrumbSlice.reducer;
