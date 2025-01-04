import { DroppedElement } from "../model/types";

export const groupBySlideId = (elements: DroppedElement[]) => {
  const groupedSlides: { [P in string]: DroppedElement[] } = {};

  elements.forEach((element) => {
    const slideId = element["slide-id"];
    if (!groupedSlides[slideId]) {
      groupedSlides[slideId] = [];
    }
    groupedSlides[slideId].push(element);
  });

  return groupedSlides;
};
