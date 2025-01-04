"use client";

import { SlideLink } from "@/shared/ui/SlideLink";
import { Button } from "@/shared/ui/common/aceternity/Button";

export const BackHome = () => {
  return (
    <Button asChild variant="link">
      <SlideLink
        href="#/0"
        className="z-10 fixed bottom-[0] left-[0] text-lg -translate-y-16"
      >
        Back Home
      </SlideLink>
    </Button>
  );
};
