import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  selectedRole: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      // CRITICAL: Always use deep cloning to avoid reference issues
      // This prevents potential issues with object mutations
      state.user = JSON.parse(JSON.stringify(action.payload));
      state.isAuthenticated = !!action.payload;
    },
clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setSelectedRole: (state, action) => {
      state.selectedRole = action.payload;
      // Also store in sessionStorage for persistence across page refreshes
      if (action.payload) {
        sessionStorage.setItem('selectedRole', action.payload);
      } else {
        sessionStorage.removeItem('selectedRole');
      }
    },
    clearSelectedRole: (state) => {
      state.selectedRole = null;
      sessionStorage.removeItem('selectedRole');
    },
  },
});

export const { setUser, clearUser, setSelectedRole, clearSelectedRole } = userSlice.actions;
export default userSlice.reducer;