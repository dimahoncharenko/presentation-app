"use client";

import { groupBySlideId } from "@/entities/DroppedElement/lib";
import { DroppedElement } from "@/entities/DroppedElement/model/types";
import { Context } from "@/shared/context/DroppedElementsContext";
import { RevealContext } from "@/shared/context/reveal-context";
import { Droppable } from "@/shared/ui/Droppable";
import EditableText from "@/shared/ui/EditableText/ui";
import { Button } from "@/shared/ui/common/aceternity/Button";
import { Input } from "@/shared/ui/common/bricks/input";
import { PresentationWrapper } from "@/widgets/PresentationWrapper";
import dynamic from "next/dynamic";
import { useContext } from "react";

const Draggable = dynamic(
  async () => (await import("@/shared/ui/Draggable")).Draggable,
  {
    ssr: false,
  }
);

export const HomeView = () => {
  const { elements, setElements } = useContext(Context);
  const { deckRef } = useContext(RevealContext);

  const currentSlideIndex = deckRef.current?.getState().indexh;

  return (
    <>
      <div className="absolute !bg-slate-100 top-0 px-8 bottom-0 left-0 w-[250px]">
        <Button
          variant="none"
          size="icon"
          onClick={() => {
            setElements([
              ...elements,
              {
                "slide-id": `slide-${currentSlideIndex}`,
                id: `text-node-${elements.length}`,
                type: "input",
                content: "New Text",
                spacing: {
                  x: 500,
                  y: 250,
                },
                size: {
                  width: 300,
                  height: 100,
                },
              },
            ]);
          }}
        >
          Add Text
        </Button>

        <Input
          onChange={(evt) => {
            if (deckRef.current) {
              const state = deckRef.current.getState();

              setElements((prev) =>
                prev.map((el, index) => {
                  if (index === state.indexh) {
                    el.bg = evt.target.value;
                  }

                  return el;
                })
              );
            }
          }}
          defaultValue="#ffffff"
          type="color"
        />
      </div>

      <PresentationWrapper />
    </>
  );
};
