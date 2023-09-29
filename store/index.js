import { configureStore } from "@reduxjs/toolkit";

import commonSlice from "./common-slice";

export const store = configureStore({
  reducer: {
    common: commonSlice,
  },
});
