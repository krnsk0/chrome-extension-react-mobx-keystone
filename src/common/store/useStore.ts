import { useContext } from "react";
import { StoreContext } from "./storeProvider";

export const useStore = () => {
  const store = useContext(StoreContext);
  return store;
};
