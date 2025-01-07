import { useState } from "react";
import { Input } from "../../common/bricks/input";
import { Button } from "../../common/aceternity/Button";
import { Check } from "lucide-react";
import { FlipWords } from "../../common/aceternity/FlipWords";

type Props = {
  handleSubmit: (value: string) => void;
};

export const EditableFlipWords = ({ handleSubmit }: Props) => {
  const [editable, setEditable] = useState(true);
  const [words, setWords] = useState("");

  if (editable) {
    return (
      <div className="inline-flex">
        <Input
          value={words}
          onChange={(e) => {
            setWords(e.target.value);
          }}
          placeholder="Separate words by commas"
        />
        <Button
          variant="none"
          onClick={() => {
            handleSubmit(words);
            setEditable(false);
          }}
        >
          <Check size={24} />
        </Button>
      </div>
    );
  }

  return (
    <div onDoubleClick={() => setEditable(true)}>
      <FlipWords words={words.split(",")} />
    </div>
  );
};
