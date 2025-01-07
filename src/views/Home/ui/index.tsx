"use client";

import { useContext, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { Context } from "@/shared/context/DroppedElementsContext";
import { RevealContext } from "@/shared/context/reveal-context";
import { Button } from "@/shared/ui/common/aceternity/Button";
import { Input } from "@/shared/ui/common/bricks/input";
import { PresentationWrapper } from "@/widgets/PresentationWrapper";

export const HomeView = () => {
  const { elements, setElements } = useContext(Context);
  const { deckRef } = useContext(RevealContext);

  const { setValue, control, watch, reset } = useForm({
    defaultValues: {
      image: null as null | File,
    },
  });

  const currentSlideIndex = deckRef.current?.getState().indexh;
  const image = watch("image");

  useEffect(() => {
    if (image) {
      setElements([
        ...elements,
        {
          "slide-id": `slide-${currentSlideIndex}`,
          id: `image-node-${elements.length}`,
          type: "image-node",
          content: URL.createObjectURL(image),
          spacing: {
            x: 500,
            y: 250,
          },
          size: {
            width: 300,
            height: 300,
          },
        },
      ]);
      reset();
    }
  }, [image]);

  return (
    <>
      <div className="absolute flex flex-col items-start !bg-slate-100 top-0 px-4 xl:px-8 bottom-0 right-0 w-[250px]">
        <Button
          variant="none"
          size="icon"
          className="ml-2"
          onClick={() => {
            setElements([
              ...elements,
              {
                "slide-id": `slide-${currentSlideIndex}`,
                id: `text-input-${elements.length}`,
                type: "text-node",
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

        <Controller
          control={control}
          name="image"
          render={({ field: { name, onBlur, ref, disabled } }) => {
            return (
              <>
                <label
                  htmlFor="image-upload"
                  className="text-sm cursor-pointer"
                >
                  Add Image
                </label>
                <Input
                  name={name}
                  onBlur={onBlur}
                  ref={ref}
                  disabled={disabled}
                  onChange={(evt) =>
                    evt.target.files && setValue("image", evt.target.files?.[0])
                  }
                  type="file"
                  className="hidden"
                  id="image-upload"
                />
              </>
            );
          }}
        />

        <Button
          variant="none"
          size="icon"
          className="ml-2"
          onClick={() => {
            setElements([
              ...elements,
              {
                "slide-id": `slide-${currentSlideIndex}`,
                id: `flip-text-${elements.length}`,
                type: "flip-words-node",
                content: "",
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
          Add flipped text
        </Button>
      </div>
      <PresentationWrapper />
    </>
  );
};
