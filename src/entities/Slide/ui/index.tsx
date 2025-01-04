"use client";

import { DroppedElement } from "@/entities/DroppedElement/model/types";
import { BackHome } from "@/features/BackHome";
import { Context } from "@/shared/context/DroppedElementsContext";
import { Droppable } from "@/shared/ui/Droppable";
import EditableText from "@/shared/ui/EditableText/ui";
import React, {
  CSSProperties,
  ReactElement,
  cloneElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type Props = Partial<{
  bg: CSSProperties["color"];
  videoBg: string;
  enableBackHome: boolean;
  state: string;
  animateOnTheNextSlide: CSSProperties;
  fragments: React.ReactElement[];

  iframeBg: string;
}> & {
  children: ReactElement<React.HTMLAttributes<HTMLElement>>;
  slideId: string;
} & Partial<
    Omit<
      React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>,
      "children"
    >
  >;

export const Slide: React.FC<Props> = ({
  bg,
  state,
  children,
  videoBg,
  animateOnTheNextSlide,
  iframeBg,
  fragments,
  slideId,
  enableBackHome = false,
  ...rest
}) => {
  const activeBgs = [videoBg, bg, iframeBg].filter((bg) => !!bg);

  if (activeBgs.length > 1) {
    throw new Error("Multiple backgrounds aren't supported!");
  }

  return (
    <>
      <Droppable id={slideId}>
        <section
          {...rest}
          data-background-iframe={iframeBg}
          data-background-video={videoBg}
          data-background-video-muted
          data-background-color={bg}
          data-state={state}
          data-auto-animate={!!animateOnTheNextSlide}
        >
          {enableBackHome && <BackHome />}

          {children}
          {fragments}
        </section>
      </Droppable>
      {animateOnTheNextSlide && (
        <Droppable id={slideId}>
          <section
            {...rest}
            data-background-video={videoBg}
            data-background-video-muted
            data-background-color={bg}
            data-state={state}
            data-auto-animate
          >
            {children}
            {fragments}
          </section>
        </Droppable>
      )}
    </>
  );
};
