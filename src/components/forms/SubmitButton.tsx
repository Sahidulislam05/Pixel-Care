import { Loader2Icon } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";

type SubmitButtonProps = ComponentProps<typeof Button> & {
  isLoading?: boolean;
  loadingText?: string;
};

export function SubmitButton({
  isLoading,
  loadingText,
  children,
  disabled,
  ...props
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && (
        <Loader2Icon className="size-4 animate-spin" aria-hidden="true" />
      )}
      {isLoading ? (loadingText ?? children) : children}
    </Button>
  );
}
