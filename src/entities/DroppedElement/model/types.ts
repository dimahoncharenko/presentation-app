type SharedProperties = {
  "slide-id": string;
  id: string;
  content: string;
  spacing: {
    x: number;
    y: number;
  };
  size?: {
    width: number;
    height: number;
  };
  bg?: string;
};

export type DroppedImage = {
  type: "image-node";
} & SharedProperties;

export type DroppedText = {
  type: "text-node";
} & SharedProperties;

export type DroppedFlipWords = {
  type: "flip-words-node";
} & SharedProperties;

export type DroppedElement = DroppedText | DroppedImage | DroppedFlipWords;
