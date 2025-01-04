"use client";

import { DroppedElement } from "@/entities/DroppedElement/model/types";
import { Dispatch, SetStateAction, createContext, useState } from "react";

type Context = {
  elements: DroppedElement[];
  setElements: Dispatch<SetStateAction<DroppedElement[]>>;
};

export const Context = createContext({} as Context);

type Props = {
  children: React.ReactNode;
};

export const DroppedElementsProvider = ({ children }: Props) => {
  const [elements, setElements] = useState<DroppedElement[]>([]);

  return (
    <Context.Provider value={{ elements, setElements }}>
      {children}
    </Context.Provider>
  );
};
