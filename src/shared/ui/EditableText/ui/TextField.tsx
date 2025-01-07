import { IconChevronDownRight } from "@tabler/icons-react";
import { Dispatch, SetStateAction, useState } from "react";
import { ControllerRenderProps } from "react-hook-form";
import { ResizableBox } from "react-resizable";

import "react-resizable/css/styles.css";

import { WYSWYG } from "@/widgets/WYSWYG";

type Props = {
  setIsFocused: Dispatch<SetStateAction<boolean>>;
  field: ControllerRenderProps<
    {
      content: string;
    },
    "content"
  >;
  initialSize?: {
    width: number;
    height: number;
  };
  onResize: (size: { width: number; height: number }) => void;
};

export const TextField = ({
  setIsFocused,
  field,
  onResize,
  initialSize,
}: Props) => {
  const [size, setSize] = useState<{
    width: number;
    height: number;
  }>({ width: initialSize?.width ?? 100, height: initialSize?.height ?? 30 });

  const handleResize = (
    _: unknown,
    {
      size,
    }: {
      size: {
        width: number;
        height: number;
      };
    }
  ) => {
    setSize(size);
    onResize(size);
  };

  return (
    <ResizableBox
      width={size.width}
      height={size.height}
      className="break-all relative max-h-max"
      onResize={(evt, props) => {
        evt.stopPropagation();
        setSize({ ...props.size });
      }}
      onResizeStop={(evt, props) => {
        evt.stopPropagation();
        handleResize(evt, props);
      }}
      minConstraints={[100, 30]}
      onResizeStart={() => {
        setIsFocused(false);
      }}
      maxConstraints={[500, 300]}
      handle={
        <div className="absolute -right-[6px] -bottom-[7px] cursor-nw-resize">
          <IconChevronDownRight size={20} color="white" />
        </div>
      }
    >
      <div
        className="border border-dashed overflow-hidden"
        style={{
          width: size.width,
          height: size.height,
        }}
      >
        <WYSWYG onChange={field.onChange} content={field.value} />
      </div>
    </ResizableBox>
  );
};
