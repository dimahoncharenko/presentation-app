"use client";

import { DroppedElement } from "@/entities/DroppedElement/model/types";
import { useDraggable } from "@dnd-kit/core";
import {
  CSSProperties,
  DetailedHTMLProps,
  HTMLAttributes,
  cloneElement,
} from "react";

type Props = {
  id: string;
  element?: DroppedElement;
  children: React.ReactElement<
    DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
  >;
  disabled?: boolean;
};

export const Draggable = ({ children, id, element, disabled }: Props) => {
  const { attributes, listeners, transform, setNodeRef } = useDraggable({
    id: element?.id ?? id,
    disabled,
    data: {
      slideId: element?.["slide-id"],
    },
  });

  const style: CSSProperties | undefined = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        position: "absolute",
        zIndex: 100000,
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};
