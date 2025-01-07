"use client";

import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { Context } from "../context/DroppedElementsContext";
import { useContext } from "react";
import { RevealProvider } from "../context/reveal-context";

type Props = {
  children: React.ReactNode;
};

export const ClientProviders = ({ children }: Props) => {
  const { elements, setElements } = useContext(Context);

  const handleDragEnd = (event: DragEndEvent) => {
    if (event.active.data.current) {
      console.log(event);

      setElements([
        ...elements,
        {
          "slide-id": `slide-${event.active.data.current["slideId"] || 0}`,
          id: `${event.active.data.current["nodeType"]}-${elements.length}`,
          type: event.active.data.current["nodeType"],
          content: event.active.data.current["content"],
          spacing: {
            x: 400,
            y: 0,
          },
          size: {
            width: 300,
            height: 300,
          },
        },
      ]);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <RevealProvider>{children}</RevealProvider>
    </DndContext>
  );
};
