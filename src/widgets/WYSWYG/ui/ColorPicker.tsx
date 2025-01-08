import { Editor } from "@tiptap/react";
import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useDebounceValue } from "usehooks-ts";

type Props = {
  editor: Editor;
};

export const ColorPicker = ({ editor }: Props) => {
  const [color, setColor] = useState("");
  const [debouncedColor] = useDebounceValue(color, 200);

  useEffect(() => {
    editor.commands.setColor(debouncedColor);
  }, [editor, debouncedColor]);

  const handleChange = (newColor: string) => {
    setColor(newColor);
  };

  return (
    <HexColorPicker
      className="absolute top-0"
      color={color}
      onChange={(color) => handleChange(color)}
    />
  );
};
