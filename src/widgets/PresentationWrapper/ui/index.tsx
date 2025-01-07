"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { PanelLeft } from "lucide-react";

import { Slide } from "@/entities/Slide/ui";
import { Fragment } from "@/shared/ui/Fragment";
import { FlipWords } from "@/shared/ui/common/aceternity/FlipWords";

import { cn } from "@/shared/lib/cn-merge";
import { Button } from "@/shared/ui/common/aceternity/Button";
import { RevealContext } from "@/shared/context/reveal-context";
import { Context } from "@/shared/context/DroppedElementsContext";
import { DroppedElement } from "@/entities/DroppedElement/model/types";
import { groupBySlideId } from "@/entities/DroppedElement/lib";
import { DraggableResizable } from "@/shared/ui/DraggableResizable";
import { WYSWYG } from "@/widgets/WYSWYG";
import Image from "next/image";
import { EditableFlipWords } from "@/shared/ui/EditableFlipWords";

export const PresentationWrapper = () => {
  const [openedSidebar, setOpenedSidebar] = useState(false);
  const { setDeckRef, deckRef } = useContext(RevealContext);
  const { elements, setElements } = useContext(Context);

  const deckDivRef = useRef<HTMLDivElement>({} as HTMLDivElement); // reference to deck container div

  const handleRemoveElement = (element: DroppedElement) => {
    setElements((prev) => prev.filter((el) => el.id !== element.id));
  };

  useEffect(() => {
    setElements([
      {
        "slide-id": "slide-0",
        content: "New Slide",
        id: "text-node-0",
        spacing: {
          x: 400,
          y: 0,
        },
        type: "text-node",
        bg: "#dd3636",
        size: {
          width: 300,
          height: 100,
        },
      },
      {
        "slide-id": "slide-1",
        content: "New Slide",
        id: "text-node-1",
        spacing: {
          x: 400,
          y: 0,
        },
        size: {
          width: 300,
          height: 100,
        },
        type: "text-node",
        bg: "white",
      },
    ]);
  }, []);

  useEffect(() => {
    if (!deckRef.current && deckDivRef.current) {
      setDeckRef(deckDivRef);
    }
  }, [deckDivRef.current]);

  return (
    <>
      <div
        className={cn(
          "reveal transition-all duration-200 ease-in-out mr-auto",
          openedSidebar && "!w-[85vw]"
        )}
        ref={deckDivRef}
      >
        <div className="custom-controls absolute top-0 h-10 w-full">
          <Button
            className="absolute z-30"
            variant="none"
            onClick={() => setOpenedSidebar(!openedSidebar)}
          >
            <PanelLeft size={24} color="black" />
          </Button>
        </div>

        <div className="slides">
          {Object.entries(groupBySlideId(elements)).map(([name, elements]) => {
            return (
              <Slide
                key={name}
                style={{
                  width: "100%",
                  height: "100%",
                }}
                slideId={`slide-${deckRef.current?.getState().indexh}`}
                bg={elements[0].bg}
              >
                <>
                  {elements.map((el, index) => {
                    return (
                      <React.Fragment key={index}>
                        {el.type === "image-node" ? (
                          <DraggableResizable initialPosition={el.spacing}>
                            <Image
                              className="!m-0 !select-none !max-w-full !max-h-full"
                              src={el.content}
                              fill
                              alt={el.id}
                            />
                          </DraggableResizable>
                        ) : el.type === "text-node" ? (
                          <DraggableResizable initialPosition={el.spacing}>
                            <WYSWYG content={el.content} onChange={() => {}} />
                          </DraggableResizable>
                        ) : (
                          <DraggableResizable initialPosition={el.spacing}>
                            <EditableFlipWords
                              handleSubmit={(words) => {
                                setElements((prev) =>
                                  prev.map((e) => {
                                    if (e.id === el.id) {
                                      return {
                                        ...el,
                                        content: words,
                                      };
                                    }

                                    return el;
                                  })
                                );
                              }}
                            />
                          </DraggableResizable>
                        )}
                      </React.Fragment>
                    );
                  })}
                </>
              </Slide>
            );
          })}
        </div>
      </div>
    </>
  );
};
