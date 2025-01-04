"use client";

import { useDroppable } from "@dnd-kit/core";
import { DetailedHTMLProps, HTMLAttributes, cloneElement } from "react";

type Props = {
  id: string;
  children: React.ReactElement<
    DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
  >;
};

export const Droppable = ({ id, children }: Props) => {
  const { setNodeRef } = useDroppable({ id });

  return <>{cloneElement(children, { ref: setNodeRef })}</>;
};
