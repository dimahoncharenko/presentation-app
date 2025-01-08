"use client";

import { SlideElement } from "@/entities/SlideElement/model/types";
import { Dispatch, SetStateAction, createContext, useState } from "react";

type SlideElementsContext = {
  elements: SlideElement[];
  setElements: Dispatch<SetStateAction<SlideElement[]>>;
};

export const SlideElementsContext = createContext({} as SlideElementsContext);

type Props = {
  children: React.ReactNode;
};

export const DroppedElementsProvider = ({ children }: Props) => {
  const [elements, setElements] = useState<SlideElement[]>([]);

  return (
    <SlideElementsContext.Provider value={{ elements, setElements }}>
      {children}
    </SlideElementsContext.Provider>
  );
};
