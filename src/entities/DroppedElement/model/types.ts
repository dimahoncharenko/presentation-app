export interface DroppedElement {
  id: string;
  "slide-id": string;
  type: "p" | "input";
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
}
