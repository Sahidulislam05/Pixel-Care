"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type Option = { value: string; label: string };

type FilterSelectProps = {
  id: string;
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  disabled?: boolean;
  hideLabel?: boolean;
  className?: string;
};

export function FilterSelect({
  id,
  label,
  value,
  options,
  onChange,
  disabled,
  hideLabel,
  className,
}: FilterSelectProps) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <Label
        htmlFor={id}
        className={cn("text-xs text-muted-foreground", hideLabel && "sr-only")}
      >
        {label}
      </Label>
      <Select
        value={value}
        items={options}
        onValueChange={(next) => onChange(String(next ?? ""))}
        disabled={disabled}
      >
        <SelectTrigger id={id} className="h-10 w-full bg-card">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
