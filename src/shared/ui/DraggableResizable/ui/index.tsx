"use client";

import { cn } from "@/shared/lib/cn-merge";
import { GripVertical } from "lucide-react";
import {
  useState,
  useEffect,
  useRef,
  MouseEvent,
  ReactNode,
  memo,
} from "react";
import { useOnClickOutside } from "usehooks-ts";

type Props = {
  children: ReactNode;
  initialPosition?: {
    x: number;
    y: number;
  };
};

export const DraggableResizable = memo(
  ({ children, initialPosition }: Props) => {
    const [grabbed, setGrabbed] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [position, setPosition] = useState(initialPosition ?? { x: 0, y: 0 });
    const [size, setSize] = useState({ width: 200, height: 200 });

    const draggableRef = useRef<HTMLDivElement>({} as HTMLDivElement);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: MouseEvent) => {
      const currentEl = e.target as HTMLElement;
      const parentEl = currentEl.parentNode as HTMLElement;

      if (parentEl) {
        const rect = parentEl.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        const handleMouseMove: EventListener = (evt) => {
          const event = evt as unknown as MouseEvent;

          if (draggableRef.current && !isResizing) {
            const newX = event.clientX - offsetX;
            const newY = event.clientY - offsetY;
            setPosition({ x: newX, y: newY });
          }
        };

        const handleMouseUp = () => {
          setIsDragging(false);
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        };

        setIsDragging(true);
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      }
    };

    useOnClickOutside(draggableRef || ([] as HTMLElement[]), () => {
      setIsDragging(false);
      setIsResizing(false);
      setGrabbed(false);
    });

    const handleResizeMouseDown = (e: MouseEvent, direction: string) => {
      const currentEl = e.target as HTMLElement;
      const parentEl = currentEl.parentNode as HTMLElement;

      if (parentEl) {
        let prevX = e.clientX;
        let prevY = e.clientY;

        const handleMouseMove: EventListener = (evt) => {
          const event = evt as unknown as MouseEvent;

          if (draggableRef.current) {
            const rect = draggableRef.current.getBoundingClientRect();
            let newWidth = size.width;
            let newHeight = size.height;

            // Resize handlers' logic
            if (direction === "se") {
              newWidth = rect.width - (prevX - event.clientX);
              newHeight = rect.height - (prevY - event.clientY);
            } else if (direction === "sw") {
              newWidth = rect.width - (event.clientX - prevX);
              newHeight = rect.height + (event.clientY - prevY);

              setPosition({
                y: position.y,
                x: position.x - (position.x - event.clientX),
              });
            } else if (direction === "ne") {
              newWidth = rect.width - (prevX - event.clientX);
              newHeight = rect.height + (prevY - event.clientY);
              setPosition({
                x: position.x,
                y: position.y - (position.y - event.clientY),
              });
            } else if (direction === "nw") {
              newWidth = rect.width + (prevX - event.clientX);
              newHeight = rect.height + (prevY - event.clientY);
              setPosition({
                x: position.x - (position.x - event.clientX),
                y: position.y - (position.y - event.clientY),
              });
            }

            setSize({ width: newWidth, height: newHeight });
            prevX = event.clientX;
            prevY = event.clientY;
          }
        };

        const handleMouseUp = () => {
          setIsResizing(false);
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        };

        setIsResizing(true);
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      }
    };

    useEffect(() => {
      if (isDragging && draggableRef.current) {
        draggableRef.current.style.transform = `translate(${position.x}px, ${position.y}px)`;
      }
    }, [isDragging, position.x, position.y]);

    useEffect(() => {
      if (draggableRef.current) {
        draggableRef.current.style.width = `${size.width}px`;
        draggableRef.current.style.height = `${size.height}px`;
      }
    }, [size.height, size.width]);

    useEffect(() => {
      if (
        contentRef.current &&
        contentRef.current.children?.length &&
        contentRef.current.children[0].tagName === "IMG"
      ) {
        const img = contentRef.current.children[0] as HTMLImageElement;
        setSize({
          width: Math.max(img.naturalWidth, 200),
          height: Math.max(img.naturalHeight, 50),
        });
      }
    }, [contentRef.current]);

    useEffect(() => {
      if (contentRef.current) {
        const rect = contentRef.current.getBoundingClientRect();

        setSize({
          width: Math.max(rect.width, 200),
          height: Math.max(rect.height, 50),
        });
      }
    }, [contentRef.current, grabbed]);

    return (
      <div
        ref={draggableRef}
        className={cn("inline-block absolute overflow-hidden")}
        aria-label="draggable-resizable"
        onDoubleClick={() => setGrabbed(true)}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: `translate(${position.x}px, ${position.y}px)`,
          width: `${size.width}px`,
          height: `${size.height}px`,
        }}
      >
        <div className={cn(!grabbed && "pointer-events-none")}>
          <div
            onMouseDown={handleMouseDown}
            className="absolute z-10 top-1 -left-2 hover:opacity-100 opacity-0 cursor-move"
            aria-label="draggable-resizable-handler"
          >
            <GripVertical className="opacity-25" size={24} />
          </div>

          <div
            onMouseDown={(e) => handleResizeMouseDown(e, "nw")}
            aria-label="draggable-resizable-resizer-nw"
            className="absolute size-[10px] rounded-full z-10  -top-[2px] -left-[2px] cursor-nw-resize"
          ></div>
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, "ne")}
            aria-label="draggable-resizable-resizer-ne"
            className="absolute size-[10px] rounded-full z-10  -top-[2px] -right-[2px] cursor-ne-resize"
          ></div>
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, "se")}
            aria-label="draggable-resizable-resizer-se"
            className="absolute size-[10px] rounded-full z-10  -bottom-[2px] -right-[2px] cursor-se-resize"
          ></div>
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, "sw")}
            aria-label="draggable-resizable-resizer-sw"
            className="absolute sw size-[10px] rounded-full z-10  -bottom-[2px] -left-[2px] cursor-sw-resize"
          ></div>
          <div
            ref={contentRef}
            className={cn(
              "break-all h-full absolute w-full",
              grabbed && "border-2 border-dashed"
            )}
            aria-label="draggable-resizable-resizer-content"
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
);
