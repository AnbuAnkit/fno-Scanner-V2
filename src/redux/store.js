import { configureStore } from "@reduxjs/toolkit";
import expiryDatesReducer from "@/redux/slice/expiryDatesSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      expiryDates: expiryDatesReducer,
    },
  });

export const store = makeStore();
