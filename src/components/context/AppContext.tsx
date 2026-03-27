import { GuestPlaySubmissionRequest, Tab, URlRiddleData } from "@/lib/types/common/types";
import { Dispatch, SetStateAction, createContext } from "react";

interface AppContextProps {
  isOpenModal: boolean;
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
  currentTab: Tab;
  setCurrentTab: Dispatch<SetStateAction<Tab>>;
  selectedPeriod: string;
  setSelectedPeriod: Dispatch<SetStateAction<string>>;
  previousUrl: string;
  setPreviousUrl: Dispatch<SetStateAction<string>>;
  isCollapsed: boolean;
  setIsCollappsed: Dispatch<SetStateAction<boolean>>;
}
const AppContext = createContext<AppContextProps | undefined>(undefined);

export { AppContext };
