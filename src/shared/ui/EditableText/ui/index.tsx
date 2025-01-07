import {
  DroppedElement,
  DroppedText,
} from "@/entities/DroppedElement/model/types";
import React, {
  CSSProperties,
  MouseEvent,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { Form, FormField } from "../../common/bricks/form";
import { useClickAnyWhere } from "usehooks-ts";
import { Draggable } from "../../Draggable";
import { TextField } from "./TextField";
import { Context } from "@/shared/context/DroppedElementsContext";
import { Button } from "../../common/aceternity/Button";
import { useDndMonitor } from "@dnd-kit/core";
import DOMPurify from "dompurify";

type Props = {
  handleRemove: () => void;
  element: DroppedText;
};

export type Attributes = {
  color: CSSProperties["color"];
};

function EditableText({ element, handleRemove }: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const [state, setState] = useState(element);

  useDndMonitor({
    onDragEnd(event) {
      setElements((prev) =>
        prev.map((el) => {
          if (el.id === event.active.id && event.active.id === state.id) {
            el.spacing = {
              x: el.spacing.x + event.delta.x,
              y: el.spacing.y + event.delta.y,
            };
          }

          return el;
        })
      );

      setIsFocused(true);
    },
  });

  const { setElements } = useContext(Context);

  const form = useForm({
    defaultValues: {
      content: state.content,
    },
  });

  useEffect(() => {
    form.setValue("content", element.content);
  }, [element.content]);

  const memoizedSize = useMemo(
    () => ({
      height: element.size?.height,
      width: element.size?.width,
    }),
    [element.size?.height, element.size?.width]
  );

  useEffect(() => {
    setState({ ...element });
  }, [element.spacing.x, element.spacing.y, element.id, memoizedSize]);

  const currentValue = form.watch("content");

  const handleSubmit = () => {
    setState((prev) => ({ ...prev, content: currentValue, type: "text-node" }));
  };

  useClickAnyWhere((evt: globalThis.MouseEvent) => {
    if (
      evt.target &&
      "innerText" in evt.target &&
      evt.target.innerText === state.content
    ) {
      return;
    }

    if (currentValue !== "<p></p>") {
      handleSubmit();
    } else {
      handleRemove();
    }
  });

  if (state.type === "text-node" && currentValue.trim()) {
    const content = DOMPurify.sanitize(state.content);

    return (
      <div
        onDoubleClick={() => {
          setState({ ...state, type: "text-input" });
          setIsFocused(true);
        }}
        className="cursor-text overflow-hidden select-none py-[6px] px-[13px] break-all"
        style={{
          display: "block",
          position: "absolute",
          top: state.spacing.y,
          left: state.spacing.x,
          width: state.size?.width,
          height: state.size?.height,
        }}
      >
        <p
          className="pointer-events-none p-0"
          onClick={() => {
            setIsFocused(true);
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    );
  }

  const handleResize = (
    id: string,
    size: { width: number; height: number }
  ) => {
    setElements((prevElements) =>
      prevElements.map((element) =>
        element.id === id ? { ...element, size } : element
      )
    );
  };

  return (
    <Form {...form}>
      <FormField
        name="content"
        control={form.control}
        render={({ field }) => (
          <Draggable id={state.id} element={state} disabled={isFocused}>
            <div
              style={{
                position: "absolute",
                top: state.spacing.y,
                left: state.spacing.x,
                width: state.size?.width,
                height: state.size?.height,
              }}
            >
              {/* Drag handler */}
              <Button
                id={state.id}
                variant="none"
                size="sm"
                className="absolute -left-2 -top-2 p-0 size-10 cursor-move opacity-0"
                onMouseMove={() => {
                  setIsFocused(false);
                }}
              ></Button>

              <TextField
                setIsFocused={setIsFocused}
                field={field}
                onResize={(size) => handleResize(state.id, size)}
                initialSize={state.size}
              />
            </div>
          </Draggable>
        )}
      />
    </Form>
  );
}

export default EditableText;
