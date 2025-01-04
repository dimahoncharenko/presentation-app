import { cn } from "@/shared/lib/cn-merge";

type Props = {
  type: "H1" | "H2" | "H3" | "H4" | "H5" | "H6" | "P";
  children: string;
  className?: string;
  order?: number;
  animation?:
    | "fade-out"
    | "fade-up"
    | "fade-down"
    | "fade-left"
    | "fade-right"
    | "fade-in-then-out"
    | "current-visible"
    | "fade-in-then-semi-out"
    | "grow"
    | "semi-fade-out"
    | "shrink"
    | "strike"
    | "highlight-red"
    | "highlight-green"
    | "highlight-blue"
    | "highlight-current-red"
    | "highlight-current-green"
    | "highlight-current-blue";
};

export const Fragment = ({
  type,
  children,
  animation,
  className,
  order,
}: Props) => {
  const element = () => {
    switch (type) {
      case "H1":
        return (
          <h1
            data-fragment-index={order ? order : undefined}
            className={cn("fragment", animation && animation, className)}
          >
            {children}
          </h1>
        );
      case "H2":
        return (
          <h2
            data-fragment-index={order ? order : undefined}
            className={cn("fragment", animation && animation, className)}
          >
            {children}
          </h2>
        );
      case "H3":
        return (
          <h3
            data-fragment-index={order ? order : undefined}
            className={cn("fragment", animation && animation, className)}
          >
            {children}
          </h3>
        );
      case "H4":
        return (
          <h4
            data-fragment-index={order ? order : undefined}
            className={cn("fragment", animation && animation, className)}
          >
            {children}
          </h4>
        );
      case "H5":
        return (
          <h5
            data-fragment-index={order ? order : undefined}
            className={cn("fragment", animation && animation, className)}
          >
            {children}
          </h5>
        );
      case "H6":
        return (
          <h6
            data-fragment-index={order ? order : undefined}
            className={cn("fragment", animation && animation, className)}
          >
            {children}
          </h6>
        );
      case "P":
        return (
          <p
            data-fragment-index={order ? order : undefined}
            className={cn("fragment", animation && animation, className)}
          >
            {children}
          </p>
        );
      default:
        return (
          <p
            data-fragment-index={order ? order : undefined}
            className={cn("fragment", animation && animation, className)}
          >
            {children}
          </p>
        );
    }
  };

  return element();
};
