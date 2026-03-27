import { useState } from "react";
import { AppContext } from "./AppContext";
import { AppProviderProps, Tab } from "@/lib/types/common/types";

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<Tab>("about");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("Monthly");
  const [previousUrl, setPreviousUrl] = useState<string>("/gamehub")
  const [ isCollapsed, setIsCollappsed ] = useState<boolean>(true);

  return (
    <AppContext.Provider
      value={{
        isOpenModal, setIsOpenModal,
        currentTab, setCurrentTab,
        selectedPeriod, setSelectedPeriod,
        previousUrl, setPreviousUrl,
        isCollapsed, setIsCollappsed,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider };
