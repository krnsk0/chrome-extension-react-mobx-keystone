import { useContext } from "react";
import { StoreContext } from "./provider";

export const useStore = () => {
  const store = useContext(StoreContext);
  return store;
};
