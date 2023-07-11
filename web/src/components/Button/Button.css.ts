import { RecipeVariants, recipe } from "@vanilla-extract/recipes";
import { vars } from "../../styles/index.css";

export const button = recipe({
  base: {
    appearance: "none",
    border: "none",
    borderRadius: "8px",
    fontWeight: 500,
  },
  variants: {
    variant: {
      primary: {
        color: vars.colorVars.d1,
        boxShadow: vars.shadows.xs,
        backgroundColor: vars.colorVars.a9,
        border: `1px solid ${vars.colorVars.a10}`,
      },
      outline: {
        color: vars.colors.text,
        backgroundColor: "transparent",
        border: `${vars.spacing.s1} solid ${vars.colors.border}`,
      },
      ghost: { color: vars.colors.text, backgroundColor: "transparent" },
    },
    size: {
      small: {
        ...vars.typography.m,
        padding: `${vars.spacing.s1} ${vars.spacing.s2}`,
      },
      medium: {
        ...vars.typography.m,
        padding: `${vars.spacing.s2} ${vars.spacing.s3}`,
      },
      large: {
        padding: `${vars.spacing.s3} ${vars.spacing.s4}`,
      },
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "medium",
  },
});

export type ButtonVariants = RecipeVariants<typeof button>;
