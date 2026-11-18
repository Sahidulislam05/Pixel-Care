import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  name: string;
  imageUrl?: string | null;
  className?: string;
};

export function UserAvatar({ name, imageUrl, className }: UserAvatarProps) {
  return (
    <Avatar className={cn("size-9", className)}>
      {imageUrl ? <AvatarImage src={imageUrl} alt={name} /> : null}
      <AvatarFallback className="bg-accent font-semibold text-accent-foreground">
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
