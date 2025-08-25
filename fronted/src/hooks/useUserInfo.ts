import { useSelector } from "react-redux";
import { RootState } from "@/store";

export const useUserInfo = () => {
  return useSelector((state: RootState) => state.user.user);
};
