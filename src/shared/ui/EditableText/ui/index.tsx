import { WYSWYG } from "@/widgets/WYSWYG";
import { DraggableResizable } from "../../DraggableResizable";
import { SlideText } from "@/entities/SlideElement/model/types";

type Props = {
  element: SlideText;
  onChange: (value: string) => void;
};

export const EditableText = ({ element, onChange }: Props) => {
  return (
    <>
      <DraggableResizable initialPosition={element.spacing}>
        <WYSWYG content={element.content} onChange={onChange} />
      </DraggableResizable>
    </>
  );
};
