"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { type ComponentProps, useState } from "react";
import { Input } from "@/components/ui/input";

export function PasswordInput(
  props: Omit<ComponentProps<typeof Input>, "type">,
) {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div className="relative">
      <Input
        {...props}
        type={isVisible ? "text" : "password"}
        className="pr-11"
      />
      <button
        type="button"
        onClick={() => setIsVisible((v) => !v)}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
        aria-label={isVisible ? "Hide password" : "Show password"}
      >
        {isVisible ? (
          <EyeOffIcon className="size-4" />
        ) : (
          <EyeIcon className="size-4" />
        )}
      </button>
    </div>
  );
}
