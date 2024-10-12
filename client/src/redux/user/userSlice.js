import { createSlice } from "@reduxjs/toolkit";

// Initial state for the user slice
const initialState = {
  currentUser: null, // No user is signed in initially
  loading: false, // No ongoing authentication process
  error: null, // No error initially
};

// Create a slice for user authentication
const userSlice = createSlice({
  name: 'user', // Name of the slice
  initialState, // Initial state defined above
  reducers: {
    // Reducer for starting the sign-in process
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    // Reducer for successful sign-in
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    // Reducer for failed sign-in
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Reducer for starting the sign-up process
    signUpStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    // Reducer for successful sign-up
    signUpSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    // Reducer for failed sign-up
    signUpFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

// Export actions for use in components
export const {
  signInStart,
  signInSuccess,
  signInFailure,
  signUpStart,
  signUpSuccess,
  signUpFailure
} = userSlice.actions;

export default userSlice.reducer;