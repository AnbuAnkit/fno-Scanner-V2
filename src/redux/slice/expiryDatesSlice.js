//////////////////////////////////////////////////////////////////////////////
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Define an async thunk for fetching data from the API
export const fetchExpiryDates = createAsyncThunk(
  "expiryDates/fetchExpiryDates", // Unique identifier for the thunk
  async (_, { rejectWithValue }) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // Set timeout for 10 seconds

      // Append cache-busting parameter to the URL
      const url = `/api/fullDate?_=${Date.now()}`;

      const response = await fetch(url, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // If the server response was not ok, throw an error with the response status
        throw new Error(`Error fetching: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      // Use `rejectWithValue` to return a custom error payload
      return rejectWithValue(error.message);
    }
  }
);

export const expiryDatesSlice = createSlice({
  name: "expiryDates",
  initialState: {
    data: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpiryDates.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchExpiryDates.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Assuming the API returns the data directly without a need for further processing
        state.data = action.payload;
      })
      .addCase(fetchExpiryDates.rejected, (state, action) => {
        state.status = "failed";
        // If `action.payload` is `undefined`, it means an exception was thrown in the payload creator
        // `action.error.message` contains the error message from the exception
        state.error = action.payload ?? action.error.message;
      });
  },
});

export default expiryDatesSlice.reducer;

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// // Define an async thunk for fetching data from the API
// export const fetchExpiryDates = createAsyncThunk(
//   "expiryDates/fetchExpiryDates", // Unique identifier for the thunk
//   async (_, { rejectWithValue }) => {
//     try {
//       // Check if data is present in localStorage and is not expired
//       const cachedData = localStorage.getItem("expiryDatesData");
//       if (cachedData) {
//         const { data, timestamp } = JSON.parse(cachedData);
//         if (Date.now() - timestamp < 12 * 60 * 60 * 1000) {
//           // Cache for 12 hours
//           return data;
//         }
//       }

//       // Fetch data from the API if not cached or expired
//       const response = await fetch("/api/fullDate");
//       if (!response.ok) {
//         throw new Error(`Error fetching: ${response.status}`);
//       }
//       const data = await response.json();

//       // Cache the fetched data in localStorage
//       localStorage.setItem(
//         "expiryDatesData",
//         JSON.stringify({ data, timestamp: Date.now() })
//       );

//       return data;
//     } catch (error) {
//       // Use `rejectWithValue` to return a custom error payload
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const expiryDatesSlice = createSlice({
//   name: "expiryDates",
//   initialState: {
//     data: [],
//     status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchExpiryDates.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchExpiryDates.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         // Assuming the API returns the data directly without a need for further processing
//         state.data = action.payload;
//       })
//       .addCase(fetchExpiryDates.rejected, (state, action) => {
//         state.status = "failed";
//         // If `action.payload` is `undefined`, it means an exception was thrown in the payload creator
//         // `action.error.message` contains the error message from the exception
//         state.error = action.payload ?? action.error.message;
//       });
//   },
// });

// export default expiryDatesSlice.reducer;
