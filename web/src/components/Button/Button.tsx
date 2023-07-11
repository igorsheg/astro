import { RecipeVariants } from "@vanilla-extract/recipes";
import * as React from "react";
import { button } from "./Button.css";

type VariantProps = RecipeVariants<typeof button>;

const Button = React.forwardRef<
  HTMLButtonElement,
  React.HTMLProps<HTMLButtonElement> & VariantProps
>(({ children, size, variant, type, ...rest }, ref) => {
  return (
    <button {...rest} className={button({ size, variant })} ref={ref}>
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
