import { create } from "zustand";

// Define the types for the store's state
interface UserState {
  ticker: string;
  type: string;
  setTicker: (ticker: string) => void;
  setType: (type: string) => void;
}

// Create the store
const useStockStore = create<UserState>((set) => ({
  ticker: "",
  type: "",
  setTicker: (ticker: string) => set(() => ({ ticker })),
  setType: (type: string) => set(() => ({ type })),
}));

export default useStockStore;
