import { Dispatch, SetStateAction, createContext, useState } from "react";

type AppStateContext = {
  openedSidenav: boolean;
  setOpenedSidenav: Dispatch<SetStateAction<boolean>>;
};

export const AppStateContext = createContext({} as AppStateContext);

type Props = {
  children: React.ReactNode;
};

export const AppStateProvider = ({ children }: Props) => {
  const [openedSidenav, setOpenedSidenav] = useState(false);

  return (
    <AppStateContext
      value={{
        openedSidenav,
        setOpenedSidenav,
      }}
    >
      {children}
    </AppStateContext>
  );
};
