import { create } from "zustand";

// Define the types for the store's state
interface UserState {
  name: string;
  email: string;
  username: string;
  phone: string;
  token: string;
  otp: string;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setUsername: (username: string) => void;
  setPhone: (phone: string) => void;
  setToken: (token: string) => void;
  setOTP: (otp: string) => void;
}

// Create the store
const useUserStore = create<UserState>((set) => ({
  name: "",
  email: "",
  username: "",
  phone: "",
  token: "",
  otp: "",
  setName: (name: string) => set(() => ({ name })),
  setEmail: (email: string) => set(() => ({ email })),
  setUsername: (username: string) => set(() => ({ username })),
  setPhone: (phone: string) => set(() => ({ phone })),
  setToken: (token: string) => set(() => ({ token })),
  setOTP: (otp: string) => () => set({ otp }),
}));

export default useUserStore;
