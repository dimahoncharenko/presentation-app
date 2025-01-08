import { useState } from "react";
import { Input } from "../../common/bricks/input";
import { Button } from "../../common/aceternity/Button";
import { Check, X } from "lucide-react";
import { FlipWords } from "../../common/aceternity/FlipWords";

type Props = {
  handleSubmit: (value: string) => void;
  handleDelete: () => void;
  initialValue: string;
};

export const EditableFlipWords = ({
  handleSubmit,
  handleDelete,
  initialValue,
}: Props) => {
  const [editable, setEditable] = useState(true);
  const [words, setWords] = useState(initialValue);

  if (editable) {
    return (
      <div className="inline-flex absolute w-full left-0">
        <Input
          value={words}
          variant="clean"
          className="py-0 px-1"
          onChange={(e) => {
            setWords(e.target.value);
          }}
          placeholder="Separate words by commas"
        />
        <div className="flex justify-between flex-col p-1">
          <Button
            variant="none"
            size="auto"
            className="hover:text-green-300"
            onClick={() => {
              handleSubmit(words);
              setEditable(false);
            }}
          >
            <Check className="!size-3" />
          </Button>
          <Button
            variant="none"
            size="auto"
            className="hover:text-red-400"
            onClick={() => {
              handleDelete();
              setEditable(false);
            }}
          >
            <X className="!size-3" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      onDoubleClick={() => setEditable(true)}
      className="flex items-center justify-center h-full"
    >
      <FlipWords duration={1} words={words.split(",")} />
    </div>
  );
};
