"use client";

import { DroppedElement } from "@/entities/DroppedElement/model/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { CSSProperties, DetailedHTMLProps, HTMLAttributes } from "react";

type Props = {
  id: string;
  element?: DroppedElement;
  children: React.ReactElement<
    DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
  >;
  disabled?: boolean;
  style?: CSSProperties;
};

export const Draggable = ({
  children,
  id,
  element,
  disabled,
  style,
}: Props) => {
  const { attributes, listeners, transform, setNodeRef } = useDraggable({
    id: element?.id ?? id,
    disabled,
    data: {
      slideId: element?.["slide-id"],
      nodeType: element?.type,
      content: element?.content,
    },
  });

  const definedStyles: CSSProperties | undefined = transform
    ? {
        transform: CSS.Translate.toString(transform),
        position: "relative",
        zIndex: 100000,
        ...style,
      }
    : style;

  return (
    <div ref={setNodeRef} style={definedStyles} {...attributes} {...listeners}>
      {children}
    </div>
  );
};
