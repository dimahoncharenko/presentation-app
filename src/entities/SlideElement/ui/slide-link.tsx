import { cn } from "@/shared/lib/cn-merge";
import { CSSProperties } from "react";

type Props = {
  children: React.ReactNode;
  href: string;
  className?: string;
  style?: CSSProperties;
};

export const SlideLink = ({ children, href, className, style }: Props) => {
  return (
    <a href={href} className={cn(className)} style={style}>
      {children}
    </a>
  );
};
